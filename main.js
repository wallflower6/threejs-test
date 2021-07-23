import './style.css'
import * as THREE from 'three'
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'dat.gui';
import { WebGL1Renderer } from 'three';

// Renderer
const _threejs = new THREE.WebGLRenderer({
  canvas: document.querySelector('#scene'),
  antialias: true
});
_threejs.shadowMap.enabled = true;
_threejs.shadowMap.type = THREE.PCFSoftShadowMap;
_threejs.setPixelRatio(window.devicePixelRatio);
_threejs.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(_threejs.domElement);

// Camera
const fov = 60;
const aspect = 1920 / 1080;
const near = 1.0;
const far = 1000.0;
const _camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// _camera.position.x += 1;
// _camera.position.y += 1;
// _camera.position.z += 0;
// _camera.rotation.x += 1.3264;
// _camera.rotation.y = 1.5358;
// _camera.rotation.z += -1.3089;

// Controls
// const controls = new OrbitControls(_camera, _threejs.domElement);
// controls.target.set(0, 0, 0);

// Scene
const _scene = new THREE.Scene();

// Loading Screen
let loadingScreen = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(fov, aspect, near, far),
  box: new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({ color: 0x4444ff })
  )
};
loadingScreen.box.position.set(0, 0, 5);
loadingScreen.camera.lookAt(loadingScreen.box.position);
loadingScreen.scene.add(loadingScreen.box);

let RESOURCES_LOADED = false;

const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (item, loaded, total) => {
  console.log(item, loaded, total);
};
loadingManager.onLoad = () => {
  console.log("Loaded all resources");
  RESOURCES_LOADED = true;
}

// PointerLock
const ptrControls = new PointerLockControls(_camera, _threejs.domElement);
let clock = new THREE.Clock();
let btn = document.querySelector("#button");
let blocker = document.querySelector("#blocker");
let blocker_right = document.querySelector("#blocker-right");
btn.addEventListener('click', () => {
  blocker.classList.add("hide");
  blocker_right.classList.add("hide");
  ptrControls.lock();
});

// ptrControls.addEventListener('lock', () => {

// });

ptrControls.addEventListener('unlock', () => {
  blocker.classList.remove("hide");
  blocker_right.classList.remove("hide");
});

// Colliders
// Front collider
const collider_0 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 2, 75),
  new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
  }));
collider_0.position.set(-35, 1, 1);
_scene.add(collider_0);

// Back collider
const collider_1 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 2, 75),
  new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
  }));
collider_1.position.set(34, 1, 1);
_scene.add(collider_1);

// Right collider
const collider_2 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 2, 72),
  new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
  }));
collider_2.position.set(-3.25, 1, -33);
collider_2.rotation.y = Math.PI / 2;
_scene.add(collider_2);

// Left collider
const collider_3 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 2, 72),
  new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
  }));
collider_3.position.set(-3.25, 1, 33);
collider_3.rotation.y = Math.PI / 2;
_scene.add(collider_3);

// Set colliders to invisible
collider_0.material.visible = false;
collider_1.material.visible = false;
collider_2.material.visible = false;
collider_3.material.visible = false;

// Set bounding box around colliders
let bb0 = new THREE.Box3().setFromObject(collider_0);
let bb1 = new THREE.Box3().setFromObject(collider_1);
let bb2 = new THREE.Box3().setFromObject(collider_2);
let bb3 = new THREE.Box3().setFromObject(collider_3);

// Helpers
// let helper_0 = new THREE.Box3Helper( bb0, 0xffff00 );
// let helper_1 = new THREE.Box3Helper( bb1, 0xffff00 );
// let helper_2 = new THREE.Box3Helper( bb2, 0xffff00 );
// let helper_3 = new THREE.Box3Helper( bb3, 0xffff00 );
// _scene.add(helper_0);
// _scene.add(helper_1);
// _scene.add(helper_2);
// _scene.add(helper_3);

ptrControls.addEventListener('change', () => {

});

// Temp mesh
const temp = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshBasicMaterial({
      color: 0xFF3333,
  }));
  temp.scale.set(0.5, 0.5, 0.5);
  temp.position.set(
    _camera.position.x - Math.sin(_camera.rotation.y) * 0.5,
    _camera.position.y - 0.5,
    _camera.position.z + Math.cos(_camera.rotation.y) * 0.5
  );

  temp.rotation.set(
    _camera.rotation.x,
    _camera.rotation.y - Math.PI,
    _camera.rotation.z
  );

  // temp.material.visible = false;
_scene.add(temp);
let bbcam = new THREE.Box3().setFromObject(temp);

const intersection = document.querySelector("#intersection");

function setCameraCollider() {
  temp.position.set(
    _camera.position.x - Math.sin(_camera.rotation.y) * 0.6,
    1,
    _camera.position.z + Math.cos(_camera.rotation.y) * 0.6
  );

  temp.rotation.set(
    _camera.rotation.x,
    _camera.rotation.y - Math.PI,
    _camera.rotation.z
  );

  bbcam = new THREE.Box3().setFromObject(temp);
}


// Keyboard
let keyboard = [];
addEventListener('keydown', (e) => {
  keyboard[e.key] = true;
});
addEventListener('keyup', (e) => {
  keyboard[e.key] = false;
});

function process_keyboard(delta) {
  let speed = 7;
  let actualSpeed = speed * delta;

  let intersecting = bb2.intersectsBox(bbcam) || bb3.intersectsBox(bbcam) || bb0.intersectsBox(bbcam) || bb1.intersectsBox(bbcam);

  if (keyboard['w']) {
    if (ptrControls.isLocked && !intersecting) {
      ptrControls.moveForward(actualSpeed);
    }
  }
  if (keyboard['s']) {
    if (ptrControls.isLocked && !intersecting) {
      ptrControls.moveForward(-actualSpeed);
    }
  }
  if (keyboard['a']) {
    if (ptrControls.isLocked && !intersecting) {
      ptrControls.moveRight(-actualSpeed);
    }
  }
  if (keyboard['d']) {
    if (ptrControls.isLocked && !intersecting) {
      ptrControls.moveRight(actualSpeed);
    }
  }
  // if (keyboard[' ']) {
  //   ptrControls.getObject().position.y += actualSpeed;
  // }
}

// controls.reset();
_camera.position.set(0, 2, 0);
_camera.rotation.x += -Math.PI / 2;
_camera.rotation.y += Math.PI / 2;
_camera.rotation.z += Math.PI / 2;
_camera.updateProjectionMatrix();
// controls.update();


const offset = 0;
// Loader
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.load('./resources/room2/scene.gltf', (gltf) => {
  gltf.scene.traverse(c => {
    c.castShadow = true;
  })
  _scene.add(gltf.scene);
  gltf.scene.position.set(0, 0, 0);
  gltf.scene.scale.set(12, 6, 6);
  // _camera.lookAt(gltf.scene.position-offset);
})
// _camera.rotation.y = 90 * Math.PI / 180

window.addEventListener('resize', () => {
  _OnWindowResize();
}, false);

let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set(20, 100, 10);
light.target.position.set(0, 0, 0);
light.castShadow = true;
light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 500.0;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500.0;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;
_scene.add(light);

light = new THREE.AmbientLight(0x101010);
_scene.add(light);

// Add HDRI
// const loader = new THREE.CubeTextureLoader(loadingManager);
// const texture = loader.load([
//     './resources/posx.jpeg',
//     './resources/negx.jpeg',
//     './resources/posy.jpeg',
//     './resources/negy.jpeg',
//     './resources/posz.jpeg',
//     './resources/negz.jpeg',
// ]);
// _scene.background = texture;

// Add a plane
// const plane = new THREE.Mesh(
//     new THREE.PlaneGeometry(100, 100, 10, 10),
//     new THREE.MeshStandardMaterial({
//         color: 0xFFFFFF,
//       }));
// plane.castShadow = false;
// plane.receiveShadow = true;
// plane.rotation.x = -Math.PI / 2;
// _scene.add(plane);

// Dat.GUI
// const gui = new dat.GUI();
// const colFolder = gui.addFolder("Collider");
// colFolder.add(collider_2.position, 'x', -5, 5, 0.5);
// colFolder.add(collider_3.position, 'x', -5, 5, 0.5);
// colFolder.open();

function _OnWindowResize() {
  _camera.aspect = window.innerWidth / window.innerHeight;
  _camera.updateProjectionMatrix();
  _threejs.setSize(window.innerWidth, window.innerHeight);
}

// Next Scene
// Add a box
const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 4, 3),
  new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
  }));
box.position.set(-35, 5, 1);
box.castShadow = true;
box.receiveShadow = true;
_scene.add(box);

const nextScene = document.querySelector("#nextScene");
function toggleNextZone() {
  if (_camera.position.x <= -32 && _camera.position.x >= -36) {
    nextScene.classList.add("show");
  } else {
    nextScene.classList.remove("show");
  }
}

function _RAF() {

  if (!RESOURCES_LOADED) {
    requestAnimationFrame(_RAF);

    loadingScreen.box.position.x -= 0.05;
    if(loadingScreen.box.position.x < -10) {
      loadingScreen.box.position.x = 10;
    }
    loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
    _threejs.render(loadingScreen.scene, loadingScreen.camera);
    return;
  }

  requestAnimationFrame(_RAF);
  let delta = clock.getDelta();
  toggleNextZone();
  process_keyboard(delta);
  setCameraCollider();
  
  _threejs.render(_scene, _camera);
}

_RAF();



