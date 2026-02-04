// Hello Wipe Effect - "HELLO" slides across the screen from left to right
// Uses canvas to render text and sample which grid cells are inside the letters

(function() {
    let letterMask = null;      // ImageData from canvas
    let maskWidth = 0;
    let maskHeight = 0;
    let textWidth = 0;
    let textHeight = 0;

    function buildMask() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Responsive font size - larger on desktop, smaller on mobile
        const fontSize = Math.min(width * 0.9, 480);

        // First, measure the text width
        const measureCanvas = document.createElement('canvas');
        const measureCtx = measureCanvas.getContext('2d');
        measureCtx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
        const metrics = measureCtx.measureText('HELLO HI');
        textWidth = metrics.width;
        textHeight = fontSize;

        // Create canvas just big enough for the text (with some padding)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = Math.ceil(textWidth) + 20;
        canvas.height = height;

        ctx.fillStyle = 'white';
        ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('HELLO HI', 20, 26*10 + 10);

        // Store the image data for pixel lookups
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        letterMask = imageData.data;
        maskWidth = canvas.width;
        maskHeight = canvas.height;
    }

    function isInsideLetter(x, y) {
        if (!letterMask) return false;

        const px = Math.round(x);
        const py = Math.round(y);

        if (px < 0 || px >= maskWidth || py < 0 || py >= maskHeight) {
            return false;
        }

        const alpha = letterMask[(py * maskWidth + px) * 4 + 3];
        return alpha > 128;
    }

    const helloWipeEffect = {
        name: 'hello-wipe',
        duration: 5500,
        charset: 'HELLO',

        getIntensity(charX, charY, originX, originY, elapsed, duration) {
            // Build mask on first use (after DOM is ready)
            if (!letterMask) {
                buildMask();
            }

            const screenWidth = window.innerWidth;

            // Word slides from fully off-screen left to fully off-screen right
            const progress = elapsed / duration;
            const totalTravel = screenWidth + textWidth;
            const wordX = screenWidth - progress * totalTravel;   
            // Check if this cell falls inside the word at its current position
            // We offset the lookup into the canvas by the word's current x position
            const checkX = charX - wordX;
            const checkY = charY;

            if (!isInsideLetter(checkX, checkY)) {
                return 0;
            }

            // Cell is inside the moving word - full intensity
            return 1;
        },

        isActive(charX, charY, originX, originY, elapsed, duration) {
            return this.getIntensity(charX, charY, originX, originY, elapsed, duration) > 0;
        }
    };

    // Register with the main system
    if (window.TextScramble) {
        window.TextScramble.registerEffect('hello-wipe', helloWipeEffect);
    }
})();
