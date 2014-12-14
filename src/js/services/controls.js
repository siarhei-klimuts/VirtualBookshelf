angular.module('VirtualBookshelf')
.factory('Controls', function (BookObject, ShelfObject, SectionObject, Camera, UI, navigation, environment) {
	var Controls = {};

	Controls.BUTTONS_ROTATE_SPEED = 100;
	Controls.BUTTONS_GO_SPEED = 0.02;

	Controls.Pocket = {
		_books: {},

		selectObject: function(target) {
			var 
				dataObject = this._books[target.value]

			Data.createBook(dataObject, function (book, dataObject) {
				Controls.Pocket.remove(dataObject.id);
				Controls.selected.select(book, null);
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

	Controls.selected = {
		object: null,
		parent: null,
		getted: null,
		point: null,

		isBook: function() {
			return this.object instanceof BookObject;
		},
		isSection: function() {
			return this.object instanceof SectionObject;
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
		},
		select: function(object, point) {
			this.clear();

			this.object = object;
			this.point = point;
		},
		release: function() {
			if(this.isBook() && !this.object.parent) {
				Controls.Pocket.put(this.object.dataObject);
				this.clear();
			}

			this.save();
		},
		get: function() {
			if(this.isBook() && !this.isGetted()) {
				this.getted = true;
				this.parent = this.object.parent;
				this.object.position.set(0, 0, -this.object.geometry.boundingBox.max.z - 0.25);
				Camera.camera.add(this.object);			
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

	Controls.mouse = {
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
			projector.unprojectVector(vector, Camera.camera);
		
			return vector.sub(Camera.getPosition()).normalize();
		},
		isCanvas: function() {
			return true; //TODO: stub
			// return this.target == VirtualBookshelf.canvas || (this.target && this.target.className == 'ui');
		},
		isPocketBook: function() {
			return !!(this.target && this.target.parentNode == UI.menu.inventory.books);
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
			raycaster = new THREE.Raycaster(Camera.getPosition(), vector);
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

	Controls.init = function() {
		Controls.clear();
		Controls.initListeners();
	};

	Controls.initListeners = function() {
		document.addEventListener('dblclick', Controls.onDblClick, false);
		document.addEventListener('mousedown', Controls.onMouseDown, false);
		document.addEventListener('mouseup', Controls.onMouseUp, false);
		document.addEventListener('mousemove', Controls.onMouseMove, false);	
		document.oncontextmenu = function() {return false;}
	};

	Controls.clear = function() {
		Controls.selected.clear();	
	};

	Controls.update = function() {
		var mouse = Controls.mouse; 

		if(!Controls.selected.isGetted()) {
			if(mouse[3]) {
				Camera.rotate(mouse.longX, mouse.longY);
			}

			if((mouse[1] && mouse[3]) || navigation.state.forward) {
				Camera.go(this.BUTTONS_GO_SPEED);
			} else if(navigation.state.backward) {
				Camera.go(-this.BUTTONS_GO_SPEED);
			} else if(navigation.state.left) {
				Camera.rotate(this.BUTTONS_ROTATE_SPEED, 0);
			} else if(navigation.state.right) {
				Camera.rotate(-this.BUTTONS_ROTATE_SPEED, 0);
			}
		}
	};

	// Events

	Controls.onDblClick = function(event) {
		if(Controls.mouse.isCanvas()) {
			switch(event.which) {
				case 1: Controls.selected.get(); break;
			}   	
		}
	};

	Controls.onMouseDown = function(event) {
		var mouse = Controls.mouse; 
		mouse.down(event); 

		if(mouse.isCanvas() || mouse.isPocketBook()) {
			// event.preventDefault();//TODO: research (enabled cannot set cursor to input)

			if(mouse[1] && !mouse[3] && !Controls.selected.isGetted()) {
				if(mouse.isCanvas()) {
					Controls.selectObject();
				} else if(mouse.isPocketBook()) {
					Controls.Pocket.selectObject(mouse.target);
				}
			}
		}
	};

	Controls.onMouseUp = function(event) {
		Controls.mouse.up(event);
		
		switch(event.which) {
			 case 1: Controls.selected.release(); break;
		}
	};

	Controls.onMouseMove = function(event) {
		var mouse = Controls.mouse; 
		mouse.move(event);

		if(mouse.isCanvas()) {
			event.preventDefault();

		 	if(!Controls.selected.isGetted()) {
				if(mouse[1] && !mouse[3]) {		
					Controls.moveObject();
				}
			} else {
				var obj = Controls.selected.object;

				if(obj instanceof BookObject) {
					if(mouse[1]) {
						obj.moveElement(mouse.dX, mouse.dY, UI.menu.createBook.edited);
					}
					if(mouse[2] && UI.menu.createBook.edited == 'cover') {
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

	Controls.selectObject = function() {
		var
			intersected,
			object,
			point;

		if(Controls.mouse.isCanvas() && environment.library) {
			intersected = Controls.mouse.getIntersected(environment.library.children, true, [SectionObject, BookObject]);
			if(intersected) {
				object = intersected.object;
				point = intersected.point; 
			}

			Controls.selected.select(object, point);
		}
	};

	Controls.moveObject = function() {
		var 
			mouseVector,
			newPosition,
			intersected,
			parent,
			oldParent;

		if(Controls.selected.isBook() || (Controls.selected.isSection()/* && UI.menu.sectionMenu.isMoveOption()*/)) {
			mouseVector = Camera.getVector();	
			newPosition = Controls.selected.object.position.clone();
			oldParent = Controls.selected.object.parent;

			if(Controls.selected.isBook()) {
				intersected = Controls.mouse.getIntersected(environment.library.children, true, [ShelfObject]);
				Controls.selected.object.setParent(intersected ? intersected.object : null);
			}

			parent = Controls.selected.object.parent;
			if(parent) {
				parent.localToWorld(newPosition);

				newPosition.x -= (mouseVector.z * Controls.mouse.dX + mouseVector.x * Controls.mouse.dY) * 0.003;
				newPosition.z -= (-mouseVector.x * Controls.mouse.dX + mouseVector.z * Controls.mouse.dY) * 0.003;

				parent.worldToLocal(newPosition);
				if(!Controls.selected.object.move(newPosition) && Controls.selected.isBook()) {
					if(parent !== oldParent) {
						Controls.selected.object.setParent(oldParent);
					}
				}
			}
		}/* else if(UI.menu.sectionMenu.isRotateOption() && Controls.selected.isSection()) {
			Controls.selected.object.rotate(Controls.mouse.dX);			
		}*/
	};

	return Controls;	
});