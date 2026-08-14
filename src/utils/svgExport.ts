/**
 * Utility to reliably export an SVGSVGElement to a 1280x720 PNG download.
 * Inlines external image URLs to base64 Data URIs to prevent cross-origin/tainted canvas issues.
 */

async function inlineSvgImages(svgClone: SVGSVGElement): Promise<void> {
  const images = Array.from(svgClone.querySelectorAll("image"));
  for (const imgEl of images) {
    const href = imgEl.getAttribute("href") || imgEl.getAttribute("xlink:href");
    if (href && !href.startsWith("data:")) {
      try {
        const dataUrl = await fetchImageAsDataUrl(href);
        if (dataUrl) {
          imgEl.setAttribute("href", dataUrl);
          imgEl.removeAttribute("xlink:href");
        }
      } catch (e) {
        console.warn("Could not inline image in SVG:", href, e);
      }
    }
  }
}

function fetchImageAsDataUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 1280;
        canvas.height = img.naturalHeight || 720;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else {
          reject(new Error("Failed to get 2d context for image inlining"));
        }
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

export async function exportSvgToPng(
  svgElement: SVGSVGElement,
  filename: string,
  targetWidth = 1280,
  targetHeight = 720
): Promise<boolean> {
  if (!svgElement) {
    throw new Error("SVG element is missing.");
  }

  // 1. Deep clone the SVG element so we don't mutate the DOM
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;

  // 2. Ensure standard SVG namespace and explicit sizing
  svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgClone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  svgClone.setAttribute("width", targetWidth.toString());
  svgClone.setAttribute("height", targetHeight.toString());
  svgClone.setAttribute("viewBox", `0 0 ${targetWidth} ${targetHeight}`);

  // 3. Inline any external/local image references to Data URIs
  await inlineSvgImages(svgClone);

  // 4. Serialize to string
  const svgData = new XMLSerializer().serializeToString(svgClone);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const blobUrl = URL.createObjectURL(svgBlob);

  return new Promise<boolean>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(blobUrl);
          reject(new Error("Could not create canvas 2d context"));
          return;
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const pngUrl = canvas.toDataURL("image/png");

        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = filename.endsWith(".png") ? filename : `${filename}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(blobUrl);
        resolve(true);
      } catch (err) {
        URL.revokeObjectURL(blobUrl);
        reject(err);
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error("Failed to render SVG onto image element"));
    };

    img.src = blobUrl;
  });
}
