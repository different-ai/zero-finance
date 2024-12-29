import { pipe } from "@screenpipe/js/node";
import type { ContentItem } from "@screenpipe/js";

export async function queryScreenData(hours: number = 24): Promise<ContentItem[]> {
    const now = new Date();
    const startTime = new Date(now.getTime() - hours * 60 * 60 * 1000);

    const response = await pipe.queryScreenpipe({
        startTime: startTime.toISOString(),
        endTime: now.toISOString(),
        limit: 10000,
        contentType: "ocr",
    });

    return response.data;
}

export async function getSettings() {
    const settings = await pipe.settings.getAll();
    return {
        analysisWindow: settings.analysisWindow || 24,
        wiseApiToken: settings.wiseApiToken,
        wiseProfileId: settings.wiseProfileId,
    };
}
