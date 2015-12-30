import THREE from 'three';
import BaseObject from './BaseObject';

export default class CameraObject extends BaseObject {
	constructor() {
		var geometry = new THREE.Geometry();
		geometry.boundingBox = new THREE.Box3(
			new THREE.Vector3(-0.1, -1, -0.1), 
			new THREE.Vector3(0.1, 1, 0.1)
		);

		super(null, geometry);
	}
	
	updateBoundingBox() {
		var radius = {
			x: this.geometry.boundingBox.max.x, 
			y: this.geometry.boundingBox.max.y, 
			z: this.geometry.boundingBox.max.z
		};

		this.boundingBox = {
			radius: radius,
			center: this.position //TODO: needs center of section in parent or world coordinates
		};
	}
}