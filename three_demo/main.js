import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const cameraZ = 30;
const cameraX = -3;
camera.position.setZ(cameraZ);
camera.position.setX(cameraX);

renderer.render(scene, camera);


// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x7b03fc});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// set up 3d puppy
var shibaModel;
const loader = new GLTFLoader();
loader.load( 'shiba.glb', function ( gltf ) {
  var shibaModel = gltf.scene;
  scene.add(shibaModel);
  shibaModel.position.set(0,0,30);
  shibaModel.rotation.x += 0.01;
}, undefined, function ( error ) {
	console.error( error );
} );

// light setup

const pointLight = new THREE.PointLight(0xfce803, 30);
pointLight.position.set(10,0,10);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// show light location and grid
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)

// enable mouse control
const controls = new OrbitControls(camera, renderer.domElement);

//add 200 random stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// set up background
const spaceTexture = new THREE.TextureLoader().load('paper.jpeg');
scene.background = spaceTexture;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = cameraZ + t * -0.02;
  camera.position.x = cameraX + t * -0.005;
  camera.rotation.y = t * -0.002;
}

document.body.onscroll = moveCamera;
moveCamera();


// rotation 

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  if (shibaModel) {
    shibaModel.rotation.x += 0.01;
    shibaModel.rotation.y += 0.005;
  }

  controls.update();

  renderer.render(scene, camera);
}

animate();