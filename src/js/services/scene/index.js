import THREE from 'three';

import camera from './camera';
import navigation from '../navigation';
import environment from './environment';

export {locator} from './locator';

var loops = [];
export var renderer;

export function init(width, height, canvas) {
	renderer = new THREE.WebGLRenderer({canvas: canvas || undefined, antialias: true});
	renderer.setSize(width, height);

	environment.scene = new THREE.Scene();
	environment.scene.fog = new THREE.Fog(0x000000, 4, 7);

	startRenderLoop();
}

export function addLoop(func) {
	loops.push(func);
}

//TODO: replace by export environment.loadLibrary as load
export function load(dto) {
	return environment.loadLibrary(dto);
}

function startRenderLoop() {
	requestAnimationFrame(startRenderLoop);

	loops.forEach(func => func());
	
	renderer.render(environment.scene, camera.camera);
}

export {
	camera,
	environment
};