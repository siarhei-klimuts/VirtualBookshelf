VirtualBookshelf.Controls = VirtualBookshelf.Controls || {};
VirtualBookshelf.Controls.mouse = {};
VirtualBookshelf.selected = {};
VirtualBookshelf.changedObjects = [];

VirtualBookshelf.MOVE_LEFT = 'left';
VirtualBookshelf.MOVE_RIGHT = 'right';
VirtualBookshelf.MOVE_FAR = 'far';
VirtualBookshelf.MOVE_NEAR = 'near';


VirtualBookshelf.Controls.init = function(domElement) {
	VirtualBookshelf.Controls.clear();
	VirtualBookshelf.Controls.initMouse();
	VirtualBookshelf.Controls.initListeners(domElement);
}

VirtualBookshelf.Controls.initMouse = function() {
	VirtualBookshelf.Controls.mouse = {};
}

VirtualBookshelf.Controls.initListeners = function(domElement) {
	domElement.addEventListener('click', VirtualBookshelf.Controls.onClick, false);
	domElement.addEventListener('dblclick', VirtualBookshelf.Controls.onDblClick, false);
	domElement.addEventListener('mousedown', VirtualBookshelf.Controls.onMouseDown, false);
	domElement.addEventListener('mouseup', VirtualBookshelf.Controls.onMouseUp, false);
	domElement.addEventListener('mousemove', VirtualBookshelf.Controls.onMouseMove, false);	
	domElement.addEventListener('keyup', VirtualBookshelf.Controls.onKeyUp, false);
	domElement.oncontextmenu = function() {return false;}
}

VirtualBookshelf.Controls.clear = function() {
	VirtualBookshelf.selected = {};
	VirtualBookshelf.changedObjects = [];	
}

VirtualBookshelf.Controls.isCanvasEvent = function(event) {
	if(event && event.target instanceof HTMLCanvasElement) {
		event.preventDefault();
		return true;
	} else {
		return false;
	}
}

VirtualBookshelf.Controls.update = function() {
	var mouse = VirtualBookshelf.Controls.mouse; 
	if(mouse[3]) {
		VirtualBookshelf.Camera.rotate(mouse.dX, mouse.dY);
		
		if(mouse[1]) {
			VirtualBookshelf.Camera.goForward();
		}
	}
}

// Events

VirtualBookshelf.Controls.onClick = function(event) {
	if(!VirtualBookshelf.Controls.isCanvasEvent(event)) return;

	switch(event.which) {
		//case 1: VirtualBookshelf.selectObject(event); break;
	}   	
}

VirtualBookshelf.Controls.onDblClick = function(event) {
	if(!VirtualBookshelf.Controls.isCanvasEvent(event)) return;

	switch(event.which) {
		case 1: VirtualBookshelf.selectObject(event); break;
	}   	
}

VirtualBookshelf.Controls.onMouseDown = function(event) {
	if(VirtualBookshelf.Controls.isCanvasEvent(event)) {
		var mouse = VirtualBookshelf.Controls.mouse; 

		mouse[event.which] = true;
		mouse.x = event.offsetX;
		mouse.y = event.offsetY;
		mouse.dX = event.target.offsetWidth * 0.5 - event.offsetX;
		mouse.dY = event.target.offsetHeight * 0.5 - event.offsetY;
	}
}

VirtualBookshelf.Controls.onMouseUp = function(event) {
	if(VirtualBookshelf.Controls.isCanvasEvent(event)) {
		VirtualBookshelf.Controls.mouse[event.which] = false;
	}
}

VirtualBookshelf.Controls.onMouseMove = function(event) {
	if(VirtualBookshelf.Controls.isCanvasEvent(event)) {
		var mouse = VirtualBookshelf.Controls.mouse; 
		 if(mouse[3]) {

			mouse.dX = event.target.offsetWidth * 0.5 - event.offsetX;
			mouse.dY = event.target.offsetHeight * 0.5 - event.offsetY;
		 }
	}
}

VirtualBookshelf.Controls.onKeyUp = function(event) {
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
	if(!VirtualBookshelf.Controls.isCanvasEvent(event)) return;
	
	var width = event.target.offsetWidth;
	var height = event.target.offsetHeight;
	var vector = new THREE.Vector3((event.offsetX / width) * 2 - 1, - (event.offsetY / height) * 2 + 1, 0.5);
	var projector = new THREE.Projector();
	projector.unprojectVector(vector, VirtualBookshelf.camera);

	var raycaster = new THREE.Raycaster(VirtualBookshelf.camera.position, vector.sub(VirtualBookshelf.camera.position).normalize());
	var intersects = raycaster.intersectObjects(VirtualBookshelf.library.children, true);
	VirtualBookshelf.releaseObject();

	if(intersects.length) {
		for(var i = 0; i < intersects.length; i++) {
			var intersected = intersects[i];
			if(intersected.object instanceof VirtualBookshelf.Section || intersected.object instanceof VirtualBookshelf.Book) {
				VirtualBookshelf.selected = intersected;

	// var shelf = VirtualBookshelf.selected.object.getShelfByPoint(VirtualBookshelf.selected.point);
	// var freePosition = VirtualBookshelf.selected.object.getGetFreeShelfPosition(shelf, 0.1); 
	// console.log(freePosition);
				break;
			}
		}
	}
	
	VirtualBookshelf.UI.refresh();
}

VirtualBookshelf.releaseObject = function() {
	VirtualBookshelf.selected = {};
}

VirtualBookshelf.authGoogle = function() {
	window.location.href = '/auth/google/';
}

VirtualBookshelf.moveObject = function(direction) {
	var object = VirtualBookshelf.selected.object;
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