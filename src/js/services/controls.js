import {BookObject} from 'lib3d';
import {SectionObject} from 'lib3d';
import {camera} from 'lib3d';
import {mouse} from 'lib3d';
import {preview} from 'lib3d';
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
		initListeners();
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

	function initListeners() {
		document.addEventListener('mousedown', onMouseDown, false);
		document.addEventListener('mouseup', onMouseUp, false);
		document.addEventListener('mousemove', onMouseMove, false);	
		document.oncontextmenu = function() {return false;};

		lib3d.events.onObjectChange(onObjectChange);
		lib3d.events.onFocus(onFocus);
		lib3d.events.onSelect(onSelect);
	}

	function onMouseDown(event) {
		if (isCanvas(event)) {
			//TODO: move to onSelect
			if(tools.placing) {
				tools.place();
			}

			lib3d.onMouseDown(event);
		}
	}

	function onMouseUp(event) {
		lib3d.onMouseUp(event);
	}

	function onMouseMove(event) {
		if(isCanvas(event)) {
			lib3d.onMouseMove(event);
		}
	}

	function onObjectChange(obj) {
		if (obj && obj.changed) {
			block.global.start();

			postObject(obj)
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
	}

	function onFocus(obj) {
		tooltip.set(obj);
		$rootScope.$apply();
	}

	function onSelect(obj) {
		$rootScope.$apply();
	}

	function postObject(obj) {
		if (obj instanceof BookObject) {
			return data.postBook(obj.getDto());
		} else if (obj instanceof SectionObject) {
			return data.postSection(obj.getDto());
		}
	}

	function isCanvas(event) {
		return event.target.id === data.LIBRARY_CANVAS_ID;
	}

	return controls;	
});