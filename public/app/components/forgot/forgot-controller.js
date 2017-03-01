angular.module('hhsApp').controller('ForgotController', ForgotController);

ForgotController.$inject = ['$location', '$timeout', 'ForgotService'];

function ForgotController($location, $timeout, ForgotService) {
    var vm = this;
    vm.errorMessage = null;
    vm.message = null;
    vm.email = null;

    vm.forgot = function () {

        ForgotService.forgot(vm.email)
            .then(function (res) {
                if(res.status === 200) {
                    vm.message = res.data.message;
                } else {
                    vm.errorMessage = res.data;
                }
            })
    }
};