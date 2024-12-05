import { Group, MathUtils, Mesh, Object3D, Object3DEventMap, Scene, ShaderMaterial } from "three";
import { getLayersByScreenId } from "../layers/getLayersByScreenId";
import { Layer, screens } from "../layers";
import { blurIntensity, cursor, itemClicked } from "../variables/cursor";
import { width } from "../variables/size";
import { intersectedObject, pickableObjects } from "../variables/objects";
import { cleanMaterial } from "../helpers/cleanMaterial";
import { LayerIntro } from "../UiComponents/screenIntro";
import { setCanInteract } from "../variables/interaction";


export class Screen {
    private _id: string;
    private _scene: Scene;
    private _sceneGroup: Group;
    private _data: {
        id: string;
        title: string;
        description: string;
        layers: Layer[];
    } | undefined;
    _layerMeshes: { mesh: Mesh; layer: Layer }[] = [];

    constructor({ id }: { id: string }) {
        this._id = id;
        this._scene = new Scene();
        this._sceneGroup = new Group();
        this._data = screens.find((searchedScreen) => searchedScreen.id === id);
    }

    async init() {
        this._layerMeshes = await getLayersByScreenId({ id: this._id });
        this._layerMeshes.forEach(layerMesh => {
            this._scene.add(layerMesh.mesh);
        });
        setTimeout(() => {
            this.showIntro();
        }, 700);
    }

    render() {
        // Light up objects
        if (!itemClicked) {
            pickableObjects.forEach((o: Mesh, i) => {
                const material = pickableObjects[i].material as ShaderMaterial;
                if (material) {
                    const layerHoveredIndex = this._layerMeshes.findIndex(layerMesh => layerMesh.layer.name === o.name);
                    if (!layerHoveredIndex || !this._layerMeshes[layerHoveredIndex]) return;
                    const hoverBrightness = this._layerMeshes[layerHoveredIndex].layer.hoverBrightness;
                    if (hoverBrightness) {
                        if (intersectedObject && intersectedObject.name === o.name) {
                            console.log(o.name);
                            
                            layerHoveredIndex && (this._layerMeshes[layerHoveredIndex].layer.isBeingHovered = true);
                            material.uniforms.u_colorFilter.value.x = MathUtils.lerp(material.uniforms.u_colorFilter.value.x, hoverBrightness, 0.1);
                            material.uniforms.u_colorFilter.value.y = MathUtils.lerp(material.uniforms.u_colorFilter.value.y, hoverBrightness, 0.1);
                            material.uniforms.u_colorFilter.value.z = MathUtils.lerp(material.uniforms.u_colorFilter.value.z, hoverBrightness, 0.1);
                        } else {
                            layerHoveredIndex && (this._layerMeshes[layerHoveredIndex].layer.isBeingHovered = false);
                            material.uniforms.u_colorFilter.value.x = MathUtils.lerp(material.uniforms.u_colorFilter.value.x, 1, 0.1);
                            material.uniforms.u_colorFilter.value.y = MathUtils.lerp(material.uniforms.u_colorFilter.value.y, 1, 0.1);
                            material.uniforms.u_colorFilter.value.z = MathUtils.lerp(material.uniforms.u_colorFilter.value.z, 1, 0.1);
                        }
                    }
                }
            });
        }

        this._layerMeshes.forEach(({ mesh, layer }) => {
            if (!layer.disableMovement) {
                mesh.position.x = MathUtils.lerp(mesh.position.x, -cursor.x + layer.position.x - width / 2, 0.1);
                mesh.position.y = MathUtils.lerp(mesh.position.y, cursor.y - layer.position.y, 0.1);
            }
            if (!layer.disableRotation) {
                mesh.rotation.y = MathUtils.lerp(mesh.rotation.y, cursor.x * .000008, 0.1);
                mesh.rotation.x = MathUtils.lerp(mesh.rotation.x, (.5 - cursor.x) * .000008, 0.1);
            }
        
            // Update blur uniform
            const material = mesh.material as ShaderMaterial;
            if (layer.blurOnMovement) {
                material.uniforms.u_blur.value = MathUtils.lerp(material.uniforms.u_blur.value, blurIntensity * layer.blurOnMovement * (layer.isBeingHovered ? 0 : 1), 0.1);
            }
        });
    }
    
    showIntro() {
        if (!this._data) return;
        new LayerIntro({ title: this._data.title, description: this._data.description, onClose: () => setCanInteract(true) });
    }

    dispose() {
        this._scene.traverse((object: Object3D<Object3DEventMap>) => {
            if (!(object instanceof Mesh)) return;
            
            object.geometry.dispose();
        
            if (object.material.isMaterial) {
                cleanMaterial(object.material);
            } else {
                // an array of materials
                for (const material of object.material) cleanMaterial(material);
            }
        })
    }

    get id() {
        return this._id;
    }
    get scene() {
        return this._scene;
    }
    get sceneGroup() {
        return this._sceneGroup;
    }
    get data() {
        return this._data;
    }
}