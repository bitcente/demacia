import { Mesh, PlaneGeometry, ShaderMaterial, Vector4 } from "three";
import { Layer } from "../layers";
import { textureLoader } from "../loaders/textureLoader";
import { layerMeshes, layers } from "../variables/layers";
import { pickableObjects } from "../variables/objects";
import { height, width } from "../variables/size";
import { cursor } from "../variables/cursor";
import { objectFragmentShader, objectVertexShader } from "../shaders/object";
import { sceneGroup } from "../main";


export const imageLayer = ({ layer, index }: { layer: Layer, index: number }) => {
    if (!layer.src) return;
    const texture = textureLoader.load(layer.src, (tex) => {
        layers[index].height = tex.image.height;
        layers[index].width = tex.image.width;
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
        })
        
        const geometry = new PlaneGeometry(1, 1, 1);
        const mesh = new Mesh(geometry, material);
        mesh.name = layer.name;
        layerMeshes.push({ mesh, layer });
        mesh.position.set(-cursor.x + layer.position.x - width / 2, cursor.y - layer.position.y, layer.position.z);
        mesh.scale.set(layer.width! * layer.scale, layer.height! * layer.scale, 1);
        sceneGroup.add(mesh);
        if (layer.hoverBrightness) pickableObjects.push(mesh)
    });
}