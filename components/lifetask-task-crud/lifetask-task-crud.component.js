/* global angular, importStyle */

importStyle('components/lifetask-task-crud/lifetask-task-crud.css', { preload: true });

class LifetaskTaskCrud {
	constructor() {
		this.templateUrl = 'components/lifetask-task-crud/lifetask-task-crud.html';
		this.bindings = {};
		this.controller = LifetaskTaskCrudController;
	}
}

class LifetaskTaskCrudController {
	static get $inject() { return ['$element', '$ngRedux']; }

	constructor($element, $ngRedux) {
		Object.assign(this, { $: $element[0], $ngRedux });

		this.__lifetaskBehavior = $ngRedux.connect(behavior =>
			Object({
				session: behavior.session,
				task: behavior.task,
				reward: behavior.reward
			})
		)(this);
	}

	/* Lifecycle */
	$onInit() { }

	$onDestroy() {
		this.__lifetaskBehavior();
	}
	/* */

	/* Public */
	/* */

	/* Private */
	/* */

	/* Protected */
	/* */

	/* Observers */
	/* */
}

angular.module('lifeTask').component('lifetaskTaskCrud', new LifetaskTaskCrud());
