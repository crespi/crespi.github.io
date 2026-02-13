// Hello Wipe Effect - text slides across the screen right to left
// Uses canvas to render text and sample which grid cells are inside the letters

(function() {
    const MESSAGE = 'HELLO hii';
    const FONT_WEIGHT = 900;
    const FONT_FAMILY = 'system-ui, -apple-system, sans-serif';
    let letterMask = null;
    let maskWidth = 0;
    let maskHeight = 0;
    let textWidth = 0;

    function buildMask() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const fontSize = Math.min(width * 0.9, 480);
        const font = `${FONT_WEIGHT} ${fontSize}px ${FONT_FAMILY}`;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        // Measure text dimensions
        ctx.font = font;
        const metrics = ctx.measureText(MESSAGE);
        textWidth = metrics.width;
        const ascent = metrics.actualBoundingBoxAscent;
        const descent = metrics.actualBoundingBoxDescent;
        const textHeight = ascent + descent;

        // Calculate vertical scale to fill viewport height
        const scaleY = height / textHeight;

        // Size canvas to fit text
        canvas.width = Math.ceil(textWidth) + 20;
        canvas.height = height;

        // Render text stretched vertically to fill the screen
        ctx.save();
        ctx.scale(1, scaleY);
        ctx.fillStyle = 'white';
        ctx.font = font;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(MESSAGE, 10, ascent);
        ctx.restore();

        // Store pixel data for hit testing
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

        return letterMask[(py * maskWidth + px) * 4 + 3] > 128;
    }

    const helloWipeEffect = {
        name: 'hello-wipe',
        duration: 5500,
        charset: '@#$%&*!?~+=',

        getIntensity(charX, charY, originX, originY, elapsed, duration) {
            if (!letterMask) buildMask();

            const screenWidth = window.innerWidth;
            const progress = elapsed / duration;
            const totalTravel = screenWidth + textWidth;
            const wordX = screenWidth - progress * totalTravel;

            const checkX = charX - wordX;
            if (!isInsideLetter(checkX, charY)) return 0;

            return 1;
        }
    };

    if (window.TextScramble) {
        window.TextScramble.registerEffect('hello-wipe', helloWipeEffect);
    }
})();
