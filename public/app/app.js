angular.module('hhsApp', ['ngRoute', 'angularModalService'])
    .config(config)
    .run(run);

config.$inject = ['$routeProvider', '$httpProvider', '$locationProvider'];

function config($routeProvider, $httpProvider, $locationProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');

    $routeProvider
        .when('/dashboard', {
            templateUrl: 'app/components/dashboard/dashboard-view.html',
            controller: DashboardController,
            controllerAs: 'vm',
            access: {
                restricted: true
            }
        })
        .when('/login', {
            templateUrl: 'app/components/login/login-view.html',
            controller: LoginController,
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        })
        .when('/register', {
            templateUrl: 'app/components/register/register-view.html',
            controller: RegisterController,
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        })
        .when('/forgot', {
            templateUrl: 'app/components/forgot/forgot-view.html',
            controller: ForgotController,
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        })
        .when('/reset/:token', {
            templateUrl: 'app/components/reset-password/reset-password-view.html',
            controller: ResetPasswordController,
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        })
        .when('/user/profile', {
            templateUrl: 'app/components/profile/profile-view.html',
            controller: ProfileController,
            controllerAs: 'vm',
            access: {
                restricted: true
            }
        })
        //expense
        .when('/expense/add', {
            templateUrl: 'app/components/expense/expense.add-view.html',
            controller: ExpenseController,
            controllerAs: 'vm',
            access: {
                restricted: true
            }
        })
        .otherwise({
            redirectTo: '/login'
        });

    // $locationProvider.html5Mode(true);
}

function run($rootScope, $location, $window, AuthFactory) {
    if($window.sessionStorage.token) {
        $rootScope.isLoggedIn = true;
    } else {
        $rootScope.isLoggedIn = false;
    }

    $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
        if(nextRoute.access !== undefined && nextRoute.access.restricted && !$window.sessionStorage.token && !AuthFactory.isLoggedIn) {
            event.preventDefault();
            $location.path('#/login');
        } else {
            if($window.sessionStorage.token) {
                $rootScope.isLoggedIn = true;
            } else {
                $rootScope.isLoggedIn = false;
            }
        }
    })
}