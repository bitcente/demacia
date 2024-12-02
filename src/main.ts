import { objectFragmentShader, objectVertexShader } from './shaders/object';
import { Layer, screens } from './layers';
import './style.css'
import * as THREE from 'three';
import { smokeFragmentShader, smokeVertexShader } from './shaders/smoke';
import { LayerIntro } from './UiComponents/screenIntro';
import gsap from 'gsap';

// GLOBAL VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;
const cursor = new THREE.Vector2(width / 2 - 1, height / 2 - 1);
const mouse = new THREE.Vector2();
const pickableObjects: THREE.Mesh[] = [];
let intersectedObject: THREE.Object3D | null;
const animatedObjects: THREE.Mesh[] = [];
let screenRatio = width / height;
let itemClicked: string | undefined;
let canInteract = false;

// HUD
const hudDomElement = document.querySelector('.hud');

// SCENE
const scene = new THREE.Scene();

// TEXTURE LOADER
const textureLoader = new THREE.TextureLoader();

// LAYERS
const screen = screens[2];
const layerMeshes: {mesh: THREE.Mesh, layer: Layer}[] = [];
const layers = screen.layers;
const sceneGroup = new THREE.Group();
layers.forEach((layer, index) => {
  if (layer.isSmoke || layer.isClouds) {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uSmokeDirection: { value: layer.isClouds ? new THREE.Vector2(-1.0, -0.5) : new THREE.Vector2(1.0, 0.5) },
        uSmokeColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        uFadeDirection: { value: layer.isClouds ? 0.0 : 1.0 },
        uSmokeScale: { value: layer.isClouds ? 1.0 : 0.4 },
        uSmokeLight: { value: layer.isClouds ? 1.0 : 0.0 },
        uSpeed: { value: layer.isClouds ? 0.01 : 0.02 },
        uNoiseScale: { value: layer.noiseScale ?? 70.0 },
      },
      transparent: true,
      vertexShader: smokeVertexShader(),
      fragmentShader: smokeFragmentShader(),
    })
    const geometry = new THREE.PlaneGeometry(1, 1, 1);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = layer.name;
    layerMeshes.push({ mesh, layer });
    mesh.position.set(-cursor.x + layer.position.x - width / 2, cursor.y - layer.position.y, layer.position.z);
    mesh.scale.set(layer.width! * layer.scale, layer.height! * layer.scale, 1);
    sceneGroup.add(mesh);
    animatedObjects.push(mesh);
  } else if (layer.src) {
    const texture = textureLoader.load(layer.src, (tex) => {
      layers[index].height = tex.image.height;
      layers[index].width = tex.image.width;
      const material = new THREE.ShaderMaterial({
        uniforms: {
          u_tDiffuse: { value: texture },
          u_opacity: { value: 1 },
          u_resolution: { value: { x: width, y: height } },
          u_cursor: { value: cursor },
          u_blur: { value: 0 },
          u_colorFilter: { value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
        },
        transparent: true,
        vertexShader: objectVertexShader(),
        fragmentShader: objectFragmentShader(),
      })
    
      const geometry = new THREE.PlaneGeometry(1, 1, 1);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = layer.name;
      layerMeshes.push({ mesh, layer });
      mesh.position.set(-cursor.x + layer.position.x - width / 2, cursor.y - layer.position.y, layer.position.z);
      mesh.scale.set(layer.width! * layer.scale, layer.height! * layer.scale, 1);
      sceneGroup.add(mesh);
      if (layer.hoverBrightness) pickableObjects.push(mesh)
    });
  }
});
scene.add(sceneGroup);

// UI INTRO
const screenIntro = new LayerIntro({ title: screen.title, description: screen.description, onClose: () => canInteract = true });

// CAMERA
let aspectRatio = width / height;
const camera = new THREE.PerspectiveCamera(35, aspectRatio, 0.1, 1000000);
camera.position.z = 100;

// RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.querySelector('body')?.appendChild(renderer.domElement);

// RAYCASTER
const raycaster = new THREE.Raycaster();
let intersects: THREE.Intersection[];

// BRIGHT ELEMENT
const brightElementByMaterial = ({ material, brightness = 2 }: { material: THREE.ShaderMaterial; brightness?: number }) => {
  if (!material.uniforms.u_colorFilter) return;
  gsap.to(material.uniforms.u_colorFilter.value, {
    x: brightness,
    y: brightness,
    z: brightness,
    duration: 1.5,
  })
}

// MOUSE MOVE
document.addEventListener('pointermove', (e) => {
  cursor.x = e.x;
  cursor.y = e.y;
  mouse.x = ( e.x / width ) * 2 - 1;
  mouse.y = - ( e.y / height ) * 2 + 1;
})
let previousCursor = { x: 0, y: 0 }; // Track cursor position in the previous frame
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
  itemClicked = clickedObject.name;
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
  })
 
  if (canInteract) {
    
    // Calculate cursor movement
    const cursorDelta = Math.sqrt(Math.pow(cursor.x - previousCursor.x, 2) + Math.pow(cursor.y - previousCursor.y, 2));
    // Update blur intensity based on cursor movement
    blurIntensity = THREE.MathUtils.lerp(blurIntensity, cursorDelta > 0.1 ? .6 : 0, 0.1);
  
    // Update the previous cursor position
    previousCursor.x = cursor.x;
    previousCursor.y = cursor.y;
  
    // Hover
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(pickableObjects, true);
    
    if (intersects.length > 0) {
      intersectedObject = intersects[0].object;
      document.body.classList.add('cursor-pointer');
    } else {
      intersectedObject = null;
      document.body.classList.remove('cursor-pointer');
    }
  
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


  renderer.render(scene, camera);
}
animate();

// RESIZE
const adjustSceneScale = () => {
  const optimalRatio = 16/9;
  screenRatio = width / height;
  let scale = 1;
  if (screenRatio > optimalRatio) { // window too large
    scale = 1 + (screenRatio - optimalRatio) * .5;
  }
  sceneGroup.scale.set(scale,scale,1);
}
adjustSceneScale();

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize( width, height );
  adjustSceneScale();
})