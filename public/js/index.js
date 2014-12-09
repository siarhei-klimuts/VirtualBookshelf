VirtualBookshelf = VirtualBookshelf || {};

VirtualBookshelf.Object = function(dataObject, geometry, material) {
	THREE.Mesh.call(this, geometry, material);

	this.dataObject = dataObject || {};
	this.dataObject.rotation = this.dataObject.rotation || [0, 0, 0];
	
	this.id = this.dataObject.id;
	this.position = new THREE.Vector3(this.dataObject.pos_x, this.dataObject.pos_y, this.dataObject.pos_z);
	this.rotation.order = 'XYZ';
	this.rotation.fromArray(this.dataObject.rotation.map(Number));

	this.updateMatrix();
	this.geometry.computeBoundingBox();
	this.updateBoundingBox();		
}
VirtualBookshelf.Object.prototype = new THREE.Mesh();
VirtualBookshelf.Object.prototype.constructor = VirtualBookshelf.Object;
VirtualBookshelf.Object.prototype.isOutOfParrent = function() {
	return Math.abs(this.boundingBox.center.x - this.parent.boundingBox.center.x) > (this.parent.boundingBox.radius.x - this.boundingBox.radius.x)
		//|| Math.abs(this.boundingBox.center.y - this.parent.boundingBox.center.y) > (this.parent.boundingBox.radius.y - this.boundingBox.radius.y)
		|| Math.abs(this.boundingBox.center.z - this.parent.boundingBox.center.z) > (this.parent.boundingBox.radius.z - this.boundingBox.radius.z);
}
VirtualBookshelf.Object.prototype.isCollided = function() {
	var
		result,
		targets,
		target,
		i;

	this.updateBoundingBox();

	result = this.isOutOfParrent();
	targets = this.parent.children;

	if(!result) {
		for(i = targets.length - 1; i >= 0; i--) {
			target = targets[i].boundingBox;

			if(targets[i] === this
			|| (Math.abs(this.boundingBox.center.x - target.center.x) > (this.boundingBox.radius.x + target.radius.x))
			|| (Math.abs(this.boundingBox.center.y - target.center.y) > (this.boundingBox.radius.y + target.radius.y))
			|| (Math.abs(this.boundingBox.center.z - target.center.z) > (this.boundingBox.radius.z + target.radius.z))) {	
				continue;
			}

	    	result = true;		
	    	break;
		}
	}

	return result;
};
VirtualBookshelf.Object.prototype.move = function(newPosition) {
	var 
		currentPosition,
		result;

	result = false;
	currentPosition = this.position.clone();
	
	if(newPosition.x) {
		this.position.setX(newPosition.x);

		if(this.isCollided()) {
			this.position.setX(currentPosition.x);
		} else {
			result = true;
		}
	}

	if(newPosition.z) {
		this.position.setZ(newPosition.z);

		if(this.isCollided()) {
			this.position.setZ(currentPosition.z);
		} else {
			result = true;
		}
	}

	this.changed = this.changed || result;
	this.updateBoundingBox();

	return result;
}
VirtualBookshelf.Object.prototype.rotate = function(dX, dY, isDemo) {
	var 
		currentRotation = this.rotation.clone(),
		result = false; 
	
	if(dX) {
		this.rotation.y += dX * 0.01;

		if(!isDemo && this.isCollided()) {
			this.rotation.y = currentRotation.y;
		} else {
			result = true;
		}
	}

	if(dY) {
		this.rotation.x += dY * 0.01;

		if(!isDemo && this.isCollided()) {
			this.rotation.x = currentRotation.x;
		} else {
			result = true;
		}
	}

	this.changed = this.changed || (!isDemo && result);
	this.updateBoundingBox();
}
VirtualBookshelf.Object.prototype.updateBoundingBox = function() {
	var
		boundingBox,
		radius,
		center;

	this.updateMatrix();
	boundingBox = this.geometry.boundingBox.clone().applyMatrix4(this.matrix);
	
	radius = {
		x: (boundingBox.max.x - boundingBox.min.x) * 0.5,
		y: (boundingBox.max.y - boundingBox.min.y) * 0.5,
		z: (boundingBox.max.z - boundingBox.min.z) * 0.5
	};

	center = new THREE.Vector3(
		radius.x + boundingBox.min.x,
		radius.y + boundingBox.min.y,
		radius.z + boundingBox.min.z
	);

	this.boundingBox = {
		radius: radius,
		center: center
	};
}
VirtualBookshelf.Object.prototype.reload = function() {
	this.position.setX(this.dataObject.pos_x);
	this.position.setY(this.dataObject.pos_y);
	this.position.setZ(this.dataObject.pos_z);
	this.rotation.set(0, 0, 0);
}

//*********************

VirtualBookshelf.CameraObject = function() {
	VirtualBookshelf.Object.call(this);
}
VirtualBookshelf.CameraObject.prototype = new VirtualBookshelf.Object();
VirtualBookshelf.CameraObject.prototype.constructor = VirtualBookshelf.CameraObject;
VirtualBookshelf.CameraObject.prototype.updateBoundingBox = function() {
	var radius = {x: 0.1,	y: 1, z: 0.1};
	var center = new THREE.Vector3(0, 0, 0);

	this.boundingBox = {
		radius: radius,
		center: this.position //TODO: needs center of section in parent or world coordinates
	};
}

VirtualBookshelf.Library = function(params, geometry, material) {
	VirtualBookshelf.Object.call(this, params, geometry, material);

	this.libraryObject = params.libraryObject || {};
}
VirtualBookshelf.Library.prototype = new VirtualBookshelf.Object();
VirtualBookshelf.Library.prototype.constructor = VirtualBookshelf.Library;

VirtualBookshelf.Library.prototype.loadSections = function() {
	var library = this;

	VirtualBookshelf.Data.getSections(library.id, function (err, sections) {
		if(sections) {
			for(key in sections) {
				VirtualBookshelf.Data.loadSection(sections[key], function (params, geometry, material) {
					var section = new VirtualBookshelf.Section(params, geometry, material);
					library.add(section);
				});				
			}
		}
	});
}
//***

VirtualBookshelf.Section = function(params, geometry, material) {
	VirtualBookshelf.Object.call(this, params, geometry, material);

	this.shelves = {};
	for(key in params.data.shelves) {
		this.shelves[key] = new VirtualBookshelf.Shelf(params.data.shelves[key]); 
		this.add(this.shelves[key]);
	}
	
	this.loadBooks();
}
VirtualBookshelf.Section.prototype = new VirtualBookshelf.Object();
VirtualBookshelf.Section.prototype.constructor = VirtualBookshelf.Section;
VirtualBookshelf.Section.prototype.loadBooks = function() {	
	var section = this;

	VirtualBookshelf.Data.getBooks(section.id, function (err, data) {
		if(!err && data && data.length) {
			data.forEach(function (dataObject) {
				VirtualBookshelf.Data.createBook(dataObject, function (book, dataObject) {
					var shelf = section.shelves[dataObject.shelfId];
					shelf && shelf.add(book);
				});
			});
		}
	});
};
VirtualBookshelf.Section.prototype.save = function() {
	var scope = this;

	this.dataObject.pos_x = this.position.x;
	this.dataObject.pos_y = this.position.y;
	this.dataObject.pos_z = this.position.z;

	this.dataObject.rotation = [this.rotation.x, this.rotation.y, this.rotation.z];

	VirtualBookshelf.Data.postSection(this.dataObject, function(err, result) {
		if(!err && result) {
			scope.dataObject = result;
			scope.changed = false;
		} else {
			//TODO: hide edit, notify user
		}
	});
};
VirtualBookshelf.Section.prototype.getShelfByPoint = function(point) {
	if(!point || !this.shelves) return null;
	this.worldToLocal(point);
	
	var minDistance;
	var closest;
	for(key in this.shelves) {
		var shelf = this.shelves[key];
		var distance = point.distanceTo(new THREE.Vector3(shelf.position.x, shelf.position.y, shelf.position.z));
		if(!minDistance || distance < minDistance) {
			minDistance = distance;
			closest = shelf;
		}
	}

	return closest;
}

VirtualBookshelf.Section.prototype.getGetFreeShelfPosition = function(shelf, bookSize) {
	if(!shelf) return null;
	var sortedBooks = [];
	var result;

	sortedBooks.push({
		left: -shelf.size.x,
		right: -shelf.size.x * 0.5
	});
	sortedBooks.push({
		left: shelf.size.x * 0.5,
		right: shelf.size.x
	});

	shelf.children.forEach(function (book) {
		if(book instanceof VirtualBookshelf.Book) {
			var inserted = false;
			var space = {
				left: book.position.x + book.geometry.boundingBox.min.x,
				right: book.position.x + book.geometry.boundingBox.max.x
			};

			for (var i = 0; i < sortedBooks.length; i++) {
				var sortedBook = sortedBooks[i];
				if(book.position.x < sortedBook.left) {
					sortedBooks.splice(i, 0, space);
					inserted = true;
					break;
				}
			}

			if(!inserted) {
				sortedBooks.push(space);
			}
		}
	});

	for (var i = 0; i < (sortedBooks.length - 1); i++) {
		var left = sortedBooks[i].right;
		var right = sortedBooks[i + 1].left;
		var distance = right - left;
		
		if(distance > bookSize.x) {
			result = new THREE.Vector3(left + bookSize.x * 0.5, bookSize.y * -0.5, 0);		
			break;
		}
	};

	return result;
}
//***

VirtualBookshelf.Shelf = function(params) {
	var size = params.size || [1,1,1];	
	VirtualBookshelf.Object.call(this, params, new THREE.CubeGeometry(size[0], size[1], size[2]));

	this.position = new THREE.Vector3(params.position[0], params.position[1], params.position[2]);
	this.size = new THREE.Vector3(size[0], size[1], size[2]);
	this.visible = false;
}
VirtualBookshelf.Shelf.prototype = new VirtualBookshelf.Object();
VirtualBookshelf.Shelf.prototype.constructor = VirtualBookshelf.Shelf;
//*****

VirtualBookshelf.Book = function(dataObject, geometry, material) {
	VirtualBookshelf.Object.call(this, dataObject, geometry, material);
	
	this.model = this.dataObject.model;
	this.canvas = material.map.image;
	this.texture = new VirtualBookshelf.Data.CanvasImage();
	this.cover = new VirtualBookshelf.Data.CanvasImage(this.dataObject.coverPos);
	this.author = new VirtualBookshelf.Data.CanvasText(this.dataObject.author, this.dataObject.authorFont);
	this.title = new VirtualBookshelf.Data.CanvasText(this.dataObject.title, this.dataObject.titleFont);
}
VirtualBookshelf.Book.prototype = new VirtualBookshelf.Object();
VirtualBookshelf.Book.prototype.constructor = VirtualBookshelf.Book;
VirtualBookshelf.Book.prototype.textNodes = ['author', 'title'];
VirtualBookshelf.Book.prototype.updateTexture = function() {
	var context = this.canvas.getContext('2d');
	var cover = this.cover;

	if(this.texture.image) {
		context.drawImage(this.texture.image, 0, 0);
	}

	if(cover.image) {
		var diff = cover.y + cover.height - VirtualBookshelf.Data.COVER_MAX_Y;
	 	var limitedHeight = diff > 0 ? cover.height - diff : cover.height;
	 	var cropHeight = diff > 0 ? cover.image.naturalHeight - (cover.image.naturalHeight / cover.height * diff) : cover.image.naturalHeight;

		context.drawImage(cover.image, 0, 0, cover.image.naturalWidth, cropHeight, cover.x, cover.y, cover.width, limitedHeight);
	}

	for(var i = this.textNodes.length - 1; i >= 0; i--) {
		var textNode = this[this.textNodes[i]];

		if(textNode.isValid()) {

			context.font = textNode.getFont();
			context.fillStyle = textNode.color;
	    	context.fillText(textNode.text, textNode.x, textNode.y, textNode.width);
	    }
	}

	this.material.map.needsUpdate = true;
}
VirtualBookshelf.Book.prototype.moveElement = function(dX, dY, element) {
	var element = element && this[element];
	
	if(element) {
		if(element.move) {
			element.move(dX, dY);
		} else {
			element.x += dX;
			element.y += dY;
		}

		this.updateTexture();
	}
}
VirtualBookshelf.Book.prototype.scaleElement = function(dX, dY) {
	this.cover.width += dX;
	this.cover.height += dY;
	this.updateTexture();
}
VirtualBookshelf.Book.prototype.save = function() {
	var scope = this;

	this.dataObject.model = this.model;
	this.dataObject.texture = this.texture.toString();
	this.dataObject.cover = this.cover.toString();
	this.dataObject.coverPos = this.cover.serializeProperties();
	this.dataObject.author = this.author.toString();
	this.dataObject.authorFont = this.author.serializeFont();
	this.dataObject.title = this.title.toString();
	this.dataObject.titleFont = this.title.serializeFont();
	this.dataObject.pos_x = this.position.x;
	this.dataObject.pos_y = this.position.y;
	this.dataObject.pos_z = this.position.z;

	VirtualBookshelf.Data.postBook(this.dataObject, function(err, result) {
		if(!err && result) {
			scope.dataObject = result;
			scope.changed = false;
		} else {
			//TODO: hide edit, notify user
		}
	});
}
VirtualBookshelf.Book.prototype.refresh = function() {
	var scope = this;
	//TODO: use in constructor instead of separate images loading
	scope.texture.load(scope.dataObject.texture, false, function () {
		scope.cover.load(scope.dataObject.cover, true, function() {
			scope.model = scope.dataObject.model;
			scope.cover.parseProperties(scope.dataObject.coverPos);
			scope.author.setText(scope.dataObject.author);
			scope.author.parseProperties(scope.dataObject.authorFont);
			scope.title.setText(scope.dataObject.title);
			scope.title.parseProperties(scope.dataObject.titleFont);

			scope.updateTexture();
		});
	});
}
VirtualBookshelf.Book.prototype.copyState = function(book) {
	if(book instanceof VirtualBookshelf.Book) {
		var fields = ['dataObject', 'position', 'rotation', 'model', 'texture', 'cover', 'author', 'title'];
		for(var i = fields.length - 1; i >= 0; i--) {
			var field = fields[i];
			this[field] = book[field];
		};

		this.updateTexture();
		book.parent.add(this);
		book.parent.remove(book);
		VirtualBookshelf.selected.object = this;
	}
}
VirtualBookshelf.Book.prototype.setParent = function(parent) {
	if(this.parent != parent) {
		if(parent) {
			parent.add(this);
			this.dataObject.shelfId = parent.id;
			this.dataObject.sectionId = parent.parent.id;
		} else {
			this.parent.remove(this);
			this.dataObject.shelfId = null;
			this.dataObject.sectionId = null;
		}
	}
}
VirtualBookshelf = VirtualBookshelf || {};

VirtualBookshelf.Camera = VirtualBookshelf.Camera || {
	HEIGTH: 1.5,
	object: new VirtualBookshelf.CameraObject(),
	setParent: function(parent) {
		parent.add(this.object);
	},
	getPosition: function() {
		return this.object.position;
	}
};

VirtualBookshelf.Camera.init = function(width, height) {
	VirtualBookshelf.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 50);
	this.object.position = new THREE.Vector3(0, VirtualBookshelf.Camera.HEIGTH, 0);
	this.object.rotation.order = 'YXZ';

	var candle = new THREE.PointLight(0x665555, 1.6, 10);
	candle.position.set(0, 0, 0);
	this.object.add(candle);

	this.object.add(VirtualBookshelf.camera);
}

VirtualBookshelf.Camera.rotate = function(x, y) {
	var newX = this.object.rotation.x + y * 0.0001 || 0;
	var newY = this.object.rotation.y + x * 0.0001 || 0;

	if(newX < 1.57 && newX > -1.57) {	
		this.object.rotation.x = newX;
	}

	this.object.rotation.y = newY;
}

VirtualBookshelf.Camera.go = function(speed) {
	var direction = this.getVector();
	var newPosition = this.object.position.clone();
	newPosition.add(direction.multiplyScalar(speed));

	this.object.move(newPosition);
}

VirtualBookshelf.Camera.getVector = function() {
	var vector = new THREE.Vector3(0, 0, -1);

	return vector.applyEuler(this.object.rotation);
}
VirtualBookshelf.Controls = VirtualBookshelf.Controls || {};

VirtualBookshelf.Controls.BUTTONS_ROTATE_SPEED = 100;
VirtualBookshelf.Controls.BUTTONS_GO_SPEED = 0.02;

VirtualBookshelf.Controls.state = {
	forward: false,
	backward: false,
	left: false,
	right: false
}

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
		// VirtualBookshelf.UI.refresh();//TODO: research for remove
	},
	select: function(object, point) {
		this.clear();

		this.object = object;
		this.point = point;

		// VirtualBookshelf.UI.refresh();
	},
	release: function() {
		if(this.isBook() && !this.object.parent) {
			VirtualBookshelf.Controls.Pocket.put(this.object.dataObject);
			this.clear();
		}

		this.save();
		// VirtualBookshelf.UI.refresh();
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
			this[1] = false; // linux chrome bug fix (when both keys release then both event.which equal 3)
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

	if(!VirtualBookshelf.selected.isGetted()) {
		if(mouse[3]) {
			VirtualBookshelf.Camera.rotate(mouse.longX, mouse.longY);
		}

		if((mouse[1] && mouse[3]) || this.state.forward) {
			VirtualBookshelf.Camera.go(this.BUTTONS_GO_SPEED);
		} else if(this.state.backward) {
			VirtualBookshelf.Camera.go(-this.BUTTONS_GO_SPEED);
		} else if(this.state.left) {
			VirtualBookshelf.Camera.rotate(this.BUTTONS_ROTATE_SPEED, 0);
		} else if(this.state.right) {
			VirtualBookshelf.Camera.rotate(-this.BUTTONS_ROTATE_SPEED, 0);
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

VirtualBookshelf.Controls.goStop = function() {
	this.state.forward = false;
	this.state.backward = false;
	this.state.left = false;
	this.state.right = false;
}

VirtualBookshelf.Controls.goForward = function() {
	this.state.forward = true;
}

VirtualBookshelf.Controls.goBackward = function() {
	this.state.backward = true;
}

VirtualBookshelf.Controls.goLeft = function() {
	this.state.left = true;
}

VirtualBookshelf.Controls.goRight = function() {
	this.state.right = true;
}
VirtualBookshelf.Data = VirtualBookshelf.Data || {};

VirtualBookshelf.Data.init = function($http) {
	VirtualBookshelf.Data.$http = $http;
	
	VirtualBookshelf.Data.getUser = function() {
		return $http.get('/user');
	}

	VirtualBookshelf.Data.getUserBooks = function(userId) {
		return $http.get('/freeBooks/' + userId)
			.then(function (res) {
				return res.data;
			});
	}

	VirtualBookshelf.Data.postBook = function(book) {
		return $http.post('/book', book);
	}

	VirtualBookshelf.Data.deleteBook = function(book) {
		return $http({
			method: 'DELETE',
			url: '/book',
			data: book,
			headers: {'Content-Type': 'application/json;charset=utf-8'}
		});
	}

	return VirtualBookshelf.Data;
};

VirtualBookshelf.Data.TEXTURE_RESOLUTION = 512;
VirtualBookshelf.Data.COVER_MAX_Y = 394;
VirtualBookshelf.Data.COVER_FACE_X = 296;

VirtualBookshelf.Data.ajax = function(urlArray, type, done, data, content) {
	var url = urlArray.join('/');

	this.$http({
		method: type,
		url: url,
		data: data
	}).success(function (data) {
		console.log('Data result: ', type, url);
    	done(null, data);
	}).error(function (data) {
		console.error('Data error: ', type, url, data);
		done(data, null);
	});
}

VirtualBookshelf.Data.getUIData = function(done) {
	VirtualBookshelf.Data.getData('/obj/data.json', done);
}

VirtualBookshelf.Data.getLibrary = function(libraryId, done) {
	VirtualBookshelf.Data.ajax(['/library', libraryId], 'GET', done);
}

VirtualBookshelf.Data.getLibraries = function(done) {
	VirtualBookshelf.Data.ajax(['/libraries'], 'GET', done);
}

VirtualBookshelf.Data.postLibrary = function(libraryModel, done) {
	VirtualBookshelf.Data.ajax(['/library', libraryModel], 'POST', done);
}

VirtualBookshelf.Data.getSections = function(libraryId, done) {
	VirtualBookshelf.Data.ajax(['/sections', libraryId], 'GET', done);
}

VirtualBookshelf.Data.postSection = function(sectionData, done) {
	VirtualBookshelf.Data.ajax(['/section'] , 'POST', done, sectionData);
}

// VirtualBookshelf.Data.postBook = function(book, done) {
// 	VirtualBookshelf.Data.ajax(['/book'], 'POST', done, book);
// }

VirtualBookshelf.Data.getBooks = function(sectionId, done) {
	VirtualBookshelf.Data.ajax(['/books', sectionId], 'GET', done);
}

// VirtualBookshelf.Data.getFreeBooks = function(userId) {
// 	VirtualBookshelf.Data.ajax(['/freeBooks', userId], 'GET', done);
// }

VirtualBookshelf.Data.loadGeometry = function(link, done) {
	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load(link, function (geometry) {
		done(geometry);
	});
}

VirtualBookshelf.Data.loadObject = function(modelUrl, mapUrl, done) {
	VirtualBookshelf.Data.loadGeometry(modelUrl, function (geometry) {
		VirtualBookshelf.Data.getImage(mapUrl, function (err, mapImage) {
	    	done(geometry, mapImage);
	    });
	});
};

VirtualBookshelf.Data.createBook = function(dataObject, done) {
	var modelPath = '/obj/books/{model}/model.js'.replace('{model}', dataObject.model);

	VirtualBookshelf.Data.loadGeometry(modelPath, function (geometry) {
		var canvas = document.createElement('canvas');
		var texture = new THREE.Texture(canvas);
	    var material = new THREE.MeshPhongMaterial({map: texture});
		var book = new VirtualBookshelf.Book(dataObject, geometry, material);

		canvas.width = canvas.height = VirtualBookshelf.Data.TEXTURE_RESOLUTION;
		book.texture.load(dataObject.texture, false, function () {
			book.cover.load(dataObject.cover, true, function () {
				book.updateTexture();
				done(book, dataObject);
			});
		});
	});
};

VirtualBookshelf.Data.loadSection = function(dataObject, done) {
	var path = '/obj/sections/{model}/'.replace('{model}', dataObject.model);
	VirtualBookshelf.Data.loadObject(path + 'model.js', path + 'map.jpg', function (geometry, mapImage) {
		var texture = new THREE.Texture(mapImage);
		texture.needsUpdate = true;

		VirtualBookshelf.Data.getData(path + 'data.json', function (err, data) {
			dataObject.data = data;
			done(dataObject, geometry, new THREE.MeshPhongMaterial({map: texture}));
		});   
	});
};

VirtualBookshelf.Data.loadLibrary = function(dataObject, done) {
	var path = '/obj/libraries/{model}/'.replace('{model}', dataObject.model);
	VirtualBookshelf.Data.loadObject(path + 'model.json', path + 'map.jpg', function (geometry, mapImage) {
		var texture = new THREE.Texture(mapImage);
		texture.needsUpdate = true;

		done(dataObject, geometry, new THREE.MeshPhongMaterial({map: texture}));
	});
}

VirtualBookshelf.Data.getData = function(url, done) {
	VirtualBookshelf.Data.ajax([url], 'GET', done);
}

VirtualBookshelf.Data.putSections = function(sections, done) {
	VirtualBookshelf.Data.ajax(['/sections'], 'PUT', done, sections);
}

VirtualBookshelf.Data.postFeedback = function(dataObject, done) {
	VirtualBookshelf.Data.ajax(['/feedback'], 'POST', done, dataObject);
}

// VirtualBookshelf.Data.getUser = function(done) {
// 	VirtualBookshelf.Data.ajax(['/user'], 'GET', done);
// }

VirtualBookshelf.Data.putUser = function(dataObject, done) {
	VirtualBookshelf.Data.ajax(['/user'], 'PUT', done, dataObject);
}

VirtualBookshelf.Data.getImage = function(url, done) {
	var img = new Image();
    img.crossOrigin = ''; 
	img.src = url;
	
	img.onload = function () {
		console.log('Data.getImage:', url, 'Ok');
		done(null, this);
	};
	img.onerror = function (error) {
		console.error('Data.getImage:', url, error);
		done(error, null);
	};
};

VirtualBookshelf.Data.CanvasText = function(text, properties) {
	this.text = text || '';
	this.parseProperties(properties);
};
VirtualBookshelf.Data.CanvasText.prototype = {
	constructor: VirtualBookshelf.CanvasText,
	getFont: function() {
		return [this.style, this.size + 'px', this.font].join(' ');
	},
	isValid: function() {
		return (this.text && this.x && this.y);
	},
	toString: function() {
		return this.text || '';
	},
	setText: function(text) {
		this.text = text;
	},
	serializeFont: function() {
		return [this.style, this.size, this.font, this.x, this.y, this.color, this.width].join(',');
	},
	parseProperties: function(properties) {
		var args = properties && properties.split(',') || [];

		this.style = args[0];
		this.size = args[1] || 14;
		this.font = args[2] || 'Arial';
		this.x = Number(args[3]) || VirtualBookshelf.Data.COVER_FACE_X;
		this.y = Number(args[4]) || 10;
		this.color = args[5] || 'black';
		this.width = args[6] || 512;
	},
	move: function(dX, dY) {
		this.x += dX;
		this.y += dY;

		if(this.x <= 0) this.x = 1;
		if(this.y <= 0) this.y = 1;
		if(this.x >= VirtualBookshelf.Data.TEXTURE_RESOLUTION) this.x = VirtualBookshelf.Data.TEXTURE_RESOLUTION;
		if(this.y >= VirtualBookshelf.Data.COVER_MAX_Y) this.y = VirtualBookshelf.Data.COVER_MAX_Y;
	}
}

VirtualBookshelf.Data.CanvasImage = function(properties) {
	this.link = '';
	this.image = null;
	this.parseProperties(properties);
}
VirtualBookshelf.Data.CanvasImage.prototype = {
	constructor: VirtualBookshelf.Data.CanvasImage,
	load: function(link, proxy, done) {
		var scope = this;
		function sync(link, image) {
			scope.link = link;
			scope.image = image;
			done();
		}

		if(scope.link != link && link) {
			var path = (proxy ? '/outside?link={link}' : '/obj/bookTextures/{link}.jpg').replace('{link}', link);
			VirtualBookshelf.Data.getImage(path, function (err, image) {
				sync(link, image);				
			});
		} else if(!link) {
			sync(link);
		} else {
			done();
		}
	},
	toString: function() {
		return this.link;
	},
	parseProperties: function(properties) {
		var args = properties && properties.split(',') || [];

		this.x = Number(args[0]) || VirtualBookshelf.Data.COVER_FACE_X;
		this.y = Number(args[1]) || 0;
		this.width = Number(args[2]) || 216;
		this.height = Number(args[3]) || VirtualBookshelf.Data.COVER_MAX_Y;
	},
	serializeProperties: function() {
		return [this.x, this.y, this.width, this.height].join(',');
	}
}
VirtualBookshelf.Editor = VirtualBookshelf.Editor || {};

VirtualBookshelf.Editor.getBookMaterial = function(bookData, mapImage, coverImage) {
	var size = 512;
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	canvas.width = size;
	canvas.height = size;

	if(mapImage) {
		context.drawImage(mapImage, 0, 0, size, size);
	}
	if(coverImage && bookData.coverPos) {
		if(bookData.coverPos.length == 4) {
			context.drawImage(coverImage, bookData.coverPos[0], bookData.coverPos[1], bookData.coverPos[2], bookData.coverPos[3]);
		}
	}

	context.font = "Bold 16px Arial";
	context.fillStyle = '#000000';
    context.fillText(bookData.title, 300, 120);
	context.font = "Bold 12px Arial";
    context.fillText(bookData.author, 325, 50);
    
	var texture = new THREE.Texture(canvas);
    var material = new THREE.MeshPhongMaterial({map: texture});
	texture.needsUpdate = true;

	bookData.context = context;
	bookData.canvas = canvas;

	return material;
}
var VirtualBookshelf = VirtualBookshelf || {};

var STATS_CONTAINER_ID = 'stats';

VirtualBookshelf.canvas;
VirtualBookshelf.renderer;
VirtualBookshelf.library;
VirtualBookshelf.scene;
VirtualBookshelf.stats;

VirtualBookshelf.start = function() {
	if(!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}

	var width = window.innerWidth;
	var height = window.innerHeight;

	VirtualBookshelf.init(width, height);
	VirtualBookshelf.Camera.init(width, height);
	VirtualBookshelf.UI.initControlsData();
	VirtualBookshelf.Controls.init();

	VirtualBookshelf.startRenderLoop();
}

VirtualBookshelf.init = function(width, height) {
	var statsContainer = document.getElementById(STATS_CONTAINER_ID);
	VirtualBookshelf.stats = new Stats();
	statsContainer.appendChild(VirtualBookshelf.stats.domElement);


	VirtualBookshelf.canvas = document.getElementById('LIBRARY');
	VirtualBookshelf.renderer = new THREE.WebGLRenderer({canvas: VirtualBookshelf.canvas});
	VirtualBookshelf.renderer.setSize(width, height);

	VirtualBookshelf.scene = new THREE.Scene();
	VirtualBookshelf.scene.fog = new THREE.Fog(0x000000, 4, 7);
}

VirtualBookshelf.startRenderLoop = function() {
	requestAnimationFrame(VirtualBookshelf.startRenderLoop);
	VirtualBookshelf.Controls.update();
	VirtualBookshelf.renderer.render(VirtualBookshelf.scene, VirtualBookshelf.camera);

	VirtualBookshelf.stats.update();
}

VirtualBookshelf.clearScene = function() {
	VirtualBookshelf.Controls.clear();
	VirtualBookshelf.library = null;

	while(VirtualBookshelf.scene.children.length > 0) {
		if(VirtualBookshelf.scene.children[0].dispose) {
			VirtualBookshelf.scene.children[0].dispose();
		}
		VirtualBookshelf.scene.remove(VirtualBookshelf.scene.children[0]);
	}
}

VirtualBookshelf.loadLibrary = function(libraryId) {
	VirtualBookshelf.clearScene();
	VirtualBookshelf.Data.getLibrary(libraryId, function (err, library) {
		VirtualBookshelf.Data.loadLibrary(library, function (params, geometry, material) {
			VirtualBookshelf.library = new VirtualBookshelf.Library(params, geometry, material);
			VirtualBookshelf.Camera.setParent(VirtualBookshelf.library);
			VirtualBookshelf.scene.add(VirtualBookshelf.library);
			VirtualBookshelf.library.loadSections();
		});				
	});
};

VirtualBookshelf.run = function(data, user) {
	user.load().then(function (res) {
		VirtualBookshelf.start();
		VirtualBookshelf.loadLibrary(user.getLibrary() || 1);
	}, function (res) {
		//TODO: show error message
	});
};

VirtualBookshelf.UI = VirtualBookshelf.UI || {};

VirtualBookshelf.UI.BOOK_IMAGE_URL = '/obj/books/{model}/img.jpg';

VirtualBookshelf.UI.init = function($q, user, data, blockUI) {
	VirtualBookshelf.UI.$q = $q;
	VirtualBookshelf.UI.user = user;
	VirtualBookshelf.UI.blockUI = blockUI;

	return VirtualBookshelf.UI;
};

VirtualBookshelf.UI.menu = {
	selectLibrary: {
		list: [],
		updateList: function() {
			var scope = this;

		    VirtualBookshelf.Data.getLibraries(function (err, result) {
		        if(!err && result) {
		            scope.list = result;
		        }
		    });
		},
		go: function(id) {
			if(id) {
				VirtualBookshelf.loadLibrary(id);
			}
		}
	},
	createLibrary: {
		list: [],
		model: null,

		getImg: function() {
			return this.model ? '/obj/libraries/{model}/img.jpg'.replace('{model}', this.model) : null;
		},
		create: function() {
			if(this.model) {
				VirtualBookshelf.Data.postLibrary(this.model, function (err, result) {
					if(!err && result) {
						//TODO: add library without reload
						VirtualBookshelf.loadLibrary(result.id);
						VirtualBookshelf.UI.menu.show = null; // TODO: hide after go 
						VirtualBookshelf.UI.menu.selectLibrary.updateList();
					}
				});
			}
		}		
	},
	createSection: {
		list: [],
		model: null,
		
		getImg: function() {
			return this.model ? '/obj/sections/{model}/img.jpg'.replace('{model}', this.model) : null;
		},
		create: function() {
			if(this.model) {
				var sectionData = {
					model: this.model,
					userId: VirtualBookshelf.UI.user.id
				};

				VirtualBookshelf.Data.postSection(sectionData, function (err, result) {
					if(!err && result) {
						//TODO: refactor
					}
				});
			}
		}
	},
	// sectionMenu: {
	// 	isMoveOption: function() {
	// 		return true;
	// 	},
	// 	isRotateOption: function() {
	// 		return false;
	// 	}
	// },
	feedback: {
		message: null,
		show: true,

		close: function() {
			this.show = false;
		},
		submit: function() {
			var dataObject;
			
			if(this.message) {
				dataObject = {
					message: this.message,
					userId: VirtualBookshelf.UI.user && VirtualBookshelf.UI.user.id
				};

				VirtualBookshelf.Data.postFeedback(dataObject, function(err, result) {
					// TODO: 
				});
			}

			this.close();
		}
	},
	navigation: {
		stop: function() {
			VirtualBookshelf.Controls.goStop();
		},
		forward: function() {
			VirtualBookshelf.Controls.goForward();
		},
		backward: function() {
			VirtualBookshelf.Controls.goBackward();
		},
		left: function() {
			VirtualBookshelf.Controls.goLeft();
		},
		right: function() {
			VirtualBookshelf.Controls.goRight();
		}
	},
	login: {
		// TODO: oauth.io
		isShow: function() {
			return !VirtualBookshelf.UI.user.isAuthorized();
		}
	},
	inventory: {
		search: null,
		list: null,
		blocker: 'inventory',
	
		expand: function(book) {
			VirtualBookshelf.UI.menu.createBook.setBook(book);
		},
		block: function() {
			VirtualBookshelf.UI.blockUI.instances.get(this.blocker).start();
		},
		unblock: function() {
			VirtualBookshelf.UI.blockUI.instances.get(this.blocker).stop();
		},
		isShow: function() {
			return VirtualBookshelf.UI.user.isAuthorized();
		},
		addBook: function() {
			var scope = this;

			scope.block();
			VirtualBookshelf.Data.postBook({userId: VirtualBookshelf.UI.user.getId()})
				.then(function (res) {
					scope.expand(res.data);
					return scope.loadData();
				})
				.then(function (res) {
					//TODO: research, looks rigth
				})
				.finally(function (res) {
					scope.unblock();
				})
				.catch(function (res) {
					//TODO: show an error
				});
		},
		remove: function(book) {
			var scope = this;

			scope.block();
			VirtualBookshelf.Data.deleteBook(book)
				.then(function (res) {
					return scope.loadData();
				})
				.catch(function (res) {
					//TODO: show an error
				})
				.finally(function (res) {
					scope.unblock();
				});
		},
		loadData: function() {
			var scope = this;
			var $q = VirtualBookshelf.UI.$q;
			var promise;

			scope.block();
			promise = $q.when(this.isShow() ? VirtualBookshelf.Data.getUserBooks(VirtualBookshelf.UI.user.getId()) : null)
				.then(function (books) {
					scope.list = books;
				})
				.finally(function () {
					scope.unblock();		
				});

			return promise;
		}
	},
	createBook: {
		list: [],
		book: {},

		setBook: function(book) {
			this.book = {}; // create new object for unbind from scope
			if(book) {
				this.book.id = book.id;
				this.book.userId = book.userId;
				this.book.model = book.model;
				this.book.cover = book.cover;
				this.book.title = book.title;
				this.book.author = book.author;
			}
		},
		getImg: function() {
			return this.book.model ? VirtualBookshelf.UI.BOOK_IMAGE_URL.replace('{model}', this.book.model) : null;
		},
		isShow: function() {
			return !!this.book.id;
		},
		save: function() {
			var scope = this;

			
			VirtualBookshelf.UI.menu.inventory.block();
			VirtualBookshelf.Data.postBook(this.book)
				.then(function (res) {
					scope.cancel();
					return VirtualBookshelf.UI.menu.inventory.loadData()
				})
				.catch(function (res) {
					//TODO: show error
				})
				.finally(function (res) {
					VirtualBookshelf.UI.menu.inventory.unblock();
				});
		},
		cancel: function() {
			this.setBook();
		}
	}
};

VirtualBookshelf.UI.initControlsData = function() {
	var scope = VirtualBookshelf.UI;

	VirtualBookshelf.Data.getUIData(function (err, data) {
		if(!err && data) {
			scope.menu.createLibrary.list = data.libraries;
			scope.menu.createSection.list = data.bookshelves;
			scope.menu.createBook.list = data.books;
		}
	});

	VirtualBookshelf.UI.menu.selectLibrary.updateList();
	VirtualBookshelf.UI.menu.inventory.loadData();
}

// VirtualBookshelf.UI.initControlsEvents = function() {
	// VirtualBookshelf.UI.menu.createBook.model.onchange = VirtualBookshelf.UI.changeModel;
	// VirtualBookshelf.UI.menu.createBook.texture.onchange = VirtualBookshelf.UI.changeBookTexture;
	// VirtualBookshelf.UI.menu.createBook.cover.onchange = VirtualBookshelf.UI.changeBookCover;
	// VirtualBookshelf.UI.menu.createBook.author.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'text');
	// VirtualBookshelf.UI.menu.createBook.authorSize.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'size');
	// VirtualBookshelf.UI.menu.createBook.authorColor.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'color');
	// VirtualBookshelf.UI.menu.createBook.title.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'text');
	// VirtualBookshelf.UI.menu.createBook.titleSize.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'size');
	// VirtualBookshelf.UI.menu.createBook.titleColor.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'color');
	// VirtualBookshelf.UI.menu.createBook.editCover.onclick = VirtualBookshelf.UI.switchEdited;
	// VirtualBookshelf.UI.menu.createBook.editAuthor.onclick = VirtualBookshelf.UI.switchEdited;
	// VirtualBookshelf.UI.menu.createBook.editTitle.onclick = VirtualBookshelf.UI.switchEdited;
	// VirtualBookshelf.UI.menu.createBook.ok.onclick = VirtualBookshelf.UI.saveBook;
	// VirtualBookshelf.UI.menu.createBook.cancel.onclick = VirtualBookshelf.UI.cancelBookEdit;
// };

// create book

// VirtualBookshelf.UI.showCreateBook = function() {
// 	var menuNode = VirtualBookshelf.UI.menu.createBook;

// 	if(VirtualBookshelf.selected.isBook()) {
// 		menuNode.show();
// 		menuNode.setValues();
// 	} else if(VirtualBookshelf.selected.isSection()) {
// 		var section = VirtualBookshelf.selected.object;
// 		var shelf = section.getShelfByPoint(VirtualBookshelf.selected.point);
// 		var freePosition = section.getGetFreeShelfPosition(shelf, {x: 0.05, y: 0.12, z: 0.1}); 
// 		if(freePosition) {
// 			menuNode.show();

// 			var dataObject = {
// 				model: menuNode.model.value, 
// 				texture: menuNode.texture.value, 
// 				cover: menuNode.cover.value,
// 				pos_x: freePosition.x,
// 				pos_y: freePosition.y,
// 				pos_z: freePosition.z,
// 				sectionId: section.dataObject.id,
// 				shelfId: shelf.id,
// 				userId: VirtualBookshelf.user.id
// 			};

// 			VirtualBookshelf.Data.createBook(dataObject, function (book, dataObject) {
// 				book.parent = shelf;
// 				VirtualBookshelf.selected.object = book;
// 				VirtualBookshelf.selected.get();
// 			});
// 		} else {
// 			alert('There is no free space on selected shelf.');
// 		}
// 	}
// }

// VirtualBookshelf.UI.changeModel = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var oldBook = VirtualBookshelf.selected.object;
// 		var dataObject = {
// 			model: this.value,
// 			texture: oldBook.texture.toString(),
// 			cover: oldBook.cover.toString()
// 		};

// 		VirtualBookshelf.Data.createBook(dataObject, function (book, dataObject) {
// 			book.copyState(oldBook);
// 		});
// 	}
// }

// VirtualBookshelf.UI.changeBookTexture = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;
// 		book.texture.load(this.value, false, function () {
// 			book.updateTexture();
// 		});
// 	}
// }

// VirtualBookshelf.UI.changeBookCover = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;
// 		book.cover.load(this.value, true, function() {
// 			book.updateTexture();
// 		});
// 	}
// }

// VirtualBookshelf.UI.changeSpecificValue = function(field, property) {
// 	return function () {
// 		if(VirtualBookshelf.selected.isBook()) {
// 			VirtualBookshelf.selected.object[field][property] = this.value;
// 			VirtualBookshelf.selected.object.updateTexture();
// 		}
// 	};
// };

// VirtualBookshelf.UI.switchEdited = function() {
// 	var activeElemets = document.querySelectorAll('a.activeEdit');

// 	for(var i = activeElemets.length - 1; i >= 0; i--) {
// 		activeElemets[i].className = 'inactiveEdit';
// 	};

// 	var previousEdited = VirtualBookshelf.UI.menu.createBook.edited;
// 	var currentEdited = this.getAttribute('edit');

// 	if(previousEdited != currentEdited) {
// 		this.className = 'activeEdit';
// 		VirtualBookshelf.UI.menu.createBook.edited = currentEdited;
// 	} else {
// 		VirtualBookshelf.UI.menu.createBook.edited = null;
// 	}
// }

// VirtualBookshelf.UI.saveBook = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;

// 		VirtualBookshelf.selected.put();
// 		book.save();
// 	}
// }

// VirtualBookshelf.UI.cancelBookEdit = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;
		
// 		VirtualBookshelf.selected.put();
// 		book.refresh();
// 	}
// }
VirtualBookshelf.User = function(data) {
	var user = {
		_dataObject: null,
		_position: null,
		_library: null,

		load: function() {
			var scope = this;

			return data.getUser()
				.then(function (res) {
					scope.setDataObject(res.data);
					scope.setLibrary();
				});
		},
		setDataObject: function(dataObject) {
			this._dataObject = dataObject;
		},
		getLibrary: function() {
			return this._library;
		},
		setLibrary: function(libraryId) {
			this._library = libraryId || window.location.pathname.substring(1);
		},
		getId: function() {
			return this._dataObject && this._dataObject.id;
		},
		isAuthorized: function() {
			return Boolean(this._dataObject);
		}
	};

	return user;
};
VirtualBookshelf.Directives = VirtualBookshelf.Directives || {};

VirtualBookshelf.Directives.Select = function() {
	return {
		restrict: 'E',
    	transclude: true,
		templateUrl: '/ui/select.ejs',
		scope: {
			options: '=',
			selected: '=',
			value: '@',
			label: '@'
		},
		link: function(scope, element, attrs, controller, transclude) {
			scope.select = function(item) {
				scope.selected = item[scope.value];
			};

			scope.isSelected = function(item) {
				return scope.selected === item[scope.value];
			};
		}
	};
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVscy5qcyIsIlZpcnR1YWxCb29rc2hlbGYvY2FtZXJhLmpzIiwiVmlydHVhbEJvb2tzaGVsZi9jb250cm9scy5qcyIsIlZpcnR1YWxCb29rc2hlbGYvZGF0YS5qcyIsIlZpcnR1YWxCb29rc2hlbGYvZWRpdG9yLmpzIiwiVmlydHVhbEJvb2tzaGVsZi9tYWluLmpzIiwiVmlydHVhbEJvb2tzaGVsZi91aS5qcyIsIlZpcnR1YWxCb29rc2hlbGYvdXNlci5qcyIsIlZpcnR1YWxCb29rc2hlbGYvZGlyZWN0aXZlcy9zZWxlY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdlhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJWaXJ0dWFsQm9va3NoZWxmID0gVmlydHVhbEJvb2tzaGVsZiB8fCB7fTtcblxuVmlydHVhbEJvb2tzaGVsZi5PYmplY3QgPSBmdW5jdGlvbihkYXRhT2JqZWN0LCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0VEhSRUUuTWVzaC5jYWxsKHRoaXMsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cblx0dGhpcy5kYXRhT2JqZWN0ID0gZGF0YU9iamVjdCB8fCB7fTtcblx0dGhpcy5kYXRhT2JqZWN0LnJvdGF0aW9uID0gdGhpcy5kYXRhT2JqZWN0LnJvdGF0aW9uIHx8IFswLCAwLCAwXTtcblx0XG5cdHRoaXMuaWQgPSB0aGlzLmRhdGFPYmplY3QuaWQ7XG5cdHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyh0aGlzLmRhdGFPYmplY3QucG9zX3gsIHRoaXMuZGF0YU9iamVjdC5wb3NfeSwgdGhpcy5kYXRhT2JqZWN0LnBvc196KTtcblx0dGhpcy5yb3RhdGlvbi5vcmRlciA9ICdYWVonO1xuXHR0aGlzLnJvdGF0aW9uLmZyb21BcnJheSh0aGlzLmRhdGFPYmplY3Qucm90YXRpb24ubWFwKE51bWJlcikpO1xuXG5cdHRoaXMudXBkYXRlTWF0cml4KCk7XG5cdHRoaXMuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XG5cdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcdFx0XG59XG5WaXJ0dWFsQm9va3NoZWxmLk9iamVjdC5wcm90b3R5cGUgPSBuZXcgVEhSRUUuTWVzaCgpO1xuVmlydHVhbEJvb2tzaGVsZi5PYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVmlydHVhbEJvb2tzaGVsZi5PYmplY3Q7XG5WaXJ0dWFsQm9va3NoZWxmLk9iamVjdC5wcm90b3R5cGUuaXNPdXRPZlBhcnJlbnQgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnggLSB0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5jZW50ZXIueCkgPiAodGhpcy5wYXJlbnQuYm91bmRpbmdCb3gucmFkaXVzLnggLSB0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy54KVxuXHRcdC8vfHwgTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueSAtIHRoaXMucGFyZW50LmJvdW5kaW5nQm94LmNlbnRlci55KSA+ICh0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5yYWRpdXMueSAtIHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnkpXG5cdFx0fHwgTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueiAtIHRoaXMucGFyZW50LmJvdW5kaW5nQm94LmNlbnRlci56KSA+ICh0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5yYWRpdXMueiAtIHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnopO1xufVxuVmlydHVhbEJvb2tzaGVsZi5PYmplY3QucHJvdG90eXBlLmlzQ29sbGlkZWQgPSBmdW5jdGlvbigpIHtcblx0dmFyXG5cdFx0cmVzdWx0LFxuXHRcdHRhcmdldHMsXG5cdFx0dGFyZ2V0LFxuXHRcdGk7XG5cblx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xuXG5cdHJlc3VsdCA9IHRoaXMuaXNPdXRPZlBhcnJlbnQoKTtcblx0dGFyZ2V0cyA9IHRoaXMucGFyZW50LmNoaWxkcmVuO1xuXG5cdGlmKCFyZXN1bHQpIHtcblx0XHRmb3IoaSA9IHRhcmdldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdHRhcmdldCA9IHRhcmdldHNbaV0uYm91bmRpbmdCb3g7XG5cblx0XHRcdGlmKHRhcmdldHNbaV0gPT09IHRoaXNcblx0XHRcdHx8IChNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci54IC0gdGFyZ2V0LmNlbnRlci54KSA+ICh0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy54ICsgdGFyZ2V0LnJhZGl1cy54KSlcblx0XHRcdHx8IChNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci55IC0gdGFyZ2V0LmNlbnRlci55KSA+ICh0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy55ICsgdGFyZ2V0LnJhZGl1cy55KSlcblx0XHRcdHx8IChNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci56IC0gdGFyZ2V0LmNlbnRlci56KSA+ICh0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy56ICsgdGFyZ2V0LnJhZGl1cy56KSkpIHtcdFxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHQgICAgXHRyZXN1bHQgPSB0cnVlO1x0XHRcblx0ICAgIFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlc3VsdDtcbn07XG5WaXJ0dWFsQm9va3NoZWxmLk9iamVjdC5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uKG5ld1Bvc2l0aW9uKSB7XG5cdHZhciBcblx0XHRjdXJyZW50UG9zaXRpb24sXG5cdFx0cmVzdWx0O1xuXG5cdHJlc3VsdCA9IGZhbHNlO1xuXHRjdXJyZW50UG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmNsb25lKCk7XG5cdFxuXHRpZihuZXdQb3NpdGlvbi54KSB7XG5cdFx0dGhpcy5wb3NpdGlvbi5zZXRYKG5ld1Bvc2l0aW9uLngpO1xuXG5cdFx0aWYodGhpcy5pc0NvbGxpZGVkKCkpIHtcblx0XHRcdHRoaXMucG9zaXRpb24uc2V0WChjdXJyZW50UG9zaXRpb24ueCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0aWYobmV3UG9zaXRpb24ueikge1xuXHRcdHRoaXMucG9zaXRpb24uc2V0WihuZXdQb3NpdGlvbi56KTtcblxuXHRcdGlmKHRoaXMuaXNDb2xsaWRlZCgpKSB7XG5cdFx0XHR0aGlzLnBvc2l0aW9uLnNldFooY3VycmVudFBvc2l0aW9uLnopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHRoaXMuY2hhbmdlZCA9IHRoaXMuY2hhbmdlZCB8fCByZXN1bHQ7XG5cdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuVmlydHVhbEJvb2tzaGVsZi5PYmplY3QucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uKGRYLCBkWSwgaXNEZW1vKSB7XG5cdHZhciBcblx0XHRjdXJyZW50Um90YXRpb24gPSB0aGlzLnJvdGF0aW9uLmNsb25lKCksXG5cdFx0cmVzdWx0ID0gZmFsc2U7IFxuXHRcblx0aWYoZFgpIHtcblx0XHR0aGlzLnJvdGF0aW9uLnkgKz0gZFggKiAwLjAxO1xuXG5cdFx0aWYoIWlzRGVtbyAmJiB0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0dGhpcy5yb3RhdGlvbi55ID0gY3VycmVudFJvdGF0aW9uLnk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0aWYoZFkpIHtcblx0XHR0aGlzLnJvdGF0aW9uLnggKz0gZFkgKiAwLjAxO1xuXG5cdFx0aWYoIWlzRGVtbyAmJiB0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0dGhpcy5yb3RhdGlvbi54ID0gY3VycmVudFJvdGF0aW9uLng7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5jaGFuZ2VkID0gdGhpcy5jaGFuZ2VkIHx8ICghaXNEZW1vICYmIHJlc3VsdCk7XG5cdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcbn1cblZpcnR1YWxCb29rc2hlbGYuT2JqZWN0LnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ0JveCA9IGZ1bmN0aW9uKCkge1xuXHR2YXJcblx0XHRib3VuZGluZ0JveCxcblx0XHRyYWRpdXMsXG5cdFx0Y2VudGVyO1xuXG5cdHRoaXMudXBkYXRlTWF0cml4KCk7XG5cdGJvdW5kaW5nQm94ID0gdGhpcy5nZW9tZXRyeS5ib3VuZGluZ0JveC5jbG9uZSgpLmFwcGx5TWF0cml4NCh0aGlzLm1hdHJpeCk7XG5cdFxuXHRyYWRpdXMgPSB7XG5cdFx0eDogKGJvdW5kaW5nQm94Lm1heC54IC0gYm91bmRpbmdCb3gubWluLngpICogMC41LFxuXHRcdHk6IChib3VuZGluZ0JveC5tYXgueSAtIGJvdW5kaW5nQm94Lm1pbi55KSAqIDAuNSxcblx0XHR6OiAoYm91bmRpbmdCb3gubWF4LnogLSBib3VuZGluZ0JveC5taW4ueikgKiAwLjVcblx0fTtcblxuXHRjZW50ZXIgPSBuZXcgVEhSRUUuVmVjdG9yMyhcblx0XHRyYWRpdXMueCArIGJvdW5kaW5nQm94Lm1pbi54LFxuXHRcdHJhZGl1cy55ICsgYm91bmRpbmdCb3gubWluLnksXG5cdFx0cmFkaXVzLnogKyBib3VuZGluZ0JveC5taW4uelxuXHQpO1xuXG5cdHRoaXMuYm91bmRpbmdCb3ggPSB7XG5cdFx0cmFkaXVzOiByYWRpdXMsXG5cdFx0Y2VudGVyOiBjZW50ZXJcblx0fTtcbn1cblZpcnR1YWxCb29rc2hlbGYuT2JqZWN0LnByb3RvdHlwZS5yZWxvYWQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5wb3NpdGlvbi5zZXRYKHRoaXMuZGF0YU9iamVjdC5wb3NfeCk7XG5cdHRoaXMucG9zaXRpb24uc2V0WSh0aGlzLmRhdGFPYmplY3QucG9zX3kpO1xuXHR0aGlzLnBvc2l0aW9uLnNldFoodGhpcy5kYXRhT2JqZWN0LnBvc196KTtcblx0dGhpcy5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG59XG5cbi8vKioqKioqKioqKioqKioqKioqKioqXG5cblZpcnR1YWxCb29rc2hlbGYuQ2FtZXJhT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFZpcnR1YWxCb29rc2hlbGYuT2JqZWN0LmNhbGwodGhpcyk7XG59XG5WaXJ0dWFsQm9va3NoZWxmLkNhbWVyYU9iamVjdC5wcm90b3R5cGUgPSBuZXcgVmlydHVhbEJvb2tzaGVsZi5PYmplY3QoKTtcblZpcnR1YWxCb29rc2hlbGYuQ2FtZXJhT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFZpcnR1YWxCb29rc2hlbGYuQ2FtZXJhT2JqZWN0O1xuVmlydHVhbEJvb2tzaGVsZi5DYW1lcmFPYmplY3QucHJvdG90eXBlLnVwZGF0ZUJvdW5kaW5nQm94ID0gZnVuY3Rpb24oKSB7XG5cdHZhciByYWRpdXMgPSB7eDogMC4xLFx0eTogMSwgejogMC4xfTtcblx0dmFyIGNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApO1xuXG5cdHRoaXMuYm91bmRpbmdCb3ggPSB7XG5cdFx0cmFkaXVzOiByYWRpdXMsXG5cdFx0Y2VudGVyOiB0aGlzLnBvc2l0aW9uIC8vVE9ETzogbmVlZHMgY2VudGVyIG9mIHNlY3Rpb24gaW4gcGFyZW50IG9yIHdvcmxkIGNvb3JkaW5hdGVzXG5cdH07XG59XG5cblZpcnR1YWxCb29rc2hlbGYuTGlicmFyeSA9IGZ1bmN0aW9uKHBhcmFtcywgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG5cdFZpcnR1YWxCb29rc2hlbGYuT2JqZWN0LmNhbGwodGhpcywgcGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdHRoaXMubGlicmFyeU9iamVjdCA9IHBhcmFtcy5saWJyYXJ5T2JqZWN0IHx8IHt9O1xufVxuVmlydHVhbEJvb2tzaGVsZi5MaWJyYXJ5LnByb3RvdHlwZSA9IG5ldyBWaXJ0dWFsQm9va3NoZWxmLk9iamVjdCgpO1xuVmlydHVhbEJvb2tzaGVsZi5MaWJyYXJ5LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFZpcnR1YWxCb29rc2hlbGYuTGlicmFyeTtcblxuVmlydHVhbEJvb2tzaGVsZi5MaWJyYXJ5LnByb3RvdHlwZS5sb2FkU2VjdGlvbnMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGxpYnJhcnkgPSB0aGlzO1xuXG5cdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5nZXRTZWN0aW9ucyhsaWJyYXJ5LmlkLCBmdW5jdGlvbiAoZXJyLCBzZWN0aW9ucykge1xuXHRcdGlmKHNlY3Rpb25zKSB7XG5cdFx0XHRmb3Ioa2V5IGluIHNlY3Rpb25zKSB7XG5cdFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5sb2FkU2VjdGlvbihzZWN0aW9uc1trZXldLCBmdW5jdGlvbiAocGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHRcdFx0XHR2YXIgc2VjdGlvbiA9IG5ldyBWaXJ0dWFsQm9va3NoZWxmLlNlY3Rpb24ocGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHRcdFx0XHRcdGxpYnJhcnkuYWRkKHNlY3Rpb24pO1xuXHRcdFx0XHR9KTtcdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59XG4vLyoqKlxuXG5WaXJ0dWFsQm9va3NoZWxmLlNlY3Rpb24gPSBmdW5jdGlvbihwYXJhbXMsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuXHRWaXJ0dWFsQm9va3NoZWxmLk9iamVjdC5jYWxsKHRoaXMsIHBhcmFtcywgZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuXHR0aGlzLnNoZWx2ZXMgPSB7fTtcblx0Zm9yKGtleSBpbiBwYXJhbXMuZGF0YS5zaGVsdmVzKSB7XG5cdFx0dGhpcy5zaGVsdmVzW2tleV0gPSBuZXcgVmlydHVhbEJvb2tzaGVsZi5TaGVsZihwYXJhbXMuZGF0YS5zaGVsdmVzW2tleV0pOyBcblx0XHR0aGlzLmFkZCh0aGlzLnNoZWx2ZXNba2V5XSk7XG5cdH1cblx0XG5cdHRoaXMubG9hZEJvb2tzKCk7XG59XG5WaXJ0dWFsQm9va3NoZWxmLlNlY3Rpb24ucHJvdG90eXBlID0gbmV3IFZpcnR1YWxCb29rc2hlbGYuT2JqZWN0KCk7XG5WaXJ0dWFsQm9va3NoZWxmLlNlY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVmlydHVhbEJvb2tzaGVsZi5TZWN0aW9uO1xuVmlydHVhbEJvb2tzaGVsZi5TZWN0aW9uLnByb3RvdHlwZS5sb2FkQm9va3MgPSBmdW5jdGlvbigpIHtcdFxuXHR2YXIgc2VjdGlvbiA9IHRoaXM7XG5cblx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLmdldEJvb2tzKHNlY3Rpb24uaWQsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcblx0XHRpZighZXJyICYmIGRhdGEgJiYgZGF0YS5sZW5ndGgpIHtcblx0XHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZGF0YU9iamVjdCkge1xuXHRcdFx0XHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEuY3JlYXRlQm9vayhkYXRhT2JqZWN0LCBmdW5jdGlvbiAoYm9vaywgZGF0YU9iamVjdCkge1xuXHRcdFx0XHRcdHZhciBzaGVsZiA9IHNlY3Rpb24uc2hlbHZlc1tkYXRhT2JqZWN0LnNoZWxmSWRdO1xuXHRcdFx0XHRcdHNoZWxmICYmIHNoZWxmLmFkZChib29rKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufTtcblZpcnR1YWxCb29rc2hlbGYuU2VjdGlvbi5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdHRoaXMuZGF0YU9iamVjdC5wb3NfeCA9IHRoaXMucG9zaXRpb24ueDtcblx0dGhpcy5kYXRhT2JqZWN0LnBvc195ID0gdGhpcy5wb3NpdGlvbi55O1xuXHR0aGlzLmRhdGFPYmplY3QucG9zX3ogPSB0aGlzLnBvc2l0aW9uLno7XG5cblx0dGhpcy5kYXRhT2JqZWN0LnJvdGF0aW9uID0gW3RoaXMucm90YXRpb24ueCwgdGhpcy5yb3RhdGlvbi55LCB0aGlzLnJvdGF0aW9uLnpdO1xuXG5cdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5wb3N0U2VjdGlvbih0aGlzLmRhdGFPYmplY3QsIGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG5cdFx0aWYoIWVyciAmJiByZXN1bHQpIHtcblx0XHRcdHNjb3BlLmRhdGFPYmplY3QgPSByZXN1bHQ7XG5cdFx0XHRzY29wZS5jaGFuZ2VkID0gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vVE9ETzogaGlkZSBlZGl0LCBub3RpZnkgdXNlclxuXHRcdH1cblx0fSk7XG59O1xuVmlydHVhbEJvb2tzaGVsZi5TZWN0aW9uLnByb3RvdHlwZS5nZXRTaGVsZkJ5UG9pbnQgPSBmdW5jdGlvbihwb2ludCkge1xuXHRpZighcG9pbnQgfHwgIXRoaXMuc2hlbHZlcykgcmV0dXJuIG51bGw7XG5cdHRoaXMud29ybGRUb0xvY2FsKHBvaW50KTtcblx0XG5cdHZhciBtaW5EaXN0YW5jZTtcblx0dmFyIGNsb3Nlc3Q7XG5cdGZvcihrZXkgaW4gdGhpcy5zaGVsdmVzKSB7XG5cdFx0dmFyIHNoZWxmID0gdGhpcy5zaGVsdmVzW2tleV07XG5cdFx0dmFyIGRpc3RhbmNlID0gcG9pbnQuZGlzdGFuY2VUbyhuZXcgVEhSRUUuVmVjdG9yMyhzaGVsZi5wb3NpdGlvbi54LCBzaGVsZi5wb3NpdGlvbi55LCBzaGVsZi5wb3NpdGlvbi56KSk7XG5cdFx0aWYoIW1pbkRpc3RhbmNlIHx8IGRpc3RhbmNlIDwgbWluRGlzdGFuY2UpIHtcblx0XHRcdG1pbkRpc3RhbmNlID0gZGlzdGFuY2U7XG5cdFx0XHRjbG9zZXN0ID0gc2hlbGY7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGNsb3Nlc3Q7XG59XG5cblZpcnR1YWxCb29rc2hlbGYuU2VjdGlvbi5wcm90b3R5cGUuZ2V0R2V0RnJlZVNoZWxmUG9zaXRpb24gPSBmdW5jdGlvbihzaGVsZiwgYm9va1NpemUpIHtcblx0aWYoIXNoZWxmKSByZXR1cm4gbnVsbDtcblx0dmFyIHNvcnRlZEJvb2tzID0gW107XG5cdHZhciByZXN1bHQ7XG5cblx0c29ydGVkQm9va3MucHVzaCh7XG5cdFx0bGVmdDogLXNoZWxmLnNpemUueCxcblx0XHRyaWdodDogLXNoZWxmLnNpemUueCAqIDAuNVxuXHR9KTtcblx0c29ydGVkQm9va3MucHVzaCh7XG5cdFx0bGVmdDogc2hlbGYuc2l6ZS54ICogMC41LFxuXHRcdHJpZ2h0OiBzaGVsZi5zaXplLnhcblx0fSk7XG5cblx0c2hlbGYuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoYm9vaykge1xuXHRcdGlmKGJvb2sgaW5zdGFuY2VvZiBWaXJ0dWFsQm9va3NoZWxmLkJvb2spIHtcblx0XHRcdHZhciBpbnNlcnRlZCA9IGZhbHNlO1xuXHRcdFx0dmFyIHNwYWNlID0ge1xuXHRcdFx0XHRsZWZ0OiBib29rLnBvc2l0aW9uLnggKyBib29rLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1pbi54LFxuXHRcdFx0XHRyaWdodDogYm9vay5wb3NpdGlvbi54ICsgYm9vay5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueFxuXHRcdFx0fTtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzb3J0ZWRCb29rcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgc29ydGVkQm9vayA9IHNvcnRlZEJvb2tzW2ldO1xuXHRcdFx0XHRpZihib29rLnBvc2l0aW9uLnggPCBzb3J0ZWRCb29rLmxlZnQpIHtcblx0XHRcdFx0XHRzb3J0ZWRCb29rcy5zcGxpY2UoaSwgMCwgc3BhY2UpO1xuXHRcdFx0XHRcdGluc2VydGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZighaW5zZXJ0ZWQpIHtcblx0XHRcdFx0c29ydGVkQm9va3MucHVzaChzcGFjZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IChzb3J0ZWRCb29rcy5sZW5ndGggLSAxKTsgaSsrKSB7XG5cdFx0dmFyIGxlZnQgPSBzb3J0ZWRCb29rc1tpXS5yaWdodDtcblx0XHR2YXIgcmlnaHQgPSBzb3J0ZWRCb29rc1tpICsgMV0ubGVmdDtcblx0XHR2YXIgZGlzdGFuY2UgPSByaWdodCAtIGxlZnQ7XG5cdFx0XG5cdFx0aWYoZGlzdGFuY2UgPiBib29rU2l6ZS54KSB7XG5cdFx0XHRyZXN1bHQgPSBuZXcgVEhSRUUuVmVjdG9yMyhsZWZ0ICsgYm9va1NpemUueCAqIDAuNSwgYm9va1NpemUueSAqIC0wLjUsIDApO1x0XHRcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuLy8qKipcblxuVmlydHVhbEJvb2tzaGVsZi5TaGVsZiA9IGZ1bmN0aW9uKHBhcmFtcykge1xuXHR2YXIgc2l6ZSA9IHBhcmFtcy5zaXplIHx8IFsxLDEsMV07XHRcblx0VmlydHVhbEJvb2tzaGVsZi5PYmplY3QuY2FsbCh0aGlzLCBwYXJhbXMsIG5ldyBUSFJFRS5DdWJlR2VvbWV0cnkoc2l6ZVswXSwgc2l6ZVsxXSwgc2l6ZVsyXSkpO1xuXG5cdHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyhwYXJhbXMucG9zaXRpb25bMF0sIHBhcmFtcy5wb3NpdGlvblsxXSwgcGFyYW1zLnBvc2l0aW9uWzJdKTtcblx0dGhpcy5zaXplID0gbmV3IFRIUkVFLlZlY3RvcjMoc2l6ZVswXSwgc2l6ZVsxXSwgc2l6ZVsyXSk7XG5cdHRoaXMudmlzaWJsZSA9IGZhbHNlO1xufVxuVmlydHVhbEJvb2tzaGVsZi5TaGVsZi5wcm90b3R5cGUgPSBuZXcgVmlydHVhbEJvb2tzaGVsZi5PYmplY3QoKTtcblZpcnR1YWxCb29rc2hlbGYuU2hlbGYucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVmlydHVhbEJvb2tzaGVsZi5TaGVsZjtcbi8vKioqKipcblxuVmlydHVhbEJvb2tzaGVsZi5Cb29rID0gZnVuY3Rpb24oZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG5cdFZpcnR1YWxCb29rc2hlbGYuT2JqZWN0LmNhbGwodGhpcywgZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKTtcblx0XG5cdHRoaXMubW9kZWwgPSB0aGlzLmRhdGFPYmplY3QubW9kZWw7XG5cdHRoaXMuY2FudmFzID0gbWF0ZXJpYWwubWFwLmltYWdlO1xuXHR0aGlzLnRleHR1cmUgPSBuZXcgVmlydHVhbEJvb2tzaGVsZi5EYXRhLkNhbnZhc0ltYWdlKCk7XG5cdHRoaXMuY292ZXIgPSBuZXcgVmlydHVhbEJvb2tzaGVsZi5EYXRhLkNhbnZhc0ltYWdlKHRoaXMuZGF0YU9iamVjdC5jb3ZlclBvcyk7XG5cdHRoaXMuYXV0aG9yID0gbmV3IFZpcnR1YWxCb29rc2hlbGYuRGF0YS5DYW52YXNUZXh0KHRoaXMuZGF0YU9iamVjdC5hdXRob3IsIHRoaXMuZGF0YU9iamVjdC5hdXRob3JGb250KTtcblx0dGhpcy50aXRsZSA9IG5ldyBWaXJ0dWFsQm9va3NoZWxmLkRhdGEuQ2FudmFzVGV4dCh0aGlzLmRhdGFPYmplY3QudGl0bGUsIHRoaXMuZGF0YU9iamVjdC50aXRsZUZvbnQpO1xufVxuVmlydHVhbEJvb2tzaGVsZi5Cb29rLnByb3RvdHlwZSA9IG5ldyBWaXJ0dWFsQm9va3NoZWxmLk9iamVjdCgpO1xuVmlydHVhbEJvb2tzaGVsZi5Cb29rLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFZpcnR1YWxCb29rc2hlbGYuQm9vaztcblZpcnR1YWxCb29rc2hlbGYuQm9vay5wcm90b3R5cGUudGV4dE5vZGVzID0gWydhdXRob3InLCAndGl0bGUnXTtcblZpcnR1YWxCb29rc2hlbGYuQm9vay5wcm90b3R5cGUudXBkYXRlVGV4dHVyZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdHZhciBjb3ZlciA9IHRoaXMuY292ZXI7XG5cblx0aWYodGhpcy50ZXh0dXJlLmltYWdlKSB7XG5cdFx0Y29udGV4dC5kcmF3SW1hZ2UodGhpcy50ZXh0dXJlLmltYWdlLCAwLCAwKTtcblx0fVxuXG5cdGlmKGNvdmVyLmltYWdlKSB7XG5cdFx0dmFyIGRpZmYgPSBjb3Zlci55ICsgY292ZXIuaGVpZ2h0IC0gVmlydHVhbEJvb2tzaGVsZi5EYXRhLkNPVkVSX01BWF9ZO1xuXHQgXHR2YXIgbGltaXRlZEhlaWdodCA9IGRpZmYgPiAwID8gY292ZXIuaGVpZ2h0IC0gZGlmZiA6IGNvdmVyLmhlaWdodDtcblx0IFx0dmFyIGNyb3BIZWlnaHQgPSBkaWZmID4gMCA/IGNvdmVyLmltYWdlLm5hdHVyYWxIZWlnaHQgLSAoY292ZXIuaW1hZ2UubmF0dXJhbEhlaWdodCAvIGNvdmVyLmhlaWdodCAqIGRpZmYpIDogY292ZXIuaW1hZ2UubmF0dXJhbEhlaWdodDtcblxuXHRcdGNvbnRleHQuZHJhd0ltYWdlKGNvdmVyLmltYWdlLCAwLCAwLCBjb3Zlci5pbWFnZS5uYXR1cmFsV2lkdGgsIGNyb3BIZWlnaHQsIGNvdmVyLngsIGNvdmVyLnksIGNvdmVyLndpZHRoLCBsaW1pdGVkSGVpZ2h0KTtcblx0fVxuXG5cdGZvcih2YXIgaSA9IHRoaXMudGV4dE5vZGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0dmFyIHRleHROb2RlID0gdGhpc1t0aGlzLnRleHROb2Rlc1tpXV07XG5cblx0XHRpZih0ZXh0Tm9kZS5pc1ZhbGlkKCkpIHtcblxuXHRcdFx0Y29udGV4dC5mb250ID0gdGV4dE5vZGUuZ2V0Rm9udCgpO1xuXHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSB0ZXh0Tm9kZS5jb2xvcjtcblx0ICAgIFx0Y29udGV4dC5maWxsVGV4dCh0ZXh0Tm9kZS50ZXh0LCB0ZXh0Tm9kZS54LCB0ZXh0Tm9kZS55LCB0ZXh0Tm9kZS53aWR0aCk7XG5cdCAgICB9XG5cdH1cblxuXHR0aGlzLm1hdGVyaWFsLm1hcC5uZWVkc1VwZGF0ZSA9IHRydWU7XG59XG5WaXJ0dWFsQm9va3NoZWxmLkJvb2sucHJvdG90eXBlLm1vdmVFbGVtZW50ID0gZnVuY3Rpb24oZFgsIGRZLCBlbGVtZW50KSB7XG5cdHZhciBlbGVtZW50ID0gZWxlbWVudCAmJiB0aGlzW2VsZW1lbnRdO1xuXHRcblx0aWYoZWxlbWVudCkge1xuXHRcdGlmKGVsZW1lbnQubW92ZSkge1xuXHRcdFx0ZWxlbWVudC5tb3ZlKGRYLCBkWSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsZW1lbnQueCArPSBkWDtcblx0XHRcdGVsZW1lbnQueSArPSBkWTtcblx0XHR9XG5cblx0XHR0aGlzLnVwZGF0ZVRleHR1cmUoKTtcblx0fVxufVxuVmlydHVhbEJvb2tzaGVsZi5Cb29rLnByb3RvdHlwZS5zY2FsZUVsZW1lbnQgPSBmdW5jdGlvbihkWCwgZFkpIHtcblx0dGhpcy5jb3Zlci53aWR0aCArPSBkWDtcblx0dGhpcy5jb3Zlci5oZWlnaHQgKz0gZFk7XG5cdHRoaXMudXBkYXRlVGV4dHVyZSgpO1xufVxuVmlydHVhbEJvb2tzaGVsZi5Cb29rLnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdHZhciBzY29wZSA9IHRoaXM7XG5cblx0dGhpcy5kYXRhT2JqZWN0Lm1vZGVsID0gdGhpcy5tb2RlbDtcblx0dGhpcy5kYXRhT2JqZWN0LnRleHR1cmUgPSB0aGlzLnRleHR1cmUudG9TdHJpbmcoKTtcblx0dGhpcy5kYXRhT2JqZWN0LmNvdmVyID0gdGhpcy5jb3Zlci50b1N0cmluZygpO1xuXHR0aGlzLmRhdGFPYmplY3QuY292ZXJQb3MgPSB0aGlzLmNvdmVyLnNlcmlhbGl6ZVByb3BlcnRpZXMoKTtcblx0dGhpcy5kYXRhT2JqZWN0LmF1dGhvciA9IHRoaXMuYXV0aG9yLnRvU3RyaW5nKCk7XG5cdHRoaXMuZGF0YU9iamVjdC5hdXRob3JGb250ID0gdGhpcy5hdXRob3Iuc2VyaWFsaXplRm9udCgpO1xuXHR0aGlzLmRhdGFPYmplY3QudGl0bGUgPSB0aGlzLnRpdGxlLnRvU3RyaW5nKCk7XG5cdHRoaXMuZGF0YU9iamVjdC50aXRsZUZvbnQgPSB0aGlzLnRpdGxlLnNlcmlhbGl6ZUZvbnQoKTtcblx0dGhpcy5kYXRhT2JqZWN0LnBvc194ID0gdGhpcy5wb3NpdGlvbi54O1xuXHR0aGlzLmRhdGFPYmplY3QucG9zX3kgPSB0aGlzLnBvc2l0aW9uLnk7XG5cdHRoaXMuZGF0YU9iamVjdC5wb3NfeiA9IHRoaXMucG9zaXRpb24uejtcblxuXHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEucG9zdEJvb2sodGhpcy5kYXRhT2JqZWN0LCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuXHRcdGlmKCFlcnIgJiYgcmVzdWx0KSB7XG5cdFx0XHRzY29wZS5kYXRhT2JqZWN0ID0gcmVzdWx0O1xuXHRcdFx0c2NvcGUuY2hhbmdlZCA9IGZhbHNlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvL1RPRE86IGhpZGUgZWRpdCwgbm90aWZ5IHVzZXJcblx0XHR9XG5cdH0pO1xufVxuVmlydHVhbEJvb2tzaGVsZi5Cb29rLnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24oKSB7XG5cdHZhciBzY29wZSA9IHRoaXM7XG5cdC8vVE9ETzogdXNlIGluIGNvbnN0cnVjdG9yIGluc3RlYWQgb2Ygc2VwYXJhdGUgaW1hZ2VzIGxvYWRpbmdcblx0c2NvcGUudGV4dHVyZS5sb2FkKHNjb3BlLmRhdGFPYmplY3QudGV4dHVyZSwgZmFsc2UsIGZ1bmN0aW9uICgpIHtcblx0XHRzY29wZS5jb3Zlci5sb2FkKHNjb3BlLmRhdGFPYmplY3QuY292ZXIsIHRydWUsIGZ1bmN0aW9uKCkge1xuXHRcdFx0c2NvcGUubW9kZWwgPSBzY29wZS5kYXRhT2JqZWN0Lm1vZGVsO1xuXHRcdFx0c2NvcGUuY292ZXIucGFyc2VQcm9wZXJ0aWVzKHNjb3BlLmRhdGFPYmplY3QuY292ZXJQb3MpO1xuXHRcdFx0c2NvcGUuYXV0aG9yLnNldFRleHQoc2NvcGUuZGF0YU9iamVjdC5hdXRob3IpO1xuXHRcdFx0c2NvcGUuYXV0aG9yLnBhcnNlUHJvcGVydGllcyhzY29wZS5kYXRhT2JqZWN0LmF1dGhvckZvbnQpO1xuXHRcdFx0c2NvcGUudGl0bGUuc2V0VGV4dChzY29wZS5kYXRhT2JqZWN0LnRpdGxlKTtcblx0XHRcdHNjb3BlLnRpdGxlLnBhcnNlUHJvcGVydGllcyhzY29wZS5kYXRhT2JqZWN0LnRpdGxlRm9udCk7XG5cblx0XHRcdHNjb3BlLnVwZGF0ZVRleHR1cmUoKTtcblx0XHR9KTtcblx0fSk7XG59XG5WaXJ0dWFsQm9va3NoZWxmLkJvb2sucHJvdG90eXBlLmNvcHlTdGF0ZSA9IGZ1bmN0aW9uKGJvb2spIHtcblx0aWYoYm9vayBpbnN0YW5jZW9mIFZpcnR1YWxCb29rc2hlbGYuQm9vaykge1xuXHRcdHZhciBmaWVsZHMgPSBbJ2RhdGFPYmplY3QnLCAncG9zaXRpb24nLCAncm90YXRpb24nLCAnbW9kZWwnLCAndGV4dHVyZScsICdjb3ZlcicsICdhdXRob3InLCAndGl0bGUnXTtcblx0XHRmb3IodmFyIGkgPSBmaWVsZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdHZhciBmaWVsZCA9IGZpZWxkc1tpXTtcblx0XHRcdHRoaXNbZmllbGRdID0gYm9va1tmaWVsZF07XG5cdFx0fTtcblxuXHRcdHRoaXMudXBkYXRlVGV4dHVyZSgpO1xuXHRcdGJvb2sucGFyZW50LmFkZCh0aGlzKTtcblx0XHRib29rLnBhcmVudC5yZW1vdmUoYm9vayk7XG5cdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3QgPSB0aGlzO1xuXHR9XG59XG5WaXJ0dWFsQm9va3NoZWxmLkJvb2sucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uKHBhcmVudCkge1xuXHRpZih0aGlzLnBhcmVudCAhPSBwYXJlbnQpIHtcblx0XHRpZihwYXJlbnQpIHtcblx0XHRcdHBhcmVudC5hZGQodGhpcyk7XG5cdFx0XHR0aGlzLmRhdGFPYmplY3Quc2hlbGZJZCA9IHBhcmVudC5pZDtcblx0XHRcdHRoaXMuZGF0YU9iamVjdC5zZWN0aW9uSWQgPSBwYXJlbnQucGFyZW50LmlkO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBhcmVudC5yZW1vdmUodGhpcyk7XG5cdFx0XHR0aGlzLmRhdGFPYmplY3Quc2hlbGZJZCA9IG51bGw7XG5cdFx0XHR0aGlzLmRhdGFPYmplY3Quc2VjdGlvbklkID0gbnVsbDtcblx0XHR9XG5cdH1cbn0iLCJWaXJ0dWFsQm9va3NoZWxmID0gVmlydHVhbEJvb2tzaGVsZiB8fCB7fTtcblxuVmlydHVhbEJvb2tzaGVsZi5DYW1lcmEgPSBWaXJ0dWFsQm9va3NoZWxmLkNhbWVyYSB8fCB7XG5cdEhFSUdUSDogMS41LFxuXHRvYmplY3Q6IG5ldyBWaXJ0dWFsQm9va3NoZWxmLkNhbWVyYU9iamVjdCgpLFxuXHRzZXRQYXJlbnQ6IGZ1bmN0aW9uKHBhcmVudCkge1xuXHRcdHBhcmVudC5hZGQodGhpcy5vYmplY3QpO1xuXHR9LFxuXHRnZXRQb3NpdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMub2JqZWN0LnBvc2l0aW9uO1xuXHR9XG59O1xuXG5WaXJ0dWFsQm9va3NoZWxmLkNhbWVyYS5pbml0ID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuXHRWaXJ0dWFsQm9va3NoZWxmLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg0NSwgd2lkdGggLyBoZWlnaHQsIDAuMDEsIDUwKTtcblx0dGhpcy5vYmplY3QucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygwLCBWaXJ0dWFsQm9va3NoZWxmLkNhbWVyYS5IRUlHVEgsIDApO1xuXHR0aGlzLm9iamVjdC5yb3RhdGlvbi5vcmRlciA9ICdZWFonO1xuXG5cdHZhciBjYW5kbGUgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDY2NTU1NSwgMS42LCAxMCk7XG5cdGNhbmRsZS5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG5cdHRoaXMub2JqZWN0LmFkZChjYW5kbGUpO1xuXG5cdHRoaXMub2JqZWN0LmFkZChWaXJ0dWFsQm9va3NoZWxmLmNhbWVyYSk7XG59XG5cblZpcnR1YWxCb29rc2hlbGYuQ2FtZXJhLnJvdGF0ZSA9IGZ1bmN0aW9uKHgsIHkpIHtcblx0dmFyIG5ld1ggPSB0aGlzLm9iamVjdC5yb3RhdGlvbi54ICsgeSAqIDAuMDAwMSB8fCAwO1xuXHR2YXIgbmV3WSA9IHRoaXMub2JqZWN0LnJvdGF0aW9uLnkgKyB4ICogMC4wMDAxIHx8IDA7XG5cblx0aWYobmV3WCA8IDEuNTcgJiYgbmV3WCA+IC0xLjU3KSB7XHRcblx0XHR0aGlzLm9iamVjdC5yb3RhdGlvbi54ID0gbmV3WDtcblx0fVxuXG5cdHRoaXMub2JqZWN0LnJvdGF0aW9uLnkgPSBuZXdZO1xufVxuXG5WaXJ0dWFsQm9va3NoZWxmLkNhbWVyYS5nbyA9IGZ1bmN0aW9uKHNwZWVkKSB7XG5cdHZhciBkaXJlY3Rpb24gPSB0aGlzLmdldFZlY3RvcigpO1xuXHR2YXIgbmV3UG9zaXRpb24gPSB0aGlzLm9iamVjdC5wb3NpdGlvbi5jbG9uZSgpO1xuXHRuZXdQb3NpdGlvbi5hZGQoZGlyZWN0aW9uLm11bHRpcGx5U2NhbGFyKHNwZWVkKSk7XG5cblx0dGhpcy5vYmplY3QubW92ZShuZXdQb3NpdGlvbik7XG59XG5cblZpcnR1YWxCb29rc2hlbGYuQ2FtZXJhLmdldFZlY3RvciA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEpO1xuXG5cdHJldHVybiB2ZWN0b3IuYXBwbHlFdWxlcih0aGlzLm9iamVjdC5yb3RhdGlvbik7XG59IiwiVmlydHVhbEJvb2tzaGVsZi5Db250cm9scyA9IFZpcnR1YWxCb29rc2hlbGYuQ29udHJvbHMgfHwge307XG5cblZpcnR1YWxCb29rc2hlbGYuQ29udHJvbHMuQlVUVE9OU19ST1RBVEVfU1BFRUQgPSAxMDA7XG5WaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLkJVVFRPTlNfR09fU1BFRUQgPSAwLjAyO1xuXG5WaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLnN0YXRlID0ge1xuXHRmb3J3YXJkOiBmYWxzZSxcblx0YmFja3dhcmQ6IGZhbHNlLFxuXHRsZWZ0OiBmYWxzZSxcblx0cmlnaHQ6IGZhbHNlXG59XG5cblZpcnR1YWxCb29rc2hlbGYuQ29udHJvbHMuUG9ja2V0ID0ge1xuXHRfYm9va3M6IHt9LFxuXG5cdHNlbGVjdE9iamVjdDogZnVuY3Rpb24odGFyZ2V0KSB7XG5cdFx0dmFyIFxuXHRcdFx0ZGF0YU9iamVjdCA9IHRoaXMuX2Jvb2tzW3RhcmdldC52YWx1ZV1cblxuXHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5jcmVhdGVCb29rKGRhdGFPYmplY3QsIGZ1bmN0aW9uIChib29rLCBkYXRhT2JqZWN0KSB7XG5cdFx0XHRWaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLlBvY2tldC5yZW1vdmUoZGF0YU9iamVjdC5pZCk7XG5cdFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLnNlbGVjdChib29rLCBudWxsKTtcblx0XHRcdC8vIGJvb2suY2hhbmdlZCA9IHRydWU7XG5cdFx0fSk7XG5cdH0sXG5cdHJlbW92ZTogZnVuY3Rpb24oaWQpIHtcblx0XHR0aGlzLl9ib29rc1tpZF0gPSBudWxsO1xuXHRcdGRlbGV0ZSB0aGlzLl9ib29rc1tpZF07XG5cdH0sXG5cdHB1dDogZnVuY3Rpb24oZGF0YU9iamVjdCkge1xuXHRcdHRoaXMuX2Jvb2tzW2RhdGFPYmplY3QuaWRdID0gZGF0YU9iamVjdDtcblx0fSxcblx0Z2V0Qm9va3M6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLl9ib29rcztcblx0fSxcblx0aXNFbXB0eTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2Jvb2tzLmxlbmd0aCA9PSAwO1xuXHR9XG59O1xuXG5WaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkID0ge1xuXHRvYmplY3Q6IG51bGwsXG5cdHBhcmVudDogbnVsbCxcblx0Z2V0dGVkOiBudWxsLFxuXHRwb2ludDogbnVsbCxcblxuXHRpc0Jvb2s6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm9iamVjdCBpbnN0YW5jZW9mIFZpcnR1YWxCb29rc2hlbGYuQm9vaztcblx0fSxcblx0aXNTZWN0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5vYmplY3QgaW5zdGFuY2VvZiBWaXJ0dWFsQm9va3NoZWxmLlNlY3Rpb247XG5cdH0sXG5cdGlzTW92YWJsZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5pc0Jvb2soKSB8fCB0aGlzLmlzU2VjdGlvbigpKTtcblx0fSxcblx0aXNSb3RhdGFibGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBCb29sZWFuKHRoaXMuaXNTZWN0aW9uKCkpO1xuXHR9LFxuXHRjbGVhcjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5vYmplY3QgPSBudWxsO1xuXHRcdHRoaXMuZ2V0dGVkID0gbnVsbDtcblx0XHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLnJlZnJlc2goKTsvL1RPRE86IHJlc2VhcmNoIGZvciByZW1vdmVcblx0fSxcblx0c2VsZWN0OiBmdW5jdGlvbihvYmplY3QsIHBvaW50KSB7XG5cdFx0dGhpcy5jbGVhcigpO1xuXG5cdFx0dGhpcy5vYmplY3QgPSBvYmplY3Q7XG5cdFx0dGhpcy5wb2ludCA9IHBvaW50O1xuXG5cdFx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5yZWZyZXNoKCk7XG5cdH0sXG5cdHJlbGVhc2U6IGZ1bmN0aW9uKCkge1xuXHRcdGlmKHRoaXMuaXNCb29rKCkgJiYgIXRoaXMub2JqZWN0LnBhcmVudCkge1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5Qb2NrZXQucHV0KHRoaXMub2JqZWN0LmRhdGFPYmplY3QpO1xuXHRcdFx0dGhpcy5jbGVhcigpO1xuXHRcdH1cblxuXHRcdHRoaXMuc2F2ZSgpO1xuXHRcdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkucmVmcmVzaCgpO1xuXHR9LFxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdGlmKHRoaXMuaXNCb29rKCkgJiYgIXRoaXMuaXNHZXR0ZWQoKSkge1xuXHRcdFx0dGhpcy5nZXR0ZWQgPSB0cnVlO1xuXHRcdFx0dGhpcy5wYXJlbnQgPSB0aGlzLm9iamVjdC5wYXJlbnQ7XG5cdFx0XHR0aGlzLm9iamVjdC5wb3NpdGlvbi5zZXQoMCwgMCwgLXRoaXMub2JqZWN0Lmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC56IC0gMC4yNSk7XG5cdFx0XHRWaXJ0dWFsQm9va3NoZWxmLmNhbWVyYS5hZGQodGhpcy5vYmplY3QpO1x0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnB1dCgpO1xuXHRcdH1cblx0fSxcblx0cHV0OiBmdW5jdGlvbigpIHtcblx0XHRpZih0aGlzLmlzR2V0dGVkKCkpIHtcblx0XHRcdHRoaXMucGFyZW50LmFkZCh0aGlzLm9iamVjdCk7XG5cdFx0XHR0aGlzLm9iamVjdC5yZWxvYWQoKTsvL3Bvc2l0aW9uXG5cdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0fVxuXHR9LFxuXHRpc0dldHRlZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuaXNCb29rKCkgJiYgdGhpcy5nZXR0ZWQ7XG5cdH0sXG5cdHNhdmU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmKHRoaXMuaXNNb3ZhYmxlKCkgJiYgdGhpcy5vYmplY3QuY2hhbmdlZCkge1xuXHRcdFx0dGhpcy5vYmplY3Quc2F2ZSgpO1xuXHRcdH1cblx0fVxufTtcblxuVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5tb3VzZSA9IHtcblx0d2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuXHRoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcblx0dGFyZ2V0OiBudWxsLFxuXHR4OiBudWxsLFxuXHR5OiBudWxsLFxuXHRkWDogbnVsbCxcblx0ZFk6IG51bGwsXG5cdGxvbmdYOiBudWxsLFxuXHRsb25nWTogbnVsbCxcblxuXHRkb3duOiBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKGV2ZW50KSB7XG5cdFx0XHR0aGlzW2V2ZW50LndoaWNoXSA9IHRydWU7XG5cdFx0XHR0aGlzLnRhcmdldCA9IGV2ZW50LnRhcmdldDtcblx0XHRcdHRoaXMueCA9IGV2ZW50Lng7XG5cdFx0XHR0aGlzLnkgPSBldmVudC55O1xuXHRcdFx0dGhpcy5sb25nWCA9IHRoaXMud2lkdGggKiAwLjUgLSB0aGlzLng7XG5cdFx0XHR0aGlzLmxvbmdZID0gdGhpcy5oZWlnaHQgKiAwLjUgLSB0aGlzLnk7XG5cdFx0fVxuXHR9LFxuXHR1cDogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZihldmVudCkge1xuXHRcdFx0dGhpc1tldmVudC53aGljaF0gPSBmYWxzZTtcblx0XHRcdHRoaXNbMV0gPSBmYWxzZTsgLy8gbGludXggY2hyb21lIGJ1ZyBmaXggKHdoZW4gYm90aCBrZXlzIHJlbGVhc2UgdGhlbiBib3RoIGV2ZW50LndoaWNoIGVxdWFsIDMpXG5cdFx0fVxuXHR9LFxuXHRtb3ZlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKGV2ZW50KSB7XG5cdFx0XHR0aGlzLnRhcmdldCA9IGV2ZW50LnRhcmdldDtcblx0XHRcdHRoaXMubG9uZ1ggPSB0aGlzLndpZHRoICogMC41IC0gdGhpcy54O1xuXHRcdFx0dGhpcy5sb25nWSA9IHRoaXMuaGVpZ2h0ICogMC41IC0gdGhpcy55O1xuXHRcdFx0dGhpcy5kWCA9IGV2ZW50LnggLSB0aGlzLng7XG5cdFx0XHR0aGlzLmRZID0gZXZlbnQueSAtIHRoaXMueTtcblx0XHRcdHRoaXMueCA9IGV2ZW50Lng7XG5cdFx0XHR0aGlzLnkgPSBldmVudC55O1xuXHRcdH1cblx0fSxcblx0Z2V0VmVjdG9yOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgcHJvamVjdG9yID0gbmV3IFRIUkVFLlByb2plY3RvcigpO1xuXHRcdHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygodGhpcy54IC8gdGhpcy53aWR0aCkgKiAyIC0gMSwgLSAodGhpcy55IC8gdGhpcy5oZWlnaHQpICogMiArIDEsIDAuNSk7XG5cdFx0cHJvamVjdG9yLnVucHJvamVjdFZlY3Rvcih2ZWN0b3IsIFZpcnR1YWxCb29rc2hlbGYuY2FtZXJhKTtcblx0XG5cdFx0cmV0dXJuIHZlY3Rvci5zdWIoVmlydHVhbEJvb2tzaGVsZi5DYW1lcmEuZ2V0UG9zaXRpb24oKSkubm9ybWFsaXplKCk7XG5cdH0sXG5cdGlzQ2FudmFzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy50YXJnZXQgPT0gVmlydHVhbEJvb2tzaGVsZi5jYW52YXMgfHwgKHRoaXMudGFyZ2V0ICYmIHRoaXMudGFyZ2V0LmNsYXNzTmFtZSA9PSAndWknKTtcblx0fSxcblx0aXNQb2NrZXRCb29rOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gISEodGhpcy50YXJnZXQgJiYgdGhpcy50YXJnZXQucGFyZW50Tm9kZSA9PSBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuaW52ZW50b3J5LmJvb2tzKTtcblx0fSxcblx0Z2V0SW50ZXJzZWN0ZWQ6IGZ1bmN0aW9uKG9iamVjdHMsIHJlY3Vyc2l2ZSwgc2VhcmNoRm9yKSB7XG5cdFx0dmFyXG5cdFx0XHR2ZWN0b3IsXG5cdFx0XHRyYXljYXN0ZXIsXG5cdFx0XHRpbnRlcnNlY3RzLFxuXHRcdFx0aW50ZXJzZWN0ZWQsXG5cdFx0XHRyZXN1bHQsXG5cdFx0XHRpLCBqO1xuXG5cdFx0cmVzdWx0ID0gbnVsbDtcblx0XHR2ZWN0b3IgPSB0aGlzLmdldFZlY3RvcigpO1xuXHRcdHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIoVmlydHVhbEJvb2tzaGVsZi5DYW1lcmEuZ2V0UG9zaXRpb24oKSwgdmVjdG9yKTtcblx0XHRpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMob2JqZWN0cywgcmVjdXJzaXZlKTtcblxuXHRcdGlmKHNlYXJjaEZvcikge1xuXHRcdFx0aWYoaW50ZXJzZWN0cy5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgaW50ZXJzZWN0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGludGVyc2VjdGVkID0gaW50ZXJzZWN0c1tpXTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRmb3IoaiA9IHNlYXJjaEZvci5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuXHRcdFx0XHRcdFx0aWYoaW50ZXJzZWN0ZWQub2JqZWN0IGluc3RhbmNlb2Ygc2VhcmNoRm9yW2pdKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3VsdCA9IGludGVyc2VjdGVkO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihyZXN1bHQpIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0gaW50ZXJzZWN0cztcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59O1xuXG5WaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLmluaXQgPSBmdW5jdGlvbigpIHtcblx0VmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5jbGVhcigpO1xuXHRWaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLmluaXRMaXN0ZW5lcnMoKTtcbn1cblxuVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5pbml0TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5vbkRibENsaWNrLCBmYWxzZSk7XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIFZpcnR1YWxCb29rc2hlbGYuQ29udHJvbHMub25Nb3VzZURvd24sIGZhbHNlKTtcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIFZpcnR1YWxCb29rc2hlbGYuQ29udHJvbHMub25Nb3VzZVVwLCBmYWxzZSk7XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIFZpcnR1YWxCb29rc2hlbGYuQ29udHJvbHMub25Nb3VzZU1vdmUsIGZhbHNlKTtcdFxuXHRkb2N1bWVudC5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24oKSB7cmV0dXJuIGZhbHNlO31cbn1cblxuVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5jbGVhciA9IGZ1bmN0aW9uKCkge1xuXHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmNsZWFyKCk7XHRcbn1cblxuVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy51cGRhdGUgPSBmdW5jdGlvbigpIHtcblx0dmFyIG1vdXNlID0gVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5tb3VzZTsgXG5cblx0aWYoIVZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNHZXR0ZWQoKSkge1xuXHRcdGlmKG1vdXNlWzNdKSB7XG5cdFx0XHRWaXJ0dWFsQm9va3NoZWxmLkNhbWVyYS5yb3RhdGUobW91c2UubG9uZ1gsIG1vdXNlLmxvbmdZKTtcblx0XHR9XG5cblx0XHRpZigobW91c2VbMV0gJiYgbW91c2VbM10pIHx8IHRoaXMuc3RhdGUuZm9yd2FyZCkge1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5DYW1lcmEuZ28odGhpcy5CVVRUT05TX0dPX1NQRUVEKTtcblx0XHR9IGVsc2UgaWYodGhpcy5zdGF0ZS5iYWNrd2FyZCkge1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5DYW1lcmEuZ28oLXRoaXMuQlVUVE9OU19HT19TUEVFRCk7XG5cdFx0fSBlbHNlIGlmKHRoaXMuc3RhdGUubGVmdCkge1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5DYW1lcmEucm90YXRlKHRoaXMuQlVUVE9OU19ST1RBVEVfU1BFRUQsIDApO1xuXHRcdH0gZWxzZSBpZih0aGlzLnN0YXRlLnJpZ2h0KSB7XG5cdFx0XHRWaXJ0dWFsQm9va3NoZWxmLkNhbWVyYS5yb3RhdGUoLXRoaXMuQlVUVE9OU19ST1RBVEVfU1BFRUQsIDApO1xuXHRcdH1cblx0fVxufVxuXG4vLyBFdmVudHNcblxuVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5vbkRibENsaWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0aWYoVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5tb3VzZS5pc0NhbnZhcygpKSB7XG5cdFx0c3dpdGNoKGV2ZW50LndoaWNoKSB7XG5cdFx0XHRjYXNlIDE6IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuZ2V0KCk7IGJyZWFrO1xuXHRcdH0gICBcdFxuXHR9XG59XG5cblZpcnR1YWxCb29rc2hlbGYuQ29udHJvbHMub25Nb3VzZURvd24gPSBmdW5jdGlvbihldmVudCkge1xuXHR2YXIgbW91c2UgPSBWaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLm1vdXNlOyBcblx0bW91c2UuZG93bihldmVudCk7IFxuXG5cdGlmKG1vdXNlLmlzQ2FudmFzKCkgfHwgbW91c2UuaXNQb2NrZXRCb29rKCkpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0aWYobW91c2VbMV0gJiYgIW1vdXNlWzNdICYmICFWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzR2V0dGVkKCkpIHtcblx0XHRcdGlmKG1vdXNlLmlzQ2FudmFzKCkpIHtcblx0XHRcdFx0VmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5zZWxlY3RPYmplY3QoKTtcblx0XHRcdH0gZWxzZSBpZihtb3VzZS5pc1BvY2tldEJvb2soKSkge1xuXHRcdFx0XHRWaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLlBvY2tldC5zZWxlY3RPYmplY3QobW91c2UudGFyZ2V0KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5vbk1vdXNlVXAgPSBmdW5jdGlvbihldmVudCkge1xuXHRWaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLm1vdXNlLnVwKGV2ZW50KTtcblx0XG5cdHN3aXRjaChldmVudC53aGljaCkge1xuXHRcdCBjYXNlIDE6IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQucmVsZWFzZSgpOyBicmVhaztcblx0fVxufVxuXG5WaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLm9uTW91c2VNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0dmFyIG1vdXNlID0gVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5tb3VzZTsgXG5cdG1vdXNlLm1vdmUoZXZlbnQpO1xuXG5cdGlmKG1vdXNlLmlzQ2FudmFzKCkpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdCBcdGlmKCFWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzR2V0dGVkKCkpIHtcblx0XHRcdGlmKG1vdXNlWzFdICYmICFtb3VzZVszXSkge1x0XHRcblx0XHRcdFx0VmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5tb3ZlT2JqZWN0KCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBvYmogPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcblxuXHRcdFx0aWYob2JqIGluc3RhbmNlb2YgVmlydHVhbEJvb2tzaGVsZi5Cb29rKSB7XG5cdFx0XHRcdGlmKG1vdXNlWzFdKSB7XG5cdFx0XHRcdFx0b2JqLm1vdmVFbGVtZW50KG1vdXNlLmRYLCBtb3VzZS5kWSwgVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdGVkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihtb3VzZVsyXSAmJiBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5lZGl0ZWQgPT0gJ2NvdmVyJykge1xuXHRcdFx0IFx0XHRvYmouc2NhbGVFbGVtZW50KG1vdXNlLmRYLCBtb3VzZS5kWSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobW91c2VbM10pIHtcblx0XHRcdCBcdFx0b2JqLnJvdGF0ZShtb3VzZS5kWCwgbW91c2UuZFksIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IFxuXHRcdH1cblx0fVxufTtcblxuLy8qKioqXG5cblZpcnR1YWxCb29rc2hlbGYuQ29udHJvbHMuc2VsZWN0T2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdHZhclxuXHRcdGludGVyc2VjdGVkLFxuXHRcdG9iamVjdCxcblx0XHRwb2ludDtcblxuXHRpZihWaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLm1vdXNlLmlzQ2FudmFzKCkgJiYgVmlydHVhbEJvb2tzaGVsZi5saWJyYXJ5KSB7XG5cdFx0aW50ZXJzZWN0ZWQgPSBWaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLm1vdXNlLmdldEludGVyc2VjdGVkKFZpcnR1YWxCb29rc2hlbGYubGlicmFyeS5jaGlsZHJlbiwgdHJ1ZSwgW1ZpcnR1YWxCb29rc2hlbGYuU2VjdGlvbiwgVmlydHVhbEJvb2tzaGVsZi5Cb29rXSk7XG5cdFx0aWYoaW50ZXJzZWN0ZWQpIHtcblx0XHRcdG9iamVjdCA9IGludGVyc2VjdGVkLm9iamVjdDtcblx0XHRcdHBvaW50ID0gaW50ZXJzZWN0ZWQucG9pbnQ7IFxuXHRcdH1cblxuXHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuc2VsZWN0KG9iamVjdCwgcG9pbnQpO1xuXHR9XG59O1xuXG5WaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLm1vdmVPYmplY3QgPSBmdW5jdGlvbigpIHtcblx0dmFyIFxuXHRcdG1vdXNlVmVjdG9yLFxuXHRcdG5ld1Bvc2l0aW9uLFxuXHRcdGludGVyc2VjdGVkLFxuXHRcdHBhcmVudCxcblx0XHRvbGRQYXJlbnQ7XG5cblx0aWYoVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc0Jvb2soKSB8fCAoVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc1NlY3Rpb24oKSAmJiBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuc2VjdGlvbk1lbnUuaXNNb3ZlT3B0aW9uKCkpKSB7XG5cdFx0bW91c2VWZWN0b3IgPSBWaXJ0dWFsQm9va3NoZWxmLkNhbWVyYS5nZXRWZWN0b3IoKTtcdFxuXHRcdG5ld1Bvc2l0aW9uID0gVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3QucG9zaXRpb24uY2xvbmUoKTtcblx0XHRvbGRQYXJlbnQgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdC5wYXJlbnQ7XG5cblx0XHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG5cdFx0XHRpbnRlcnNlY3RlZCA9IFZpcnR1YWxCb29rc2hlbGYuQ29udHJvbHMubW91c2UuZ2V0SW50ZXJzZWN0ZWQoVmlydHVhbEJvb2tzaGVsZi5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbVmlydHVhbEJvb2tzaGVsZi5TaGVsZl0pO1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3Quc2V0UGFyZW50KGludGVyc2VjdGVkID8gaW50ZXJzZWN0ZWQub2JqZWN0IDogbnVsbCk7XG5cdFx0fVxuXG5cdFx0cGFyZW50ID0gVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3QucGFyZW50O1xuXHRcdGlmKHBhcmVudCkge1xuXHRcdFx0cGFyZW50LmxvY2FsVG9Xb3JsZChuZXdQb3NpdGlvbik7XG5cblx0XHRcdG5ld1Bvc2l0aW9uLnggLT0gKG1vdXNlVmVjdG9yLnogKiBWaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLm1vdXNlLmRYICsgbW91c2VWZWN0b3IueCAqIFZpcnR1YWxCb29rc2hlbGYuQ29udHJvbHMubW91c2UuZFkpICogMC4wMDM7XG5cdFx0XHRuZXdQb3NpdGlvbi56IC09ICgtbW91c2VWZWN0b3IueCAqIFZpcnR1YWxCb29rc2hlbGYuQ29udHJvbHMubW91c2UuZFggKyBtb3VzZVZlY3Rvci56ICogVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5tb3VzZS5kWSkgKiAwLjAwMztcblxuXHRcdFx0cGFyZW50LndvcmxkVG9Mb2NhbChuZXdQb3NpdGlvbik7XG5cdFx0XHRpZighVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3QubW92ZShuZXdQb3NpdGlvbikgJiYgVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc0Jvb2soKSkge1xuXHRcdFx0XHRpZihwYXJlbnQgIT09IG9sZFBhcmVudCkge1xuXHRcdFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0LnNldFBhcmVudChvbGRQYXJlbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2UgaWYoVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LnNlY3Rpb25NZW51LmlzUm90YXRlT3B0aW9uKCkgJiYgVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc1NlY3Rpb24oKSkge1xuXHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0LnJvdGF0ZShWaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLm1vdXNlLmRYKTtcdFx0XHRcblx0fVxufTtcblxuVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5nb1N0b3AgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zdGF0ZS5mb3J3YXJkID0gZmFsc2U7XG5cdHRoaXMuc3RhdGUuYmFja3dhcmQgPSBmYWxzZTtcblx0dGhpcy5zdGF0ZS5sZWZ0ID0gZmFsc2U7XG5cdHRoaXMuc3RhdGUucmlnaHQgPSBmYWxzZTtcbn1cblxuVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5nb0ZvcndhcmQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zdGF0ZS5mb3J3YXJkID0gdHJ1ZTtcbn1cblxuVmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5nb0JhY2t3YXJkID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc3RhdGUuYmFja3dhcmQgPSB0cnVlO1xufVxuXG5WaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLmdvTGVmdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnN0YXRlLmxlZnQgPSB0cnVlO1xufVxuXG5WaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLmdvUmlnaHQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zdGF0ZS5yaWdodCA9IHRydWU7XG59IiwiVmlydHVhbEJvb2tzaGVsZi5EYXRhID0gVmlydHVhbEJvb2tzaGVsZi5EYXRhIHx8IHt9O1xuXG5WaXJ0dWFsQm9va3NoZWxmLkRhdGEuaW5pdCA9IGZ1bmN0aW9uKCRodHRwKSB7XG5cdFZpcnR1YWxCb29rc2hlbGYuRGF0YS4kaHR0cCA9ICRodHRwO1xuXHRcblx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLmdldFVzZXIgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvdXNlcicpO1xuXHR9XG5cblx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLmdldFVzZXJCb29rcyA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9mcmVlQm9va3MvJyArIHVzZXJJZClcblx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdFx0fSk7XG5cdH1cblxuXHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEucG9zdEJvb2sgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9ib29rJywgYm9vayk7XG5cdH1cblxuXHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEuZGVsZXRlQm9vayA9IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRyZXR1cm4gJGh0dHAoe1xuXHRcdFx0bWV0aG9kOiAnREVMRVRFJyxcblx0XHRcdHVybDogJy9ib29rJyxcblx0XHRcdGRhdGE6IGJvb2ssXG5cdFx0XHRoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnfVxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIFZpcnR1YWxCb29rc2hlbGYuRGF0YTtcbn07XG5cblZpcnR1YWxCb29rc2hlbGYuRGF0YS5URVhUVVJFX1JFU09MVVRJT04gPSA1MTI7XG5WaXJ0dWFsQm9va3NoZWxmLkRhdGEuQ09WRVJfTUFYX1kgPSAzOTQ7XG5WaXJ0dWFsQm9va3NoZWxmLkRhdGEuQ09WRVJfRkFDRV9YID0gMjk2O1xuXG5WaXJ0dWFsQm9va3NoZWxmLkRhdGEuYWpheCA9IGZ1bmN0aW9uKHVybEFycmF5LCB0eXBlLCBkb25lLCBkYXRhLCBjb250ZW50KSB7XG5cdHZhciB1cmwgPSB1cmxBcnJheS5qb2luKCcvJyk7XG5cblx0dGhpcy4kaHR0cCh7XG5cdFx0bWV0aG9kOiB0eXBlLFxuXHRcdHVybDogdXJsLFxuXHRcdGRhdGE6IGRhdGFcblx0fSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xuXHRcdGNvbnNvbGUubG9nKCdEYXRhIHJlc3VsdDogJywgdHlwZSwgdXJsKTtcbiAgICBcdGRvbmUobnVsbCwgZGF0YSk7XG5cdH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRGF0YSBlcnJvcjogJywgdHlwZSwgdXJsLCBkYXRhKTtcblx0XHRkb25lKGRhdGEsIG51bGwpO1xuXHR9KTtcbn1cblxuVmlydHVhbEJvb2tzaGVsZi5EYXRhLmdldFVJRGF0YSA9IGZ1bmN0aW9uKGRvbmUpIHtcblx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLmdldERhdGEoJy9vYmovZGF0YS5qc29uJywgZG9uZSk7XG59XG5cblZpcnR1YWxCb29rc2hlbGYuRGF0YS5nZXRMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeUlkLCBkb25lKSB7XG5cdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5hamF4KFsnL2xpYnJhcnknLCBsaWJyYXJ5SWRdLCAnR0VUJywgZG9uZSk7XG59XG5cblZpcnR1YWxCb29rc2hlbGYuRGF0YS5nZXRMaWJyYXJpZXMgPSBmdW5jdGlvbihkb25lKSB7XG5cdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5hamF4KFsnL2xpYnJhcmllcyddLCAnR0VUJywgZG9uZSk7XG59XG5cblZpcnR1YWxCb29rc2hlbGYuRGF0YS5wb3N0TGlicmFyeSA9IGZ1bmN0aW9uKGxpYnJhcnlNb2RlbCwgZG9uZSkge1xuXHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEuYWpheChbJy9saWJyYXJ5JywgbGlicmFyeU1vZGVsXSwgJ1BPU1QnLCBkb25lKTtcbn1cblxuVmlydHVhbEJvb2tzaGVsZi5EYXRhLmdldFNlY3Rpb25zID0gZnVuY3Rpb24obGlicmFyeUlkLCBkb25lKSB7XG5cdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5hamF4KFsnL3NlY3Rpb25zJywgbGlicmFyeUlkXSwgJ0dFVCcsIGRvbmUpO1xufVxuXG5WaXJ0dWFsQm9va3NoZWxmLkRhdGEucG9zdFNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uRGF0YSwgZG9uZSkge1xuXHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEuYWpheChbJy9zZWN0aW9uJ10gLCAnUE9TVCcsIGRvbmUsIHNlY3Rpb25EYXRhKTtcbn1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5EYXRhLnBvc3RCb29rID0gZnVuY3Rpb24oYm9vaywgZG9uZSkge1xuLy8gXHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEuYWpheChbJy9ib29rJ10sICdQT1NUJywgZG9uZSwgYm9vayk7XG4vLyB9XG5cblZpcnR1YWxCb29rc2hlbGYuRGF0YS5nZXRCb29rcyA9IGZ1bmN0aW9uKHNlY3Rpb25JZCwgZG9uZSkge1xuXHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEuYWpheChbJy9ib29rcycsIHNlY3Rpb25JZF0sICdHRVQnLCBkb25lKTtcbn1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5EYXRhLmdldEZyZWVCb29rcyA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuLy8gXHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEuYWpheChbJy9mcmVlQm9va3MnLCB1c2VySWRdLCAnR0VUJywgZG9uZSk7XG4vLyB9XG5cblZpcnR1YWxCb29rc2hlbGYuRGF0YS5sb2FkR2VvbWV0cnkgPSBmdW5jdGlvbihsaW5rLCBkb25lKSB7XG5cdHZhciBqc29uTG9hZGVyID0gbmV3IFRIUkVFLkpTT05Mb2FkZXIoKTtcblx0anNvbkxvYWRlci5sb2FkKGxpbmssIGZ1bmN0aW9uIChnZW9tZXRyeSkge1xuXHRcdGRvbmUoZ2VvbWV0cnkpO1xuXHR9KTtcbn1cblxuVmlydHVhbEJvb2tzaGVsZi5EYXRhLmxvYWRPYmplY3QgPSBmdW5jdGlvbihtb2RlbFVybCwgbWFwVXJsLCBkb25lKSB7XG5cdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5sb2FkR2VvbWV0cnkobW9kZWxVcmwsIGZ1bmN0aW9uIChnZW9tZXRyeSkge1xuXHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5nZXRJbWFnZShtYXBVcmwsIGZ1bmN0aW9uIChlcnIsIG1hcEltYWdlKSB7XG5cdCAgICBcdGRvbmUoZ2VvbWV0cnksIG1hcEltYWdlKTtcblx0ICAgIH0pO1xuXHR9KTtcbn07XG5cblZpcnR1YWxCb29rc2hlbGYuRGF0YS5jcmVhdGVCb29rID0gZnVuY3Rpb24oZGF0YU9iamVjdCwgZG9uZSkge1xuXHR2YXIgbW9kZWxQYXRoID0gJy9vYmovYm9va3Mve21vZGVsfS9tb2RlbC5qcycucmVwbGFjZSgne21vZGVsfScsIGRhdGFPYmplY3QubW9kZWwpO1xuXG5cdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5sb2FkR2VvbWV0cnkobW9kZWxQYXRoLCBmdW5jdGlvbiAoZ2VvbWV0cnkpIHtcblx0XHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdFx0dmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShjYW52YXMpO1xuXHQgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHttYXA6IHRleHR1cmV9KTtcblx0XHR2YXIgYm9vayA9IG5ldyBWaXJ0dWFsQm9va3NoZWxmLkJvb2soZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuXHRcdGNhbnZhcy53aWR0aCA9IGNhbnZhcy5oZWlnaHQgPSBWaXJ0dWFsQm9va3NoZWxmLkRhdGEuVEVYVFVSRV9SRVNPTFVUSU9OO1xuXHRcdGJvb2sudGV4dHVyZS5sb2FkKGRhdGFPYmplY3QudGV4dHVyZSwgZmFsc2UsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGJvb2suY292ZXIubG9hZChkYXRhT2JqZWN0LmNvdmVyLCB0cnVlLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGJvb2sudXBkYXRlVGV4dHVyZSgpO1xuXHRcdFx0XHRkb25lKGJvb2ssIGRhdGFPYmplY3QpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0pO1xufTtcblxuVmlydHVhbEJvb2tzaGVsZi5EYXRhLmxvYWRTZWN0aW9uID0gZnVuY3Rpb24oZGF0YU9iamVjdCwgZG9uZSkge1xuXHR2YXIgcGF0aCA9ICcvb2JqL3NlY3Rpb25zL3ttb2RlbH0vJy5yZXBsYWNlKCd7bW9kZWx9JywgZGF0YU9iamVjdC5tb2RlbCk7XG5cdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5sb2FkT2JqZWN0KHBhdGggKyAnbW9kZWwuanMnLCBwYXRoICsgJ21hcC5qcGcnLCBmdW5jdGlvbiAoZ2VvbWV0cnksIG1hcEltYWdlKSB7XG5cdFx0dmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShtYXBJbWFnZSk7XG5cdFx0dGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cblx0XHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEuZ2V0RGF0YShwYXRoICsgJ2RhdGEuanNvbicsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcblx0XHRcdGRhdGFPYmplY3QuZGF0YSA9IGRhdGE7XG5cdFx0XHRkb25lKGRhdGFPYmplY3QsIGdlb21ldHJ5LCBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe21hcDogdGV4dHVyZX0pKTtcblx0XHR9KTsgICBcblx0fSk7XG59O1xuXG5WaXJ0dWFsQm9va3NoZWxmLkRhdGEubG9hZExpYnJhcnkgPSBmdW5jdGlvbihkYXRhT2JqZWN0LCBkb25lKSB7XG5cdHZhciBwYXRoID0gJy9vYmovbGlicmFyaWVzL3ttb2RlbH0vJy5yZXBsYWNlKCd7bW9kZWx9JywgZGF0YU9iamVjdC5tb2RlbCk7XG5cdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5sb2FkT2JqZWN0KHBhdGggKyAnbW9kZWwuanNvbicsIHBhdGggKyAnbWFwLmpwZycsIGZ1bmN0aW9uIChnZW9tZXRyeSwgbWFwSW1hZ2UpIHtcblx0XHR2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKG1hcEltYWdlKTtcblx0XHR0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuXHRcdGRvbmUoZGF0YU9iamVjdCwgZ2VvbWV0cnksIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7bWFwOiB0ZXh0dXJlfSkpO1xuXHR9KTtcbn1cblxuVmlydHVhbEJvb2tzaGVsZi5EYXRhLmdldERhdGEgPSBmdW5jdGlvbih1cmwsIGRvbmUpIHtcblx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLmFqYXgoW3VybF0sICdHRVQnLCBkb25lKTtcbn1cblxuVmlydHVhbEJvb2tzaGVsZi5EYXRhLnB1dFNlY3Rpb25zID0gZnVuY3Rpb24oc2VjdGlvbnMsIGRvbmUpIHtcblx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLmFqYXgoWycvc2VjdGlvbnMnXSwgJ1BVVCcsIGRvbmUsIHNlY3Rpb25zKTtcbn1cblxuVmlydHVhbEJvb2tzaGVsZi5EYXRhLnBvc3RGZWVkYmFjayA9IGZ1bmN0aW9uKGRhdGFPYmplY3QsIGRvbmUpIHtcblx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLmFqYXgoWycvZmVlZGJhY2snXSwgJ1BPU1QnLCBkb25lLCBkYXRhT2JqZWN0KTtcbn1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5EYXRhLmdldFVzZXIgPSBmdW5jdGlvbihkb25lKSB7XG4vLyBcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5hamF4KFsnL3VzZXInXSwgJ0dFVCcsIGRvbmUpO1xuLy8gfVxuXG5WaXJ0dWFsQm9va3NoZWxmLkRhdGEucHV0VXNlciA9IGZ1bmN0aW9uKGRhdGFPYmplY3QsIGRvbmUpIHtcblx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLmFqYXgoWycvdXNlciddLCAnUFVUJywgZG9uZSwgZGF0YU9iamVjdCk7XG59XG5cblZpcnR1YWxCb29rc2hlbGYuRGF0YS5nZXRJbWFnZSA9IGZ1bmN0aW9uKHVybCwgZG9uZSkge1xuXHR2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgaW1nLmNyb3NzT3JpZ2luID0gJyc7IFxuXHRpbWcuc3JjID0gdXJsO1xuXHRcblx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRjb25zb2xlLmxvZygnRGF0YS5nZXRJbWFnZTonLCB1cmwsICdPaycpO1xuXHRcdGRvbmUobnVsbCwgdGhpcyk7XG5cdH07XG5cdGltZy5vbmVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRGF0YS5nZXRJbWFnZTonLCB1cmwsIGVycm9yKTtcblx0XHRkb25lKGVycm9yLCBudWxsKTtcblx0fTtcbn07XG5cblZpcnR1YWxCb29rc2hlbGYuRGF0YS5DYW52YXNUZXh0ID0gZnVuY3Rpb24odGV4dCwgcHJvcGVydGllcykge1xuXHR0aGlzLnRleHQgPSB0ZXh0IHx8ICcnO1xuXHR0aGlzLnBhcnNlUHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcbn07XG5WaXJ0dWFsQm9va3NoZWxmLkRhdGEuQ2FudmFzVGV4dC5wcm90b3R5cGUgPSB7XG5cdGNvbnN0cnVjdG9yOiBWaXJ0dWFsQm9va3NoZWxmLkNhbnZhc1RleHQsXG5cdGdldEZvbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBbdGhpcy5zdHlsZSwgdGhpcy5zaXplICsgJ3B4JywgdGhpcy5mb250XS5qb2luKCcgJyk7XG5cdH0sXG5cdGlzVmFsaWQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAodGhpcy50ZXh0ICYmIHRoaXMueCAmJiB0aGlzLnkpO1xuXHR9LFxuXHR0b1N0cmluZzogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMudGV4dCB8fCAnJztcblx0fSxcblx0c2V0VGV4dDogZnVuY3Rpb24odGV4dCkge1xuXHRcdHRoaXMudGV4dCA9IHRleHQ7XG5cdH0sXG5cdHNlcmlhbGl6ZUZvbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBbdGhpcy5zdHlsZSwgdGhpcy5zaXplLCB0aGlzLmZvbnQsIHRoaXMueCwgdGhpcy55LCB0aGlzLmNvbG9yLCB0aGlzLndpZHRoXS5qb2luKCcsJyk7XG5cdH0sXG5cdHBhcnNlUHJvcGVydGllczogZnVuY3Rpb24ocHJvcGVydGllcykge1xuXHRcdHZhciBhcmdzID0gcHJvcGVydGllcyAmJiBwcm9wZXJ0aWVzLnNwbGl0KCcsJykgfHwgW107XG5cblx0XHR0aGlzLnN0eWxlID0gYXJnc1swXTtcblx0XHR0aGlzLnNpemUgPSBhcmdzWzFdIHx8IDE0O1xuXHRcdHRoaXMuZm9udCA9IGFyZ3NbMl0gfHwgJ0FyaWFsJztcblx0XHR0aGlzLnggPSBOdW1iZXIoYXJnc1szXSkgfHwgVmlydHVhbEJvb2tzaGVsZi5EYXRhLkNPVkVSX0ZBQ0VfWDtcblx0XHR0aGlzLnkgPSBOdW1iZXIoYXJnc1s0XSkgfHwgMTA7XG5cdFx0dGhpcy5jb2xvciA9IGFyZ3NbNV0gfHwgJ2JsYWNrJztcblx0XHR0aGlzLndpZHRoID0gYXJnc1s2XSB8fCA1MTI7XG5cdH0sXG5cdG1vdmU6IGZ1bmN0aW9uKGRYLCBkWSkge1xuXHRcdHRoaXMueCArPSBkWDtcblx0XHR0aGlzLnkgKz0gZFk7XG5cblx0XHRpZih0aGlzLnggPD0gMCkgdGhpcy54ID0gMTtcblx0XHRpZih0aGlzLnkgPD0gMCkgdGhpcy55ID0gMTtcblx0XHRpZih0aGlzLnggPj0gVmlydHVhbEJvb2tzaGVsZi5EYXRhLlRFWFRVUkVfUkVTT0xVVElPTikgdGhpcy54ID0gVmlydHVhbEJvb2tzaGVsZi5EYXRhLlRFWFRVUkVfUkVTT0xVVElPTjtcblx0XHRpZih0aGlzLnkgPj0gVmlydHVhbEJvb2tzaGVsZi5EYXRhLkNPVkVSX01BWF9ZKSB0aGlzLnkgPSBWaXJ0dWFsQm9va3NoZWxmLkRhdGEuQ09WRVJfTUFYX1k7XG5cdH1cbn1cblxuVmlydHVhbEJvb2tzaGVsZi5EYXRhLkNhbnZhc0ltYWdlID0gZnVuY3Rpb24ocHJvcGVydGllcykge1xuXHR0aGlzLmxpbmsgPSAnJztcblx0dGhpcy5pbWFnZSA9IG51bGw7XG5cdHRoaXMucGFyc2VQcm9wZXJ0aWVzKHByb3BlcnRpZXMpO1xufVxuVmlydHVhbEJvb2tzaGVsZi5EYXRhLkNhbnZhc0ltYWdlLnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IFZpcnR1YWxCb29rc2hlbGYuRGF0YS5DYW52YXNJbWFnZSxcblx0bG9hZDogZnVuY3Rpb24obGluaywgcHJveHksIGRvbmUpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdGZ1bmN0aW9uIHN5bmMobGluaywgaW1hZ2UpIHtcblx0XHRcdHNjb3BlLmxpbmsgPSBsaW5rO1xuXHRcdFx0c2NvcGUuaW1hZ2UgPSBpbWFnZTtcblx0XHRcdGRvbmUoKTtcblx0XHR9XG5cblx0XHRpZihzY29wZS5saW5rICE9IGxpbmsgJiYgbGluaykge1xuXHRcdFx0dmFyIHBhdGggPSAocHJveHkgPyAnL291dHNpZGU/bGluaz17bGlua30nIDogJy9vYmovYm9va1RleHR1cmVzL3tsaW5rfS5qcGcnKS5yZXBsYWNlKCd7bGlua30nLCBsaW5rKTtcblx0XHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5nZXRJbWFnZShwYXRoLCBmdW5jdGlvbiAoZXJyLCBpbWFnZSkge1xuXHRcdFx0XHRzeW5jKGxpbmssIGltYWdlKTtcdFx0XHRcdFxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmKCFsaW5rKSB7XG5cdFx0XHRzeW5jKGxpbmspO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkb25lKCk7XG5cdFx0fVxuXHR9LFxuXHR0b1N0cmluZzogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMubGluaztcblx0fSxcblx0cGFyc2VQcm9wZXJ0aWVzOiBmdW5jdGlvbihwcm9wZXJ0aWVzKSB7XG5cdFx0dmFyIGFyZ3MgPSBwcm9wZXJ0aWVzICYmIHByb3BlcnRpZXMuc3BsaXQoJywnKSB8fCBbXTtcblxuXHRcdHRoaXMueCA9IE51bWJlcihhcmdzWzBdKSB8fCBWaXJ0dWFsQm9va3NoZWxmLkRhdGEuQ09WRVJfRkFDRV9YO1xuXHRcdHRoaXMueSA9IE51bWJlcihhcmdzWzFdKSB8fCAwO1xuXHRcdHRoaXMud2lkdGggPSBOdW1iZXIoYXJnc1syXSkgfHwgMjE2O1xuXHRcdHRoaXMuaGVpZ2h0ID0gTnVtYmVyKGFyZ3NbM10pIHx8IFZpcnR1YWxCb29rc2hlbGYuRGF0YS5DT1ZFUl9NQVhfWTtcblx0fSxcblx0c2VyaWFsaXplUHJvcGVydGllczogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFt0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHRdLmpvaW4oJywnKTtcblx0fVxufSIsIlZpcnR1YWxCb29rc2hlbGYuRWRpdG9yID0gVmlydHVhbEJvb2tzaGVsZi5FZGl0b3IgfHwge307XG5cblZpcnR1YWxCb29rc2hlbGYuRWRpdG9yLmdldEJvb2tNYXRlcmlhbCA9IGZ1bmN0aW9uKGJvb2tEYXRhLCBtYXBJbWFnZSwgY292ZXJJbWFnZSkge1xuXHR2YXIgc2l6ZSA9IDUxMjtcblx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHR2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRjYW52YXMud2lkdGggPSBzaXplO1xuXHRjYW52YXMuaGVpZ2h0ID0gc2l6ZTtcblxuXHRpZihtYXBJbWFnZSkge1xuXHRcdGNvbnRleHQuZHJhd0ltYWdlKG1hcEltYWdlLCAwLCAwLCBzaXplLCBzaXplKTtcblx0fVxuXHRpZihjb3ZlckltYWdlICYmIGJvb2tEYXRhLmNvdmVyUG9zKSB7XG5cdFx0aWYoYm9va0RhdGEuY292ZXJQb3MubGVuZ3RoID09IDQpIHtcblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKGNvdmVySW1hZ2UsIGJvb2tEYXRhLmNvdmVyUG9zWzBdLCBib29rRGF0YS5jb3ZlclBvc1sxXSwgYm9va0RhdGEuY292ZXJQb3NbMl0sIGJvb2tEYXRhLmNvdmVyUG9zWzNdKTtcblx0XHR9XG5cdH1cblxuXHRjb250ZXh0LmZvbnQgPSBcIkJvbGQgMTZweCBBcmlhbFwiO1xuXHRjb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcbiAgICBjb250ZXh0LmZpbGxUZXh0KGJvb2tEYXRhLnRpdGxlLCAzMDAsIDEyMCk7XG5cdGNvbnRleHQuZm9udCA9IFwiQm9sZCAxMnB4IEFyaWFsXCI7XG4gICAgY29udGV4dC5maWxsVGV4dChib29rRGF0YS5hdXRob3IsIDMyNSwgNTApO1xuICAgIFxuXHR2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGNhbnZhcyk7XG4gICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHttYXA6IHRleHR1cmV9KTtcblx0dGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cblx0Ym9va0RhdGEuY29udGV4dCA9IGNvbnRleHQ7XG5cdGJvb2tEYXRhLmNhbnZhcyA9IGNhbnZhcztcblxuXHRyZXR1cm4gbWF0ZXJpYWw7XG59IiwidmFyIFZpcnR1YWxCb29rc2hlbGYgPSBWaXJ0dWFsQm9va3NoZWxmIHx8IHt9O1xuXG52YXIgU1RBVFNfQ09OVEFJTkVSX0lEID0gJ3N0YXRzJztcblxuVmlydHVhbEJvb2tzaGVsZi5jYW52YXM7XG5WaXJ0dWFsQm9va3NoZWxmLnJlbmRlcmVyO1xuVmlydHVhbEJvb2tzaGVsZi5saWJyYXJ5O1xuVmlydHVhbEJvb2tzaGVsZi5zY2VuZTtcblZpcnR1YWxCb29rc2hlbGYuc3RhdHM7XG5cblZpcnR1YWxCb29rc2hlbGYuc3RhcnQgPSBmdW5jdGlvbigpIHtcblx0aWYoIURldGVjdG9yLndlYmdsKSB7XG5cdFx0RGV0ZWN0b3IuYWRkR2V0V2ViR0xNZXNzYWdlKCk7XG5cdH1cblxuXHR2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0dmFyIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuXHRWaXJ0dWFsQm9va3NoZWxmLmluaXQod2lkdGgsIGhlaWdodCk7XG5cdFZpcnR1YWxCb29rc2hlbGYuQ2FtZXJhLmluaXQod2lkdGgsIGhlaWdodCk7XG5cdFZpcnR1YWxCb29rc2hlbGYuVUkuaW5pdENvbnRyb2xzRGF0YSgpO1xuXHRWaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLmluaXQoKTtcblxuXHRWaXJ0dWFsQm9va3NoZWxmLnN0YXJ0UmVuZGVyTG9vcCgpO1xufVxuXG5WaXJ0dWFsQm9va3NoZWxmLmluaXQgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG5cdHZhciBzdGF0c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNUQVRTX0NPTlRBSU5FUl9JRCk7XG5cdFZpcnR1YWxCb29rc2hlbGYuc3RhdHMgPSBuZXcgU3RhdHMoKTtcblx0c3RhdHNDb250YWluZXIuYXBwZW5kQ2hpbGQoVmlydHVhbEJvb2tzaGVsZi5zdGF0cy5kb21FbGVtZW50KTtcblxuXG5cdFZpcnR1YWxCb29rc2hlbGYuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0xJQlJBUlknKTtcblx0VmlydHVhbEJvb2tzaGVsZi5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtjYW52YXM6IFZpcnR1YWxCb29rc2hlbGYuY2FudmFzfSk7XG5cdFZpcnR1YWxCb29rc2hlbGYucmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuXHRWaXJ0dWFsQm9va3NoZWxmLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cdFZpcnR1YWxCb29rc2hlbGYuc2NlbmUuZm9nID0gbmV3IFRIUkVFLkZvZygweDAwMDAwMCwgNCwgNyk7XG59XG5cblZpcnR1YWxCb29rc2hlbGYuc3RhcnRSZW5kZXJMb29wID0gZnVuY3Rpb24oKSB7XG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZShWaXJ0dWFsQm9va3NoZWxmLnN0YXJ0UmVuZGVyTG9vcCk7XG5cdFZpcnR1YWxCb29rc2hlbGYuQ29udHJvbHMudXBkYXRlKCk7XG5cdFZpcnR1YWxCb29rc2hlbGYucmVuZGVyZXIucmVuZGVyKFZpcnR1YWxCb29rc2hlbGYuc2NlbmUsIFZpcnR1YWxCb29rc2hlbGYuY2FtZXJhKTtcblxuXHRWaXJ0dWFsQm9va3NoZWxmLnN0YXRzLnVwZGF0ZSgpO1xufVxuXG5WaXJ0dWFsQm9va3NoZWxmLmNsZWFyU2NlbmUgPSBmdW5jdGlvbigpIHtcblx0VmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5jbGVhcigpO1xuXHRWaXJ0dWFsQm9va3NoZWxmLmxpYnJhcnkgPSBudWxsO1xuXG5cdHdoaWxlKFZpcnR1YWxCb29rc2hlbGYuc2NlbmUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHRcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2NlbmUuY2hpbGRyZW5bMF0uZGlzcG9zZSkge1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5zY2VuZS5jaGlsZHJlblswXS5kaXNwb3NlKCk7XG5cdFx0fVxuXHRcdFZpcnR1YWxCb29rc2hlbGYuc2NlbmUucmVtb3ZlKFZpcnR1YWxCb29rc2hlbGYuc2NlbmUuY2hpbGRyZW5bMF0pO1xuXHR9XG59XG5cblZpcnR1YWxCb29rc2hlbGYubG9hZExpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5SWQpIHtcblx0VmlydHVhbEJvb2tzaGVsZi5jbGVhclNjZW5lKCk7XG5cdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5nZXRMaWJyYXJ5KGxpYnJhcnlJZCwgZnVuY3Rpb24gKGVyciwgbGlicmFyeSkge1xuXHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5sb2FkTGlicmFyeShsaWJyYXJ5LCBmdW5jdGlvbiAocGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHRcdFZpcnR1YWxCb29rc2hlbGYubGlicmFyeSA9IG5ldyBWaXJ0dWFsQm9va3NoZWxmLkxpYnJhcnkocGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5DYW1lcmEuc2V0UGFyZW50KFZpcnR1YWxCb29rc2hlbGYubGlicmFyeSk7XG5cdFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNjZW5lLmFkZChWaXJ0dWFsQm9va3NoZWxmLmxpYnJhcnkpO1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5saWJyYXJ5LmxvYWRTZWN0aW9ucygpO1xuXHRcdH0pO1x0XHRcdFx0XG5cdH0pO1xufTtcblxuVmlydHVhbEJvb2tzaGVsZi5ydW4gPSBmdW5jdGlvbihkYXRhLCB1c2VyKSB7XG5cdHVzZXIubG9hZCgpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFZpcnR1YWxCb29rc2hlbGYuc3RhcnQoKTtcblx0XHRWaXJ0dWFsQm9va3NoZWxmLmxvYWRMaWJyYXJ5KHVzZXIuZ2V0TGlicmFyeSgpIHx8IDEpO1xuXHR9LCBmdW5jdGlvbiAocmVzKSB7XG5cdFx0Ly9UT0RPOiBzaG93IGVycm9yIG1lc3NhZ2Vcblx0fSk7XG59O1xuIiwiVmlydHVhbEJvb2tzaGVsZi5VSSA9IFZpcnR1YWxCb29rc2hlbGYuVUkgfHwge307XG5cblZpcnR1YWxCb29rc2hlbGYuVUkuQk9PS19JTUFHRV9VUkwgPSAnL29iai9ib29rcy97bW9kZWx9L2ltZy5qcGcnO1xuXG5WaXJ0dWFsQm9va3NoZWxmLlVJLmluaXQgPSBmdW5jdGlvbigkcSwgdXNlciwgZGF0YSwgYmxvY2tVSSkge1xuXHRWaXJ0dWFsQm9va3NoZWxmLlVJLiRxID0gJHE7XG5cdFZpcnR1YWxCb29rc2hlbGYuVUkudXNlciA9IHVzZXI7XG5cdFZpcnR1YWxCb29rc2hlbGYuVUkuYmxvY2tVSSA9IGJsb2NrVUk7XG5cblx0cmV0dXJuIFZpcnR1YWxCb29rc2hlbGYuVUk7XG59O1xuXG5WaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUgPSB7XG5cdHNlbGVjdExpYnJhcnk6IHtcblx0XHRsaXN0OiBbXSxcblx0XHR1cGRhdGVMaXN0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzY29wZSA9IHRoaXM7XG5cblx0XHQgICAgVmlydHVhbEJvb2tzaGVsZi5EYXRhLmdldExpYnJhcmllcyhmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHQgICAgICAgIGlmKCFlcnIgJiYgcmVzdWx0KSB7XG5cdFx0ICAgICAgICAgICAgc2NvcGUubGlzdCA9IHJlc3VsdDtcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSk7XG5cdFx0fSxcblx0XHRnbzogZnVuY3Rpb24oaWQpIHtcblx0XHRcdGlmKGlkKSB7XG5cdFx0XHRcdFZpcnR1YWxCb29rc2hlbGYubG9hZExpYnJhcnkoaWQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Y3JlYXRlTGlicmFyeToge1xuXHRcdGxpc3Q6IFtdLFxuXHRcdG1vZGVsOiBudWxsLFxuXG5cdFx0Z2V0SW1nOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLm1vZGVsID8gJy9vYmovbGlicmFyaWVzL3ttb2RlbH0vaW1nLmpwZycucmVwbGFjZSgne21vZGVsfScsIHRoaXMubW9kZWwpIDogbnVsbDtcblx0XHR9LFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZih0aGlzLm1vZGVsKSB7XG5cdFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5wb3N0TGlicmFyeSh0aGlzLm1vZGVsLCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcblx0XHRcdFx0XHRpZighZXJyICYmIHJlc3VsdCkge1xuXHRcdFx0XHRcdFx0Ly9UT0RPOiBhZGQgbGlicmFyeSB3aXRob3V0IHJlbG9hZFxuXHRcdFx0XHRcdFx0VmlydHVhbEJvb2tzaGVsZi5sb2FkTGlicmFyeShyZXN1bHQuaWQpO1xuXHRcdFx0XHRcdFx0VmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LnNob3cgPSBudWxsOyAvLyBUT0RPOiBoaWRlIGFmdGVyIGdvIFxuXHRcdFx0XHRcdFx0VmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LnNlbGVjdExpYnJhcnkudXBkYXRlTGlzdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVx0XHRcblx0fSxcblx0Y3JlYXRlU2VjdGlvbjoge1xuXHRcdGxpc3Q6IFtdLFxuXHRcdG1vZGVsOiBudWxsLFxuXHRcdFxuXHRcdGdldEltZzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tb2RlbCA/ICcvb2JqL3NlY3Rpb25zL3ttb2RlbH0vaW1nLmpwZycucmVwbGFjZSgne21vZGVsfScsIHRoaXMubW9kZWwpIDogbnVsbDtcblx0XHR9LFxuXHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZih0aGlzLm1vZGVsKSB7XG5cdFx0XHRcdHZhciBzZWN0aW9uRGF0YSA9IHtcblx0XHRcdFx0XHRtb2RlbDogdGhpcy5tb2RlbCxcblx0XHRcdFx0XHR1c2VySWQ6IFZpcnR1YWxCb29rc2hlbGYuVUkudXNlci5pZFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5wb3N0U2VjdGlvbihzZWN0aW9uRGF0YSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRcdFx0aWYoIWVyciAmJiByZXN1bHQpIHtcblx0XHRcdFx0XHRcdC8vVE9ETzogcmVmYWN0b3Jcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Ly8gc2VjdGlvbk1lbnU6IHtcblx0Ly8gXHRpc01vdmVPcHRpb246IGZ1bmN0aW9uKCkge1xuXHQvLyBcdFx0cmV0dXJuIHRydWU7XG5cdC8vIFx0fSxcblx0Ly8gXHRpc1JvdGF0ZU9wdGlvbjogZnVuY3Rpb24oKSB7XG5cdC8vIFx0XHRyZXR1cm4gZmFsc2U7XG5cdC8vIFx0fVxuXHQvLyB9LFxuXHRmZWVkYmFjazoge1xuXHRcdG1lc3NhZ2U6IG51bGwsXG5cdFx0c2hvdzogdHJ1ZSxcblxuXHRcdGNsb3NlOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuc2hvdyA9IGZhbHNlO1xuXHRcdH0sXG5cdFx0c3VibWl0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBkYXRhT2JqZWN0O1xuXHRcdFx0XG5cdFx0XHRpZih0aGlzLm1lc3NhZ2UpIHtcblx0XHRcdFx0ZGF0YU9iamVjdCA9IHtcblx0XHRcdFx0XHRtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG5cdFx0XHRcdFx0dXNlcklkOiBWaXJ0dWFsQm9va3NoZWxmLlVJLnVzZXIgJiYgVmlydHVhbEJvb2tzaGVsZi5VSS51c2VyLmlkXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLnBvc3RGZWVkYmFjayhkYXRhT2JqZWN0LCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuXHRcdFx0XHRcdC8vIFRPRE86IFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdH1cblx0fSxcblx0bmF2aWdhdGlvbjoge1xuXHRcdHN0b3A6IGZ1bmN0aW9uKCkge1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5nb1N0b3AoKTtcblx0XHR9LFxuXHRcdGZvcndhcmQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5nb0ZvcndhcmQoKTtcblx0XHR9LFxuXHRcdGJhY2t3YXJkOiBmdW5jdGlvbigpIHtcblx0XHRcdFZpcnR1YWxCb29rc2hlbGYuQ29udHJvbHMuZ29CYWNrd2FyZCgpO1xuXHRcdH0sXG5cdFx0bGVmdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRWaXJ0dWFsQm9va3NoZWxmLkNvbnRyb2xzLmdvTGVmdCgpO1xuXHRcdH0sXG5cdFx0cmlnaHQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5Db250cm9scy5nb1JpZ2h0KCk7XG5cdFx0fVxuXHR9LFxuXHRsb2dpbjoge1xuXHRcdC8vIFRPRE86IG9hdXRoLmlvXG5cdFx0aXNTaG93OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAhVmlydHVhbEJvb2tzaGVsZi5VSS51c2VyLmlzQXV0aG9yaXplZCgpO1xuXHRcdH1cblx0fSxcblx0aW52ZW50b3J5OiB7XG5cdFx0c2VhcmNoOiBudWxsLFxuXHRcdGxpc3Q6IG51bGwsXG5cdFx0YmxvY2tlcjogJ2ludmVudG9yeScsXG5cdFxuXHRcdGV4cGFuZDogZnVuY3Rpb24oYm9vaykge1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suc2V0Qm9vayhib29rKTtcblx0XHR9LFxuXHRcdGJsb2NrOiBmdW5jdGlvbigpIHtcblx0XHRcdFZpcnR1YWxCb29rc2hlbGYuVUkuYmxvY2tVSS5pbnN0YW5jZXMuZ2V0KHRoaXMuYmxvY2tlcikuc3RhcnQoKTtcblx0XHR9LFxuXHRcdHVuYmxvY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5VSS5ibG9ja1VJLmluc3RhbmNlcy5nZXQodGhpcy5ibG9ja2VyKS5zdG9wKCk7XG5cdFx0fSxcblx0XHRpc1Nob3c6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIFZpcnR1YWxCb29rc2hlbGYuVUkudXNlci5pc0F1dGhvcml6ZWQoKTtcblx0XHR9LFxuXHRcdGFkZEJvb2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdFx0c2NvcGUuYmxvY2soKTtcblx0XHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5wb3N0Qm9vayh7dXNlcklkOiBWaXJ0dWFsQm9va3NoZWxmLlVJLnVzZXIuZ2V0SWQoKX0pXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHRzY29wZS5leHBhbmQocmVzLmRhdGEpO1xuXHRcdFx0XHRcdHJldHVybiBzY29wZS5sb2FkRGF0YSgpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0Ly9UT0RPOiByZXNlYXJjaCwgbG9va3MgcmlndGhcblx0XHRcdFx0fSlcblx0XHRcdFx0LmZpbmFsbHkoZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdHNjb3BlLnVuYmxvY2soKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHRcdFx0fSk7XG5cdFx0fSxcblx0XHRyZW1vdmU6IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRcdHZhciBzY29wZSA9IHRoaXM7XG5cblx0XHRcdHNjb3BlLmJsb2NrKCk7XG5cdFx0XHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEuZGVsZXRlQm9vayhib29rKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHNjb3BlLmxvYWREYXRhKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5maW5hbGx5KGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHRzY29wZS51bmJsb2NrKCk7XG5cdFx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0bG9hZERhdGE6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNjb3BlID0gdGhpcztcblx0XHRcdHZhciAkcSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuJHE7XG5cdFx0XHR2YXIgcHJvbWlzZTtcblxuXHRcdFx0c2NvcGUuYmxvY2soKTtcblx0XHRcdHByb21pc2UgPSAkcS53aGVuKHRoaXMuaXNTaG93KCkgPyBWaXJ0dWFsQm9va3NoZWxmLkRhdGEuZ2V0VXNlckJvb2tzKFZpcnR1YWxCb29rc2hlbGYuVUkudXNlci5nZXRJZCgpKSA6IG51bGwpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChib29rcykge1xuXHRcdFx0XHRcdHNjb3BlLmxpc3QgPSBib29rcztcblx0XHRcdFx0fSlcblx0XHRcdFx0LmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHNjb3BlLnVuYmxvY2soKTtcdFx0XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gcHJvbWlzZTtcblx0XHR9XG5cdH0sXG5cdGNyZWF0ZUJvb2s6IHtcblx0XHRsaXN0OiBbXSxcblx0XHRib29rOiB7fSxcblxuXHRcdHNldEJvb2s6IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRcdHRoaXMuYm9vayA9IHt9OyAvLyBjcmVhdGUgbmV3IG9iamVjdCBmb3IgdW5iaW5kIGZyb20gc2NvcGVcblx0XHRcdGlmKGJvb2spIHtcblx0XHRcdFx0dGhpcy5ib29rLmlkID0gYm9vay5pZDtcblx0XHRcdFx0dGhpcy5ib29rLnVzZXJJZCA9IGJvb2sudXNlcklkO1xuXHRcdFx0XHR0aGlzLmJvb2subW9kZWwgPSBib29rLm1vZGVsO1xuXHRcdFx0XHR0aGlzLmJvb2suY292ZXIgPSBib29rLmNvdmVyO1xuXHRcdFx0XHR0aGlzLmJvb2sudGl0bGUgPSBib29rLnRpdGxlO1xuXHRcdFx0XHR0aGlzLmJvb2suYXV0aG9yID0gYm9vay5hdXRob3I7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRnZXRJbWc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYm9vay5tb2RlbCA/IFZpcnR1YWxCb29rc2hlbGYuVUkuQk9PS19JTUFHRV9VUkwucmVwbGFjZSgne21vZGVsfScsIHRoaXMuYm9vay5tb2RlbCkgOiBudWxsO1xuXHRcdH0sXG5cdFx0aXNTaG93OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAhIXRoaXMuYm9vay5pZDtcblx0XHR9LFxuXHRcdHNhdmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdFx0XG5cdFx0XHRWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuaW52ZW50b3J5LmJsb2NrKCk7XG5cdFx0XHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEucG9zdEJvb2sodGhpcy5ib29rKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0c2NvcGUuY2FuY2VsKCk7XG5cdFx0XHRcdFx0cmV0dXJuIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5pbnZlbnRvcnkubG9hZERhdGEoKVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdC8vVE9ETzogc2hvdyBlcnJvclxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZmluYWxseShmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0VmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmludmVudG9yeS51bmJsb2NrKCk7XG5cdFx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0Y2FuY2VsOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuc2V0Qm9vaygpO1xuXHRcdH1cblx0fVxufTtcblxuVmlydHVhbEJvb2tzaGVsZi5VSS5pbml0Q29udHJvbHNEYXRhID0gZnVuY3Rpb24oKSB7XG5cdHZhciBzY29wZSA9IFZpcnR1YWxCb29rc2hlbGYuVUk7XG5cblx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLmdldFVJRGF0YShmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG5cdFx0aWYoIWVyciAmJiBkYXRhKSB7XG5cdFx0XHRzY29wZS5tZW51LmNyZWF0ZUxpYnJhcnkubGlzdCA9IGRhdGEubGlicmFyaWVzO1xuXHRcdFx0c2NvcGUubWVudS5jcmVhdGVTZWN0aW9uLmxpc3QgPSBkYXRhLmJvb2tzaGVsdmVzO1xuXHRcdFx0c2NvcGUubWVudS5jcmVhdGVCb29rLmxpc3QgPSBkYXRhLmJvb2tzO1xuXHRcdH1cblx0fSk7XG5cblx0VmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LnNlbGVjdExpYnJhcnkudXBkYXRlTGlzdCgpO1xuXHRWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuaW52ZW50b3J5LmxvYWREYXRhKCk7XG59XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuaW5pdENvbnRyb2xzRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLm1vZGVsLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VNb2RlbDtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2sudGV4dHVyZS5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlQm9va1RleHR1cmU7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmNvdmVyLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VCb29rQ292ZXI7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmF1dGhvci5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgnYXV0aG9yJywgJ3RleHQnKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suYXV0aG9yU2l6ZS5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgnYXV0aG9yJywgJ3NpemUnKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suYXV0aG9yQ29sb3Iub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZVNwZWNpZmljVmFsdWUoJ2F1dGhvcicsICdjb2xvcicpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay50aXRsZS5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgndGl0bGUnLCAndGV4dCcpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay50aXRsZVNpemUub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZVNwZWNpZmljVmFsdWUoJ3RpdGxlJywgJ3NpemUnKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2sudGl0bGVDb2xvci5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgndGl0bGUnLCAnY29sb3InKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdENvdmVyLm9uY2xpY2sgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLnN3aXRjaEVkaXRlZDtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdEF1dGhvci5vbmNsaWNrID0gVmlydHVhbEJvb2tzaGVsZi5VSS5zd2l0Y2hFZGl0ZWQ7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmVkaXRUaXRsZS5vbmNsaWNrID0gVmlydHVhbEJvb2tzaGVsZi5VSS5zd2l0Y2hFZGl0ZWQ7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLm9rLm9uY2xpY2sgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLnNhdmVCb29rO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5jYW5jZWwub25jbGljayA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2FuY2VsQm9va0VkaXQ7XG4vLyB9O1xuXG4vLyBjcmVhdGUgYm9va1xuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLnNob3dDcmVhdGVCb29rID0gZnVuY3Rpb24oKSB7XG4vLyBcdHZhciBtZW51Tm9kZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rO1xuXG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHRtZW51Tm9kZS5zaG93KCk7XG4vLyBcdFx0bWVudU5vZGUuc2V0VmFsdWVzKCk7XG4vLyBcdH0gZWxzZSBpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzU2VjdGlvbigpKSB7XG4vLyBcdFx0dmFyIHNlY3Rpb24gPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcbi8vIFx0XHR2YXIgc2hlbGYgPSBzZWN0aW9uLmdldFNoZWxmQnlQb2ludChWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLnBvaW50KTtcbi8vIFx0XHR2YXIgZnJlZVBvc2l0aW9uID0gc2VjdGlvbi5nZXRHZXRGcmVlU2hlbGZQb3NpdGlvbihzaGVsZiwge3g6IDAuMDUsIHk6IDAuMTIsIHo6IDAuMX0pOyBcbi8vIFx0XHRpZihmcmVlUG9zaXRpb24pIHtcbi8vIFx0XHRcdG1lbnVOb2RlLnNob3coKTtcblxuLy8gXHRcdFx0dmFyIGRhdGFPYmplY3QgPSB7XG4vLyBcdFx0XHRcdG1vZGVsOiBtZW51Tm9kZS5tb2RlbC52YWx1ZSwgXG4vLyBcdFx0XHRcdHRleHR1cmU6IG1lbnVOb2RlLnRleHR1cmUudmFsdWUsIFxuLy8gXHRcdFx0XHRjb3ZlcjogbWVudU5vZGUuY292ZXIudmFsdWUsXG4vLyBcdFx0XHRcdHBvc194OiBmcmVlUG9zaXRpb24ueCxcbi8vIFx0XHRcdFx0cG9zX3k6IGZyZWVQb3NpdGlvbi55LFxuLy8gXHRcdFx0XHRwb3NfejogZnJlZVBvc2l0aW9uLnosXG4vLyBcdFx0XHRcdHNlY3Rpb25JZDogc2VjdGlvbi5kYXRhT2JqZWN0LmlkLFxuLy8gXHRcdFx0XHRzaGVsZklkOiBzaGVsZi5pZCxcbi8vIFx0XHRcdFx0dXNlcklkOiBWaXJ0dWFsQm9va3NoZWxmLnVzZXIuaWRcbi8vIFx0XHRcdH07XG5cbi8vIFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5jcmVhdGVCb29rKGRhdGFPYmplY3QsIGZ1bmN0aW9uIChib29rLCBkYXRhT2JqZWN0KSB7XG4vLyBcdFx0XHRcdGJvb2sucGFyZW50ID0gc2hlbGY7XG4vLyBcdFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0ID0gYm9vaztcbi8vIFx0XHRcdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5nZXQoKTtcbi8vIFx0XHRcdH0pO1xuLy8gXHRcdH0gZWxzZSB7XG4vLyBcdFx0XHRhbGVydCgnVGhlcmUgaXMgbm8gZnJlZSBzcGFjZSBvbiBzZWxlY3RlZCBzaGVsZi4nKTtcbi8vIFx0XHR9XG4vLyBcdH1cbi8vIH1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VNb2RlbCA9IGZ1bmN0aW9uKCkge1xuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0dmFyIG9sZEJvb2sgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcbi8vIFx0XHR2YXIgZGF0YU9iamVjdCA9IHtcbi8vIFx0XHRcdG1vZGVsOiB0aGlzLnZhbHVlLFxuLy8gXHRcdFx0dGV4dHVyZTogb2xkQm9vay50ZXh0dXJlLnRvU3RyaW5nKCksXG4vLyBcdFx0XHRjb3Zlcjogb2xkQm9vay5jb3Zlci50b1N0cmluZygpXG4vLyBcdFx0fTtcblxuLy8gXHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5jcmVhdGVCb29rKGRhdGFPYmplY3QsIGZ1bmN0aW9uIChib29rLCBkYXRhT2JqZWN0KSB7XG4vLyBcdFx0XHRib29rLmNvcHlTdGF0ZShvbGRCb29rKTtcbi8vIFx0XHR9KTtcbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZUJvb2tUZXh0dXJlID0gZnVuY3Rpb24oKSB7XG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHR2YXIgYm9vayA9IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0O1xuLy8gXHRcdGJvb2sudGV4dHVyZS5sb2FkKHRoaXMudmFsdWUsIGZhbHNlLCBmdW5jdGlvbiAoKSB7XG4vLyBcdFx0XHRib29rLnVwZGF0ZVRleHR1cmUoKTtcbi8vIFx0XHR9KTtcbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZUJvb2tDb3ZlciA9IGZ1bmN0aW9uKCkge1xuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0dmFyIGJvb2sgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcbi8vIFx0XHRib29rLmNvdmVyLmxvYWQodGhpcy52YWx1ZSwgdHJ1ZSwgZnVuY3Rpb24oKSB7XG4vLyBcdFx0XHRib29rLnVwZGF0ZVRleHR1cmUoKTtcbi8vIFx0XHR9KTtcbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZVNwZWNpZmljVmFsdWUgPSBmdW5jdGlvbihmaWVsZCwgcHJvcGVydHkpIHtcbi8vIFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcbi8vIFx0XHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdFtmaWVsZF1bcHJvcGVydHldID0gdGhpcy52YWx1ZTtcbi8vIFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0LnVwZGF0ZVRleHR1cmUoKTtcbi8vIFx0XHR9XG4vLyBcdH07XG4vLyB9O1xuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLnN3aXRjaEVkaXRlZCA9IGZ1bmN0aW9uKCkge1xuLy8gXHR2YXIgYWN0aXZlRWxlbWV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EuYWN0aXZlRWRpdCcpO1xuXG4vLyBcdGZvcih2YXIgaSA9IGFjdGl2ZUVsZW1ldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbi8vIFx0XHRhY3RpdmVFbGVtZXRzW2ldLmNsYXNzTmFtZSA9ICdpbmFjdGl2ZUVkaXQnO1xuLy8gXHR9O1xuXG4vLyBcdHZhciBwcmV2aW91c0VkaXRlZCA9IFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmVkaXRlZDtcbi8vIFx0dmFyIGN1cnJlbnRFZGl0ZWQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZWRpdCcpO1xuXG4vLyBcdGlmKHByZXZpb3VzRWRpdGVkICE9IGN1cnJlbnRFZGl0ZWQpIHtcbi8vIFx0XHR0aGlzLmNsYXNzTmFtZSA9ICdhY3RpdmVFZGl0Jztcbi8vIFx0XHRWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5lZGl0ZWQgPSBjdXJyZW50RWRpdGVkO1xuLy8gXHR9IGVsc2Uge1xuLy8gXHRcdFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmVkaXRlZCA9IG51bGw7XG4vLyBcdH1cbi8vIH1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5zYXZlQm9vayA9IGZ1bmN0aW9uKCkge1xuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0dmFyIGJvb2sgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcblxuLy8gXHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQucHV0KCk7XG4vLyBcdFx0Ym9vay5zYXZlKCk7XG4vLyBcdH1cbi8vIH1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5jYW5jZWxCb29rRWRpdCA9IGZ1bmN0aW9uKCkge1xuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0dmFyIGJvb2sgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcblx0XHRcbi8vIFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLnB1dCgpO1xuLy8gXHRcdGJvb2sucmVmcmVzaCgpO1xuLy8gXHR9XG4vLyB9IiwiVmlydHVhbEJvb2tzaGVsZi5Vc2VyID0gZnVuY3Rpb24oZGF0YSkge1xuXHR2YXIgdXNlciA9IHtcblx0XHRfZGF0YU9iamVjdDogbnVsbCxcblx0XHRfcG9zaXRpb246IG51bGwsXG5cdFx0X2xpYnJhcnk6IG51bGwsXG5cblx0XHRsb2FkOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzY29wZSA9IHRoaXM7XG5cblx0XHRcdHJldHVybiBkYXRhLmdldFVzZXIoKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0c2NvcGUuc2V0RGF0YU9iamVjdChyZXMuZGF0YSk7XG5cdFx0XHRcdFx0c2NvcGUuc2V0TGlicmFyeSgpO1xuXHRcdFx0XHR9KTtcblx0XHR9LFxuXHRcdHNldERhdGFPYmplY3Q6IGZ1bmN0aW9uKGRhdGFPYmplY3QpIHtcblx0XHRcdHRoaXMuX2RhdGFPYmplY3QgPSBkYXRhT2JqZWN0O1xuXHRcdH0sXG5cdFx0Z2V0TGlicmFyeTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbGlicmFyeTtcblx0XHR9LFxuXHRcdHNldExpYnJhcnk6IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuXHRcdFx0dGhpcy5fbGlicmFyeSA9IGxpYnJhcnlJZCB8fCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3Vic3RyaW5nKDEpO1xuXHRcdH0sXG5cdFx0Z2V0SWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2RhdGFPYmplY3QgJiYgdGhpcy5fZGF0YU9iamVjdC5pZDtcblx0XHR9LFxuXHRcdGlzQXV0aG9yaXplZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLl9kYXRhT2JqZWN0KTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHVzZXI7XG59OyIsIlZpcnR1YWxCb29rc2hlbGYuRGlyZWN0aXZlcyA9IFZpcnR1YWxCb29rc2hlbGYuRGlyZWN0aXZlcyB8fCB7fTtcblxuVmlydHVhbEJvb2tzaGVsZi5EaXJlY3RpdmVzLlNlbGVjdCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0OiAnRScsXG4gICAgXHR0cmFuc2NsdWRlOiB0cnVlLFxuXHRcdHRlbXBsYXRlVXJsOiAnL3VpL3NlbGVjdC5lanMnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRzZWxlY3RlZDogJz0nLFxuXHRcdFx0dmFsdWU6ICdAJyxcblx0XHRcdGxhYmVsOiAnQCdcblx0XHR9LFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlciwgdHJhbnNjbHVkZSkge1xuXHRcdFx0c2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRzY29wZS5zZWxlY3RlZCA9IGl0ZW1bc2NvcGUudmFsdWVdO1xuXHRcdFx0fTtcblxuXHRcdFx0c2NvcGUuaXNTZWxlY3RlZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIHNjb3BlLnNlbGVjdGVkID09PSBpdGVtW3Njb3BlLnZhbHVlXTtcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==