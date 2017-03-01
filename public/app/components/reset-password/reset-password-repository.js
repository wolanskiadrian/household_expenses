angular.module('hhsApp').service('ResetPasswordService', ResetPasswordService);

ResetPasswordService.$inject = ['$http'];

function ResetPasswordService($http) {

    this.reset = function (token, password, confirm) {
        var model = {
            password: password,
            confirm: confirm
        };

        return $http.post('/api/users/reset-password/' + token, model).then(function (res) {
            return res;
        }).catch(function (err) {
            return err;
        });
    }

}