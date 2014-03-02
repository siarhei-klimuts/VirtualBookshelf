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
		if(bookData.coverPos.length == 4) {
			context.drawImage(coverImage, bookData.coverPos[0], bookData.coverPos[1], bookData.coverPos[2], bookData.coverPos[3]);
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

	bookData.context = context;
	bookData.canvas = canvas;

	return material;
}