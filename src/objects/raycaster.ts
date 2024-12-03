import { Raycaster, Intersection } from "three";
import { mouse } from "../variables/cursor";
import { camera } from "./camera";
import { pickableObjects, setIntersectedObject } from "../variables/objects";

export const raycaster = new Raycaster();
export let intersects: Intersection[];

export const setIntersects = (value: Intersection[]) => {
    intersects = value;
}

export const updateRaycaster = () => {
    raycaster.setFromCamera(mouse, camera);
    setIntersects(raycaster.intersectObjects(pickableObjects, true));

    if (intersects.length > 0) {
      setIntersectedObject(intersects[0].object);
      document.body.classList.add('cursor-pointer');
    } else {
      setIntersectedObject(null);
      document.body.classList.remove('cursor-pointer');
    }
}