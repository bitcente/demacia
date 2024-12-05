import { Mesh } from "three";
import { Layer, screens } from "../layers";
import { cloudsLayer } from "./cloudsLayer";
import { imageLayer } from "./imageLayer";
import { smokeLayer } from "./smokeLayer";

export const getLayersByScreenId = async ({ id }: { id: string }): Promise<{ mesh: Mesh; layer: Layer }[]> => {
    const layers: Promise<{ mesh: Mesh; layer: Layer }>[] = [];
    const screenInfo = screens.find((searchedScreen) => searchedScreen.id === id);

    if (!screenInfo) {
        console.error(`Screen with id ${id} not found!`);
        return [];
    }

    screenInfo.layers.forEach((layer) => {
        if (layer.isClouds) {
            layers.push( Promise.resolve({ mesh: cloudsLayer({ layer }), layer }) );
        } else if (layer.isSmoke) {
            layers.push( Promise.resolve({ mesh: smokeLayer({ layer }), layer }) );
        } else if (layer.src) {
            layers.push(
                imageLayer({ layer }).then((mesh) => {
                    if (mesh) {
                        return { mesh, layer };
                    } else {
                        throw new Error(`Failed to create mesh for layer with src: ${layer.src}`);
                    }
                })
            );
        }
    });

    return Promise.all(layers);
};