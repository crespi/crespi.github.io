// Ripple Effect - expanding wave that scrambles text as it passes

(function() {
    const MAX_RADIUS = 2500;
    const WAVE_WIDTH = 250;
    const FADE_WIDTH = 1;

    const rippleEffect = {
        name: 'ripple',
        duration: 5000,
        charset: '@#$%&*!?~+=',

        // Returns intensity 0-1 (0 = not in wave, 1 = fully in wave)
        getIntensity(charX, charY, originX, originY, elapsed, duration) {
            const dx = charX - originX;
            const dy = charY - originY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const progress = elapsed / duration;
            const waveFront = progress * MAX_RADIUS;
            const waveBack = waveFront - WAVE_WIDTH;

            // Outside the wave
            if (distance > waveFront || distance < waveBack) return 0;

            // Fade in at leading edge
            const distFromFront = waveFront - distance;
            if (distFromFront < FADE_WIDTH) return distFromFront / FADE_WIDTH;

            // Fade out at trailing edge
            const distFromBack = distance - waveBack;
            if (distFromBack < FADE_WIDTH) return distFromBack / FADE_WIDTH;

            return 1;
        }
    };

    if (window.TextScramble) {
        window.TextScramble.registerEffect('ripple', rippleEffect);
    }
})();
