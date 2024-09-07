const express = require('express');
const TransactionRouter = express.Router();
const TransactionRepo = require('../repos/TransactionRepo');
const AccountService = require('../services/AccountService');

// TransactionRouter.get('/accounts/:id', TransactionService.findAccounts);

TransactionRouter.post('/create', TransactionRepo.create);

TransactionRouter.put('/update', TransactionRepo.update);

// TransactionRouter.delete('/delete/:id', TransactionRepo.delete);

module.exports = TransactionRouter;
