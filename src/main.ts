import * as THREE from 'three';
import { brightElementByMaterial } from './helpers/brightElementByMaterial';
import { intersects, updateRaycaster } from './objects/raycaster';
import { Renderer } from './objects/renderer';
import { Screen } from './screens/screen';
import './style.css';
import { LayerIntro } from './UiComponents/screenIntro';
import { cursor, cursorDelta, setBlurIntensity, setItemClicked, unfocusEverything, updateCursorDeltaOnFrame } from './variables/cursor';
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

const id = 'petricite';

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
    const id2 = 'plaza';

    const screen2 = new Screen({ id: id2 });
    await screen2.init();

    // Camera
    const camera2 = new Camera();
    renderer.transitionToScene({ targetScene: screen2.scene, targetCamera: camera2,
      onComplete: () => {
        setCurrentScreen(screen2);
        setCanInteract(false);
        unfocusEverything();

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

// MOUSE MOVE
let blurIntensity = 0; // Current blur radius


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