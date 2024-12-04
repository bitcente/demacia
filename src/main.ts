import gsap from 'gsap';
import * as THREE from 'three';
import { camera } from './objects/camera';
import { intersects, updateRaycaster } from './objects/raycaster';
import { renderer } from './objects/renderer';
import { Screen } from './screens/screen';
import './style.css';
import { LayerIntro } from './UiComponents/screenIntro';
import { cursor, cursorDelta, itemClicked, setItemClicked, updateCursorDeltaOnFrame } from './variables/cursor';
import { canInteract, setCanInteract } from './variables/interaction';
import { layerMeshes } from './variables/layers';
import { animatedObjects, intersectedObject, pickableObjects } from './variables/objects';
import { height, optimalRatio, screenRatio, setHeight, setScreenRatio, setWidth, width } from './variables/size';
import { brightElementByMaterial } from './helpers/brightElementByMaterial';

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
  if (!intersects[0]) return;
  const clickedObject = pickableObjects.filter(obj => obj.name === intersects[0].object.name)[0] as THREE.Mesh;
  setItemClicked(clickedObject.name);
  focusElementByName({ name: clickedObject.name });
}
document.addEventListener('click', (e) => {
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
    blurIntensity = THREE.MathUtils.lerp(blurIntensity, cursorDelta > 0.1 ? .6 : 0, 0.1);
  
    // Hover
    updateRaycaster();
  
    // Light up objects
    if (!itemClicked) {
      pickableObjects.forEach((o: THREE.Mesh, i) => {
        const material = pickableObjects[i].material as THREE.ShaderMaterial;
        if (material) {
          const layerHoveredIndex = layerMeshes.findIndex(layerMesh => layerMesh.layer.name === o.name);
          const hoverBrightness = layerMeshes[layerHoveredIndex].layer.hoverBrightness;
          if (hoverBrightness) {
            if (intersectedObject && intersectedObject.name === o.name) {
              layerHoveredIndex && (layerMeshes[layerHoveredIndex].layer.isBeingHovered = true);
              material.uniforms.u_colorFilter.value.x = THREE.MathUtils.lerp(material.uniforms.u_colorFilter.value.x, hoverBrightness, 0.1);
              material.uniforms.u_colorFilter.value.y = THREE.MathUtils.lerp(material.uniforms.u_colorFilter.value.y, hoverBrightness, 0.1);
              material.uniforms.u_colorFilter.value.z = THREE.MathUtils.lerp(material.uniforms.u_colorFilter.value.z, hoverBrightness, 0.1);
            } else {
              layerHoveredIndex && (layerMeshes[layerHoveredIndex].layer.isBeingHovered = false);
              material.uniforms.u_colorFilter.value.x = THREE.MathUtils.lerp(material.uniforms.u_colorFilter.value.x, 1, 0.1);
              material.uniforms.u_colorFilter.value.y = THREE.MathUtils.lerp(material.uniforms.u_colorFilter.value.y, 1, 0.1);
              material.uniforms.u_colorFilter.value.z = THREE.MathUtils.lerp(material.uniforms.u_colorFilter.value.z, 1, 0.1);
            }
          }
        }
      });
    }
  
    layerMeshes.forEach(({ mesh, layer }) => {
      if (!layer.disableMovement) {
        mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, -cursor.x + layer.position.x - width / 2, 0.1);
        mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, cursor.y - layer.position.y, 0.1);
      }
      if (!layer.disableRotation) {
        mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, cursor.x * .000008, 0.1);
        mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, (.5 - cursor.x) * .000008, 0.1);
      }
  
      // Update blur uniform
      const material = mesh.material as THREE.ShaderMaterial;
      if (layer.blurOnMovement) {
        material.uniforms.u_blur.value = THREE.MathUtils.lerp(material.uniforms.u_blur.value, blurIntensity * layer.blurOnMovement * (layer.isBeingHovered ? 0 : 1), 0.1);
      }
    });
    
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