angular.module('hhsApp').service('DashboardService', DashboardService);

DashboardService.$inject = ['$http'];

function DashboardService($http) {

    this.getAll = function getAll(userId) {
        return $http.get('/api/expenses/' + userId).then(function (res) {
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
    }
}