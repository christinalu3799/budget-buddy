const mongoose = require('mongoose');

const accountSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        startingBalance: {
            type: Number,
            required: true,
        },
        balance: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
