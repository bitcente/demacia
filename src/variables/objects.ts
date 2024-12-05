import { Mesh, Object3D } from 'three';

export let pickableObjects: Mesh[] = [];
export let intersectedObject: Object3D | null;
export let animatedObjects: Mesh[] = [];

export const setIntersectedObject = (object: Object3D | null) => {
    intersectedObject = object;
}
export const setAnimatedObjects = (newArray: Mesh[]) => {
    animatedObjects = newArray;
}
export const setPickableObjects = (newArray: Mesh[]) => {
    pickableObjects = newArray;
}