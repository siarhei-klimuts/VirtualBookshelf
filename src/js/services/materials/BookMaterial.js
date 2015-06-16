angular.module('VirtualBookshelf')
.factory('BookMaterial', function () {
	var BookMaterial = function(mapImage, bumpMapImage, specularMapImage, coverMapImage) {
		var VERTEX_SHADER_ID = 'BookMaterialVertexShader';
		var FRAGMENT_SHADER_ID = 'BookMaterialFragmentShader';

		var vertexShader = document.getElementById(VERTEX_SHADER_ID).textContent;
		var fragmentShader = document.getElementById(FRAGMENT_SHADER_ID).textContent;

		var defines = {};
		var uniforms;
		var parameters;

        var map;
        var bumpMap;
        var specularMap;
        var coverMap;
		
		uniforms = THREE.UniformsUtils.merge([
			THREE.UniformsLib.common,
			THREE.UniformsLib.bump,
			THREE.UniformsLib.fog,
			THREE.UniformsLib.lights
		]);

		uniforms.shininess = {type: 'f', value: 30};
		defines.PHONG = true;

		if(mapImage) {
			map = new THREE.Texture(mapImage);
			map.needsUpdate = true;
			uniforms.map = {type: 't', value: map};
			this.map = true;
		}
		if(bumpMapImage) {
			bumpMap = new THREE.Texture(bumpMapImage);
			bumpMap.needsUpdate = true;
			uniforms.bumpMap = {type: 't', value: bumpMap};
			uniforms.bumpScale.value = 0.005;
			this.bumpMap = true;
		}
		if(specularMapImage) {
			specularMap = new THREE.Texture(specularMapImage);
			specularMap.needsUpdate = true;
			uniforms.specular = {type: 'c', value: new THREE.Color(0x555555)};
			uniforms.specularMap = {type: 't', value: specularMap};
			this.specularMap = true;
		}
        if(coverMapImage) {
			coverMap = new THREE.Texture(coverMapImage);
			coverMap.needsUpdate = true;
			uniforms.coverMap = {type: 't', value: coverMap};
			defines.USE_COVER = true;
        }

		parameters = {
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: uniforms,
			defines: defines,
			lights: true,
			fog: true
		};

		THREE.ShaderMaterial.call(this, parameters);
	};

	BookMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);

	BookMaterial.prototype.constructor = THREE.BookMaterial;

	return BookMaterial;
});