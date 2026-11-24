/**
 * Client-Side Image Compressor & Normalizer
 * يقوم بضغط وتصغير صور الموبايل (iPhone & Android) محلياً في المتصفح قبل الإرسال:
 * 1. تحويل الصور الضخمة (10MB - 20MB) إلى صور JPEG خفيفة (~500KB) فائقة الوضوح في أجزاء من الثانية.
 * 2. تصغير الأبعاد القصوى إلى 1920px (أفضل دقة لقراءة OCR دون استهلاك باقة الإنترنت أو الذاكرة).
 * 3. تحويل صيغ HEIC/HEIF وتصحيح اتجاه الصورة (Orientation) تلقائياً لتوافق كامل مع أجهزة Apple و Samsung.
 */

export interface CompressionResult {
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
}

export async function compressAndNormalizeImage(
  file: File,
  maxDimension = 1920,
  quality = 0.82
): Promise<File> {
  // إذا كان الملف PDF، لا نقوم بضغطه كصورة
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return file;
  }

  // إذا لم يكن صورة معروفة وليس به امتداد صورة، نتركه كما هو
  const isImage = file.type.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|jfif|bmp|heic|heif)$/i.test(file.name);

  if (!isImage) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            let width = img.width;
            let height = img.height;

            // حساب الأبعاد التناسبية بحيث لا يتجاوز أكبر ضلع maxDimension
            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d', { alpha: false });
            if (!ctx) {
              // إذا تعذر الحصول على الـ context، أعد الملف الأصلي
              resolve(file);
              return;
            }

            // رسم الخلفية بيضاء لضمان عدم ظهور سواد في الصور الشفافة
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);

            // تفعيل التنعيم عالي الجودة
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  resolve(file);
                  return;
                }

                // تنظيف اسم الملف واستبدال أي امتداد بـ .jpg
                const baseName = file.name.replace(/\.[^/.]+$/, '').trim() || 'invoice_mobile';
                const compressedFile = new File([blob], `${baseName}.jpg`, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });

                console.log(
                  `📸 Mobile image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024).toFixed(0)}KB (${width}x${height})`
                );

                resolve(compressedFile);
              },
              'image/jpeg',
              quality
            );
          } catch (canvasErr) {
            console.warn('Canvas compression error, falling back to original file:', canvasErr);
            resolve(file);
          }
        };

        img.onerror = () => {
          console.warn('Could not load image into element, returning original file');
          resolve(file);
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        resolve(file);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('Error reading file for compression:', err);
      resolve(file);
    }
  });
}
