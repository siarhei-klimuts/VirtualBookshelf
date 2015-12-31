import THREE from 'three';

var jsonLoader = new THREE.JSONLoader();

export function loadLibraryData(model) {
	var path = `/obj/libraries/${model}`;
    var modelUrl = `${path}/model.json`;
    var mapUrl = `${path}/map.jpg`;

    return Promise.all([
    	loadGeometry(modelUrl),
    	loadImage(mapUrl)
    ]);
}

function loadGeometry(url) {
	return new Promise((resolve, reject) => {
		jsonLoader.load(url, function (geometry) {
			geometry.computeBoundingBox();
			resolve(geometry);
		}, function () {}, reject);
	});
}

function loadImage(url) {
    var img = new Image();
        
    img.crossOrigin = ''; 
    img.src = url;

    return new Promise((resolve, reject) => {
    	img.onload = function() {
    		resolve(img);
    	};

    	img.onerror = function(err) {
    		reject(err);
    	};
    });
}