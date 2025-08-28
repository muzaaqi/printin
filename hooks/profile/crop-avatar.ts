export const cropToSquare = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return reject("Failed to read file");

      img.src = e.target.result as string;
    };

    img.onload = () => {
      const size = Math.min(img.width, img.height); // sisi terpendek
      const startX = (img.width - size) / 2;
      const startY = (img.height - size) / 2;

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Failed to get canvas context");

      ctx.drawImage(img, startX, startY, size, size, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], file.name, { type: file.type });
          resolve(croppedFile);
        } else {
          reject("Failed to crop image");
        }
      }, file.type);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
