// ASCII Ripple Effect using WebGL
(function() {
    const CELL_SIZE = 16;
    const CHAR_COUNT = 8; // "  .hello"
    const DURATION = 8; // seconds
    const WAVE_SPEED = 400; // pixels per second
    const WAVE_WIDTH = 150; // width of the ripple ring in pixels

    let canvas, gl, program;
    let startTime = null;
    let clickPos = { x: 0, y: 0 };
    let animating = false;
    let texture;

    const vsSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fsSource = `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform vec2 u_click;
        uniform float u_time;
        uniform sampler2D u_texture;
        uniform vec2 u_texSize;

        const float CELL_WIDTH = 16.0;
        const float CELL_HEIGHT = 24.0;
        const float WAVE_SPEED = 400.0;
        const float WAVE_WIDTH = 150.0;
        const float DURATION = 8.0;
        const float CHAR_COUNT = 8.0;

        void main() {
            vec2 cellSize = vec2(CELL_WIDTH, CELL_HEIGHT);
            vec2 cell = floor(gl_FragCoord.xy / cellSize);
            vec2 cellCenter = (cell + 0.5) * cellSize;

            float dist = distance(cellCenter, u_click);

            // Ease-out: starts fast, slows down
            float maxRadius = WAVE_SPEED * DURATION;
            float progress = u_time / DURATION;
            float eased = 1.0 - pow(1.0 - progress, 2.0);
            float waveRadius = eased * maxRadius;
            float waveDist = abs(dist - waveRadius);

            // Wave intensity (1.0 at wave center, 0.0 outside)
            float wave = 1.0 - smoothstep(0.0, WAVE_WIDTH, waveDist);

            // Fade out over time
            float fade = 1.0 - (u_time / DURATION);
            wave *= fade;

            // Map to character index (0 to CHAR_COUNT - 1)
            float charIndex = floor(wave * (CHAR_COUNT - 1.0) + 0.5);

            // Sample texture
            vec2 cellUV = fract(gl_FragCoord.xy / cellSize);
            float charWidth = 1.0 / CHAR_COUNT;
            vec2 texCoord = vec2(
                charIndex * charWidth + cellUV.x * charWidth,
                1.0 - cellUV.y
            );

            vec4 texColor = texture2D(u_texture, texCoord);

            // Only show if wave has reached this point
            float show = step(dist, waveRadius + WAVE_WIDTH);

            gl_FragColor = vec4(texColor.rgb, texColor.a * show * step(0.01, wave));
        }
    `;

    function initWebGL() {
        canvas = document.createElement('canvas');
        canvas.id = 'ripple-canvas';
        document.body.insertBefore(canvas, document.body.firstChild);

        gl = canvas.getContext('webgl', {
            alpha: true,
            premultipliedAlpha: false,
            antialias: false
        });

        if (!gl) {
            console.warn('WebGL not supported');
            return false;
        }

        // Create shader program
        const vs = createShader(gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Shader link error:', gl.getProgramInfoLog(program));
            return false;
        }

        // Fullscreen quad
        const positions = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        // Load texture
        loadTexture('img/ripple-chars.png');

        resize();
        window.addEventListener('resize', resize);

        return true;
    }

    function createShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    function loadTexture(url) {
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Placeholder until image loads
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 255, 255, 0]));

        const image = new Image();
        image.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        };
        image.src = url;
    }

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function triggerRipple(x, y) {
        if (animating) return;

        const dpr = window.devicePixelRatio || 1;
        clickPos.x = x * dpr;
        clickPos.y = (window.innerHeight - y) * dpr; // Flip Y for WebGL
        startTime = performance.now();
        animating = true;
        requestAnimationFrame(render);
    }

    function render(now) {
        const elapsed = (now - startTime) / 1000;

        if (elapsed > DURATION) {
            animating = false;
            gl.clear(gl.COLOR_BUFFER_BIT);
            return;
        }

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.useProgram(program);

        gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.height);
        gl.uniform2f(gl.getUniformLocation(program, 'u_click'), clickPos.x, clickPos.y);
        gl.uniform1f(gl.getUniformLocation(program, 'u_time'), elapsed);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(program, 'u_texture'), 0);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(render);
    }

    // Initialize and expose trigger function
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        if (initWebGL()) {
            window.triggerRipple = triggerRipple;
        }
    }
})();
