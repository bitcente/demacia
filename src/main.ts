import * as THREE from 'three';
import { brightElementByMaterial } from './helpers/brightElementByMaterial';
import { camera } from './objects/camera';
import { intersects, updateRaycaster } from './objects/raycaster';
import { renderer } from './objects/renderer';
import { Screen } from './screens/screen';
import './style.css';
import { LayerIntro } from './UiComponents/screenIntro';
import { cursor, cursorDelta, setBlurIntensity, setItemClicked, updateCursorDeltaOnFrame } from './variables/cursor';
import { canInteract, setCanInteract } from './variables/interaction';
import { layerMeshes } from './variables/layers';
import { animatedObjects, pickableObjects } from './variables/objects';
import { height, optimalRatio, screenRatio, setHeight, setScreenRatio, setWidth, width } from './variables/size';

// SCENE
const id = 'invasion';

const scene = new Screen({ id });
const sceneData = scene.data;
await scene.init();

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
  
    scene.render();
    
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, (cursor.x / width - .5)  * .01, 0.1);

  }

  renderer.render(scene.scene, camera);
}
animate();

// RESIZE
const adjustSceneScale = () => {
  setScreenRatio(width / height)
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
  renderer.setSize( width, height );
  adjustSceneScale();
})