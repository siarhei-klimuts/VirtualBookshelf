VirtualBookshelf.Controls = VirtualBookshelf.Controls || {};

VirtualBookshelf.selected = {
	object: null,
	parent: null,
	getted: null,
	point: null,

	isBook: function() {
		return this.object instanceof VirtualBookshelf.Book;
	},
	isSection: function() {
		return this.object instanceof VirtualBookshelf.Section;
	},
	isMovable: function() {
		return Boolean(this.isBook() || this.isSection());
	},
	isRotatable: function() {
		return Boolean(this.isSection());
	},
	clear: function() {
		this.object = null;
		this.getted = null;
		VirtualBookshelf.UI.refresh();
	},
	select: function(intersected) {
		this.object = intersected.object;
		this.point = intersected.point;
	},
	get: function() {
		if(this.isBook() && !this.isGetted()) {
			this.getted = true;
			this.parent = this.object.parent;
			this.object.position.set(0, 0, -this.object.geometry.boundingBox.max.z - 0.25);
			VirtualBookshelf.camera.add(this.object);			
		} else {
			this.put();
		}
	},
	put: function() {
		if(this.isGetted()) {
			this.parent.add(this.object);
			this.object.reload();//position
			this.clear();
		}
	},
	isGetted: function() {
		return this.isBook() && this.getted;
	},
	save: function() {
		if(this.isMovable() && this.object.changed) {
			this.object.save();
			VirtualBookshelf.UI.refresh();
		}
	}
};

VirtualBookshelf.Controls.mouse = {
	width: window.innerWidth,
	height: window.innerHeight,
	target: null,
	x: null,
	y: null,
	dX: null,
	dY: null,
	longX: null,
	longY: null,
	down: function(event) {
		if(event) {
			this[event.which] = true;
			this.target = event.target;
			this.x = event.x;
			this.y = event.y;
			this.longX = this.width * 0.5 - this.x;
			this.longY = this.height * 0.5 - this.y;
		}
	},
	up: function(event) {
		if(event) {
			this[event.which] = false;
		}
	},
	move: function(event) {
		if(event) {
			this.longX = this.width * 0.5 - this.x;
			this.longY = this.height * 0.5 - this.y;
			this.dX = event.x - this.x;
			this.dY = event.y - this.y;
			this.x = event.x;
			this.y = event.y;
		}
	},
	getVector: function() {
		var projector = new THREE.Projector();
		var vector = new THREE.Vector3((this.x / this.width) * 2 - 1, - (this.y / this.height) * 2 + 1, 0.5);
		projector.unprojectVector(vector, VirtualBookshelf.camera);
	
		return vector.sub(VirtualBookshelf.Camera.getPosition()).normalize();
	},
	isCanvas: function() {
		return this.target == VirtualBookshelf.canvas;
	}
};

VirtualBookshelf.Controls.init = function(domElement) {
	VirtualBookshelf.Controls.clear();
	VirtualBookshelf.Controls.initListeners(domElement);
}

VirtualBookshelf.Controls.initListeners = function(domElement) {
	document.addEventListener('dblclick', VirtualBookshelf.Controls.onDblClick, false);
	document.addEventListener('mousedown', VirtualBookshelf.Controls.onMouseDown, false);
	document.addEventListener('mouseup', VirtualBookshelf.Controls.onMouseUp, false);
	document.addEventListener('mousemove', VirtualBookshelf.Controls.onMouseMove, false);	
	document.oncontextmenu = function() {return false;}
}

VirtualBookshelf.Controls.clear = function() {
	VirtualBookshelf.selected.clear();	
}

VirtualBookshelf.Controls.update = function() {
	var mouse = VirtualBookshelf.Controls.mouse; 

	if(mouse[3] && !VirtualBookshelf.selected.isGetted()) {
		VirtualBookshelf.Camera.rotate(mouse.longX, mouse.longY);
		
		if(mouse[1]) {
			VirtualBookshelf.Camera.goForward();
		}
	}
}

// Events

VirtualBookshelf.Controls.onDblClick = function(event) {
	if(VirtualBookshelf.Controls.mouse.isCanvas()) {
		switch(event.which) {
			case 1: VirtualBookshelf.selected.get(); break;
		}   	
	}
}

VirtualBookshelf.Controls.onMouseDown = function(event) {
	var mouse = VirtualBookshelf.Controls.mouse; 
	mouse.down(event); 
		
	if(VirtualBookshelf.Controls.mouse.isCanvas()) {
		event.preventDefault();

		if(mouse[1] && !mouse[3] && !VirtualBookshelf.selected.isGetted()) {
			VirtualBookshelf.Controls.selectObject();
		}
	}
}

VirtualBookshelf.Controls.onMouseUp = function(event) {
	VirtualBookshelf.Controls.mouse.up(event);
	
	switch(event.which) {
		 case 1: VirtualBookshelf.selected.save(); break;
	}
}

VirtualBookshelf.Controls.onMouseMove = function(event) {
	var mouse = VirtualBookshelf.Controls.mouse; 
	mouse.move(event);

	if(VirtualBookshelf.Controls.mouse.isCanvas()) {
		event.preventDefault();

	 	if(!VirtualBookshelf.selected.isGetted()) {
			if(mouse[1] && !mouse[3]) {		 	
				VirtualBookshelf.Controls.moveObject();
			}
		} else {
			var obj = VirtualBookshelf.selected.object;

			if(obj instanceof VirtualBookshelf.Book) {
				if(mouse[1]) {
					obj.moveElement(mouse.dX, mouse.dY, VirtualBookshelf.UI.menu.createBook.edited);
				}
				if(mouse[2] && VirtualBookshelf.UI.menu.createBook.edited == 'cover') {
			 		obj.scaleElement(mouse.dX, mouse.dY);
				}
				if(mouse[3]) {
			 		obj.rotate(mouse.dX, mouse.dY);
				}
			} 
		}
	}
}

//****

VirtualBookshelf.Controls.selectObject = function() {
	if(VirtualBookshelf.Controls.mouse.isCanvas() && VirtualBookshelf.library) {
		var vector = VirtualBookshelf.Controls.mouse.getVector();
		var raycaster = new THREE.Raycaster(VirtualBookshelf.Camera.getPosition(), vector);
		var intersects = raycaster.intersectObjects(VirtualBookshelf.library.children, true);

		VirtualBookshelf.selected.clear();

		if(intersects.length) {
			for(var i = 0; i < intersects.length; i++) {
				var intersected = intersects[i];
				if(intersected.object instanceof VirtualBookshelf.Section || intersected.object instanceof VirtualBookshelf.Book) {
					VirtualBookshelf.selected.select(intersected);
					break;
				}
			}
		}
		
		VirtualBookshelf.UI.refresh();
	}
};

VirtualBookshelf.Controls.moveObject = function() {
	var mouseVector;
	var newPosition;

	if(VirtualBookshelf.selected.isBook() || (VirtualBookshelf.selected.isSection() && VirtualBookshelf.UI.menu.sectionMenu.isMoveOption())) {
		mouseVector = VirtualBookshelf.Camera.getVector();	
		newPosition = VirtualBookshelf.selected.object.position.clone();
		VirtualBookshelf.selected.object.parent.localToWorld(newPosition);

		newPosition.x -= (mouseVector.z * VirtualBookshelf.Controls.mouse.dX + mouseVector.x * VirtualBookshelf.Controls.mouse.dY) * 0.003;
		newPosition.z -= (-mouseVector.x * VirtualBookshelf.Controls.mouse.dX + mouseVector.z * VirtualBookshelf.Controls.mouse.dY) * 0.003;

		VirtualBookshelf.selected.object.parent.worldToLocal(newPosition);
		VirtualBookshelf.selected.object.move(newPosition)			
	} else if(VirtualBookshelf.UI.menu.sectionMenu.isRotateOption() && VirtualBookshelf.selected.isSection()) {
		VirtualBookshelf.selected.object.rotate(VirtualBookshelf.Controls.mouse.dX);			
	}
};