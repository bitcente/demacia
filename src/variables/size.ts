export let width = window.innerWidth;
export let height = window.innerHeight;
export let screenRatio = width / height;
export const optimalRatio = 16 / 9;

export const setWidth = (value: number) => {
    width = value;
}
export const setHeight = (value: number) => {
    height = value;
}
export const setScreenRatio = (value: number) => {
    screenRatio = value;
}