document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const processBtn = document.getElementById('processBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const sortDirection = document.getElementById('sortDirection');
    const sortOrder = document.getElementById('sortOrder');
    const threshold = document.getElementById('threshold');
    const thresholdValue = document.getElementById('thresholdValue');

    let originalImage = null;
    let currentImage = null;

    // Update threshold value display
    threshold.addEventListener('input', () => {
        thresholdValue.textContent = threshold.value;
    });

    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#2980b9';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#3498db';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#3498db';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });

    // Handle click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                currentImage = img;
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                processBtn.disabled = false;
                resetBtn.disabled = false;
                downloadBtn.disabled = true;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function resetImage() {
        if (originalImage) {
            currentImage = originalImage;
            ctx.drawImage(originalImage, 0, 0);
            downloadBtn.disabled = true;
        }
    }

    resetBtn.addEventListener('click', resetImage);

    function findIntervals(pixels, width, height, thresholdValue, isHorizontal) {
        const intervals = [];
        if (isHorizontal) {
            for (let y = 0; y < height; y++) {
                let start = -1;
                for (let x = 0; x < width; x++) {
                    const i = (y * width + x) * 4;
                    const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
                    
                    if (brightness < thresholdValue && start === -1) {
                        start = x;
                    } else if (brightness >= thresholdValue && start !== -1) {
                        intervals.push({ y, start, end: x - 1 });
                        start = -1;
                    }
                }
                if (start !== -1) {
                    intervals.push({ y, start, end: width - 1 });
                }
            }
        } else {
            for (let x = 0; x < width; x++) {
                let start = -1;
                for (let y = 0; y < height; y++) {
                    const i = (y * width + x) * 4;
                    const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
                    
                    if (brightness < thresholdValue && start === -1) {
                        start = y;
                    } else if (brightness >= thresholdValue && start !== -1) {
                        intervals.push({ x, start, end: y - 1 });
                        start = -1;
                    }
                }
                if (start !== -1) {
                    intervals.push({ x, start, end: height - 1 });
                }
            }
        }
        return intervals;
    }

    function sortInterval(pixels, width, interval, isHorizontal, isDarkToLight) {
        if (isHorizontal) {
            const { y, start, end } = interval;
            const row = [];
            for (let x = start; x <= end; x++) {
                const i = (y * width + x) * 4;
                row.push({
                    index: i,
                    brightness: (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3,
                    r: pixels[i],
                    g: pixels[i + 1],
                    b: pixels[i + 2],
                    a: pixels[i + 3]
                });
            }
            
            // Sort by brightness based on sort order
            row.sort((a, b) => isDarkToLight ? a.brightness - b.brightness : b.brightness - a.brightness);
            
            // Apply sorted pixels
            for (let i = 0; i < row.length; i++) {
                const x = start + i;
                const pixelIndex = (y * width + x) * 4;
                pixels[pixelIndex] = row[i].r;
                pixels[pixelIndex + 1] = row[i].g;
                pixels[pixelIndex + 2] = row[i].b;
                pixels[pixelIndex + 3] = row[i].a;
            }
        } else {
            const { x, start, end } = interval;
            const column = [];
            for (let y = start; y <= end; y++) {
                const i = (y * width + x) * 4;
                column.push({
                    index: i,
                    brightness: (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3,
                    r: pixels[i],
                    g: pixels[i + 1],
                    b: pixels[i + 2],
                    a: pixels[i + 3]
                });
            }
            
            // Sort by brightness based on sort order
            column.sort((a, b) => isDarkToLight ? a.brightness - b.brightness : b.brightness - a.brightness);
            
            // Apply sorted pixels
            for (let i = 0; i < column.length; i++) {
                const y = start + i;
                const pixelIndex = (y * width + x) * 4;
                pixels[pixelIndex] = column[i].r;
                pixels[pixelIndex + 1] = column[i].g;
                pixels[pixelIndex + 2] = column[i].b;
                pixels[pixelIndex + 3] = column[i].a;
            }
        }
    }

    processBtn.addEventListener('click', () => {
        if (!currentImage) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const thresholdValue = parseInt(threshold.value);
        const isHorizontal = sortDirection.value === 'horizontal';
        const isDarkToLight = sortOrder.value === 'darkToLight';

        // Find intervals where sorting should occur (dark areas)
        const intervals = findIntervals(pixels, canvas.width, canvas.height, thresholdValue, isHorizontal);

        // Sort each interval
        intervals.forEach(interval => {
            sortInterval(pixels, canvas.width, interval, isHorizontal, isDarkToLight);
        });

        ctx.putImageData(imageData, 0, 0);
        downloadBtn.disabled = false;
    });

    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'pixel-sorted-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}); 