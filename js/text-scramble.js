// Text Scramble Effect System
// Uses overlay technique to prevent layout reflow
// Pre-loads DOM elements for instant animation start

(function() {
    const DEFAULT_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const GRID_WORD = 'hello ';
    const WORD_SPACING = -1.5; // matches CSS word-spacing
    const VERTICAL_OFFSET = 6; // tweak this to adjust vertical alignment (positive = down, negative = up)

    let CELL_WIDTH = 10; // will be measured dynamically
    let CELL_HEIGHT = 26; // will be measured dynamically
    let initialized = false;

    // Measure actual character dimensions from the page's font
    function measureCharDimensions() {
        // Measure width (including letter-spacing)
        const widthSpan = document.createElement('span');
        widthSpan.style.cssText = `
            font-family: var(--font-mono, ui-monospace, monospace);
            font-size: 15px;
            letter-spacing: -0.2px;
            position: absolute;
            visibility: hidden;
        `;
        widthSpan.textContent = 'XXXXXXXXXX';
        document.body.appendChild(widthSpan);
        CELL_WIDTH = widthSpan.getBoundingClientRect().width / 10;
        widthSpan.remove();

        // Measure line height by creating two lines and measuring distance
        const heightDiv = document.createElement('div');
        heightDiv.style.cssText = `
            font-family: var(--font-mono, ui-monospace, monospace);
            font-size: 15px;
            line-height: var(--line-unit, 26px);
            position: absolute;
            visibility: hidden;
        `;
        heightDiv.innerHTML = '<span>X</span><br><span>X</span>';
        document.body.appendChild(heightDiv);
        const spans = heightDiv.querySelectorAll('span');
        CELL_HEIGHT = spans[1].getBoundingClientRect().top - spans[0].getBoundingClientRect().top;
        heightDiv.remove();
    }

    let overlayChars = [];   // Overlay character spans
    let gridCells = [];      // Background grid cells
    let gridContainer = null;
    let overlayContainer = null;
    let animating = false;
    let currentEffect = null;
    let startTime = 0;
    let origin = { x: 0, y: 0 };
    let onCompleteCallback = null;

    // Registry of available effects
    const effects = {};

    // Register an effect
    function registerEffect(name, effect) {
        effects[name] = effect;
    }

    // Create background grid of "hello" characters (runs once on page load)
    function createGrid() {
        // Find where text actually starts to align grid
        const container = document.querySelector('.container');
        const firstText = container ? container.querySelector('h1, h2, p') : null;
        const textRect = firstText ? firstText.getBoundingClientRect() : { top: 0, left: 0 };

        // Calculate pattern width (accounts for narrower spaces)
        const spaceCount = (GRID_WORD.match(/ /g) || []).length;
        const charCount = GRID_WORD.length - spaceCount;
        const patternWidth = charCount * CELL_WIDTH + spaceCount * (CELL_WIDTH + WORD_SPACING);

        // Calculate offsets to align grid with text
        // Use negative offset to start before viewport edge, ensuring full coverage
        const gridOffsetY = (textRect.top % CELL_HEIGHT) - CELL_HEIGHT;
        const gridOffsetX = (textRect.left % patternWidth) - patternWidth;

        gridContainer = document.createElement('div');
        gridContainer.id = 'scramble-grid';
        gridContainer.style.cssText = `
            position: fixed;
            top: ${gridOffsetY + VERTICAL_OFFSET}px;
            left: ${gridOffsetX}px;
            width: calc(100vw + ${patternWidth * 2}px);
            height: calc(100vh + ${CELL_HEIGHT * 2}px);
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
            font-family: var(--font-mono, monospace);
            font-size: 15px;
            line-height: ${CELL_HEIGHT}px;
            letter-spacing: -0.2px;
            word-spacing: -1.5px;
            color: var(--text, #fff);
            display: none;
        `;

        const cols = Math.ceil(window.innerWidth / CELL_WIDTH) + GRID_WORD.length * 3;
        const rows = Math.ceil(window.innerHeight / CELL_HEIGHT) + 4;

        gridCells = [];

        for (let row = 0; row < rows; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.style.cssText = `
                white-space: nowrap;
                height: ${CELL_HEIGHT}px;
                line-height: ${CELL_HEIGHT}px;
            `;

            // Offset each row for visual interest
            const offset = (row % GRID_WORD.length);

            let xPos = 0; // track cumulative x position
            for (let col = 0; col < cols; col++) {
                const charIndex = (col + offset) % GRID_WORD.length;
                const char = GRID_WORD[charIndex];
                const isSpace = char === ' ';
                const charWidth = isSpace ? CELL_WIDTH + WORD_SPACING : CELL_WIDTH;

                const span = document.createElement('span');
                span.textContent = char;
                span.style.cssText = `
                    display: inline-block;
                    width: ${charWidth}px;
                    text-align: center;
                    vertical-align: top;
                    opacity: 0;
                `;

                rowDiv.appendChild(span);

                // Store cell data - account for grid offset
                const x = gridOffsetX + xPos + charWidth / 2;
                const y = gridOffsetY + row * CELL_HEIGHT + CELL_HEIGHT / 2;
                gridCells.push({ span, x, y });

                xPos += charWidth;
            }

            gridContainer.appendChild(rowDiv);
        }

        document.body.appendChild(gridContainer);
    }

    // Check if element or any ancestor has data-no-scramble
    function shouldSkip(element) {
        while (element) {
            if (element.dataset && element.dataset.noScramble !== undefined) return true;
            if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return true;
            if (element.tagName === 'BUTTON') return true;
            element = element.parentElement;
        }
        return false;
    }

    // Get all text nodes within an element
    function getTextNodes(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
                    if (shouldSkip(node.parentElement)) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }
        return textNodes;
    }

    // Create overlay with character spans positioned over original text (runs once on page load)
    function createOverlay() {
        const container = document.querySelector('.container');
        if (!container) return;

        // Create overlay container
        overlayContainer = document.createElement('div');
        overlayContainer.id = 'scramble-overlay';
        overlayContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 1000;
            font-family: var(--font-mono, monospace);
            font-size: 15px;
            display: none;
        `;

        const textNodes = getTextNodes(container);
        overlayChars = [];

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const parent = textNode.parentNode;

            // Get computed styles BEFORE modifying DOM
            const computedStyle = window.getComputedStyle(parent);
            const color = computedStyle.color;
            const fontWeight = computedStyle.fontWeight;

            // Wrap text node in a span so we can measure character positions
            // Use display:contents so it doesn't affect layout/styling
            const measuringWrapper = document.createElement('span');
            measuringWrapper.style.display = 'contents';
            parent.replaceChild(measuringWrapper, textNode);

            // Create individual spans for each character to measure positions
            // Explicitly set color to match original
            const charSpans = [];
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.textContent = text[i];
                span.style.color = color;
                span.style.fontWeight = fontWeight;
                measuringWrapper.appendChild(span);
                charSpans.push(span);
            }

            // Measure positions and create overlay chars
            charSpans.forEach((span, i) => {
                const char = text[i];
                const isSpace = !char.trim();
                const rect = span.getBoundingClientRect();

                // Extend background to cover full line height (hides grid ascenders)
                const charCenterY = rect.top + rect.height / 2;
                const extendedTop = charCenterY - CELL_HEIGHT / 2;

                // Create overlay character - match exact styles of original
                const overlaySpan = document.createElement('span');
                overlaySpan.textContent = char;
                overlaySpan.style.cssText = `
                    position: absolute;
                    left: ${rect.left}px;
                    top: ${extendedTop}px;
                    width: ${rect.width}px;
                    height: ${CELL_HEIGHT}px;
                    line-height: ${CELL_HEIGHT}px;
                    font-weight: ${fontWeight};
                    color: ${color};
                    opacity: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;

                overlayContainer.appendChild(overlaySpan);

                overlayChars.push({
                    span: overlaySpan,
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    original: char,
                    originalSpan: span,
                    isSpace: isSpace
                });
            });
        });

        document.body.appendChild(overlayContainer);
    }

    // Update overlay positions (call before animation if user may have scrolled)
    function updateOverlayPositions() {
        overlayChars.forEach(data => {
            const rect = data.originalSpan.getBoundingClientRect();
            const charCenterY = rect.top + rect.height / 2;
            const extendedTop = charCenterY - CELL_HEIGHT / 2;
            data.span.style.left = rect.left + 'px';
            data.span.style.top = extendedTop + 'px';
            data.x = rect.left + rect.width / 2;
            data.y = charCenterY;
        });
    }

    // Reset state after animation ends (hide but don't remove)
    function resetState() {
        // Reset grid cell opacities
        gridCells.forEach(cell => {
            cell.span.style.opacity = 0;
            cell.wasActive = false;
        });

        // Reset overlay
        overlayChars.forEach(data => {
            data.span.style.opacity = 0;
            data.span.style.background = 'transparent';
            data.span.textContent = data.original;
            data.originalSpan.style.opacity = 1;
            data.lastChange = null;
            data.wasActive = false;
            data.enteredAt = null;
        });

        // Hide containers
        if (gridContainer) gridContainer.style.display = 'none';
        if (overlayContainer) overlayContainer.style.display = 'none';
    }

    // Get random character from charset
    function randomChar(charset) {
        return charset[Math.floor(Math.random() * charset.length)];
    }

    // Main animation loop
    function animate(timestamp) {
        if (!animating || !currentEffect) return;

        // Reveal containers on first frame
        if (gridContainer && gridContainer.style.display === 'none') {
            gridContainer.style.display = 'block';
        }
        if (overlayContainer && overlayContainer.style.display === 'none') {
            overlayContainer.style.display = 'block';
        }

        const elapsed = timestamp - startTime;

        if (elapsed > currentEffect.duration) {
            endEffect();
            return;
        }

        const charset = currentEffect.charset || DEFAULT_CHARSET;
        const scrambleWindow = currentEffect.scrambleWindow || 150;

        // Update background grid — only touch DOM on state transitions
        gridCells.forEach(cell => {
            const intensity = currentEffect.getIntensity
                ? currentEffect.getIntensity(cell.x, cell.y, origin.x, origin.y, elapsed, currentEffect.duration)
                : (currentEffect.isActive(cell.x, cell.y, origin.x, origin.y, elapsed, currentEffect.duration) ? 1 : 0);
            const active = intensity > 0;
            if (active !== cell.wasActive) {
                cell.span.style.opacity = active ? intensity : 0;
                cell.wasActive = active;
            }
        });

        // Update overlay characters — scramble briefly on enter, then freeze
        overlayChars.forEach(data => {
            const intensity = currentEffect.getIntensity
                ? currentEffect.getIntensity(data.x, data.y, origin.x, origin.y, elapsed, currentEffect.duration)
                : (currentEffect.isActive(data.x, data.y, origin.x, origin.y, elapsed, currentEffect.duration) ? 1 : 0);
            const active = intensity > 0;

            if (active && !data.wasActive) {
                // Just entered zone — show overlay, set initial random char
                data.span.style.opacity = 1;
                data.span.style.background = 'var(--background, #070B0E)';
                data.originalSpan.style.opacity = 0;
                data.wasActive = true;
                data.enteredAt = elapsed;
                if (!data.isSpace) {
                    data.span.textContent = randomChar(charset);
                    data.lastChange = elapsed;
                }
            } else if (active && !data.isSpace && elapsed - data.enteredAt < scrambleWindow) {
                // Still within scramble window — keep flickering
                if (elapsed - data.lastChange > 50) {
                    data.span.textContent = randomChar(charset);
                    data.lastChange = elapsed;
                }
            } else if (!active && data.wasActive) {
                // Just left zone — restore original
                data.span.style.opacity = 0;
                data.span.style.background = 'transparent';
                data.originalSpan.style.opacity = 1;
                data.wasActive = false;
            }
            // Active past scramble window or still inactive: no DOM writes
        });

        requestAnimationFrame(animate);
    }

    // Prepare for animation (call during delay period before trigger)
    function prepare() {
        if (!initialized) return;
        // Update overlay positions in case user scrolled
        updateOverlayPositions();
    }

    // Start an effect
    function triggerEffect(effectName, x, y, onComplete) {
        if (animating) return;

        if (!initialized) {
            console.warn('TextScramble not initialized yet');
            return;
        }

        const effect = effects[effectName];
        if (!effect) {
            console.warn(`Effect "${effectName}" not registered`);
            return;
        }

        currentEffect = effect;
        origin = { x, y };
        onCompleteCallback = onComplete || null;

        // Start animation immediately - no heavy DOM work needed!
        animating = true;
        startTime = performance.now();
        requestAnimationFrame(animate);
    }

    // End effect and cleanup
    function endEffect() {
        animating = false;
        currentEffect = null;
        resetState();

        if (onCompleteCallback) {
            onCompleteCallback();
            onCompleteCallback = null;
        }
    }

    // Initialize on page load
    function init() {
        if (initialized) return;

        measureCharDimensions();
        createGrid();
        createOverlay();
        initialized = true;
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded, init immediately
        init();
    }

    // Expose API
    window.TextScramble = {
        registerEffect,
        trigger: triggerEffect,
        prepare, // call during delay before trigger
        init // expose for manual init if needed
    };
})();
