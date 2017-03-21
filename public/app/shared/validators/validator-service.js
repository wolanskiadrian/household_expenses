angular.module('hhsApp').service('ValidatorService', ValidatorService);

ValidatorService.$inject = [];

function ValidatorService() {

    this.validateForm = function validateForm(FieldsArray, model) {
        var validationErrors = {};

        _.forEach(FieldsArray, function (field) {
            if(!model[field]) {
                validationErrors[field] = {
                    required: true
                }
            } else {
                //TODO: specific validators
            }
        });

        return validationErrors;
    }
}