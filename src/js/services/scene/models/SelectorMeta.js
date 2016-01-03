export default class SelectorMeta {
	constructor(selectedObject) {
		if(selectedObject) {
			this.id = selectedObject.getId();
			this.parentId = selectedObject.parent.getId();
			this.type = selectedObject.getType();
		}
	}

	isEmpty() {
		return !this.id;
	}

	equals(meta) {
		return !(!meta || 
				meta.id !== this.id || 
				meta.parentId !== this.parentId || 
				meta.type !== this.type);
	}
}