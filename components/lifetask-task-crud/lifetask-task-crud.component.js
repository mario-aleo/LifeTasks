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
	static get $inject() { return ['$element', '$ngRedux', '$state']; }

	constructor($element, $ngRedux, $state) {
		Object.assign(this, { $: $element[0], $ngRedux, $state });

		this.__lifetaskBehavior = $ngRedux.connect(behavior =>
			Object({
				id: behavior.task.task.id,
				title: behavior.task.task.title,
				description: behavior.task.task.description,
				reward: behavior.task.task.reward
			})
		)(this);
	}

	/* Lifecycle */
	$onInit() {
		if (this.id === null)
			this.$state.go('taskList');
	}

	$onDestroy() {
		this.__lifetaskBehavior();
	}
	/* */

	/* Public */
	save() {
		this.$ngRedux.dispatch({type: 'SAVE_TASK_CRUD', data: {
			id: this.id,
			title: this.title,
			description: this.description,
			reward: this.reward
		}});
		this.$state.go('taskList');
	}
	/* */

	/* Private */
	/* */

	/* Protected */
	/* */

	/* Observers */
	/* */
}

angular.module('lifeTask').component('lifetaskTaskCrud', new LifetaskTaskCrud());
