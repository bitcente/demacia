import { Vector2 } from 'three';
import { height, width } from './size';

export const cursor = new Vector2(width / 2 - 1, height / 2 - 1);
export const mouse = new Vector2();
export let itemClicked: string | undefined;
export const previousCursor = { x: 0, y: 0 };
export let cursorDelta = 0;
export let blurIntensity = 0; // based on cursor movement

export const setItemClicked = (value: string | undefined) => {
    itemClicked = value;
}
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