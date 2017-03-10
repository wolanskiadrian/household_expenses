angular.module('hhsApp').service('ExpenseService', ExpenseService);

ExpenseService.$inject = ['$http'];

function ExpenseService($http) {

    this.add = function (model) {
        return $http.post('/api/expense', model).then(function (res) {
            return res;
        }).catch(function (err) {
            return err;
        });
    };

    this.getCategories = function getCategories(userId) {
        return $http.get('/api/categories/all/' + userId).then(function (res) {
            return res;
        }).catch(function (err) {
            return err;
        })
    };
}