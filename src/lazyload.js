import getInstanceSettings from "./lazyload.defaults";
import purgeElements from "./lazyload.purge";
import autoInitialize from "./lazyload.autoInitialize";
import revealElement from "./lazyload.reveal";
import {
	isIntersecting,
	getObserverSettings
} from "./lazyload.intersectionObserver";
import {
	runningOnBrowser,
	supportsIntersectionObserver
} from "./lazyload.environment";

const LazyLoad = function(customSettings, elements) {
	this._settings = getInstanceSettings(customSettings);
	this._setObserver();
	this.update(elements);
};

LazyLoad.prototype = {
	_setObserver: function() {
		if (!supportsIntersectionObserver) {
			return;
		}
		const revealIntersectingElements = entries => {
			entries.forEach(entry => {
				if (isIntersecting(entry)) {
					let element = entry.target;
					this.load(element);
					this._observer.unobserve(element);
				}
			});
			this._elements = purgeElements(this._elements);
		};
		this._observer = new IntersectionObserver(
			revealIntersectingElements,
			getObserverSettings(this._settings)
		);
	},

	loadAll: function() {
		this._elements.forEach(element => {
			this.load(element);
		});
		this._elements = purgeElements(this._elements);
	},

	update: function(elements) {
		const settings = this._settings;
		const nodeSet =
			elements ||
			settings.container.querySelectorAll(settings.elements_selector);

		this._elements = purgeElements(Array.prototype.slice.call(nodeSet)); // nodeset to array for IE compatibility
		if (this._observer) {
			if (!this._observer.observe) {
				console.warn(
					"The observe method was not found in this._observer",
					this._observer
				);
			}
			this._elements.forEach(element => {
				this._observer.observe(element);
			});
			return;
		}
		// Fallback: load all elements at once
		this.loadAll();
	},

	destroy: function() {
		if (this._observer) {
			purgeElements(this._elements).forEach(element => {
				this._observer.unobserve(element);
			});
			this._observer = null;
		}
		this._elements = null;
		this._settings = null;
	},

	load: function(element, force) {
		revealElement(element, this._settings, force);
	}
};

/* Automatic instances creation if required (useful for async script loading!) */
let autoInitOptions = window.lazyLoadOptions;
if (runningOnBrowser && autoInitOptions) {
	autoInitialize(LazyLoad, autoInitOptions);
}

export default LazyLoad;
