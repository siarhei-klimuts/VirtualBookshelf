var VirtualBookshelf = VirtualBookshelf || {};

VirtualBookshelf.loader = new THREE.OBJMTLLoader();
VirtualBookshelf.user;
VirtualBookshelf.scene;
VirtualBookshelf.width;
VirtualBookshelf.height;

// Objects

VirtualBookshelf.Library = function(params) {
	THREE.Object3D.call(this);
	var scope = this;

	this.id = params.id;
	this.libraryObject = params.libraryObject || {};
	this.modelPath = '/obj/libraries/{model}/'.replace('{model}', this.libraryObject.model);

	VirtualBookshelf.loader.load(this.modelPath + 'model.obj', this.modelPath + 'model.mtl', function (object) {
		scope.add(object);
	});

	this.loadSections();
}
VirtualBookshelf.Library.prototype = new THREE.Object3D();
VirtualBookshelf.Library.prototype.constructor = VirtualBookshelf.Library;

VirtualBookshelf.Library.prototype.loadSections = function() {
	var library = this;

	$.ajax({url: '/sections/' + library.id, type: 'GET', success: function(data) {
		if(data) {
			for(key in data) {
				library.add(new VirtualBookshelf.Section(data[key]));
			}
		}
	}});
}
//***

VirtualBookshelf.Section = function(params) {
	THREE.Object3D.call(this);
	var section = this;

	this.id = params.id;
	this.position = new THREE.Vector3(params.pos_x, params.pos_y, params.pos_z);
	this.sectionObject = params.sectionObject || {};
	this.modelPath = '/obj/sections/{model}/'.replace('{model}', this.sectionObject.model);

	VirtualBookshelf.loader.load(this.modelPath + 'model.obj', this.modelPath + 'model.mtl', function ( object ) {
		section.add(object);
	});
	
	this.loadShelfs();
}
VirtualBookshelf.Section.prototype = new THREE.Object3D();
VirtualBookshelf.Section.prototype.constructor = VirtualBookshelf.Section;

VirtualBookshelf.Section.prototype.loadShelfs = function() {	
	var section = this;

	$.ajax({url: '/shelves/' + section.sectionObject.id, type: 'GET', success: function(data) {
		if(data) {
			for(key in data) {
				section.add(new VirtualBookshelf.Shelf(data[key], section.id));
			}
		}
	}});
}
//***

VirtualBookshelf.Shelf = function(params, sectionId) {
	THREE.Object3D.call(this);

	this.id = params.id;
	this.size = new THREE.Vector3(params.size_x, params.size_y, params.size_z);
	this.position = new THREE.Vector3(params.pos_x, params.pos_y, params.pos_z);
	this.sectionId = sectionId; 

	var shapeGeometry = new THREE.CubeGeometry(this.size.x, this.size.y, this.size.z);
	var shapeMaterial = new THREE.MeshLambertMaterial({color: 0x961818, shading: THREE.SmoothShading});
	shapeMaterial.side = THREE.BackSide;
	var shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
	shape.position.y = this.size.y * 0.5;
	this.add(shape);

	this.loadBooks();
}
VirtualBookshelf.Shelf.prototype = new THREE.Object3D();
VirtualBookshelf.Shelf.prototype.constructor = VirtualBookshelf.Shelf;

VirtualBookshelf.Shelf.prototype.loadBooks = function() {
	var shelf = this;

	$.ajax({url: '/books/' + shelf.sectionId + '/' + shelf.id, type: 'GET', success: function(data) {
		if(data) {
			for(key in data) {
				shelf.add(new VirtualBookshelf.Book(data[key]));
			}
		}
	}});
}
//***

VirtualBookshelf.Book = function(params) {
	THREE.Mesh.call(this);
	var scope = this;

	this.shelf = params.shelf;
	this.size = params.size || new THREE.Vector3(10,10,10);
	this.color = params.color || 0xdddddd || 0x101030 || 0xffeedd;
	this.position = new THREE.Vector3(params.pos_x, params.pos_y, params.pos_z);

	VirtualBookshelf.loader.load('/obj/books/book_0001/model.obj', '/obj/books/book_0001/model.mtl', function (object) {
		//object.scale = scope.size;
		scope.add(object);
	});	
	this.geometry = new THREE.CubeGeometry(2,8,7);
	this.material = new THREE.MeshLambertMaterial({color: this.color, shading: THREE.SmoothShading});
	this.visible = false;
}
VirtualBookshelf.Book.prototype = new THREE.Mesh();
VirtualBookshelf.Book.prototype.constructor = VirtualBookshelf.Book;
VirtualBookshelf.Book.prototype.margin = 0.1;
VirtualBookshelf.Book.prototype.width = 2;

// main

VirtualBookshelf.start = function() {
	if(!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}

	var camera;
	var renderer;
	var projector;

	VirtualBookshelf.init();
	VirtualBookshelf.startRenderLoop();
	VirtualBookshelf.UI.init();


}

VirtualBookshelf.init = function() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	VirtualBookshelf.width = width;
	VirtualBookshelf.height = height;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	VirtualBookshelf.container = document.getElementById('LIBRARY');
	VirtualBookshelf.container.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
	camera.position = new THREE.Vector3(0,3,2);

	VirtualBookshelf.controls = VirtualBookshelf.initControl(camera);

	projector = new THREE.Projector();
	
	var ambient = new THREE.AmbientLight(0x111111);
	var directionalLight = new THREE.PointLight( 0x999999, 1, 100);
	directionalLight.position.set(0, 1, 0);

	VirtualBookshelf.scene = new THREE.Scene();
	VirtualBookshelf.scene.add(ambient);
	VirtualBookshelf.scene.add(directionalLight);

	VirtualBookshelf.initControls(document);
}

VirtualBookshelf.initControl = function(camera) {
	var controls = new THREE.OrbitControls(camera);
	controls.addEventListener('change', VirtualBookshelf.render);

	return controls;	
}

VirtualBookshelf.startRenderLoop = function() {
	requestAnimationFrame(VirtualBookshelf.startRenderLoop);
	VirtualBookshelf.controls.update();
	VirtualBookshelf.render();
}

VirtualBookshelf.render = function() {
	renderer.render(VirtualBookshelf.scene, camera);
}

VirtualBookshelf.saveUser = function(user) {
	VirtualBookshelf.user = user;
}

// events 

$(document).ready(function() {
	VirtualBookshelf.start();

	$.ajax({
    	url: "/library", 
		type: 'GET',
    	success: function(data) {
    		console.log('data',data);
    		if(!data) return;

    	}
    });

	// $.ajax({
 //    	url: "/library", 
	// 	type: 'GET',
 //    	success: function(data) {
 //    		if(!data) return;

	// 		VirtualBookshelf.scene.add(new VirtualBookshelf.Library(data));
 //    	}
 //    });
});
