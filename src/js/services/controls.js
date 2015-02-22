angular.module('VirtualBookshelf')
/* 
 * controls.js is a service for processing not UI(menus) events 
 * like mouse, keyboard, touch or gestures.
 *
 * TODO: remove all busines logic from there and leave only
 * events functionality to make it more similar to usual controller
 */
.factory('Controls', function ($q, $log, SelectorMeta, BookObject, ShelfObject, SectionObject, Camera, navigation, environment, mouse, selector) {
	var Controls = {};

	Controls.BUTTONS_ROTATE_SPEED = 100;
	Controls.BUTTONS_GO_SPEED = 0.02;

	Controls.init = function() {
		Controls.initListeners();
	};

	Controls.initListeners = function() {
		document.addEventListener('mousedown', Controls.onMouseDown, false);
		document.addEventListener('mouseup', Controls.onMouseUp, false);
		document.addEventListener('mousemove', Controls.onMouseMove, false);	
		document.oncontextmenu = function() {return false;};
	};

	Controls.update = function() {
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
	};

	Controls.onMouseDown = function(event) {
		mouse.down(event); 

		if(mouse.isCanvas() && mouse[1] && !mouse[3]) {
			Controls.selectObject();
			selector.selectFocused();
		}
	};

	Controls.onMouseUp = function(event) {
		mouse.up(event);
		
		if(event.which === 1) {
			if(selector.isSelectedEditable()) {
				var obj = selector.getSelectedObject();

				if(obj.changed) {
					obj.save();
				}
			}
		}
	};

	Controls.onMouseMove = function(event) {
		mouse.move(event);

		if(mouse.isCanvas()) {
			event.preventDefault();

			if(mouse[1] && !mouse[3]) {		
				Controls.moveObject();
			} else {
				Controls.selectObject();
			}
		}
	};

	//****

	Controls.selectObject = function() {
		var
			intersected,
			object;

		if(mouse.isCanvas() && environment.library) {
			//TODO: optimize
			intersected = mouse.getIntersected(environment.library.children, true, [BookObject]);
			if(!intersected) {
				intersected = mouse.getIntersected(environment.library.children, true, [ShelfObject]);
			}
			if(!intersected) {
				intersected = mouse.getIntersected(environment.library.children, true, [SectionObject]);
			}
			if(intersected) {
				object = intersected.object;
			}

			selector.focus(new SelectorMeta(object));
		}
	};

	Controls.moveObject = function() {
		var mouseVector;
		var newPosition;
		var intersected;
		var parent;
		var oldParent;
		var selectedObject;

		if(selector.isSelectedEditable()) {
			selectedObject = selector.getSelectedObject();
			mouseVector = Camera.getVector();	

			newPosition = selectedObject.position.clone();
			oldParent = selectedObject.parent;

			if(selector.isSelectedBook()) {
				intersected = mouse.getIntersected(environment.library.children, true, [ShelfObject]);
				selectedObject.setParent(intersected ? intersected.object : null);
			}

			parent = selectedObject.parent;
			if(parent) {
				parent.localToWorld(newPosition);

				newPosition.x -= (mouseVector.z * mouse.dX + mouseVector.x * mouse.dY) * 0.003;
				newPosition.z -= (-mouseVector.x * mouse.dX + mouseVector.z * mouse.dY) * 0.003;

				parent.worldToLocal(newPosition);
				if(!selectedObject.move(newPosition) && selector.isSelectedBook()) {
					if(parent !== oldParent) {
						selectedObject.setParent(oldParent);
					}
				}
			}
		}
	};

	return Controls;	
});