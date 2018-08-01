/* global angular, firebase, importStyle */

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
				userId: behavior.session.id,
				coins: behavior.session.coins,
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
		this.$ngRedux.dispatch({type: 'TASK_CRUD', data: {
			task: {title: null, description: null, reward: null}
		}});
		this.$state.go('taskCrud');
	}

	editTask(task) {
		this.$ngRedux.dispatch({type: 'TASK_CRUD', data: { task }});
		this.$state.go('taskCrud');
	}

	finishTask(task) {
		const db = firebase.firestore();
		db.collection('users')
			.doc(this.userId)
			.collection('taskList')
			.doc(task.id)
			.delete()
			.then(() => 
				db.collection('users')
					.doc(this.userId)
					.update({
						coins: this.coins + task.reward
					})
			)
			.then(() => 
				db.collection('users')
					.doc(this.userId)
					.get()
			)
			.then(res => { 
				this.$ngRedux.dispatch({ type: 'UPDATE_COINS',
					data: {
						coins: res.data().coins
					}
				});
				this.$ngRedux.dispatch({ type: 'UPDATE_TASK_LIST',
					data: {
						taskList: res.data().taskList
					}
				});
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

angular.module('lifeTask').component('lifetaskTaskList', new LifetaskTaskList());


// const db = firebase.firestore();
// db.collection("users")
//     .doc(firebase.auth().currentUser.uid)
// 	.collection("taskList")
// 	.add({
// 		title: 'title',
// 		description: 'description'
// 	});
//
// db.collection("users")
//     .doc(firebase.auth().currentUser.uid)
// 	.collection("taskList")
// 	.get()
// 	.then(querySnapshot => {
//         querySnapshot.forEach(doc => {
//             console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
//         });
//     });
//
