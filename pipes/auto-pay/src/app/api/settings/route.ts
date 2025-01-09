import { getAutoPaySettings } from '@/lib/auto-pay-settings';
import { pipe } from '@screenpipe/js';
import { NextResponse } from 'next/server';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('0xHypr', 'shello');
  if (!pipe) {
    return NextResponse.json({ error: 'pipe not found' }, { status: 500 });
  }
  try {
    const settingsManager = pipe.settings;
    if (!settingsManager) {
      throw new Error('settingsManager not found');
    }

    // Load persisted settings if they exist
    const screenpipeDir = process.env.SCREENPIPE_DIR || process.cwd();
    const settingsPath = path.join(screenpipeDir, 'pipes', 'auto-pay', 'settings.json');

    console.log('0xHypr', { settingsPath })
    try {
      const rawSettings = await settingsManager.getAll();
      const customSettings = await getAutoPaySettings();

      console.log('0xHypr', { customSettings })
      console.log('0xHypr', { rawSettings })

      return NextResponse.json({
        ...rawSettings,
        customSettings: {
          ...rawSettings.customSettings,
          'auto-pay': {
            ...(rawSettings.customSettings?.['auto-pay'] || {}),
            ...customSettings,
          },
        },
      });
    } catch (err) {
      // If no persisted settings, return normal settings
      const rawSettings = await settingsManager.getAll();
      return NextResponse.json(rawSettings);
    }
  } catch (error) {
    console.error('failed to get settings:', error);
    return NextResponse.json({ error: 'failed to get settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const settingsManager = pipe.settings;
    if (!settingsManager) {
      throw new Error('settingsManager not found');
    }

    const body = await request.json();
    const { key, value, isPartialUpdate, reset, namespace } = body;

    if (reset) {
      if (namespace) {
        if (key) {
          // Reset single key in namespace
          await settingsManager.setCustomSetting(namespace, key, undefined);
        } else {
          // Reset entire namespace
          await settingsManager.updateNamespaceSettings(namespace, {});
        }
      } else {
        if (key) {
          await settingsManager.resetKey(key);
        } else {
          await settingsManager.reset();
        }
      }
      return NextResponse.json({ success: true });
    }

    if (namespace) {
      if (isPartialUpdate) {
        const currentSettings = await settingsManager.getNamespaceSettings(namespace) || {};
        await settingsManager.updateNamespaceSettings(namespace, {
          ...currentSettings,
          ...value,
        });
      } else {
        await settingsManager.setCustomSetting(namespace, key, value);
      }
    } else if (isPartialUpdate) {
      const serializedSettings = JSON.parse(JSON.stringify(value));
      await settingsManager.update(serializedSettings);
    } else {
      const serializedValue = JSON.parse(JSON.stringify(value));
      await settingsManager.set(key, serializedValue);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('failed to update settings:', error);
    return NextResponse.json(
      { error: 'failed to update settings' },
      { status: 500 }
    );
  }
}
