import { db } from '@/db';
import { cardActions, inboxCards, type NewCardAction } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export interface TrackActionParams {
  cardId: string;
  userId: string;
  actionType: NewCardAction['actionType'];
  actor?: NewCardAction['actor'];
  actorDetails?: any;
  previousValue?: any;
  newValue?: any;
  details?: any;
  metadata?: any;
}

export class CardActionsService {
  /**
   * Track a new action on a card
   */
  static async trackAction(params: TrackActionParams): Promise<string> {
    try {
      const [action] = await db
        .insert(cardActions)
        .values({
          cardId: params.cardId,
          userId: params.userId,
          actionType: params.actionType,
          actor: params.actor || 'human',
          actorDetails: params.actorDetails,
          previousValue: params.previousValue,
          newValue: params.newValue,
          details: params.details,
          metadata: params.metadata,
          status: 'success',
        })
        .returning();

      return action.id;
    } catch (error) {
      console.error('[CardActionsService] Error tracking action:', error);

      // Still try to record the failed action
      try {
        const [failedAction] = await db
          .insert(cardActions)
          .values({
            cardId: params.cardId,
            userId: params.userId,
            actionType: params.actionType,
            actor: params.actor || 'human',
            actorDetails: params.actorDetails,
            previousValue: params.previousValue,
            newValue: params.newValue,
            details: params.details,
            metadata: params.metadata,
            status: 'failed',
            errorMessage:
              error instanceof Error ? error.message : 'Unknown error',
          })
          .returning();

        return failedAction.id;
      } catch (recordError) {
        console.error(
          '[CardActionsService] Failed to record failed action:',
          recordError,
        );
        throw recordError;
      }
    }
  }

  /**
   * Get all actions for a specific card
   */
  static async getCardActions(cardId: string, userId: string) {
    const actionsWithCards = await db
      .select({
        action: cardActions,
        card: {
          title: inboxCards.title,
          subtitle: inboxCards.subtitle,
          amount: inboxCards.amount,
          currency: inboxCards.currency,
          from: inboxCards.fromEntity,
          to: inboxCards.toEntity,
        },
      })
      .from(cardActions)
      .leftJoin(inboxCards, eq(cardActions.cardId, inboxCards.cardId))
      .where(
        and(eq(cardActions.cardId, cardId), eq(cardActions.userId, userId)),
      )
      .orderBy(desc(cardActions.performedAt));

    console.log(actionsWithCards);
    // Transform the results to include card info in the action object
    return actionsWithCards.map(({ action, card }) => ({
      ...action,
      cardInfo: card || {
        title: 'Unknown Card',
        subtitle: 'Card information not availablse',
        amount: null,
        currency: null,
        from: null,
        to: null,
      },
    }));
  }

  /**
   * Get recent actions for a user
   */
  static async getUserRecentActions(userId: string, limit = 50) {
    const actionsWithCards = await db
      .select({
        action: cardActions,
        card: {
          title: inboxCards.title,
          subtitle: inboxCards.subtitle,
          amount: inboxCards.amount,
          currency: inboxCards.currency,
          from: inboxCards.fromEntity,
          to: inboxCards.toEntity,
        },
      })
      .from(cardActions)
      .leftJoin(inboxCards, eq(cardActions.cardId, inboxCards.cardId))
      .where(eq(cardActions.userId, userId))
      .orderBy(desc(cardActions.performedAt))
      .limit(limit);

    // Transform the results to include card info in the action object
    console.log(JSON.stringify(actionsWithCards, null, 3));
    return actionsWithCards.map(({ action, card }) => ({
      ...action,
      cardInfo: card || {
        title: 'Unknown Card',
        subtitle: 'Card information not available',
        amount: null,
        currency: null,
        from: null,
        to: null,
      },
    }));
  }

  /**
   * Track multiple actions at once (batch)
   */
  static async trackBatchActions(
    actions: TrackActionParams[],
  ): Promise<string[]> {
    const results = await Promise.allSettled(
      actions.map((action) => this.trackAction(action)),
    );

    return results
      .filter(
        (result): result is PromiseFulfilledResult<string> =>
          result.status === 'fulfilled',
      )
      .map((result) => result.value);
  }

  /**
   * Get action statistics for a user
   */
  static async getActionStats(userId: string) {
    const actions = await db
      .select()
      .from(cardActions)
      .where(eq(cardActions.userId, userId));

    const stats = {
      total: actions.length,
      byType: {} as Record<string, number>,
      byActor: {} as Record<string, number>,
      failureRate: 0,
    };

    actions.forEach((action) => {
      // Count by type
      stats.byType[action.actionType] =
        (stats.byType[action.actionType] || 0) + 1;

      // Count by actor
      stats.byActor[action.actor] = (stats.byActor[action.actor] || 0) + 1;
    });

    // Calculate failure rate
    const failedActions = actions.filter((a) => a.status === 'failed').length;
    stats.failureRate =
      actions.length > 0 ? (failedActions / actions.length) * 100 : 0;

    return stats;
  }
}
