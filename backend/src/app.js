const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authR = require("./routes/auth.route")
const projectR = require('./routes/project.route')

const app = express();  // ✅ Fixed - added parentheses
 

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//api for atentucaton only
app.use('api/v1/authentication',authR);
app.use('api/v1/project', projectR)


module.exports = app ;