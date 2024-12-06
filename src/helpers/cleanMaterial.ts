import { ShaderMaterial, Texture } from "three"


export const cleanMaterial = (material: ShaderMaterial) => {
    material.dispose();

    // Dispose textures in uniforms
    if (material.uniforms) {
        for (const key in material.uniforms) {
            const uniform = material.uniforms[key];

            if (uniform && uniform.value instanceof Texture) {
                uniform.value.dispose();
            }
        }
    }
};