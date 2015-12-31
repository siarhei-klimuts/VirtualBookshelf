import BaseObject from './BaseObject';

const TYPE = 'BookObject';

export default class BookObject extends BaseObject {	
	constructor(dataObject, geometry, material) {
		super(dataObject, geometry, material);
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
			pos_z: this.position.z
		};
	}

	setParent(parent) {
		if(this.parent != parent) {
			if(parent) {
				parent.add(this);
				this.dataObject.shelfId = parent.getId();
				this.dataObject.sectionId = parent.parent.getId();
			} else {
				this.parent.remove(this);
				this.dataObject.shelfId = null;
				this.dataObject.sectionId = null;
			}
		}
	}
}