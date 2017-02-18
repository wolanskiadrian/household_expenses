angular.module('hhsApp').service('RegisterService', RegisterService);

RegisterService.$inject = ['$http'];

function RegisterService($http) {

    this.register = function (model) {
        return $http.post('/api/users/register', model).then(function (res) {
            return res;
        }).catch(function (err) {
            return err;
        });
    }

}