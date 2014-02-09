VirtualBookshelf.Library = function(params) {
	THREE.Object3D.call(this);
	var scope = this;

	this.id = params.id;
	this.libraryObject = params.libraryObject || {};
	this.modelPath = '/obj/libraries/{model}/'.replace('{model}', this.libraryObject.model);

	VirtualBookshelf.loader.load(this.modelPath + 'model.obj', this.modelPath + 'model.mtl', function (object) {
		scope.add(object);
	});

	this.loadSections();
}
VirtualBookshelf.Library.prototype = new THREE.Object3D();
VirtualBookshelf.Library.prototype.constructor = VirtualBookshelf.Library;

VirtualBookshelf.Library.prototype.loadSections = function() {
	var library = this;

	$.ajax({url: '/sections/' + library.id, type: 'GET', success: function(data) {
		if(data) {
			for(key in data) {
				VirtualBookshelf.Data.loadSection(data[key], function (params, geometry, material) {
					library.add(new VirtualBookshelf.Section(params, geometry, material));
				});				
			}
		}
	}});
}
//***

VirtualBookshelf.Section = function(params, geometry, material) {
	THREE.Mesh.call(this, geometry, material);
	var scope = this;

	this.id = params.id;
	this.shelves = params.data.shelves;
	this.position = new THREE.Vector3(params.pos_x, params.pos_y, params.pos_z);
	
	for(key in this.shelves) {
		var shelf = this.shelves[key];
		// var shapeGeometry = new THREE.CubeGeometry(shelf.size[0], shelf.size[1], shelf.size[2]);
		// var shapeMaterial = new THREE.MeshLambertMaterial({color: 0x961818, shading: THREE.SmoothShading});
		// shapeMaterial.side = THREE.BackSide;
		// var shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
		// shape.position = new THREE.Vector3(shelf.position[0], shelf.position[1], shelf.position[2]);
		//shape.visible = false;

		var obj = new THREE.Object3D();
		obj.position = new THREE.Vector3(shelf.position[0], shelf.position[1], shelf.position[2]);
		shelf.obj = obj; 
		scope.add(obj);
	}
	
	this.loadBooks();
}
VirtualBookshelf.Section.prototype = new THREE.Mesh();
VirtualBookshelf.Section.prototype.constructor = VirtualBookshelf.Section;

VirtualBookshelf.Section.prototype.loadBooks = function() {	
	var section = this;

	VirtualBookshelf.Data.getBooks(section.id, function (err, data) {
		if(!err && data && data.length) {
			data.forEach(function (book) {
				VirtualBookshelf.Data.loadBookData(book, function (params, geometry, material) {
					var shelf = section.shelves[params.shelfId];
					if(shelf && shelf.obj) {
						shelf.obj.add(new VirtualBookshelf.Book(params, geometry, material));
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
		var distance = point.distanceTo(new THREE.Vector3(shelf.position[0], shelf.position[1], shelf.position[2]));
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
		left: -shelf.size[0],
		right: -shelf.size[0] * 0.5
	});
	sortedBooks.push({
		left: shelf.size[0] * 0.5,
		right: shelf.size[0]
	});

	shelf.obj.children.forEach(function (book) {
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

VirtualBookshelf.Book = function(params, geometry, material) {
	THREE.Mesh.call(this, geometry, material);
	var scope = this;

	this.position = new THREE.Vector3(params.pos_x, params.pos_y, params.pos_z);
}
VirtualBookshelf.Book.prototype = new THREE.Mesh();
VirtualBookshelf.Book.prototype.constructor = VirtualBookshelf.Book;