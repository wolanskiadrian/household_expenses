var express = require('express');
var router = express.Router();

var ctrlUsers = require('../controllers/users-controller');

//Auth
router
    .route('/users/register')
    .post(ctrlUsers.register);

router
    .route('/users/login')
    .post(ctrlUsers.login);

router
    .route('/users')
    .get(ctrlUsers.getUsers);

router
    .route('/email-verification/:URL')
    .get(ctrlUsers.confirmAccount);

router
    .route('/auth/resend-ve')
    .post(ctrlUsers.resendVerificationEmail);

router
    .route('/users/change-password')
    .post(ctrlUsers.changePassword);

router
    .route('/users/edit-profile')
    .post(ctrlUsers.editProfile);

router
    .route('/users/forgot')
    .post(ctrlUsers.forgotPasswordEmail);

router
    .route('/users/reset-password/:token')
    .post(ctrlUsers.resetPassword);

// App endpoints


module.exports = router;