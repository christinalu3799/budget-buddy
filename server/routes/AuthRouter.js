const express = require('express');
const AuthRouter = express.Router();
const AuthenticationService = require('../services/AuthenticationService.js');
const UserRepo = require('../repos/UserRepo.js');

AuthRouter.get('/users', AuthenticationService.findUsers);

AuthRouter.get('/:id', AuthenticationService.findUser);

AuthRouter.post('/register', UserRepo.registerNewUser);

AuthRouter.post('/login', AuthenticationService.loginUser);

AuthRouter.put('/:id', UserRepo.updateUser);

AuthRouter.delete('/logout', AuthenticationService.logoutUser);

AuthRouter.delete('/:id', UserRepo.deleteUser);

module.exports = AuthRouter;
