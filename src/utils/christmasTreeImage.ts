export const ORNAMENT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ORNAMENT_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
const THUMBNAIL_SIZE = 96;
const PHOTO_SIZE = 240;
const MAX_ENCODED_LENGTH = 52000;
const MAX_DETAIL_LENGTH = 880000;
const PHOTO_DETAIL_ENCODINGS = [[1280, .94], [1280, .83], [960, .8], [640, .8]] as const;

export type PreparedOrnamentPhoto = { preview: string; detail: string };

export async function prepareOrnamentPhoto(file: File): Promise<PreparedOrnamentPhoto> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();

    const side = Math.min(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");

    const drawThumbnail = (size: number) => {
      canvas.width = canvas.height = size;
      context.imageSmoothingQuality = "high";
      context.drawImage(
        image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side,
        0, 0, size, size,
      );
    };

    drawThumbnail(PHOTO_SIZE);
    let preview = canvas.toDataURL("image/webp", .88);
    if (preview.length > MAX_ENCODED_LENGTH && preview.startsWith("data:image/webp;")) {
      preview = canvas.toDataURL("image/webp", .72);
    }
    if (preview.length > MAX_ENCODED_LENGTH) {
      drawThumbnail(THUMBNAIL_SIZE);
      preview = canvas.toDataURL("image/webp", .84);
    }

    for (const [maxEdge, quality] of PHOTO_DETAIL_ENCODINGS) {
      const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      context.imageSmoothingQuality = "high";
      context.fillStyle = "#fffdf4";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const detail = canvas.toDataURL("image/jpeg", quality);
      if (detail.startsWith("data:image/jpeg;base64,") && detail.length <= MAX_DETAIL_LENGTH) {
        return { preview, detail };
      }
    }
    throw new Error("Photo exceeds the encoded size limit");
  } finally {
    URL.revokeObjectURL(url);
  }
}
