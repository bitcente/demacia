import { Mesh, PlaneGeometry, ShaderMaterial, Vector4 } from "three";
import { Layer } from "../layers";
import { textureLoader } from "../loaders/textureLoader";
import { objectFragmentShader, objectVertexShader } from "../shaders/object";
import { cursor } from "../variables/cursor";
import { layerMeshes } from "../variables/layers";
import { pickableObjects } from "../variables/objects";
import { height, width } from "../variables/size";

export const imageLayer = async ({ layer }: { layer: Layer }): Promise<Mesh | undefined> => {
    return new Promise((resolve, reject) => {
        if (!layer.src) return;
        const texture = textureLoader.load(
            layer.src,
            (tex) => {
                try {
                    layer.height = tex.image.height;
                    layer.width = tex.image.width;

                    const material = new ShaderMaterial({
                        uniforms: {
                            u_tDiffuse: { value: texture },
                            u_opacity: { value: 1 },
                            u_resolution: { value: { x: width, y: height } },
                            u_cursor: { value: cursor },
                            u_blur: { value: 0 },
                            u_colorFilter: { value: new Vector4(1.0, 1.0, 1.0, 1.0) },
                        },
                        transparent: true,
                        vertexShader: objectVertexShader(),
                        fragmentShader: objectFragmentShader(),
                    });

                    const geometry = new PlaneGeometry(1, 1, 1);
                    const mesh = new Mesh(geometry, material);
                    mesh.name = layer.name;

                    layerMeshes.push({ mesh, layer });
                    mesh.position.set(
                        -cursor.x + layer.position.x - width / 2,
                        cursor.y - layer.position.y,
                        layer.position.z
                    );
                    mesh.scale.set(layer.width! * layer.scale, layer.height! * layer.scale, 1);
                    if (layer.hoverBrightness) pickableObjects.push(mesh);

                    resolve(mesh);
                } catch (err) {
                    reject(err);
                }
            },
            undefined,
            (error) => {
                reject(error);
            }
        );
    });
};