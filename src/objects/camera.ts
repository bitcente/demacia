import { PerspectiveCamera } from "three";
import { screenRatio } from "../variables/size";

export const camera = new PerspectiveCamera(35, screenRatio, 0.1, 1000000);
camera.position.z = 100;