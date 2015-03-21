angular.module('VirtualBookshelf')
.factory('BookMaterial', function () {
	var BookMaterial = function(mapImage, bumpMapImage, specularMapImage, coverMapImage) {
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

	var vertexShader = [
		'varying vec3 vViewPosition;',
		'varying vec3 vNormal;',

		THREE.ShaderChunk.map_pars_vertex,
		THREE.ShaderChunk.lights_phong_pars_vertex,
		THREE.ShaderChunk.color_pars_vertex,

		'void main() {',
			THREE.ShaderChunk.map_vertex,
			THREE.ShaderChunk.color_vertex,
			THREE.ShaderChunk.defaultnormal_vertex,
			'vNormal = normalize(transformedNormal);',
			THREE.ShaderChunk.default_vertex,
			'vViewPosition = -mvPosition.xyz;',
			THREE.ShaderChunk.worldpos_vertex,
			THREE.ShaderChunk.lights_phong_vertex,
		'}'
	].join('\n');

	var fragmentShader = [
		'uniform vec3 diffuse;',
		'uniform float opacity;',

		'uniform vec3 ambient;',
		'uniform vec3 emissive;',
		'uniform vec3 specular;',
		'uniform float shininess;',

		'uniform sampler2D coverMap;',

		THREE.ShaderChunk.color_pars_fragment,
		THREE.ShaderChunk.map_pars_fragment,
		THREE.ShaderChunk.fog_pars_fragment,
		THREE.ShaderChunk.lights_phong_pars_fragment,
		THREE.ShaderChunk.bumpmap_pars_fragment,
		THREE.ShaderChunk.specularmap_pars_fragment,

		'void main() {',
			'vec4 testcolor = vec4(1.0, 1.0, 1.0, 1.0);',
			'float eps = 0.004;',
			'vec4 baseColor  = texture2D(map, vUv);',

			'#ifdef USE_COVER',
		    	'vec4 coverColor = texture2D(coverMap, vUv * vec2(2.3, 1.3) - vec2(1.3, 0.3));',
			    'if(vUv.y > 0.23 && (vUv.x > 0.57 || (all(greaterThanEqual(baseColor,testcolor-eps)) && all(lessThanEqual(baseColor,testcolor+eps)))))',
			    	'gl_FragColor = coverColor;',
			    'else',
			    	'gl_FragColor = baseColor;',
			'#else',
		    	'gl_FragColor = baseColor;',
			'#endif',

			THREE.ShaderChunk.specularmap_fragment,
			THREE.ShaderChunk.lights_phong_fragment,
			THREE.ShaderChunk.color_fragment,
			THREE.ShaderChunk.fog_fragment,
		'}'		
	].join('\n');

	return BookMaterial;
});