angular.module('lifeTask').config([
	'$stateProvider', '$urlRouterProvider',
	($stateProvider, $urlRouterProvider) => {
		$urlRouterProvider
			.otherwise(() => '/login');

		$stateProvider
			.state('login', {
				url: '/login',
				template: '<lifetask-login></lifetask-login>'
			});
	}
]);