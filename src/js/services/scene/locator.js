angular.module('VirtualBookshelf')
.factory('locator', function ($q, Data, selector, environment, cache) {
	var locator = {};

	locator.placeBook = function(bookDto) {
		var promise;
		var shelf = selector.isSelectedShelf() && selector.getSelectedObject();

		if(shelf) {
			promise = cache.getBook(bookDto.model).then(function (bookCache) {
				var shelfBB = shelf.geometry.boundingBox;
				var bookBB = bookCache.geometry.boundingBox;
				var freePlace = getFreePlace(shelf.children, shelfBB, bookBB);

				if(freePlace) {
					bookDto.shelfId = shelf.id;
					bookDto.sectionId = shelf.parent.id;
					bookDto.pos_x = freePlace.x;
					bookDto.pos_y = freePlace.y;
					bookDto.pos_z = freePlace.z;

					return Data.postBook(bookDto);
				} else {
					return $q.reject('there is no free space');
				}
			}).then(function () {
				return environment.updateBook(bookDto);
			});
		} else {
			promise = $q.reject('shelf is not selected');
		}

		return promise;
	};

	locator.unplaceBook = function(bookDto) {
		var promise;
		bookDto.sectionId = null;

		promise = Data.postBook(bookDto).then(function () {
			return environment.updateBook(bookDto);
		});

		return promise;
	};

	var getFreePlace = function(objects, spaceBB, targetBB) {
		var matrixPrecision = new THREE.Vector3(targetBB.max.x - targetBB.min.x, 0, 0);
		var occupiedMatrix = getOccupiedMatrix(objects, matrixPrecision);
		var freeCells = getFreeMatrixCells(occupiedMatrix, spaceBB, targetBB, matrixPrecision);
		var result;

		if(freeCells) {
			var freePosition = getPositionFromCells(freeCells, matrixPrecision);
			var bottomY = getBottomY(spaceBB, targetBB);

			result = new THREE.Vector3(freePosition, bottomY, 0);
		}

		return result
	};

	var getBottomY = function(spaceBB, targetBB) {
		return spaceBB.min.y - targetBB.min.y;
	};

	var getFreeMatrixCells = function(occupiedMatrix, spaceBB, targetBB, matrixPrecision) {
		var result = null;
		var targetCellsSize = 1;
		var freeCellsCount = 0;
		var freeCellsStart;
		var cellIndex;

		var minCell = Math.floor(spaceBB.min.x / matrixPrecision.x) + 1;
		var maxCell = Math.floor(spaceBB.max.x / matrixPrecision.x) - 1;

		for (cellIndex = minCell; cellIndex <= maxCell; cellIndex++) {
			if (!occupiedMatrix[cellIndex]) {
				if (!freeCellsCount) {
					freeCellsStart = cellIndex;
				}
				freeCellsCount++;

				if(freeCellsCount === targetCellsSize) {
					break;
				}
			} else {
				freeCellsCount = 0;
				freeCellsStart = null;
			}
		}

		if(freeCellsCount) {
			result = [];

			for (cellIndex = freeCellsStart; cellIndex < freeCellsStart + freeCellsCount; cellIndex++) {
				result.push(cellIndex);
			}
		}

		return result;
	};

	var getPositionFromCells = function(cells, matrixPrecision) {
		var size = cells.length * matrixPrecision.x;
		var result = cells[0] * matrixPrecision.x + size * 0.5;

		return result;
	};

	var getOccupiedMatrix = function(objects, matrixPrecision) {
		var result = {};

		for (var objectIndex = objects.length - 1; objectIndex >= 0; objectIndex--) {
			var objectBB = objects[objectIndex].geometry.boundingBox;
			var objPos = objects[objectIndex].position;
			var minKey = Math.floor((objPos.x + objectBB.min.x) / matrixPrecision.x);
			var maxKey = Math.floor((objPos.x + objectBB.max.x) / matrixPrecision.x);

			result[minKey] = true;
			result[maxKey] = true;
		}

		return result;
	};

	return locator;	
});