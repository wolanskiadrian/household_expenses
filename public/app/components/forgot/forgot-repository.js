angular.module('hhsApp').service('ForgotService', ForgotService);

ForgotService.$inject = ['$http'];

function ForgotService($http) {

    this.forgot = function (email) {
        var model = {
            email: email
        };

        return $http.post('/api/users/forgot', model).then(function (res) {
            return res;
        }).catch(function (err) {
            return err;
        });
    }

}