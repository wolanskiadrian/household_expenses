angular.module('hhsApp').controller('RegisterController', RegisterController);

RegisterController.$inject = ['$http'];

function RegisterController($http) {
    var vm = this;

    vm.register = function () {
        var user = {
            username: vm.username,
            password: vm.password
        };

        if(!vm.username || !vm.password) {
            vm.error = 'Please add a username and password.'
        } else {
            if(vm.password !== vm.passwordRepeat) {
                vm.error = 'Please make sure the passwords match.'
            } else {
                $http.post('/api/users/register', user).then(function (res) {
                    console.log(res);

                    vm.message = 'New user was added.';
                    vm.error = null;
                }).catch(function (error) {
                    console.log(error);
                })
            }
        }
    };
};