import sharp from "sharp";

export interface OptimizeImageOptions {
  idealWidth: number;
  idealHeight: number;
  maxSizeKB: number;
  minQuality?: number;
  initialQuality?: number;
}

export interface OptimizedImageResult {
  optimizedBuffer: Buffer;
  finalQuality: number;
  finalSize: number;
  originalWidth: number;
  originalHeight: number;
  optimizedWidth: number;
  optimizedHeight: number;
}

export async function optimizeImageToWebp(
  inputBuffer: Buffer,
  options: OptimizeImageOptions
): Promise<OptimizedImageResult> {
  const {
    idealWidth,
    idealHeight,
    maxSizeKB,
    minQuality = 10,
    initialQuality = 80,
  } = options;

  const metadata = await sharp(inputBuffer).metadata();
  let quality = initialQuality;
  let optimizedBuffer: Buffer = inputBuffer;
  let fileSize = Infinity;
  let optimizedMeta: sharp.Metadata = metadata;

  // Loop to reduce quality until file size is below maxSizeKB or quality is too low
  while (fileSize > maxSizeKB * 1024 && quality >= minQuality) {
    let sharpInstance = sharp(inputBuffer);

    // Only resize if original is larger than ideal
    if (
      (metadata.width && metadata.width > idealWidth) ||
      (metadata.height && metadata.height > idealHeight)
    ) {
      sharpInstance = sharpInstance.resize({
        width: idealWidth,
        height: idealHeight,
        fit: sharp.fit.cover, // or sharp.fit.attention for smart crop
        withoutEnlargement: true,
      });
    }

    optimizedBuffer = await sharpInstance.webp({ quality }).toBuffer();
    fileSize = optimizedBuffer.length;

    // Get metadata of the optimized image
    optimizedMeta = await sharp(optimizedBuffer).metadata();

    if (fileSize > maxSizeKB * 1024) {
      quality -= 5;
    }
  }

  return {
    optimizedBuffer,
    finalQuality: quality,
    finalSize: fileSize,
    originalWidth: metadata.width ?? 0,
    originalHeight: metadata.height ?? 0,
    optimizedWidth: optimizedMeta.width ?? 0,
    optimizedHeight: optimizedMeta.height ?? 0,
  };
}
