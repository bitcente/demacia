import { Mesh, ShaderMaterial, Vector2 } from 'three';
import { height, width } from './size';
import { canInteract } from './interaction';
import { intersects } from '../objects/raycaster';
import { pickableObjects } from './objects';
import { brightElementByMaterial } from '../helpers/brightElementByMaterial';
import { layerMeshes } from './layers';

export const cursor = new Vector2(width / 2 - 1, height / 2 - 1);
export const mouse = new Vector2();
export let itemClicked: string | undefined;
export const previousCursor = { x: 0, y: 0 };
export let cursorDelta = 0;
export let blurIntensity = 0; // based on cursor movement

export const setBlurIntensity = (value: number) => {
    blurIntensity = value;
}

export const updateCursorDeltaOnFrame = () => {
    // Calculate cursor movement
    cursorDelta = Math.sqrt(Math.pow(cursor.x - previousCursor.x, 2) + Math.pow(cursor.y - previousCursor.y, 2));
    // Update the previous cursor position
    previousCursor.x = cursor.x;
    previousCursor.y = cursor.y;
}

document.addEventListener('pointermove', (e) => {
    cursor.x = e.x;
    cursor.y = e.y;
    mouse.x = ( e.x / width ) * 2 - 1;
    mouse.y = - ( e.y / height ) * 2 + 1;
});


// CLICK
export const setItemClicked = (value?: string) => {
    itemClicked = value;
}

export const focusElementByName = ({ name }: { name: string }) => {
    layerMeshes.forEach(({ mesh, layer }) => {
        if (!layer.src) return;
        const material = mesh.material as ShaderMaterial;
        if (mesh.name === name) {
            brightElementByMaterial({ material, brightness: layer.hoverBrightness });
        } else {
            brightElementByMaterial({ material, brightness: .5 });
        }
    });
}
export const unfocusEverything = () => {
    layerMeshes.forEach(({ mesh, layer }) => {
        if (!layer.src) return;
        const material = mesh.material as ShaderMaterial;
        brightElementByMaterial({ material, brightness: 1 });
    })
}
  
export const triggerClick = () => {
    if (!intersects || !intersects[0]) {
        unfocusEverything();
        setItemClicked();
    } else {
        const clickedObject = pickableObjects.filter(obj => obj.name === intersects[0].object.name)[0] as Mesh;
        setItemClicked(clickedObject.name);
        focusElementByName({ name: clickedObject.name });
    }
}

document.addEventListener('click', () => {
    canInteract && triggerClick();
});