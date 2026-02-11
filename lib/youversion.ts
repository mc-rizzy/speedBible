// lib/youversion.ts
import { ApiClient, BibleClient } from '@youversion/platform-core';

const apiKey = process.env.YOUVERSION;

if (!apiKey) {
  throw new Error("Missing YOUVERSION_API_KEY environment variable");
}

export const apiClient = new ApiClient({
  appKey: apiKey,
});

export const bibleClient = new BibleClient(apiClient);