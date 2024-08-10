const express = require('express');
const AuthRouter = express.Router();
const AuthenticationService = require('../services/AuthenticationService.js');

AuthRouter.get('/users', AuthenticationService.findUsers);

AuthRouter.get('/:id', AuthenticationService.findUser);

AuthRouter.post('/register', AuthenticationService.registerNewUser);

AuthRouter.post('/login', AuthenticationService.loginUser);

AuthRouter.put('/:id', AuthenticationService.updateUser);

AuthRouter.delete('/logout', AuthenticationService.logoutUser);

AuthRouter.delete('/:id', async (req, res) => {});

module.exports = AuthRouter;
