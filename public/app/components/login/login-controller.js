angular.module('hhsApp').controller('LoginController', LoginController);

LoginController.$inject = ['$location', '$window', '$timeout', 'AuthFactory', 'LoginService'];

function LoginController($location, $window, $timeout, AuthFactory, LoginService) {
    var vm = this;
    vm.errorMessage = null;

    function init() {
        if($window.sessionStorage.token) {
            $location.path('/dashboard');
        }
    }

    init();

    vm.login = function () {
        if(vm.username && vm.password) {
            LoginService.login(vm.username, vm.password)
                .then(function (res) {
                    if(res.data.success && res.data.token && res.data.user) {
                        $window.sessionStorage.token = res.data.token;
                        $window.sessionStorage.userData = JSON.stringify(res.data.user);
                        AuthFactory.isLoggedIn = true;
                        vm.errorMessage = null;
                        $location.path('/dashboard');
                    } else {
                        vm.errorMessage = res.data.message;
                        $timeout(function () {
                            vm.errorMessage = null;
                        }, 2000)
                    }
                }).catch(function (err) {
                    console.log(err);
                    vm.errorMessage = err;
                });
        } else {
            //TODO: validation form message
            vm.errorMessage = '';
        }
    };

    vm.logout = function () {
        AuthFactory.isLoggedIn = false;
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.userData;

        $location.path('#/login');
    };

    vm.register = function () {
        $location.path('/register');
    }
};