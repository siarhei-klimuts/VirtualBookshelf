import {ShelfObject} from 'lib3d';
import {BookObject} from 'lib3d';
import {SectionObject} from 'lib3d';
import {SelectorMeta} from 'lib3d';
import {camera} from 'lib3d';
import {mouse} from 'lib3d';
import {preview} from 'lib3d';
import {selector} from 'lib3d';
import {navigation} from 'lib3d';

import * as lib3d from 'lib3d';

import './ui/block';
import './ui/tools';
import './ui/tooltip';

angular.module('VirtualBookshelf')
/* 
 * controls.js is a service for processing not UI(menus) events 
 * like mouse, keyboard, touch or gestures.
 *
 * TODO: remove all busines logic from there and leave only
 * events functionality to make it more similar to usual controller
 */
.factory('controls', function ($q, $log, $rootScope, block, tools, data, tooltip) {
	var controls = {};

	controls.init = function() {
		controls.initListeners();
	};

	controls.initListeners = function() {
		document.addEventListener('mousedown', controls.onMouseDown, false);
		document.addEventListener('mouseup', controls.onMouseUp, false);
		document.addEventListener('mousemove', controls.onMouseMove, false);	
		document.oncontextmenu = function() {return false;};

		lib3d.events.onObjectChange(obj => controls.saveObject(obj));
	};

	controls.update = function() {
		if(!preview.isActive()) {
			if(mouse.keys[3]) {
				camera.rotate(mouse.longX, mouse.longY);
			}
			if(mouse.keys[1] && mouse.keys[3]) {
				camera.go(navigation.BUTTONS_GO_SPEED);
			}
		}
	};

	controls.onMouseDown = function(event) {
		if (isCanvas(event)) {
			if(tools.placing) {
				tools.place();
			}

			lib3d.onMouseDown(event);
			$rootScope.$apply();
		}
	};

	controls.onMouseUp = function(event) {
		lib3d.onMouseUp(event);
	};

	controls.onMouseMove = function(event) {
		if(isCanvas(event)) {
			lib3d.onMouseMove(event);

			//TODO: apply on change ONLY
			$rootScope.$apply();
			tooltip.set(selector.getFocusedObject());
		}
	};

	controls.saveObject = function(obj) {
		if (obj && obj.changed) {
			block.global.start();

			controls.postObject(obj)
			.then(function (newDto) {
				obj.dataObject = newDto;
				obj.changed = false;
			})
			.catch(function () {
				obj.rollback();
			})
			.finally(function () {
				block.global.stop();
			});
		}
	};

	controls.postObject = function(obj) {
		if (obj instanceof BookObject) {
			return data.postBook(obj.getDto());
		} else if (obj instanceof SectionObject) {
			return data.postSection(obj.getDto());
		}
	};

	var isCanvas = function(event) {
		return event.target.id === data.LIBRARY_CANVAS_ID;
	};

	return controls;	
});