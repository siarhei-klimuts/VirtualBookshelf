var THREE = require('three');

describe('gridCalculator.js', function () {
	var gridCalculator;

	beforeEach(angular.mock.module('VirtualBookshelf'));
	
	beforeEach(function () {
		inject(function (_gridCalculator_) {
			gridCalculator = _gridCalculator_;
		});
	});

	it('should calculate right cells from positions', function () {
		var radiuses = [0.8, 0.15, 2.5, 3.3, 0.001];
		var cells = 5;
		var EDGE = 0.000001;

		radiuses.forEach(function (radius) {
			var precision = new THREE.Vector3(radius * 2, 0, radius * 2);
			var cell;
			var pos;
			var cellPos;

			for(var i = -cells; i <= cells; i++) {
				pos = i * radius * 2;
				cell = gridCalculator.posToCell(new THREE.Vector3(pos, 0, pos), precision);
				expect(cell.x).toBe(i);
				expect(cell.z).toBe(i);

				cellPos = gridCalculator.cellToPos(cell, precision);
				expect(cellPos.x).toBe(pos);
				expect(cellPos.z).toBe(pos);

				pos = i * radius * 2 + radius - EDGE;
				cell = gridCalculator.posToCell(new THREE.Vector3(pos, 0, pos), precision);
				expect(cell.x).toBe(i);
				expect(cell.z).toBe(i);

				pos = i * radius * 2 - radius + EDGE;
				cell = gridCalculator.posToCell(new THREE.Vector3(pos, 0, pos), precision);
				expect(cell.x).toBe(i);
				expect(cell.z).toBe(i);

				pos = i * radius * 2 + radius + EDGE;
				cell = gridCalculator.posToCell(new THREE.Vector3(pos, 0, pos), precision);
				expect(cell.x).toBe(i + 1);
				expect(cell.z).toBe(i + 1);

				pos = i * radius * 2 - radius - EDGE;
				cell = gridCalculator.posToCell(new THREE.Vector3(pos, 0, pos), precision);
				expect(cell.x).toBe(i - 1);
				expect(cell.z).toBe(i - 1);
			}
		});
	});

	it('should return space grid edges not collided with BB edges', function () {
		var precision = new THREE.Vector3(1.3, 0, 0.8);
		var spaceBB = new THREE.Box3(
			new THREE.Vector3(-5, 0, -3),
			new THREE.Vector3(15, 0, 9)
		);

		var edges = gridCalculator.getEdges(spaceBB, precision);
		
		expect(edges.minXCell).toBe(-3);
		expect(edges.maxXCell).toBe(11);
		expect(edges.minZCell).toBe(-3);
		expect(edges.maxZCell).toBe(10);
	});
});