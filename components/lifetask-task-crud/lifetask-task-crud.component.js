/* global angular, firebase, importStyle */

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
				userId: behavior.session.id,
				id: behavior.task.task.id,
				title: behavior.task.task.title,
				description: behavior.task.task.description,
				reward: behavior.task.task.reward
			})
		)(this);
	}

	/* Lifecycle */
	$onDestroy() {
		this.__lifetaskBehavior();
	}
	/* */

	/* Public */
	save() {
		if (this.id)
			this.updateTask();
		else
			this.createTask();
	}

	createTask() {
		const db = firebase.firestore();
		db.collection('users')
			.doc(this.userId)
			.collection('taskList')
			.add({
				title: this.title,
				description: this.description,
				reward: this.reward
			})
			.then(res => {
				console.log(res);
				return db.collection('users')
					.doc(this.userId)
					.get();
			})
			.then(res => {
				this.$ngRedux.dispatch({ type: 'UPDATE_TASK_LIST',
					data: {
						taskList: res.data().taskList
					}
				});
				this.$state.go('taskList');
			})
			.catch(err =>
				console.error(err)
			);
	}

	updateTask() {
		const db = firebase.firestore();
		db.collection('users')
			.doc(this.userId)
			.collection('taskList')
			.doc(this.id)
			.update({
				title: this.title,
				description: this.description,
				reward: this.reward
			})
			.then(() =>
				db.collection('users')
					.doc(this.userId)
					.get()
			)
			.then(res => {
				this.$ngRedux.dispatch({ type: 'UPDATE_TASK_LIST',
					data: {
						taskList: res.data().taskList
					}
				});
				this.$state.go('taskList');
			})
			.catch(err =>
				console.error(err)
			);
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
