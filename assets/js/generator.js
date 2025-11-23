export async function generateFavicons() {
    if (!window.originalImageData) {
        alert("Сначала загрузите изображение!");
        return;
    }

    const img = await loadImage(window.originalImageData);
    const zip = new JSZip();

    const pngSizes = [32, 57, 72, 96, 120, 128, 144, 152, 167, 180, 192, 196, 256, 512];
    for (const size of pngSizes) {
        const blob = await resizeToPng(img, size);
        zip.file(`icons/icon-${size}x${size}.png`, blob);
    }

    const icoBlob = await createIco(img, [16, 24, 32, 48, 64]);
    zip.file("favicon.ico", icoBlob);

    zip.file("manifest.json", JSON.stringify({
        name: "FavGen Pro",
        short_name: "FavGen",
        icons: pngSizes.map(s => ({
            src: `icons/icon-${s}x${s}.png`,
            sizes: `${s}x${s}`,
            type: "image/png",
            purpose: "any"
        })),
        theme_color: "#8b5cf6",
        background_color: "#ffffff",
        display: "standalone"
    }, null, 2));

    lastZipBlob = await zip.generateAsync({ type: "blob" });

    document.getElementById("result").classList.remove("hidden");
    console.log("Готово!");
}
let lastZipBlob = null;

export function downloadZipBlob() {
    if (!lastZipBlob) {
        alert("Сначала сгенерируйте иконки!");
        return;
    }
    saveAs(lastZipBlob, "favicons.zip");
}

function loadImage(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.src = src;
    });
}

function resizeToPng(img, size) {
    return new Promise(resolve => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d");

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, size, size);

        canvas.toBlob(blob => resolve(blob), "image/png");
    });
}
async function createIco(image, sizes = [16, 32, 48]) {
    const pngBuffers = [];

    // Конвертируем PNG разных размеров
    for (const size of sizes) {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(image, 0, 0, size, size);

        const blob = await new Promise(r => canvas.toBlob(r, "image/png"));
        const arrayBuffer = await blob.arrayBuffer();
        pngBuffers.push({ size, buffer: new Uint8Array(arrayBuffer) });
    }

    // ICO HEADER (6 bytes)
    const header = new Uint8Array(6);
    header[0] = 0; // reserved
    header[1] = 0;
    header[2] = 1; // ICO type
    header[3] = 0;
    header[4] = pngBuffers.length; // count
    header[5] = 0;

    const parts = [header];
    let offset = 6 + pngBuffers.length * 16;

    // Directory entries
    for (const { size, buffer } of pngBuffers) {
        const entry = new Uint8Array(16);

        entry[0] = size === 256 ? 0 : size;
        entry[1] = size === 256 ? 0 : size;
        entry[2] = 0;
        entry[3] = 0;
        entry[4] = 1; // planes
        entry[5] = 0;
        entry[6] = 32; // bpp
        entry[7] = 0;

        const len = buffer.length;
        entry[8] = len & 0xff;
        entry[9] = (len >> 8) & 0xff;
        entry[10] = (len >> 16) & 0xff;
        entry[11] = (len >> 24) & 0xff;

        entry[12] = offset & 0xff;
        entry[13] = (offset >> 8) & 0xff;
        entry[14] = (offset >> 16) & 0xff;
        entry[15] = (offset >> 24) & 0xff;

        offset += len;

        parts.push(entry);
    }

    // PNG data
    for (const { buffer } of pngBuffers) {
        parts.push(buffer);
    }

    return new Blob(parts, { type: "image/x-icon" });
}
