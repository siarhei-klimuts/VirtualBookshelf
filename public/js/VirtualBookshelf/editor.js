VirtualBookshelf.Editor = VirtualBookshelf.Editor || {};

VirtualBookshelf.Editor.getBookMaterial = function(bookData, mapImage, coverImage) {
	var size = 512;
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	canvas.width = size;
	canvas.height = size;

	if(mapImage) {
		context.drawImage(mapImage, 0, 0, size, size);
	}
	if(coverImage && bookData.coverPos) {
		var pos = bookData.coverPos.split(',');
		if(pos.length === 4) {
			context.drawImage(coverImage, pos[0], pos[1], pos[2], pos[3]);
		}
	}

	context.font = "Bold 16px Arial";
	context.fillStyle = '#000000';
    context.fillText(bookData.title, 300, 120);
	context.font = "Bold 12px Arial";
    context.fillText(bookData.author, 325, 50);
    
	var texture = new THREE.Texture(canvas);
    var material = new THREE.MeshPhongMaterial({map: texture});
	texture.needsUpdate = true;

	return material;
}