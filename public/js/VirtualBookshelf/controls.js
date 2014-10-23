VirtualBookshelf.Controls = VirtualBookshelf.Controls || {};

VirtualBookshelf.Controls.Pocket = {
	_books: {},

	selectObject: function(target) {
		var 
			dataObject = this._books[target.value]

		VirtualBookshelf.Data.createBook(dataObject, function (book, dataObject) {
			VirtualBookshelf.Controls.Pocket.remove(dataObject.id);
			VirtualBookshelf.selected.select(book, null);
			// book.changed = true;
		});
	},
	remove: function(id) {
		this._books[id] = null;
		delete this._books[id];
	},
	put: function(dataObject) {
		this._books[dataObject.id] = dataObject;
	},
	getBooks: function() {
		return this._books;
	},
	isEmpty: function() {
		return this._books.length == 0;
	},
	loadFreeBooks: function() {
		var
			scope = this,
			dataObject,
			i;
			
		if(VirtualBookshelf.user) {
			VirtualBookshelf.Data.getFreeBooks(VirtualBookshelf.user.id, function (err, result) {
				if(!err && result) {
					for(i = result.length - 1; i >= 0; i--) {
						scope.put(result[i]);
					}
				}
			});
		}
	}
};

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
		VirtualBookshelf.UI.refresh();//TODO: research for remove
	},
	select: function(object, point) {
		this.clear();

		this.object = object;
		this.point = point;

		VirtualBookshelf.UI.refresh();
	},
	release: function() {
		if(this.isBook() && !this.object.parent) {
			VirtualBookshelf.Controls.Pocket.put(this.object.dataObject);
			this.clear();
		}

		this.save();
		VirtualBookshelf.UI.refresh();
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
			this.target = event.target;
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
		return this.target == VirtualBookshelf.canvas || (this.target && this.target.className == 'ui');
	},
	isPocketBook: function() {
		return !!(this.target && this.target.parentNode == VirtualBookshelf.UI.menu.inventory.books);
	},
	getIntersected: function(objects, recursive, searchFor) {
		var
			vector,
			raycaster,
			intersects,
			intersected,
			result,
			i, j;

		result = null;
		vector = this.getVector();
		raycaster = new THREE.Raycaster(VirtualBookshelf.Camera.getPosition(), vector);
		intersects = raycaster.intersectObjects(objects, recursive);

		if(searchFor) {
			if(intersects.length) {
				for(i = 0; i < intersects.length; i++) {
					intersected = intersects[i];
					
					for(j = searchFor.length - 1; j >= 0; j--) {
						if(intersected.object instanceof searchFor[j]) {
							result = intersected;
							break;
						}
					}

					if(result) {
						break;
					}
				}
			}		
		} else {
			result = intersects;
		}

		return result;
	}
};

VirtualBookshelf.Controls.init = function() {
	VirtualBookshelf.Controls.clear();
	VirtualBookshelf.Controls.initListeners();
	VirtualBookshelf.Controls.Pocket.loadFreeBooks();
}

VirtualBookshelf.Controls.initListeners = function() {
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
	VirtualBookshelf.Data.getUser(function (err, result) {
		console.log(result);
	});
	var mouse = VirtualBookshelf.Controls.mouse; 
	mouse.down(event); 

	if(mouse.isCanvas() || mouse.isPocketBook()) {
		event.preventDefault();

		if(mouse[1] && !mouse[3] && !VirtualBookshelf.selected.isGetted()) {
			if(mouse.isCanvas()) {
				VirtualBookshelf.Controls.selectObject();
			} else if(mouse.isPocketBook()) {
				VirtualBookshelf.Controls.Pocket.selectObject(mouse.target);
			}
		}
	}
}

VirtualBookshelf.Controls.onMouseUp = function(event) {
	VirtualBookshelf.Controls.mouse.up(event);
	
	switch(event.which) {
		 case 1: VirtualBookshelf.selected.release(); break;
	}
}

VirtualBookshelf.Controls.onMouseMove = function(event) {
	var mouse = VirtualBookshelf.Controls.mouse; 
	mouse.move(event);

	if(mouse.isCanvas()) {
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
			 		obj.rotate(mouse.dX, mouse.dY, true);
				}
			} 
		}
	}
};

//****

VirtualBookshelf.Controls.selectObject = function() {
	var
		intersected,
		object,
		point;

	if(VirtualBookshelf.Controls.mouse.isCanvas() && VirtualBookshelf.library) {
		intersected = VirtualBookshelf.Controls.mouse.getIntersected(VirtualBookshelf.library.children, true, [VirtualBookshelf.Section, VirtualBookshelf.Book]);
		if(intersected) {
			object = intersected.object;
			point = intersected.point; 
		}

		VirtualBookshelf.selected.select(object, point);
	}
};

VirtualBookshelf.Controls.moveObject = function() {
	var 
		mouseVector,
		newPosition,
		intersected,
		parent,
		oldParent;

	if(VirtualBookshelf.selected.isBook() || (VirtualBookshelf.selected.isSection() && VirtualBookshelf.UI.menu.sectionMenu.isMoveOption())) {
		mouseVector = VirtualBookshelf.Camera.getVector();	
		newPosition = VirtualBookshelf.selected.object.position.clone();
		oldParent = VirtualBookshelf.selected.object.parent;

		if(VirtualBookshelf.selected.isBook()) {
			intersected = VirtualBookshelf.Controls.mouse.getIntersected(VirtualBookshelf.library.children, true, [VirtualBookshelf.Shelf]);
			VirtualBookshelf.selected.object.setParent(intersected ? intersected.object : null);
		}

		parent = VirtualBookshelf.selected.object.parent;
		if(parent) {
			parent.localToWorld(newPosition);

			newPosition.x -= (mouseVector.z * VirtualBookshelf.Controls.mouse.dX + mouseVector.x * VirtualBookshelf.Controls.mouse.dY) * 0.003;
			newPosition.z -= (-mouseVector.x * VirtualBookshelf.Controls.mouse.dX + mouseVector.z * VirtualBookshelf.Controls.mouse.dY) * 0.003;

			parent.worldToLocal(newPosition);
			if(!VirtualBookshelf.selected.object.move(newPosition) && VirtualBookshelf.selected.isBook()) {
				if(parent !== oldParent) {
					VirtualBookshelf.selected.object.setParent(oldParent);
				}
			}
		}
	} else if(VirtualBookshelf.UI.menu.sectionMenu.isRotateOption() && VirtualBookshelf.selected.isSection()) {
		VirtualBookshelf.selected.object.rotate(VirtualBookshelf.Controls.mouse.dX);			
	}
};