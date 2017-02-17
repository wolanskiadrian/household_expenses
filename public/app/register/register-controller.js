angular.module('hhsApp').controller('RegisterController', RegisterController);

RegisterController.$inject = ['RegisterService'];

function RegisterController(RegisterService) {
    var vm = this;
    vm.errorMessage = null;
    vm.message = null;

    vm.register = function () {
        var user = {
            username: vm.username,
            password: vm.password
        };

        if(!vm.username || !vm.password) {
            vm.errorMessage = 'Please add a username and password.'
        } else {
            if(vm.password !== vm.passwordRepeat) {
                vm.error = 'Please make sure the passwords match.'
            } else {
                RegisterService.register(vm.username, vm.password)
                    .then(function (res) {
                        vm.errorMessage = null;
                        vm.message = 'New user was added.';
                        console.log(res);
                    }).catch(function (err) {
                        vm.errorMessage = err;
                        console.log(err);
                    });
            }
        }
    };
};