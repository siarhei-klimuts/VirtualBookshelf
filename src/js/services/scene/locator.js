import THREE from 'three';

import '../models/BaseObject';
import '../data';
import '../scene/selector';
import '../environment';
import '../cache';
import '../scene/gridCalculator';

angular.module('VirtualBookshelf')
.factory('locator', function ($q, $log, BaseObject, data, selector, environment, cache, gridCalculator) {
	var locator = {};

	var debugEnabled = false;

	locator.centerObject = function(obj) {
		var targetBB = obj.geometry.boundingBox;
		var spaceBB = environment.library.geometry.boundingBox;

		var matrixPrecision = new THREE.Vector3(targetBB.max.x - targetBB.min.x + 0.01, 0, targetBB.max.z - targetBB.min.z + 0.01);
		var occupiedMatrix = getOccupiedMatrix(environment.library.children, matrixPrecision, obj);
		var freePosition = getFreeMatrix(occupiedMatrix, spaceBB, targetBB, matrixPrecision);		

		obj.position.setX(freePosition.x);
		obj.position.setZ(freePosition.z);
	};

	locator.placeSection = function(sectionDto) {
		var promise = cache.getSection(sectionDto.model).then(function (sectionCache) {
			var sectionBB = sectionCache.geometry.boundingBox;
			var libraryBB = environment.library.geometry.boundingBox;
			var freePlace = getFreePlace(environment.library.children, libraryBB, sectionBB);

			return freePlace ?
				saveSection(sectionDto, freePlace) :
				$q.reject('there is no free space');
		}).then(function (newDto) {
			return environment.updateSection(newDto);
		});

		return promise;
	};

	var saveSection = function(dto, position) {
		dto.libraryId = environment.library.getId();
		dto.pos_x = position.x;
		dto.pos_y = position.y;
		dto.pos_z = position.z;

		return data.postSection(dto);
	};

	locator.placeBook = function(bookDto, shelf) {
		var promise = cache.getBook(bookDto.model).then(function (bookCache) {
			var shelfBB = shelf.geometry.boundingBox;
			var bookBB = bookCache.geometry.boundingBox;
			var freePlace = getFreePlace(shelf.children, shelfBB, bookBB);

			return freePlace ? 
				saveBook(bookDto, freePlace, shelf) : 
				$q.reject('there is no free space');
		}).then(function (newDto) {
			return environment.updateBook(newDto);
		});

		return promise;
	};

	var saveBook = function(dto, position, shelf) {
		dto.shelfId = shelf.getId();
		dto.sectionId = shelf.parent.getId();
		dto.pos_x = position.x;
		dto.pos_y = position.y;
		dto.pos_z = position.z;

		return data.postBook(dto);
	};

	locator.unplaceBook = function(bookDto) {
		var promise;
		bookDto.sectionId = null;

		promise = data.postBook(bookDto).then(function () {
			return environment.updateBook(bookDto);
		});

		return promise;
	};

	var getFreePlace = function(objects, spaceBB, targetBB) {
		var matrixPrecision = new THREE.Vector3(targetBB.max.x - targetBB.min.x + 0.01, 0, targetBB.max.z - targetBB.min.z + 0.01);
		var occupiedMatrix = getOccupiedMatrix(objects, matrixPrecision);
		var freePosition = getFreeMatrixCells(occupiedMatrix, spaceBB, targetBB, matrixPrecision);
		
		if (debugEnabled) {
			debugShowFree(freePosition, matrixPrecision, environment.library);
		}

		return freePosition;
	};

	var getFreeMatrix = function(occupiedMatrix, spaceBB, targetBB, matrixPrecision) {
		var DISTANCE = 1.3;

		var xIndex;
		var zIndex;
		var position = {};
		var minPosition = {};
		var edges = gridCalculator.getEdges(spaceBB, matrixPrecision);

		for (zIndex = edges.minZCell; zIndex <= edges.maxZCell; zIndex++) {
			for (xIndex = edges.minXCell; xIndex <= edges.maxXCell; xIndex++) {
				if (!occupiedMatrix[zIndex] || !occupiedMatrix[zIndex][xIndex]) {
					position.pos = getPositionFromCells([xIndex], zIndex, matrixPrecision, spaceBB, targetBB);
					position.length = position.pos.length();

					if(!minPosition.pos || position.length < minPosition.length) {
						minPosition.pos = position.pos;
						minPosition.length = position.length;
					}

					if(minPosition.pos && minPosition.length < DISTANCE) {
						return minPosition.pos;
					}
				}
			}
		}

		return minPosition.pos;
	};

	var getFreeMatrixCells = function(occupiedMatrix, spaceBB, targetBB, matrixPrecision) {
		var targetCellsSize = 1;
		var freeCellsCount = 0;
		var freeCellsStart;
		var xIndex;
		var zIndex;
		var cells;
		var edges = gridCalculator.getEdges(spaceBB, matrixPrecision);

		for (zIndex = edges.minZCell; zIndex <= edges.maxZCell; zIndex++) {
			for (xIndex = edges.minXCell; xIndex <= edges.maxXCell; xIndex++) {
				if (!occupiedMatrix[zIndex] || !occupiedMatrix[zIndex][xIndex]) {
					freeCellsStart = freeCellsStart || xIndex;
					freeCellsCount++;

					if (freeCellsCount === targetCellsSize) {
						cells = _.range(freeCellsStart, freeCellsStart + freeCellsCount);
						return getPositionFromCells(cells, zIndex, matrixPrecision, spaceBB, targetBB);
					}
				} else {
					freeCellsCount = 0;
				}
			}
		}

		return null;
	};

	var getPositionFromCells = function(cells, zIndex, matrixPrecision, spaceBB, targetBB) {
		var center = gridCalculator.cellToPos(new THREE.Vector3(cells[0], 0, zIndex), matrixPrecision);

		var offset = new THREE.Vector3();
		offset.addVectors(targetBB.min, targetBB.max);
		offset.multiplyScalar(-0.5);

		return center.add(offset).setY(getBottomY(spaceBB, targetBB));
	};

	var getBottomY = function(spaceBB, targetBB) {
		return spaceBB.min.y - targetBB.min.y + environment.CLEARANCE;
	};

	var getOccupiedMatrix = function(objects, matrixPrecision, obj) {
		var result = {};
		var objectBB;
		var minKeyX;
		var maxKeyX;
		var minKeyZ;
		var maxKeyZ;		
		var z, x;

		objects.forEach(function (child) {
			if(child instanceof BaseObject && child !== obj) {
				objectBB = child.boundingBox;

				minKeyX = Math.round((objectBB.center.x - objectBB.radius.x) / matrixPrecision.x);
				maxKeyX = Math.round((objectBB.center.x + objectBB.radius.x) / matrixPrecision.x);
				minKeyZ = Math.round((objectBB.center.z - objectBB.radius.z) / matrixPrecision.z);
				maxKeyZ = Math.round((objectBB.center.z + objectBB.radius.z) / matrixPrecision.z);

				for(z = minKeyZ; z <= maxKeyZ; z++) {
					result[z] = result[z] || {};
					var debugCells = [];

					for(x = minKeyX; x <= maxKeyX; x++) {
						result[z][x] = true;
						debugCells.push(x);
					}

					if(debugEnabled) {
						debugShowBB(child);
						debugAddOccupied(debugCells, matrixPrecision, child, z);
					}
				}
			}
		});

		return result;
	};

	locator.debug = function() {
		cache.getSection('bookshelf_0001').then(function (sectionCache) {
			debugEnabled = true;
			var sectionBB = sectionCache.geometry.boundingBox;
			var libraryBB = environment.library.geometry.boundingBox;
			getFreePlace(environment.library.children, libraryBB, sectionBB);
			debugEnabled = false;
		});
	};

	var debugShowBB = function(obj) {
		var objectBB = obj.boundingBox;
		var objBox = new THREE.Mesh(
			new THREE.BoxGeometry(
				objectBB.radius.x * 2, 
				objectBB.radius.y * 2 + 0.1, 
				objectBB.radius.z * 2
			), 
			new THREE.MeshLambertMaterial({
				color: 0xbbbbff,
				opacity: 0.2,
				transparent: true
			})
		);
		
		objBox.position.x = objectBB.center.x;
		objBox.position.y = objectBB.center.y;
		objBox.position.z = objectBB.center.z;

		obj.parent.add(objBox);
	};

	var debugAddOccupied = function(cells, matrixPrecision, obj, zKey) {
		cells.forEach(function (cell) {
			var pos = getPositionFromCells([cell], zKey, matrixPrecision, obj.parent.geometry.boundingBox, obj.geometry.boundingBox);
			var cellBox = new THREE.Mesh(new THREE.BoxGeometry(matrixPrecision.x - 0.01, 0.01, matrixPrecision.z - 0.01), new THREE.MeshLambertMaterial({color: 0xff0000}));
			
			cellBox.position.set(pos.x, pos.y, pos.z);
			obj.parent.add(cellBox);
		});
	};

	var debugShowFree = function(position, matrixPrecision, obj) {
		if (position) {
			var cellBox = new THREE.Mesh(new THREE.BoxGeometry(matrixPrecision.x, 0.5, matrixPrecision.z), new THREE.MeshLambertMaterial({color: 0x00ff00}));
			cellBox.position.set(position.x, position.y, position.z);
			obj.parent.add(cellBox);
		}
	};

	return locator;	
});