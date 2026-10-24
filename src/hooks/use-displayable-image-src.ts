"use client";

import { useEffect, useState } from "react";

// Chrome, Firefox and Edge cannot decode HEIC/HEIF (the iPhone camera default),
// so an <img> pointing at one shows a broken image. Those files are converted to
// JPEG in the browser before display; every other image is used as-is.
const HEIC_MIME_TYPES = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);
const HEIC_EXTENSIONS = new Set(["heic", "heif"]);

type ImageFile = {
  file_link?: string;
  file_name?: string;
  mime_type?: string;
};

export const isHeicFile = (file: ImageFile): boolean => {
  const mime = (file.mime_type || "").toLowerCase().split(";")[0].trim();
  if (HEIC_MIME_TYPES.has(mime)) return true;
  const name = (file.file_name || "").toLowerCase();
  const ext = name.includes(".") ? (name.split(".").pop() ?? "") : "";
  return HEIC_EXTENSIONS.has(ext);
};

// Shared across components so a thumbnail and the full-size viewer convert
// the same file only once. Failed conversions are dropped so they can retry.
const convertedUrls = new Map<string, Promise<string>>();

const convertHeicToJpegUrl = (src: string): Promise<string> => {
  const cached = convertedUrls.get(src);
  if (cached) return cached;

  const pending = (async () => {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to fetch image (${response.status})`);
    }
    const blob = await response.blob();
    // Loaded on demand: the converter is large and only needed for HEIC files.
    const { default: heic2any } = await import("heic2any");
    const result = await heic2any({
      blob,
      toType: "image/jpeg",
      quality: 0.85,
    });
    return URL.createObjectURL(Array.isArray(result) ? result[0] : result);
  })();

  convertedUrls.set(src, pending);
  pending.catch(() => convertedUrls.delete(src));
  return pending;
};

type ConversionResult = { source: string; url?: string; failed: boolean };

export function useDisplayableImageSrc(file?: ImageFile | null) {
  const source = file?.file_link ?? "";
  const needsConversion = !!file && !!source && isHeicFile(file);
  const [result, setResult] = useState<ConversionResult | null>(null);

  useEffect(() => {
    if (!needsConversion) return;
    let cancelled = false;

    convertHeicToJpegUrl(source).then(
      (url) => {
        if (!cancelled) setResult({ source, url, failed: false });
      },
      () => {
        if (!cancelled) setResult({ source, failed: true });
      }
    );

    return () => {
      cancelled = true;
    };
  }, [needsConversion, source]);

  if (!needsConversion) {
    return { src: source || undefined, isConverting: false, failed: false };
  }
  if (result?.source === source) {
    return { src: result.url, isConverting: false, failed: result.failed };
  }
  return { src: undefined, isConverting: true, failed: false };
}
