angular.module('hhsApp').controller('LoginController', LoginController);

LoginController.$inject = ['$http', '$location', '$window', 'AuthFactory'];

function LoginController($http, $location, $window, AuthFactory) {
    var vm = this;

    vm.isLoggedIn = function () {
        if(AuthFactory.isLoggedIn) {
            return true;
        } else {
            return false;
        }
    };

    vm.login = function () {
        if(vm.username && vm.password) {
            var user = {
                username: vm.username,
                password: vm.password
            };

            $http.post('/api/users/login', user).then(function (res) {
                console.log(res);

                if(res.data.success && res.data.token && res.data.user) {
                    $window.sessionStorage.token = res.data.token;
                    $window.sessionStorage.userData = res.data.user;
                    AuthFactory.isLoggedIn = true;
                }
            }).catch(function (err) {
                console.log(err)
            });
        } else {
            //TODO: validation form message
        }
    };

    vm.logout = function () {
        AuthFactory.isLoggedIn = false;
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.userData;

        $location.path('#/login');
    };

};