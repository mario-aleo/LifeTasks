/* global angular, importStyle */

importStyle('components/lifetask-task-list/lifetask-task-list.css', { preload: true });

class LifetaskTaskList {
	constructor() {
		this.templateUrl = 'components/lifetask-task-list/lifetask-task-list.html';
		this.bindings = {};
		this.controller = LifetaskTaskListController;
	}
}

class LifetaskTaskListController {
	static get $inject() { return ['$element', '$ngRedux', '$state']; }

	constructor($element, $ngRedux, $state) {
		Object.assign(this, { $: $element[0], $ngRedux, $state });

		this.__lifetaskBehavior = $ngRedux.connect(behavior =>
			Object({
				taskList: behavior.task.list
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
	addTask() {
		const taskList = Object.assign([], this.taskList);
		const newId = taskList.sort((a, b) => a.id < b.id)[0].id + 1;
		this.$ngRedux.dispatch({type: 'TASK_CRUD', data: {
			task: {
				id: newId
			}
		}});
		this.$state.go('taskCrud');
	}

	editTask(task) {
		this.$ngRedux.dispatch({type: 'TASK_CRUD', data: { task }});
		this.$state.go('taskCrud');
	}

	finishTask(task) {
		this.$ngRedux.dispatch({type: 'FINISH_TASK', data: { task }});
	}
	/* */

	/* Private */
	/* */

	/* Protected */
	/* */

	/* Observers */
	/* */
}

angular.module('lifeTask').component('lifetaskTaskList', new LifetaskTaskList());
