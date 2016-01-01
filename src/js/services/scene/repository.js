import THREE from 'three';

var jsonLoader = new THREE.JSONLoader();
var dataLoader = new THREE.XHRLoader();
dataLoader.setResponseType('json');

export function loadLibraryData(model) {
	var path = `/obj/libraries/${model}`;
    var modelUrl = `${path}/model.json`;
    var mapUrl = `${path}/map.jpg`;

    return Promise.all([
    	loadGeometry(modelUrl),
    	loadImage(mapUrl)
    ]);
}

export function loadSectionData(model) {
	var path = `/obj/sections/${model}`;
    var modelUrl = `${path}/model.js`;
    var mapUrl = `${path}/map.jpg`;
    var dataUrl = `${path}/data.json`;

    return Promise.all([
    	loadGeometry(modelUrl), 
    	loadImage(mapUrl), 
    	loadData(dataUrl)
    ]).then(sectionData => (
    	{
    		geometry: sectionData[0],
    		mapImage: sectionData[1],
    		data: sectionData[2]
    	}
    ));
}

function loadGeometry(url) {
	return new Promise((resolve, reject) => {
		jsonLoader.load(url, geometry => {
			geometry.computeBoundingBox();
			resolve(geometry);
		}, () => {}, reject);
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

function loadData(url) {
	return new Promise((resolve, reject) => {
		dataLoader.load(url, resolve, () => {}, reject);
	});
}