import { Mesh, Object3D } from 'three';

export const pickableObjects: Mesh[] = [];
export let intersectedObject: Object3D | null;
export const animatedObjects: Mesh[] = [];

export const setIntersectedObject = (object: Object3D | null) => {
    intersectedObject = object;
}