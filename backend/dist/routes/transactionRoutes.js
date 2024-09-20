"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pool_1 = require("../db/pool");
const router = (0, express_1.Router)();
// Get User transactions
router.get('/userTransacations/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Extract user ID from the URL
    try {
        const query = 'SELECT * FROM transactions WHERE user_id = $1'; // Assuming 'user_id' is the foreign key in the transactions table
        const result = yield pool_1.pool.query(query, [id]);
        // Check if transactions were found
        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ message: 'No transactions found for this user' });
        }
        const sortedArray = result.rows
            .sort((a, b) => a.transaction_date - b.transaction_date)
            .reverse();
        res.json(sortedArray); // Send the transactions as a response
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Update balance and transaction
router.put('/userTransaction', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, userId } = req.body;
    try {
        const getBalanceQuery = 'SELECT balance FROM bank_balances WHERE user_id = $1';
        const balanceResult = yield pool_1.pool.query(getBalanceQuery, [userId]);
        if (balanceResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        let currentBalance = parseFloat(balanceResult.rows[0].balance);
        const transactionAmount = parseFloat(amount);
        const newBalance = currentBalance + transactionAmount;
        const updateBalanceQuery = 'UPDATE bank_balances SET balance = $1 WHERE user_id = $2';
        yield pool_1.pool.query(updateBalanceQuery, [newBalance, userId]);
        const insertTransactionQuery = `
      INSERT INTO transactions (user_id, amount, transaction_date)
      VALUES ($1, $2, NOW())
      RETURNING transaction_date
    `;
        const transactionResult = yield pool_1.pool.query(insertTransactionQuery, [
            userId,
            transactionAmount,
        ]);
        const transactionDate = transactionResult.rows[0].transaction_date;
        res.json({
            balance: newBalance,
            transaction_date: transactionDate,
        });
    }
    catch (err) {
        console.error('Error processing transaction:', err.message);
        res.status(500).send('Server error');
    }
}));
exports.default = router;
