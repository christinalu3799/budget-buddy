const express = require('express');
const TransactionRouter = express.Router();
const TransactionRepo = require('../repos/TransactionRepo');
const AccountService = require('../services/AccountService');

// TransactionRouter.get('/accounts/:id', AccountService.findAccounts);

TransactionRouter.post('/create', TransactionRepo.create);

// TransactionRouter.put('/update', AccountRepo.update);

// TransactionRouter.delete('/delete/:id', AccountRepo.delete);

module.exports = TransactionRouter;
