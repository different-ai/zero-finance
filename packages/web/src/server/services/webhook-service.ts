import { db } from '@/db';
import { auditEvents, webhookDeliveries, webhookEndpoints } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import crypto from 'crypto';

export type WebhookEventType =
  | 'vault.position.updated'
  | 'vault.action.created'
  | 'vault.action.completed'
  | 'insurance.status.changed';

export async function logAuditEvent(params: {
  workspaceId: string;
  actor?: string;
  eventType: string;
  metadata?: Record<string, unknown>;
}) {
  await db.insert(auditEvents).values({
    workspaceId: params.workspaceId,
    actor: params.actor ?? null,
    eventType: params.eventType,
    metadata: params.metadata ?? null,
  });
}

function signPayload(secret: string, payload: unknown) {
  const body = JSON.stringify(payload);
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

export async function dispatchWebhookEvent(params: {
  workspaceId: string;
  eventType: WebhookEventType;
  payload: Record<string, unknown>;
}) {
  const endpoints = await db.query.webhookEndpoints.findMany({
    where: (tbl, { and, eq: eqLocal }) =>
      and(
        eqLocal(tbl.workspaceId, params.workspaceId),
        eqLocal(tbl.isActive, true),
      ),
  });

  const eligibleEndpoints = endpoints.filter((endpoint) =>
    endpoint.events.includes(params.eventType),
  );

  if (eligibleEndpoints.length === 0) {
    return { deliveries: [] };
  }

  const deliveries = [] as Array<{ id: string; status: string }>;

  for (const endpoint of eligibleEndpoints) {
    const [delivery] = await db
      .insert(webhookDeliveries)
      .values({
        workspaceId: params.workspaceId,
        endpointId: endpoint.id,
        eventType: params.eventType,
        payload: params.payload,
        status: 'pending',
        attempts: 0,
      })
      .returning();

    try {
      const signature = signPayload(endpoint.secret, params.payload);
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-zero-event': params.eventType,
          'x-zero-signature': signature,
        },
        body: JSON.stringify(params.payload),
      });

      const status = response.ok ? 'sent' : 'failed';
      await db
        .update(webhookDeliveries)
        .set({
          status,
          attempts: 1,
          nextRetryAt: response.ok
            ? null
            : new Date(Date.now() + 5 * 60 * 1000),
        })
        .where(eq(webhookDeliveries.id, delivery.id));

      deliveries.push({ id: delivery.id, status });
    } catch (error) {
      await db
        .update(webhookDeliveries)
        .set({
          status: 'failed',
          attempts: 1,
          nextRetryAt: new Date(Date.now() + 5 * 60 * 1000),
        })
        .where(eq(webhookDeliveries.id, delivery.id));

      deliveries.push({ id: delivery.id, status: 'failed' });
    }
  }

  return { deliveries };
}
