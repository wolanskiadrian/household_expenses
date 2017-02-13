angular.module('hhsApp', ['ngRoute'])
    .config(config)
    .run(run);

config.$inject = ['$routeProvider', '$httpProvider'];

function config($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');

    $routeProvider
        .when('/dashboard', {
            templateUrl: 'app/dashboard/dashboard-view.html',
            controller: DashboardController,
            controllerAs: 'vm',
            access: {
                restricted: true
            }
        })
        .when('/login', {
            templateUrl: 'app/login/login-view.html',
            controller: LoginController,
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        })
        .when('/register', {
            templateUrl: 'app/register/register-view.html',
            controller: RegisterController,
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        })
        .when('/user/profile', {
            templateUrl: 'app/profile/profile-view.html',
            controller: ProfileController,
            controllerAs: 'vm',
            access: {
                restricted: true
            }
        })
        .otherwise({
            redirectTo: '/login'
        })
}

function run($rootScope, $location, $window, AuthFactory) {
    $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
        if(nextRoute.access !== undefined && nextRoute.access.restricted && !$window.sessionStorage.token && !AuthFactory.isLoggedIn) {
            event.preventDefault();
            $location.path('#/login');
        }
    })
}