const express = require('express')
const AuthC = require('../controllers/auth.controller')
const authRoute = express.Router();

authRoute.post('/register',AuthCcreateAccount)
authRoute.post('/login',AuthC.login);
authRoute.post("/logout",AuthC.logout)

module.exports = authRoute;