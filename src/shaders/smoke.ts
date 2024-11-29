export const smokeVertexShader = () => {
    return `
        varying vec2 vUv;

        void main() {
            vUv = uv; // Pass UV coordinates to fragment shader
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
}

export const smokeFragmentShader = () => {
    return `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uSmokeDirection;
        uniform vec3 uSmokeColor;
        uniform float uFadeDirection;
        uniform float uSmokeScale;
        uniform float uSmokeLight;
        uniform float uSpeed;
        uniform float uNoiseScale;

        varying vec2 vUv;

        const float smokedark = 0.5;
        const float smokecover = 0.1;
        const float smokealpha = 1.0;

        const mat2 m = mat2(1.6, 1.2, -1.2, 1.6);

        vec2 hash(vec2 p) {
            p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
            return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
        }

        float noise(in vec2 p) {
            const float K1 = 0.366025404; // (sqrt(3)-1)/2
            const float K2 = 0.211324865; // (3-sqrt(3))/6
            vec2 i = floor(p + (p.x + p.y) * K1);
            vec2 a = p - i + (i.x + i.y) * K2;
            vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec2 b = a - o + K2;
            vec2 c = a - 1.0 + 2.0 * K2;
            vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
            vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
            return dot(n, vec3(uNoiseScale));
        }

        float fbm(vec2 n) {
            float total = 0.0, amplitude = 0.1;
            for (int i = 0; i < 7; i++) {
                total += noise(n) * amplitude;
                n = m * n;
                amplitude *= 0.4;
            }
            return total;
        }

        void main() {
            vec2 p = vUv;
            vec2 uv = p * vec2(uResolution.x / uResolution.y, 1.0);

            // Modify time-based movement using uSmokeDirection
            float time = uTime * uSpeed;
            vec2 smokeOffset = uSmokeDirection * time; // Smoke movement offset

            float q = fbm(uv * uSmokeScale * 0.5);

            float r = 0.0;
            uv *= uSmokeScale;
            uv -= q - smokeOffset; // Apply directional offset
            float weight = 0.8;
            for (int i = 0; i < 8; i++) {
                r += abs(weight * noise(uv));
                uv = m * uv + smokeOffset;
                weight *= 0.7;
            }

            float f = 0.0;
            uv = p * vec2(uResolution.x / uResolution.y, 1.0);
            uv *= uSmokeScale;
            uv -= q - smokeOffset; // Apply directional offset
            weight = 0.7;
            for (int i = 0; i < 8; i++) {
                f += weight * noise(uv);
                uv = m * uv + smokeOffset;
                weight *= 0.6;
            }

            f *= r + f;

            float c = 0.0;
            time = uTime * uSpeed * 2.0;
            uv = p * vec2(uResolution.x / uResolution.y, 1.0);
            uv *= uSmokeScale * 2.0;
            uv -= q - smokeOffset; // Apply directional offset
            weight = 0.4;
            for (int i = 0; i < 7; i++) {
                c += weight * noise(uv);
                uv = m * uv + smokeOffset;
                weight *= 0.6;
            }

            float c1 = 0.0;
            time = uTime * uSpeed * 3.0;
            uv = p * vec2(uResolution.x / uResolution.y, 1.0);
            uv *= uSmokeScale * 3.0;
            uv -= q - smokeOffset; // Apply directional offset
            weight = 0.4;
            for (int i = 0; i < 7; i++) {
                c1 += abs(weight * noise(uv));
                uv = m * uv + smokeOffset;
                weight *= 0.6;
            }

            c += c1;

            vec3 smokecolour = uSmokeColor * clamp((smokedark + uSmokeLight * c), 0.0, 1.0);

            f = smokecover + smokealpha * f * r;

            vec3 result = mix(vec3(0.0), clamp(smokecolour, 0.0, 1.0), clamp(f + c, 0.0, 1.0));

            // Fade factor logic based on uFadeDirection uniform
            float fade;
            if (uFadeDirection == 0.0) {
                // Fade from the bottom (0.0 -> 1.0)
                fade = smoothstep(0.0, 1.5, vUv.y);
            } else {
                // Fade from the top (1.0 -> 0.0)
                fade = smoothstep(0.5, 0.0, vUv.y);
            }

            float alpha = clamp(f + c - 0.3, 0.0, 1.0) * fade; // Adjust alpha with fade factor

            gl_FragColor = vec4(result, alpha); // Include dynamic alpha with fade
        }
    `;
};
