import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// Scene
const scene = new THREE.Scene();
window.scene = scene;

// Camera
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,0,0.5);

// Renderer
const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );

// Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.autoRotate = true;
controls.autoRotateSpeed = 5.0;

// GLTFLoader Loader
function loadGltfObject(filename, envMap) {
		new GLTFLoader().load( `/${filename}.glb`, function ( gltf ) {
			gltf.scene.traverse( child => {
				if ( child.isMesh ) {
			      child.material.envMap = envMap;
			    }
			} );

			let object = gltf.scene;
			scene.add( object );
		}, undefined, function ( error ) {
			console.error( error );
		} );
}

// createEnvMap
function createEnvMap() {
	return new Promise((resolve, reject) => {
		new RGBELoader().load('/sky2.hdr', function(texture) {
			let pmremGenerator = new THREE.PMREMGenerator(renderer);
			pmremGenerator.compileEquirectangularShader();
			
			let envMap = pmremGenerator.fromEquirectangular(texture).texture;
		  pmremGenerator.dispose();
		  
		  return resolve(envMap)
		})
	})
}

// Animation
function animate() {
	requestAnimationFrame( animate );

	controls.update();
	renderer.render( scene, camera );
}

const envMap = await createEnvMap();
scene.environment = envMap;
loadGltfObject('vml-logo2', envMap);

// loadGltfObject('can', envMap);
animate();

function clearScene() {
	scene.children.forEach(c => {
		scene.remove(c);
	})
}

window.clearScene = clearScene;

clearScene();