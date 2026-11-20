export const ORNAMENT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ORNAMENT_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
const THUMBNAIL_SIZE = 96;
const PHOTO_SIZE = 240;
const MAX_ENCODED_LENGTH = 52000;

export async function prepareOrnamentPhoto(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();

    const side = Math.min(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");

    const draw = (size: number) => {
      canvas.width = canvas.height = size;
      context.drawImage(
        image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side,
        0, 0, size, size,
      );
    };

    draw(PHOTO_SIZE);
    const photo = canvas.toDataURL("image/webp", 0.84);
    if (photo.length <= MAX_ENCODED_LENGTH) return photo;
    if (photo.startsWith("data:image/webp;")) {
      const compressedPhoto = canvas.toDataURL("image/webp", 0.65);
      if (compressedPhoto.length <= MAX_ENCODED_LENGTH) return compressedPhoto;
    }
    // A high-detail PNG fallback can exceed the shared image payload limit.
    draw(THUMBNAIL_SIZE);
    return canvas.toDataURL("image/webp", 0.84);
  } finally {
    URL.revokeObjectURL(url);
  }
}
