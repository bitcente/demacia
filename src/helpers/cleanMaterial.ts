import { ShaderMaterial, Texture } from "three"


export const cleanMaterial = (material: ShaderMaterial) => {
    console.log('dispose material!');
    material.dispose();

    // Dispose textures in uniforms
    if (material.uniforms) {
        for (const key in material.uniforms) {
            const uniform = material.uniforms[key];

            if (uniform && uniform.value instanceof Texture) {
                console.log(`dispose texture for uniform: ${key}`);
                uniform.value.dispose();
            }
        }
    }
};