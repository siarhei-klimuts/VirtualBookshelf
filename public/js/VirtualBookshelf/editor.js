VirtualBookshelf.Editor = VirtualBookshelf.Editor || {};

VirtualBookshelf.Editor.getUpdatedTexture = function(params, img) {
	var size = 512;
	var canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	var context = canvas.getContext('2d');

	context.drawImage(img, 0, 0);
	context.font = "Bold 16px Arial";
	context.fillStyle = '#000000';
    context.fillText(params.title, 300, 80);
	context.font = "Bold 12px Arial";
    context.fillText(params.author, 325, 50);
    
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;

	return texture;
}