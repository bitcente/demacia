import * as THREE from 'three';
import { brightElementByMaterial } from './helpers/brightElementByMaterial';
import { intersects, updateRaycaster } from './objects/raycaster';
import { Renderer } from './objects/renderer';
import { Screen } from './screens/screen';
import './style.css';
import { LayerIntro } from './UiComponents/screenIntro';
import { cursor, cursorDelta, setBlurIntensity, setItemClicked, updateCursorDeltaOnFrame } from './variables/cursor';
import { canInteract, setCanInteract } from './variables/interaction';
import { layerMeshes } from './variables/layers';
import { animatedObjects, pickableObjects } from './variables/objects';
import { height, optimalRatio, screenRatio, setHeight, setScreenRatio, setWidth, width } from './variables/size';
import { Camera, setCurrentCamera } from './objects/camera';

// SCENE
let currentScreen: Screen;

const id = 'invasion';

const scene = new Screen({ id });
currentScreen = scene;
const sceneData = scene.data;
await scene.init();

// Camera
const camera = new Camera();
setCurrentCamera(camera);

// Renderer
export const renderer = new Renderer({ scene: scene.scene, camera });

const id2 = 'petricite';

const scene2 = new Screen({ id: id2 });
const sceneData2 = scene2.data;
await scene2.init();

// Camera
const camera2 = new Camera();

setTimeout(() => {
  renderer.transitionToScene({ targetScene: scene2.scene, targetCamera: camera2, onComplete: () => {
    currentScreen = scene2;
    setCanInteract(false);
    // UI INTRO
    if (sceneData2) {
      new LayerIntro({ title: sceneData2.title, description: sceneData2.description, onClose: () => setCanInteract(true) });
    }
  } })
}, 3000);


// UI INTRO
if (sceneData) {
  new LayerIntro({ title: sceneData.title, description: sceneData.description, onClose: () => setCanInteract(true) });
}

// MOUSE MOVE
let blurIntensity = 0; // Current blur radius

// CLICK
const focusElementByName = ({ name }: { name: string }) => {
  layerMeshes.forEach(({ mesh, layer }) => {
    if (!layer.src) return;
    const material = mesh.material as THREE.ShaderMaterial;
    if (mesh.name === name) {
      brightElementByMaterial({ material, brightness: 2 });
    } else {
      brightElementByMaterial({ material, brightness: .5 });
    }
  })
}

const triggerClick = () => {
  if (!intersects || !intersects[0]) return;
  const clickedObject = pickableObjects.filter(obj => obj.name === intersects[0].object.name)[0] as THREE.Mesh;
  setItemClicked(clickedObject.name);
  focusElementByName({ name: clickedObject.name });
}
document.addEventListener('click', () => {
  triggerClick();
})


// ANIMATE
const clock = new THREE.Clock();
const animate = () => {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime(); // Time in seconds
  
  animatedObjects.forEach(object => {
    const material = object.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = elapsedTime;
  });
 
  if (canInteract) {

    // Update blur intensity based on cursor movement
    updateCursorDeltaOnFrame();
    setBlurIntensity(THREE.MathUtils.lerp(blurIntensity, cursorDelta > 0.1 ? .6 : 0, 0.1))
  
    // Hover
    updateRaycaster();
  
    currentScreen.render();
    
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, (cursor.x / width - .5)  * .01, 0.1);

  }

  renderer.render();
}
animate();

// RESIZE
const adjustSceneScale = () => {
  setScreenRatio(width / height);
  let scale = 1;
  if (screenRatio > optimalRatio) { // window too large
    scale = 1 + (screenRatio - optimalRatio) * .5;
  }
  scene.sceneGroup.scale.set(scale,scale,1);
}
adjustSceneScale();

window.addEventListener('resize', () => {
  setWidth(window.innerWidth);
  setHeight(window.innerHeight);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.updateSize();
  adjustSceneScale();
})