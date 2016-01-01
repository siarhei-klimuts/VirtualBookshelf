import THREE from 'three';

import LibraryObject from 'js/services/models/LibraryObject';
import * as cache from 'js/services/cache';

describe('locator.js', function () {
	var $httpBackend;
	var $q;
	var locator;
	var environment;

	var libraryDto = {
		id: 1,
		model: 'library_0001',
		sections: [],
		userId: 1
	};

	var sectionCache = {
		geometry: new THREE.BoxGeometry(0.774968 * 2, 2.24895 + 0.0449831, 0.309278 + 0.18316),
		data: readJSON('public/obj/sections/bookshelf_0001/data.json')
	};

	beforeEach(angular.mock.module('VirtualBookshelf'));
	
	beforeEach(function () {
		inject(function (_$httpBackend_, _$q_, _$rootScope_, _locator_, _environment_) {
			$httpBackend = _$httpBackend_;
			$q = _$q_;
			locator = _locator_;
			environment = _environment_;
		});

		$httpBackend.when('GET', '/obj/data.json').respond();
		$httpBackend.when('GET', '/user').respond();
		$httpBackend.when('GET', '/library/1').respond(libraryDto);
		$httpBackend.flush();

		var libraryGeometry = new THREE.BoxGeometry(4.15864 * 2, 2.33378 + 1.8178, 4.15864 * 2);
		libraryGeometry.computeBoundingBox();
		sectionCache.geometry.computeBoundingBox();
		
		environment.library = new LibraryObject(null, libraryGeometry);
		spyOn(cache, 'getSection').and.returnValue($q.when(sectionCache));
	});

	afterEach(function() {
		// $httpBackend.verifyNoOutstandingExpectation();
		// $httpBackend.verifyNoOutstandingRequest();
	});	

	it('should place section in left far corner', function () {
		var dto;
		var max = 75;

		for(var i = 1; i <= max + 1; i++) {
			dto = {id: i};
			locator.placeSection(dto);

	     	if(i <= max) {
	     		// $httpBackend.expectPOST('/section', dto).respond(dto);
				// $httpBackend.flush();
			}
		}

		// expect(environment.library.children.length).toBe(max);
		environment.library.children.forEach(function (section) {
			var library = environment.library;

			expect(section.position.x + sectionCache.geometry.boundingBox.min.x).toBeGreaterThan(library.geometry.boundingBox.min.x);
			expect(section.position.x + sectionCache.geometry.boundingBox.max.x).toBeLessThan(library.geometry.boundingBox.max.x);
			expect(section.position.z + sectionCache.geometry.boundingBox.min.z).toBeGreaterThan(library.geometry.boundingBox.min.z);
			expect(section.position.z + sectionCache.geometry.boundingBox.max.z).toBeLessThan(library.geometry.boundingBox.max.z);

			expect(section.isOutOfParrent()).toBeFalsy();
			expect(section.isCollided()).toBeFalsy();
		});
	});
});