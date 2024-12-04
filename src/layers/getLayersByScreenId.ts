import { screens } from "../layers";
import { cloudsLayer } from "./cloudsLayer";
import { imageLayer } from "./imageLayer";
import { smokeLayer } from "./smokeLayer";

export const getLayersByScreenId = async ({ id }: { id: string }): Promise<any[]> => {
    const layers: Promise<any>[] = [];
    const screenInfo = screens.find((searchedScreen) => searchedScreen.id === id);

    if (!screenInfo) {
        console.error(`Screen with id ${id} not found!`);
        return [];
    }

    screenInfo.layers.forEach((layer) => {
        if (layer.isClouds) {
            layers.push(Promise.resolve(cloudsLayer({ layer }))); // Wrap synchronous calls in a resolved promise
        } else if (layer.isSmoke) {
            layers.push(Promise.resolve(smokeLayer({ layer }))); // Wrap synchronous calls in a resolved promise
        } else if (layer.src) {
            layers.push(imageLayer({ layer })); // Push the promise returned by imageLayer
        }
    });

    // Resolve all promises
    return Promise.all(layers);
};