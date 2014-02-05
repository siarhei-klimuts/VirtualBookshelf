VirtualBookshelf.selectedObject = null;
VirtualBookshelf.changedObjects = [];

VirtualBookshelf.MOVE_LEFT = 'left';
VirtualBookshelf.MOVE_RIGHT = 'right';
VirtualBookshelf.MOVE_FAR = 'far';
VirtualBookshelf.MOVE_NEAR = 'near';


VirtualBookshelf.initControls = function(domElement) {
	domElement.addEventListener('dblclick', VirtualBookshelf.onDblClick, false);
	domElement.addEventListener('mousedown', VirtualBookshelf.onMouseDown, false);
	domElement.addEventListener('mouseup', VirtualBookshelf.onMouseUp, false);
	domElement.addEventListener('mousemove', VirtualBookshelf.onMouseMove, false);	
	domElement.addEventListener('keyup', VirtualBookshelf.onKeyUp, false);	
}

VirtualBookshelf.isCanvasEvent = function(event) {
	if(event && event.target instanceof HTMLCanvasElement) {
		event.preventDefault();
		return true;
	}

	return false;
}

VirtualBookshelf.onDblClick = function(event) {
	if(!VirtualBookshelf.isCanvasEvent(event)) return;

	switch(event.which) {
		case 1: VirtualBookshelf.selectObject(event); break;
	}   	
}

VirtualBookshelf.onMouseDown = function(event) {
	if(!VirtualBookshelf.isCanvasEvent(event)) return;

	switch(event.which) {
		//case 1: VirtualBookshelf.selectObject(event); break;
	}   	
}

VirtualBookshelf.onMouseUp = function(event) {
	if(!VirtualBookshelf.isCanvasEvent(event)) return;

	switch(event.which) {
		//case 1: VirtualBookshelf.releaseObject(); break;
	}   	
}

VirtualBookshelf.onMouseMove = function(event) {
	if(!VirtualBookshelf.isCanvasEvent(event)) return;

	switch(event.which) {
		//case 1: VirtualBookshelf.moveObject(); break;
	}   	
}

VirtualBookshelf.onKeyUp = function(event) {
	switch(event.keyCode) {
		case 13: VirtualBookshelf.authGoogle(); break;//enter
		case 37: VirtualBookshelf.moveObject(VirtualBookshelf.MOVE_LEFT); break;//left
		case 38: VirtualBookshelf.moveObject(VirtualBookshelf.MOVE_FAR); break;//up
		case 39: VirtualBookshelf.moveObject(VirtualBookshelf.MOVE_RIGHT); break;//right
		case 40: VirtualBookshelf.moveObject(VirtualBookshelf.MOVE_NEAR); break;//down
		case 107: VirtualBookshelf.saveChanged(); break;//+
		case 109: VirtualBookshelf.moveObject(VirtualBookshelf.MOVE_NEAR); break;//-
	}   		
}

//****

VirtualBookshelf.selectObject = function(event) {
	if(!VirtualBookshelf.isCanvasEvent(event)) return;
	var width = event.target.offsetWidth;
	var height = event.target.offsetHeight;
	var vector = new THREE.Vector3((event.offsetX / width) * 2 - 1, - (event.offsetY / height) * 2 + 1, 0.5);
	projector.unprojectVector(vector, camera);
	var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
	var intersects = raycaster.intersectObjects(VirtualBookshelf.library.children, true);

	if(intersects.length) {
		for(var i = 0; i < intersects.length; i++) {
			var intersected = intersects[i].object;
			if(intersected instanceof VirtualBookshelf.Section || intersected instanceof VirtualBookshelf.Book) {
				VirtualBookshelf.selectedObject = intersected;
				break;
			}
		}
	}
}

VirtualBookshelf.releaseObject = function() {
	VirtualBookshelf.selectedObject = null;
}

VirtualBookshelf.authGoogle = function() {
	window.location.href = '/auth/google/';
}

VirtualBookshelf.moveObject = function(direction) {
	var object = VirtualBookshelf.selectedObject;
	if(object) {
		switch(direction) {
			case VirtualBookshelf.MOVE_RIGHT: object.position.x += 1; break;
			case VirtualBookshelf.MOVE_LEFT: object.position.x += -1; break;
			case VirtualBookshelf.MOVE_FAR: object.position.z += -1; break;
			case VirtualBookshelf.MOVE_NEAR: object.position.z += 1; break;
		}

		VirtualBookshelf.objectChanged(object);
	}
}

VirtualBookshelf.saveChanged = function() {
	var sections = [];
	var books = [];
	
	for(key in VirtualBookshelf.changedObjects) {
		var object = VirtualBookshelf.changedObjects[key];
	
		if(object instanceof VirtualBookshelf.Section) {
			sections.push({
				id: object.id,
				pos_x: object.position.x,
				pos_y: object.position.y,
				pos_z: object.position.z,
			});
		} else if(object instanceof VirtualBookshelf.Book) {
			books.push({
				id: object.id,
				pos_x: object.position.x,
				pos_y: object.position.y,
				pos_z: object.position.z,
			});
		}
	}

	if(sections && sections.length > 0) {
		console.log('Save sections', sections);
		$.ajax({
	    	url: "/sections", 
	    	contentType: "application/json",
			type: 'PUT',
			data: JSON.stringify(sections),
	    	success: function(data) {
	    		if(!data) return;
				console.log('Sections saved', data);
	    		VirtualBookshelf.changedObjects = [];
	    	}
	    });	
	}
}

VirtualBookshelf.objectChanged = function(object) {
	VirtualBookshelf.changedObjects.push(object);
}