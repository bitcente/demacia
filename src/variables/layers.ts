import { Layer } from "../layers";
import { screen } from "./screen";
import { Mesh } from "three";

export const layerMeshes: {mesh: Mesh, layer: Layer}[] = [];
export const layers = screen.layers;