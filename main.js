import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,0,1);

const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Controls
const controls = new OrbitControls( camera, renderer.domElement );

// Lighting
// const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
// hemiLight.position.set( 0, 30, 0 );
// scene.add( hemiLight );
// const dirLight = new THREE.DirectionalLight( 0xffffff,2);
// dirLight.position.set( 10, 10, 7 );
// scene.add( dirLight );
// const dirLight2 = new THREE.DirectionalLight( 0xffffff,2);
// dirLight2.position.set( -5, 10, 20 );
// scene.add( dirLight2 );

// Axes Helper
const hlp = new THREE.AxesHelper(1);
scene.add(hlp);

// Tone Mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

// Model Loader
const loader = new GLTFLoader();



// HDRI

new RGBELoader().load('/public/sunset.hdr', function(texture) {
	let pmremGenerator = new THREE.PMREMGenerator(renderer);
	pmremGenerator.compileEquirectangularShader();

	let envMap = pmremGenerator.fromEquirectangular(texture).texture;
    pmremGenerator.dispose()

	// scene.background = envMap;
	scene.environment = envMap;

	loader.load( `/public/can.glb`, function ( gltf ) {
		gltf.scene.traverse( child => {
			console.log(child.material)
	    	if ( child.material ) child.material.metalness = 1;
			if ( child.isMesh ) {

		      child.material.envMap = envMap;
		      //shadows are optional:
		      child.castShadow = true;
		      child.receiveShadow = true;
		    }
		} );
		let object = gltf.scene;
		object.position.set(0,-0.3,0);
		object.castShadow = true;
    	object.receiveShadow = true;

		scene.add( object );
		renderer.render( scene, camera );

	}, undefined, function ( error ) {

		console.error( error );

	} );
})

// Animation
function animate() {
	requestAnimationFrame( animate );

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

animate();	