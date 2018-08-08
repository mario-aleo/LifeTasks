/* global angular, firebase, importStyle */

importStyle('components/lifetask-app/lifetask-app.css', { preload: true });

class LifetaskApp {
	constructor() {
		this.templateUrl = 'components/lifetask-app/lifetask-app.html';
		this.bindings = {};
		this.controller = LifetaskAppController;
	}
}

class LifetaskAppController {
	static get $inject() { return ['$element', '$ngRedux', '$state', '$scope']; }

	constructor($element, $ngRedux, $state, $scope) {
		Object.assign(this, { $: $element[0], $ngRedux, $state, $scope });

		this.__lifetaskBehavior = $ngRedux.connect(behavior =>
			Object({
				userId: behavior.session.id,
				userCoins: behavior.session.coins
			})
		)(this);

		this.provider = new firebase.auth.GoogleAuthProvider();
	}

	/* Lifecycle */
	$onInit() {
		this.$.removeAttribute('unresolved');

		this.$scope.$watch(
			() => this.$state.$current,
			this.__stateChanged.bind(this)
		);

		firebase.auth()
			.onAuthStateChanged(user => {
				if (user) {
					this.$ngRedux.dispatch({ type: 'LOGIN',
						data: {
							name: user.displayName,
							email: user.email,
							id: user.uid
						}
					});
					const db = firebase.firestore();
					db.collection('users')
						.doc(user.uid)
						.get()
						.then(res => {
							this.$ngRedux.dispatch({ type: 'UPDATE_COINS',
								data: {
									coins: res.data().coins
								}
							});
						});
					db.collection('users')
						.doc(user.uid)
						.collection('taskList')
						.get()
						.then(res =>
							this.$ngRedux.dispatch({ type: 'UPDATE_TASK_LIST',
								data: {
									taskList: res.docs.map(doc => 
										Object.assign({}, doc.data(), {
											id: doc.id
										})
									)
								}
							})
						);
					db.collection('users')
						.doc(user.uid)
						.collection('rewardList')
						.get()
						.then(res =>
							this.$ngRedux.dispatch({ type: 'UPDATE_REWARD_LIST',
								data: {
									rewardList: res.docs.map(doc => 
										Object.assign({}, doc.data(), {
											id: doc.id
										})
									)
								}
							})
						);
					this.$.setAttribute('authorized', '');
				} else
					firebase.auth().signOut();
			});
	}

	$onDestroy() {
		this.__lifetaskBehavior();
	}
	/* */

	/* Public */
	login() {
		firebase.auth()
			.signInWithPopup(this.provider)
			.then(result => {
				if (result.credential) {
					const db = firebase.firestore();
					db.collection('users')
						.doc(result.user.uid)
						.get()
						.then(res => {
							if (!res.data())
								db.collection('users')
									.doc(result.user.uid)
									.set({
										uid: result.user.uid,
										coins: 0,
										taskList: [],
										rewardList: []
									});
							else {
								this.$ngRedux.dispatch({ type: 'UPDATE_COINS',
									data: {
										coins: res.data().coins
									}
								});
								db.collection('users')
									.doc(result.user.uid)
									.collection('taskList')
									.get()
									.then(res =>
										this.$ngRedux.dispatch({ type: 'UPDATE_TASK_LIST',
											data: {
												taskList: res.docs.map(doc => 
													Object.assign({}, doc.data(), {
														id: doc.id
													})
												)
											}
										})
									);
								db.collection('users')
									.doc(result.user.uid)
									.collection('rewardList')
									.get()
									.then(res =>
										this.$ngRedux.dispatch({ type: 'UPDATE_REWARD_LIST',
											data: {
												rewardList: res.docs.map(doc => 
													Object.assign({}, doc.data(), {
														id: doc.id
													})
												)
											}
										})
									);
							}
						});
				}
			})
			.catch(error =>
				console.error(error)
			);
	}

	changeView(evt) {
		this.$state.go(evt.target.dataset.view);
	}
	/* */

	/* Private */
	/* */

	/* Observers */
	__stateChanged(newValue) {
		if (newValue) {
			const currentState = newValue.name;
			this.$.querySelectorAll('#appFooter div')
				.forEach(node => {
					if (currentState.includes('task') && node.dataset.view.includes('task'))
						node.setAttribute('active', '');
					else if (currentState.includes('reward') && node.dataset.view.includes('reward'))
						node.setAttribute('active', '');
					else
						node.removeAttribute('active');
				});
		}
	}
	/* */
}

angular.module('lifeTask').component('lifetaskApp', new LifetaskApp());

// const db = firebase.firestore();
// db.collection('users')
// 	.doc(result.user.uid)
// 	.set({
// 		uid: result.user.uid,
// 		coins: 0,
// 		taskList: [],
// 		rewardList: []
// 	})
// 	.then(res => console.log(res))
// 	.catch(err => console.error(err));
//
// db.collection("users")
// 	.doc(firebase.auth().currentUser.uid)
// 	.get()
// 	.then(res => console.log(res.data()));
//
// db.collection('users')
// 	.doc(result.user.uid)
// 	.update({
// 		uid: result.user.uid,
// 		coins: 0,
// 		taskList: [],
// 		rewardList: []
// 	})
// 	.then(res => console.log(res))
// 	.catch(err => console.error(err));