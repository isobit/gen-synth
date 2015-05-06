import Router from 'director';
import Vue from 'vue';

export var pages = [];
export var navPages = [];
export function page(url, name, componentUrl, nav = false) {
	let o = {
		url: url, 
		name: name, 
		loadComponent: function() {
			return System.import(componentUrl)
		}
	};
	pages.push(o);
	if (nav) navPages.push(o);
}

export var router;
export function init(vm, base) {
	var routes = {};
	pages.forEach((c) => routes[c.url] = function(...params) {
		c.loadComponent().then(comp => {
			Vue.component(c.name, comp.default);
			vm.ctrlName = c.name;
			setTimeout(function() {
				// @TODO Find a better way to do this
				vm.$.ctrl.params = params;
			}, 0);
		});
	});
	router = Router(routes);
	router.init(base);
	return router;
}
