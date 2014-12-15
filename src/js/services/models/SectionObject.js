angular.module('VirtualBookshelf')
.factory('SectionObject', function (BaseObject, ShelfObject, BookObject, Data) {
	var SectionObject = function(params, geometry, material) {
		BaseObject.call(this, params, geometry, material);

		this.shelves = {};
		for(key in params.data.shelves) {
			this.shelves[key] = new ShelfObject(params.data.shelves[key]); 
			this.add(this.shelves[key]);
		}
		
		// this.loadBooks();
	};
	SectionObject.prototype = new BaseObject();
	SectionObject.prototype.constructor = SectionObject;
	
	// SectionObject.prototype.loadBooks = function() {	
	// 	var section = this;

	// 	Data.getBooks(section.id).then(function (books) {
	// 		books.forEach(function (dataObject) {
	// 			createBook(dataObject, function (book, dataObject) {
	// 				var shelf = section.shelves[dataObject.shelfId];
	// 				shelf && shelf.add(book);
	// 			});
	// 		});
	// 	}).catch(function (res) {
	// 		//TODO: show an error
	// 	});
	// };

	SectionObject.prototype.save = function() {
		var scope = this;

		this.dataObject.pos_x = this.position.x;
		this.dataObject.pos_y = this.position.y;
		this.dataObject.pos_z = this.position.z;

		this.dataObject.rotation = [this.rotation.x, this.rotation.y, this.rotation.z];

		Data.postSection(this.dataObject).then(function (dto) {
			scope.dataObject = dto;
			scope.changed = false;
		}).catch(function (res) {
			//TODO: hide edit, notify user
		});
	};

	SectionObject.prototype.getShelfByPoint = function(point) {
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
	};
	SectionObject.prototype.getGetFreeShelfPosition = function(shelf, bookSize) {
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
			if(book instanceof Book) {
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
	};

	// var createBook = function(dataObject, done) {
	// 	var modelPath = '/obj/books/{model}/model.js'.replace('{model}', dataObject.model);

	// 	Data.loadGeometry(modelPath).then(function (geometry) {
	// 		var canvas = document.createElement('canvas');
	// 		var texture = new THREE.Texture(canvas);
	// 	    var material = new THREE.MeshPhongMaterial({map: texture});
	// 		var book = new BookObject(dataObject, geometry, material);

	// 		canvas.width = canvas.height = Data.TEXTURE_RESOLUTION;
	// 		book.texture.load(dataObject.texture, false, function () {
	// 			book.cover.load(dataObject.cover, true, function () {
	// 				book.updateTexture();
	// 				done(book, dataObject);
	// 			});
	// 		});
	// 	});
	// };	

	return SectionObject;
});