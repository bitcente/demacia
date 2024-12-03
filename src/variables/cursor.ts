import { Vector2 } from 'three';
import { height, width } from './size';

export const cursor = new Vector2(width / 2 - 1, height / 2 - 1);
export const mouse = new Vector2();
export let itemClicked: string | undefined;

export const setItemClicked = (value: string | undefined) => {
    itemClicked = value;
}