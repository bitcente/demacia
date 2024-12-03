import { Mesh, PlaneGeometry, ShaderMaterial, Vector2, Vector3 } from "three";
import { Layer } from "../layers";
import { height, width } from "../variables/size";
import { smokeFragmentShader, smokeVertexShader } from "../shaders/smoke";
import { layerMeshes } from "../variables/layers";
import { cursor } from "../variables/cursor";
import { sceneGroup } from "../main";
import { animatedObjects } from "../variables/objects";


export const cloudsLayer = ({ layer }: { layer: Layer }) => {
    const material = new ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uResolution: { value: new Vector2(width, height) },
            uSmokeDirection: { value: new Vector2(-1.0, -0.5) },
            uSmokeColor: { value: new Vector3(1.0, 1.0, 1.0) },
            uFadeDirection: { value: 0.0 },
            uSmokeScale: { value: 1.0 },
            uSmokeLight: { value: 1.0 },
            uSpeed: { value: 0.01 },
            uNoiseScale: { value: layer.noiseScale ?? 70.0 },
        },
        transparent: true,
        vertexShader: smokeVertexShader(),
        fragmentShader: smokeFragmentShader(),
    });
    const geometry = new PlaneGeometry(1, 1, 1);
    const mesh = new Mesh(geometry, material);
    mesh.name = layer.name;
    layerMeshes.push({ mesh, layer });
    mesh.position.set(-cursor.x + layer.position.x - width / 2, cursor.y - layer.position.y, layer.position.z);
    mesh.scale.set(layer.width! * layer.scale, layer.height! * layer.scale, 1);
    sceneGroup.add(mesh);
    animatedObjects.push(mesh);
}