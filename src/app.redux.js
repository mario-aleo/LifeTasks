/* global angular */

angular.module('lifeTask').config([
	'$ngReduxProvider',
	$ngReduxProvider => {
		class SessionReducerState {
			constructor() {
				this.id = '';
				this.name = '';
				this.email = '';
				this.coins = 0;
			}
		}

		function sessionReducer(state, action) {
			if (!state)
				return new SessionReducerState();
			switch(action.type) {
			case 'LOGIN':
				return Object.assign({}, state, {
					id: action.data.id,
					name: action.data.name,
					email: action.data.email
				});
			default:
				return state;
			}
		}

		class TaskReducerState {
			constructor() {
				this.list = [];
			}
		}

		function taskReducer(state, action) {
			if (!state)
				return new TaskReducerState();
			switch(action.type) {
			default:
				return state;
			}
		}

		class RewardReducerState {
			constructor() {
				this.list = [];
			}
		}

		function rewardReducer(state, action) {
			if (!state)
				return new RewardReducerState();
			switch(action.type) {
			default:
				return state;
			}
		}

		$ngReduxProvider.createStoreWith({
			session: sessionReducer,
			task: taskReducer,
			reward: rewardReducer
		});
	}
]);