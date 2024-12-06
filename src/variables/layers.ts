import { Layer } from "../layers";
import { Mesh } from "three";

export let layerMeshes: {mesh: Mesh, layer: Layer}[] = [];

export const setLayerMeshes = (value: {mesh: Mesh, layer: Layer}[]) => {
    layerMeshes = value;
}