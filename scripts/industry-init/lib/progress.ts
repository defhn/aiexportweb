/**
 * Progress tracker — reads/writes image-progress.json
 * Enables Antigravity to resume image generation without duplicates.
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { ImageProgress, ImageManifest } from "../types";

const PROGRESS_FILE = join(process.cwd(), "scripts", "industry-init", "image-progress.json");

export function loadProgress(): ImageProgress | null {
  if (!existsSync(PROGRESS_FILE)) return null;
  try {
    return JSON.parse(readFileSync(PROGRESS_FILE, "utf8")) as ImageProgress;
  } catch {
    return null;
  }
}

export function initProgress(manifest: ImageManifest): ImageProgress {
  const progress: ImageProgress = {
    lastUpdated: new Date().toISOString(),
    completedIds: [],
    nextId: 1,
    totalImages: manifest.totalImages,
  };
  saveProgress(progress);
  return progress;
}

export function markDone(progress: ImageProgress, id: number): ImageProgress {
  const updated: ImageProgress = {
    ...progress,
    lastUpdated: new Date().toISOString(),
    completedIds: [...new Set([...progress.completedIds, id])],
    nextId: id + 1,
  };
  saveProgress(updated);
  return updated;
}

export function saveProgress(progress: ImageProgress): void {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), "utf8");
}

export function getPendingImages(
  manifest: ImageManifest,
  progress: ImageProgress | null,
): typeof manifest.images {
  if (!progress) return manifest.images;
  const done = new Set(progress.completedIds);
  return manifest.images.filter((img) => !done.has(img.id));
}
