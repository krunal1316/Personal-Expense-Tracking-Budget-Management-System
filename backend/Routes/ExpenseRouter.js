const express = require('express');
const { getAllTransactions, addTransaction, deleteTransaction, deleteAllTransactions }
    = require('../Controllers/ExpenseController');
const router = express.Router();

router.get('/', getAllTransactions);
router.post('/', addTransaction);
router.delete('/:expenseId', deleteTransaction);
router.delete('/', deleteAllTransactions);

module.exports = router;