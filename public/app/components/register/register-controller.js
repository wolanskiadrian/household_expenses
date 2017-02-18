angular.module('hhsApp').controller('RegisterController', RegisterController);

RegisterController.$inject = ['$location', '$timeout', 'RegisterService'];

function RegisterController($location, $timeout, RegisterService) {
    var vm = this;
    vm.errorMessage = null;
    vm.message = null;

    vm.register = function () {
        var user = {
            email: vm.username,
            password: vm.password,
            firstname: vm.firstname,
            lastname: vm.lastname
        };

        if(!vm.username || !vm.password) {
            vm.errorMessage = 'Please add a username and password.'
        } else {
            if(vm.password !== vm.confirm) {
                vm.errorMessage = 'Please make sure the passwords match.'
            } else {
                RegisterService.register(user)
                    .then(function (res) {
                        if(res.status === 200) {
                            vm.errorMessage = null;
                            vm.message = 'New user was added';

                            $timeout(function () {
                                $location.path('/login');
                            }, 2000);
                        } else {
                            vm.errorMessage = res.data.message;
                        }
                    }).catch(function (err) {
                        vm.errorMessage = err;
                        console.log(err);
                    });
            }
        }
    };
};