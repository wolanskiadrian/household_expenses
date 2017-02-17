angular.module('hhsApp').controller('LoginController', LoginController);

LoginController.$inject = ['$location', '$window', 'AuthFactory', 'LoginService'];

function LoginController($location, $window, AuthFactory, LoginService) {
    var vm = this;
    vm.errorMessage = null;

    vm.isLoggedIn = function () {
        if(AuthFactory.isLoggedIn) {
            return true;
        } else {
            return false;
        }
    };

    vm.login = function () {
        if(vm.username && vm.password) {

            LoginService.login(vm.username, vm.password)
                .then(function (res) {
                    if(res.data.success && res.data.token && res.data.user) {
                        $window.sessionStorage.token = res.data.token;
                        $window.sessionStorage.userData = res.data.user;
                        AuthFactory.isLoggedIn = true;
                        vm.errorMessage = null;
                    }
                }).catch(function (err) {
                    console.log(err);
                    vm.errorMessage = err;
                });
        } else {
            //TODO: validation form message
            vm.errorMessage = 'Password do not match.';
        }
    };

    vm.logout = function () {
        AuthFactory.isLoggedIn = false;
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.userData;

        $location.path('#/login');
    };

};