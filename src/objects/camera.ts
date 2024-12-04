import { PerspectiveCamera } from "three";
import { screenRatio } from "../variables/size";

export let currentCamera: Camera;

export const setCurrentCamera = (newCamera: Camera) => {
    currentCamera = newCamera;
}

export class Camera extends PerspectiveCamera {

    constructor() {
        super( 35, screenRatio, 0.1, 1000000 );
        this.position.z = 100;
        this.updateProjectionMatrix();
    }
}