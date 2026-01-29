// Ripple Effect - expanding wave that scrambles text as it passes

(function() {
    const MAX_RADIUS = 2500;    // maximum distance the wave travels
    const WAVE_WIDTH = 250;     // width of the scramble band in pixels
    const FADE_WIDTH = 75;      // width of soft edge fade in pixels

    const rippleEffect = {
        name: 'ripple',
        duration: 5000,         // 5 seconds total
        charset: '@#$%&*!?~+=',

        // Returns intensity 0-1 (0 = not in wave, 1 = fully in wave)
        // Soft edges fade in/out over FADE_WIDTH pixels
        getIntensity(charX, charY, originX, originY, elapsed, duration) {
            const distance = Math.sqrt(
                Math.pow(charX - originX, 2) +
                Math.pow(charY - originY, 2)
            );

            // Linear progression
            const progress = elapsed / duration;
            const waveFront = progress * MAX_RADIUS;

            // Wave back position (trailing edge)
            const waveBack = waveFront - WAVE_WIDTH;

            // Outside the wave entirely
            if (distance > waveFront || distance < waveBack) {
                return 0;
            }

            // Fade in at leading edge
            const distFromFront = waveFront - distance;
            if (distFromFront < FADE_WIDTH) {
                return distFromFront / FADE_WIDTH;
            }

            // Fade out at trailing edge
            const distFromBack = distance - waveBack;
            if (distFromBack < FADE_WIDTH) {
                return distFromBack / FADE_WIDTH;
            }

            // Fully in the wave
            return 1;
        },

        // Keep isActive for backwards compatibility
        isActive(charX, charY, originX, originY, elapsed, duration) {
            return this.getIntensity(charX, charY, originX, originY, elapsed, duration) > 0;
        }
    };

    // Register with the main system
    if (window.TextScramble) {
        window.TextScramble.registerEffect('ripple', rippleEffect);
    }
})();
