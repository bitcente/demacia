import { Layer } from "../layers";
import { screen } from "./screen";
import { Mesh } from "three";

export let layerMeshes: {mesh: Mesh, layer: Layer}[] = [];
export const layers = screen.layers;

export const setLayerMeshes = (value: {mesh: Mesh, layer: Layer}[]) => {
    layerMeshes = value;
}