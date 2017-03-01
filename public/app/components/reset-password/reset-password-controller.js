angular.module('hhsApp').controller('ResetPasswordController', ResetPasswordController);

ResetPasswordController.$inject = ['$location', '$timeout', '$routeParams', 'ResetPasswordService'];

function ResetPasswordController($location, $timeout, $routeParams, ResetPasswordService) {
    var vm = this;
    vm.errorMessage = null;
    vm.message = null;
    vm.email = null;
    vm.token = $routeParams.token;

    vm.reset = function () {

        ResetPasswordService.reset(vm.token, vm.password, vm.confirm)
            .then(function (res) {
                console.log(res);
                if(res.status === 200) {
                    vm.message = res.data.message;

                    $timeout(function () {
                        $location.path('/login');
                    }, 2000);
                } else {
                    vm.errorMessage = res.data;
                }
            })
    }
};