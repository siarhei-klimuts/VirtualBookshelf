import BaseObject from './BaseObject';
import ShelfObject from './ShelfObject';

const TYPE = 'SectionObject';

export default class SectionObject extends BaseObject {
	constructor(params, geometry, material) {
		super(params, geometry, material);

		this.shelves = {};
		for(var key in params.data.shelves) {
			this.shelves[key] = new ShelfObject(params.data.shelves[key]); 
			this.add(this.shelves[key]);
		}
	}

	static get TYPE() {
		return TYPE;
	}

	get vbType() {
		return TYPE;
	}

	getDto() {
		return {
			id: this.getId(),
			userId: this.dataObject.userId,
			pos_x: this.position.x,
			pos_y: this.position.y,
			pos_z: this.position.z,
			rotation: [this.rotation.x, this.rotation.y, this.rotation.z]
		};
	}

	setParent(parent) {
		if(this.parent != parent) {
			if(parent) {
				parent.add(this);
				this.dataObject.libraryId = parent.getId();
			} else {
				this.parent.remove(this);
				this.dataObject.libraryId = null;
			}
		}
	}
}