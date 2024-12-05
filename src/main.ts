import * as THREE from 'three';
import { brightElementByMaterial } from './helpers/brightElementByMaterial';
import { intersects, updateRaycaster } from './objects/raycaster';
import { Renderer } from './objects/renderer';
import { Screen } from './screens/screen';
import './style.css';
import { LayerIntro } from './UiComponents/screenIntro';
import { cursor, cursorDelta, setBlurIntensity, setItemClicked, updateCursorDeltaOnFrame } from './variables/cursor';
import { canInteract, setCanInteract } from './variables/interaction';
import { layerMeshes, setLayerMeshes } from './variables/layers';
import { animatedObjects, pickableObjects } from './variables/objects';
import { height, optimalRatio, screenRatio, setHeight, setScreenRatio, setWidth, width } from './variables/size';
import { Camera, setCurrentCamera } from './objects/camera';

// SCENE
export let currentScreen: Screen;
export const setCurrentScreen = (newScreen: Screen) => {
  currentScreen = newScreen;
}

const id = 'invasion';

const screen1 = new Screen({ id });
currentScreen = screen1;
const screen1Data = screen1.data;
await screen1.init();

// Camera
const camera = new Camera();
setCurrentCamera(camera);

// Renderer
export const renderer = new Renderer({ scene: screen1.scene, camera });

window.addEventListener('keypress', async (e) => {
  if (e.key === 'q') { // to test
    const id2 = 'petricite';

    const screen2 = new Screen({ id: id2 });
    const screen2Data = screen2.data;
    await screen2.init();

    // Camera
    const camera2 = new Camera();
    renderer.transitionToScene({ targetScene: screen2.scene, targetCamera: camera2,
      onComplete: () => {
        setCurrentScreen(screen2);
        setCanInteract(false);
        unfocusEverything();

        // UI intro
        if (screen2Data) {
          new LayerIntro({ title: screen2Data.title, description: screen2Data.description, onClose: () => setCanInteract(true) });
        }

        // Remove items from old scene in layerMeshes
        if (screen1Data) {
          const idsToRemove = new Set(screen1Data.layers.map(item => item.name));
          setLayerMeshes(layerMeshes.filter(item => !idsToRemove.has(item.layer.name)));
        }

        screen1.dispose();
      }
    })
  }
})


// UI INTRO
if (screen1Data) {
  new LayerIntro({ title: screen1Data.title, description: screen1Data.description, onClose: () => setCanInteract(true) });
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
const unfocusEverything = () => {
  layerMeshes.forEach(({ mesh, layer }) => {
    if (!layer.src) return;
    const material = mesh.material as THREE.ShaderMaterial;
    brightElementByMaterial({ material, brightness: 1 });
  })
}

const triggerClick = () => {
  if (!intersects || !intersects[0]) {
    unfocusEverything();
  } else {
    const clickedObject = pickableObjects.filter(obj => obj.name === intersects[0].object.name)[0] as THREE.Mesh;
    setItemClicked(clickedObject.name);
    focusElementByName({ name: clickedObject.name });
  }
}
document.addEventListener('click', () => {
  canInteract && triggerClick();
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
  currentScreen && currentScreen.sceneGroup.scale.set(scale,scale,1);
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