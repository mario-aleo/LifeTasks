angular.module('lifeTask').config([
	'$ngReduxProvider',
	$ngReduxProvider => {
		class SessionReducerState {
			constructor() {
				this.token = '';
				this.coins = 0;
			}
		}

		function sessionReducer(state, action) {
			if (!state)
				return new SessionReducerState();
			switch(action.type) {
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