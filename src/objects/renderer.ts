import { WebGLRenderer } from "three";
import { height, width } from "../variables/size";

export const renderer = new WebGLRenderer();
renderer.setSize(width, height);
document.querySelector('body')?.appendChild(renderer.domElement);