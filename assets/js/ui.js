// assets/js/ui.js
let originalImage = null;

export function initDropZone() {
    const zone = document.getElementById('drop-zone');
    const input = document.getElementById('file-input');
    const preview = document.getElementById('preview');
    const img = document.getElementById('preview-img');

    const handleFile = (file) => {
        const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
        if (!allowed.includes(file.type)) {
            alert('Только PNG, JPG, WebP, SVG!');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            originalImage = dataUrl;

            // ВАЖНО: сохраняем в глобальную переменную, чтобы generator.js видел
            window.originalImageData = dataUrl;

            img.src = dataUrl;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    };

    zone.onclick = () => input.click();
    input.onchange = (e) => handleFile(e.target.files[0]);

    zone.ondragover = (e) => {
        e.preventDefault();
        zone.classList.add('border-purple-600', 'bg-purple-900/20');
    };
    zone.ondragleave = () => {
        zone.classList.remove('border-purple-600', 'bg-purple-900/20');
    };
    zone.ondrop = (e) => {
        e.preventDefault();
        zone.classList.remove('border-purple-600', 'bg-purple-900/20');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    };
}