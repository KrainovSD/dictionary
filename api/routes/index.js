const express = require('express');
const router = express.Router();

const authRout = require('../routes/auth');

const routes = {
    auth: authRout,
};
module.exports = routes;
