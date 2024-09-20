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
// Get user balance
router.get('/userBalance/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const accountQuery = 'SELECT balance FROM bank_balances WHERE user_id = $1';
        const result = yield pool_1.pool.query(accountQuery, [id]);
        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ message: 'No user account found for this user' });
        }
        const { balance } = result.rows[0]; // Extracting balance
        res.json({ balance }); // Sending only the balance
    }
    catch (err) {
        console.error('Error processing Balance:', err.message);
        res.status(500).send('Server error');
    }
}));
exports.default = router;
