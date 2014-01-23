var VirtualBookshelf = VirtualBookshelf || {};

VirtualBookshelf.library = null;
VirtualBookshelf.scene = null;

// Objects

VirtualBookshelf.Library = function(params) {
	THREE.Mesh.call(this);

	this.id = params.id;
	this.size = params.size || new THREE.Vector3(0, 0, 0);
	this.geometry = new THREE.CubeGeometry(this.size.x, this.size.y, this.size.z);
	this.material = new THREE.MeshLambertMaterial({color: 0x961818, shading: THREE.SmoothShading});
	this.material.side = THREE.BackSide;

	this.loadSections();
}
VirtualBookshelf.Library.prototype = new THREE.Mesh();
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
	THREE.Mesh.call(this);

	this.id = params.id;
	this.size = params.size || new THREE.Vector3(20,40,5);
	this.position = new THREE.Vector3(params.pos_x, params.pos_y, params.pos_z);

	this.geometry = new THREE.CubeGeometry(this.size.x, this.size.y, this.size.z);
	this.material = new THREE.MeshLambertMaterial({color: 0x961818, shading: THREE.SmoothShading});
	this.material.side = THREE.BackSide;
	this.loadShelfs(this.id);
}
VirtualBookshelf.Section.prototype = new THREE.Mesh();
VirtualBookshelf.Section.prototype.constructor = VirtualBookshelf.Section;

VirtualBookshelf.Section.prototype.loadShelfs = function() {	
	var section = this;

	$.ajax({url: '/shelves/' + section.id, type: 'GET', success: function(data) {
		if(data) {
			for(key in data) {
				section.add(new VirtualBookshelf.Shelf(data[key]));
			}
		}
	}});
}
//***

VirtualBookshelf.Shelf = function(params) {
	THREE.Mesh.call(this);

	this.id = params.id;
	this.size = params.size || new THREE.Vector3(20, 10, 5);

	this.geometry = new THREE.CubeGeometry(this.size.x, this.size.y, this.size.z);
	this.material = new THREE.MeshLambertMaterial({color: 0x961818, shading: THREE.SmoothShading});
	this.material.side = THREE.BackSide;

	this.loadBooks();
}
VirtualBookshelf.Shelf.prototype = new THREE.Mesh();
VirtualBookshelf.Shelf.prototype.constructor = VirtualBookshelf.Shelf;

VirtualBookshelf.Shelf.prototype.loadBooks = function() {
	var shelf = this;

	$.ajax({url: '/books/' + shelf.id, type: 'GET', success: function(data) {
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

	this.shelf = params.shelf;
	this.color = params.color || 0xdddddd || 0x101030 || 0xffeedd;
	this.position = params.pos || new THREE.Vector3(0,0,0);

	this.geometry = new THREE.CubeGeometry(2,8,7);
	this.material = new THREE.MeshLambertMaterial({color: this.color, shading: THREE.SmoothShading});
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
}

VirtualBookshelf.init = function() {
	VirtualBookshelf.scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.z = 15;

	projector = new THREE.Projector();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById('library').appendChild(renderer.domElement);	

	var ambient = new THREE.AmbientLight(0x111111);
	VirtualBookshelf.scene.add(ambient);
	
	var directionalLight = new THREE.PointLight( 0x999999, 1, 100);
	directionalLight.position.set( 5, 3, 5 );
	VirtualBookshelf.scene.add(directionalLight);

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
}

VirtualBookshelf.startRenderLoop = function() {
	requestAnimationFrame(VirtualBookshelf.startRenderLoop);
	renderer.render(VirtualBookshelf.scene, camera);
}

// events 

function onDocumentMouseDown( event ) {
	event.preventDefault();

	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	var intersects = raycaster.intersectObjects(VirtualBookshelf.library.children[0].children[0].children);

	if(intersects.length > 0) {
		console.log(intersects[0].object instanceof VirtualBookshelf.Book);
	}
}

$(document).ready(function() {
	VirtualBookshelf.start();

	$.ajax({
    	url: "/library", 
		type: 'GET',
    	success: function(data) {
    		if(!data) return;

			VirtualBookshelf.library = new VirtualBookshelf.Library(data);
			VirtualBookshelf.scene.add(VirtualBookshelf.library);
    	}
    });
});
