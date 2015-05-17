angular.module('VirtualBookshelf')
.factory('gridCalculator', function () {
	var gridCalculator = {};

	gridCalculator.getEdges = function(spaceBB, precision) {
		var posMin = this.posToCell(spaceBB.min, precision);
		var posMax = this.posToCell(spaceBB.max, precision);
		
		return {
			minXCell: posMin.x + 1,
			maxXCell: posMax.x - 1,
			minZCell: posMin.z + 1,
			maxZCell: posMax.z - 1
		};
	};

	gridCalculator.posToCell = function(pos, precision) {
		return pos.clone().divide(precision).round();
	};

	gridCalculator.cellToPos = function(cell, precision) {
		return cell.clone().multiply(precision);
	};

	return gridCalculator;
});