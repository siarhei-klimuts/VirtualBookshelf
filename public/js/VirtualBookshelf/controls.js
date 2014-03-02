VirtualBookshelf.Controls = VirtualBookshelf.Controls || {};

VirtualBookshelf.Controls.changedObjects = {};

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
	invocate: function(method) {
		if(this.object && this.object[method]) {
			this.object[method].call(this.object);
		}
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
	
		return vector.sub(VirtualBookshelf.camera.position).normalize();
	},
	isCanvas: function() {
		return this.target == VirtualBookshelf.canvas;
	},
	isPreview: function() {
		return this.target == VirtualBookshelf.UI.menu.createBook.preview;
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
	VirtualBookshelf.Controls.changedObjects = {};	
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
		case 1: VirtualBookshelf.Controls.objectChanged(VirtualBookshelf.selected.object); break;
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
		var raycaster = new THREE.Raycaster(VirtualBookshelf.camera.position, vector);
		var intersects = raycaster.intersectObjects(VirtualBookshelf.library.children, true);

		VirtualBookshelf.Controls.releaseObject();

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
}

VirtualBookshelf.Controls.releaseObject = function() {
	VirtualBookshelf.selected.clear();
	VirtualBookshelf.UI.refresh();
}

VirtualBookshelf.Controls.moveObject = function() {
	var object = VirtualBookshelf.selected.object;
	if(object instanceof VirtualBookshelf.Section || object instanceof VirtualBookshelf.Book) {
		var mouseVector = VirtualBookshelf.Controls.mouse.getVector();
		var cameraPosition = VirtualBookshelf.camera.position;
		var planePoint = VirtualBookshelf.selected.point;
		var planeNormal = new THREE.Vector3(0, 1, 0);
		var d = -(planeNormal.x * planePoint.x + planeNormal.y * planePoint.y + planeNormal.z * planePoint.z);
		var a = -(planeNormal.dot(cameraPosition) + d);
		var b = (planeNormal.dot(mouseVector));
		var c = a / b;
		var intersectionPoint = new THREE.Vector3(cameraPosition.x + mouseVector.x * c, cameraPosition.y + mouseVector.y * c, cameraPosition.z + mouseVector.z * c);
		object.parent.worldToLocal(intersectionPoint);
		object.move(intersectionPoint);
	}
}

VirtualBookshelf.Controls.saveChanged = function() {
	var sections = [];
	var books = [];
	
	for(key in VirtualBookshelf.Controls.changedObjects) {
		var object = VirtualBookshelf.Controls.changedObjects[key];
		if(object && object.position) {
			var dao = {
				id: object.id,
				pos_x: object.position.x,
				pos_y: object.position.y,
				pos_z: object.position.z
			}
			if(object instanceof VirtualBookshelf.Section) {
				sections.push(dao);
			} else if(object instanceof VirtualBookshelf.Book) {
				books.push(dao);
			}
		}
	}

	if(books && books.length) {
		VirtualBookshelf.Data.putBooks(books, function (err, data) {
			if(!err && data) {
				data.forEach(function (book) {
					delete VirtualBookshelf.Controls.changedObjects[book.id];
				});
				VirtualBookshelf.UI.refresh();
			} else {
				alert('Can\'t save books. Please try again.');
			}
		});
	}

	if(sections && sections.length) {
		VirtualBookshelf.Data.putSections(sections, function (err, data) {
			if(!err && data) {
				data.forEach(function (section) {
					delete VirtualBookshelf.Controls.changedObjects[section.id];
				});
				VirtualBookshelf.UI.refresh();
			} else {
				alert('Can\'t save sections. Please try again.');
			}
		});
	}
}

VirtualBookshelf.Controls.objectChanged = function(object) {
	if(object && object.changed) {
		VirtualBookshelf.Controls.changedObjects[object.id] = object;
		VirtualBookshelf.UI.refresh();
	}
}