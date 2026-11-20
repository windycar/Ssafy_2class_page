export const ORNAMENT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ORNAMENT_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
const THUMBNAIL_SIZE = 96;

export async function createOrnamentThumbnail(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = THUMBNAIL_SIZE;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    context.drawImage(
      image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side,
      0, 0, THUMBNAIL_SIZE, THUMBNAIL_SIZE,
    );
    // Browsers that lack a WebP encoder return PNG automatically.
    return canvas.toDataURL("image/webp", 0.84);
  } finally {
    URL.revokeObjectURL(url);
  }
}
