VirtualBookshelf.Object = function(dataObject, geometry, material) {
	THREE.Mesh.call(this, geometry, material);

	this.dataObject = dataObject || {};
	this.id = this.dataObject.id;
	this.position = new THREE.Vector3(this.dataObject.pos_x, this.dataObject.pos_y, this.dataObject.pos_z);
	this.rotation.order = 'XYZ';
}
VirtualBookshelf.Object.prototype = new THREE.Mesh();
VirtualBookshelf.Object.prototype.constructor = VirtualBookshelf.Object;
VirtualBookshelf.Object.prototype.move = function(newPosition) {
	var collision = false;
	var newPositionX = newPosition.x;
	var newPositionZ = newPosition.z;

	if(!collision) {
		if(newPositionX) {
			this.position.setX(newPositionX);
			this.changed = true;
		}
		if(newPositionZ) {
			this.position.setZ(newPositionZ);
			this.changed = true;
		}
	}	
}
VirtualBookshelf.Object.prototype.rotate = function(x, y) {
	this.rotation.x += y * 0.01 || 0;
	this.rotation.y += x * 0.01 || 0;
}
VirtualBookshelf.Object.prototype.getDataObject = function() {
	this.dataObject.pos_x = this.position.x;
	this.dataObject.pos_y = this.position.y;
	this.dataObject.pos_z = this.position.z;

	return this.dataObject;
}
VirtualBookshelf.Object.prototype.reload = function() {
	this.position.setX(this.dataObject.pos_x);
	this.position.setY(this.dataObject.pos_y);
	this.position.setZ(this.dataObject.pos_z);
	this.rotation.set(0, 0, 0);
}

//*********************

VirtualBookshelf.Library = function(params, geometry, material) {
	VirtualBookshelf.Object.call(this, params, geometry, material);

	this.libraryObject = params.libraryObject || {};

	this.loadSections();
}
VirtualBookshelf.Library.prototype = new VirtualBookshelf.Object();
VirtualBookshelf.Library.prototype.constructor = VirtualBookshelf.Library;

VirtualBookshelf.Library.prototype.loadSections = function() {
	var library = this;

	VirtualBookshelf.Data.getSections(library.id, function (err, sections) {
		if(sections) {
			for(key in sections) {
				VirtualBookshelf.Data.loadSection(sections[key], function (params, geometry, material) {
					library.add(new VirtualBookshelf.Section(params, geometry, material));
				});				
			}
		}
	});
}
//***

VirtualBookshelf.Section = function(params, geometry, material) {
	VirtualBookshelf.Object.call(this, params, geometry, material);

	this.shelves = {};
	this.position = new THREE.Vector3(params.pos_x, params.pos_y, params.pos_z);
	
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
				// VirtualBookshelf.Data.loadBookData(book, function (dataObject, geometry, material, properties) {
				// 	var shelf = section.shelves[dataObject.shelfId];
				// 	if(shelf) {
				// 		var book = new VirtualBookshelf.Book(dataObject, geometry, material, properties);
				// 		book.updateTexture();
				// 		shelf.add(book);
				// 	}
				// });
			});
		}
	});
}

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
			result = new THREE.Vector3(left + bookSize.x * 0.5, bookSize.y, bookSize.z);		
			break;
		}
	};

	return result;
}
//***

VirtualBookshelf.Shelf = function(params) {
	THREE.Object3D.call(this);

	this.id = params.id;
	this.position = new THREE.Vector3(params.position[0], params.position[1], params.position[2]);
	this.size = new THREE.Vector3(params.size[0], params.size[1], params.size[2]);
}
VirtualBookshelf.Shelf.prototype = new THREE.Object3D();
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
VirtualBookshelf.Book.prototype.move = function(newPosition) {
	var collision = false;
	var newPosition = newPosition.x;
	var shelf = this.parent;
	var	thisSize = this.geometry.boundingBox;

	if(newPosition + thisSize.min.x <= shelf.size.x * -0.5
		|| newPosition + thisSize.max.x >= shelf.size.x * 0.5
	) {
		collision = true
	} else {
		for(var i = 0; i < this.parent.children.length; i++) {
			var book = this.parent.children[i];
			var bookSize = book.geometry.boundingBox;
			if(book === this) continue;
			if((newPosition <= book.position.x && thisSize.max.x + newPosition >= bookSize.min.x + book.position.x)
				|| (newPosition >= book.position.x && thisSize.min.x + newPosition <= bookSize.max.x + book.position.x)
			) {
				collision = true;
				break;
			}
		};
	}
	
	if(!collision) {
		this.position.setX(newPosition);
		this.changed = true;
	}
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

	VirtualBookshelf.Data.postBook(this.dataObject, function(err, result) {
		if(!err && result && result) {
			scope.dataObject = result;
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