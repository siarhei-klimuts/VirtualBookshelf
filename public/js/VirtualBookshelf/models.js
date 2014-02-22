VirtualBookshelf.Object = function(dataObject, geometry, material) {
	THREE.Mesh.call(this, geometry, material);
	if(dataObject) {
		this.id = dataObject.id;
		this.position = new THREE.Vector3(dataObject.pos_x, dataObject.pos_y, dataObject.pos_z);
		this.rotation.order = 'XYZ';
		this.dataObject = dataObject;
	}
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
			data.forEach(function (book) {
				VirtualBookshelf.Data.loadBookData(book, function (params, geometry, material) {
					var shelf = section.shelves[params.shelfId];
					if(shelf && shelf) {
						shelf.add(new VirtualBookshelf.Book(params, geometry, material));
					}
				});
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
		
		if(distance > bookSize) {
			result = new THREE.Vector3(left + bookSize * 0.5, 0, 0);		
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

VirtualBookshelf.Book = function(params, geometry, material) {
	VirtualBookshelf.Object.call(this, params, geometry, material);
}
VirtualBookshelf.Book.prototype = new VirtualBookshelf.Object();
VirtualBookshelf.Book.prototype.constructor = VirtualBookshelf.Book;

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