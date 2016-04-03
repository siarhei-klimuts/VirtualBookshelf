import * as lib3d from 'lib3d';

import './ui/block';
import './ui/tools';
import './ui/tooltip';

angular.module('VirtualBookshelf')
.factory('controls', function ($q, $log, $rootScope, block, tools, data, tooltip) {
	var controls = {};

	controls.init = function() {
		document.addEventListener('mousedown', onMouseDown, false);
		document.addEventListener('mouseup', onMouseUp, false);
		document.addEventListener('mousemove', onMouseMove, false);	
		document.oncontextmenu = function() {return false;};

		lib3d.events.onObjectChange(onObjectChange);
		lib3d.events.onFocus(onFocus);
		lib3d.events.onSelect(onSelect);
	};

	function onMouseDown(event) {
		if (isCanvas(event)) {
			//TODO: move to onSelect
			if(tools.placing) {
				tools.place();
			}

			lib3d.onMouseDown(event);

			navigate();
		}
	}

	function onMouseUp(event) {
		lib3d.onMouseUp(event);
		lib3d.navigation.goStop();
	}

	function onMouseMove(event) {
		if(isCanvas(event)) {
			lib3d.onMouseMove(event);
			navigate();
		}
	}

	function onObjectChange(obj) {
		if (!obj)
			return;

		block.global.start();

		postObject(obj)
			.then(function (newDto) {
				obj.dataObject = newDto;
			})
			.catch(function () {
				obj.rollback();
			})
			.finally(function () {
				block.global.stop();
			});
	}

	function onFocus(obj) {
		tooltip.set(obj);
		$rootScope.$apply();
	}

	function onSelect(obj) {
		$rootScope.$apply();
	}

	function postObject(obj) {
		if (obj instanceof lib3d.BookObject) {
			return data.postBook(obj.getDto());
		} else if (obj instanceof lib3d.SectionObject) {
			return data.postSection(obj.getDto());
		}
	}

	function isCanvas(event) {
		return event.target.id === data.LIBRARY_CANVAS_ID;
	}

	function navigate() {
		if (!lib3d.preview.isActive() && lib3d.mouse.keys[3]) {
			lib3d.navigation.rotate(lib3d.mouse.longX, lib3d.mouse.longY);
			if (lib3d.mouse.keys[1]) {
				lib3d.navigation.goForward();
			}
		}
	}

	return controls;	
});