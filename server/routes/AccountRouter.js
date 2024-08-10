const express = require('express');
const AccountRouter = express.Router();
const AccountRepo = require('../repos/AccountRepo');
const AccountService = require('../services/AccountService');

AccountRouter.get('/accounts/:id', AccountService.findAccounts);

AccountRouter.post('/create', AccountRepo.create);

AccountRouter.put('/update', AccountRepo.update);

AccountRouter.delete('/delete/:id', AccountRepo.delete);

module.exports = AccountRouter;
