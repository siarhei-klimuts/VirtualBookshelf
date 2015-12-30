export default class GridCalculator {
	getEdges(spaceBB, precision) {
		var posMin = this.posToCell(spaceBB.min, precision);
		var posMax = this.posToCell(spaceBB.max, precision);
		
		return {
			minXCell: posMin.x + 1,
			maxXCell: posMax.x - 1,
			minZCell: posMin.z + 1,
			maxZCell: posMax.z - 1
		};
	}

	posToCell(pos, precision) {
		return pos.clone().divide(precision).round();
	}

	cellToPos(cell, precision) {
		return cell.clone().multiply(precision);
	}
}