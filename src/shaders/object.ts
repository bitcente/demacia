export const objectVertexShader = () => {
    return `
        varying vec2 vUv;

        void main() {
            vUv = uv; // Pass UV coordinates to fragment shader
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `
}


export const objectFragmentShader = () => {
    return `
        uniform sampler2D u_tDiffuse;
        uniform float u_opacity;
        uniform vec2 u_resolution;
        uniform vec2 u_cursor;
        uniform float u_blur;
        uniform vec4 u_colorFilter;

        varying vec2 vUv;

        const int SampleCount = 64; // use a multiple of 2 here
        float Intensity = 0.1;
        vec4 directionalBlur(in vec2 uv, in vec2 direction, in float intensity) {
            vec4 color = vec4(0.0);  
            
            for (int i=1; i<=SampleCount; i++)
            {
                color += texture(u_tDiffuse,uv+float(i)*intensity/float(SampleCount)*direction);
            }
        
            return color/float(SampleCount);    
        }

        void main() {
            vec2 middle = u_resolution.xy * 0.5;
            vec2 direction = (u_cursor.xy-(middle));

            float dist = length(direction) / length(middle) * u_blur;

            // Sample the texture at the current UV coordinates
            vec4 color = directionalBlur(vUv, normalize(direction), dist * Intensity);

            // Apply the color filter and opacity
            color.rgb *= u_colorFilter.rgb; // Apply RGB color filter
            color.a *= u_opacity * u_colorFilter.a; // Combine filter alpha with uniform opacity

            // Output the final color
            gl_FragColor = color;
        }
    `;
}