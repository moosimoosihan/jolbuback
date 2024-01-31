const db = require('./db/db.js');
const sql = require('./sql.js');

module.exports = (data) => {
    db.query(sql.check_stock, [data.code], (err, result) => {
        if(err) {
            console.log(err);
            return;
        }
        if(result.length === 0) {
            db.query(sql.insert_stock, [data.code, data.opening_price, data.closing_price, data.min_price, data.max_price, data.units_traded, data.acc_trade_value, data.prev_closing_price, data.units_traded_24H, data.acc_trade_value_24H, data.fluctate_24H, data.fluctate_rate_24H], (err, result) => {
                if(err) {
                    console.log(err);
                }
            })
        } else {
            db.query(sql.update_stock, [data.opening_price, data.closing_price, data.min_price, data.max_price, data.units_traded, data.acc_trade_value, data.prev_closing_price, data.units_traded_24H, data.acc_trade_value_24H, data.fluctate_24H, data.fluctate_rate_24H, data.code], (err, result) => {
                if(err) {
                    console.log(err);
                }
            })
        }
    })
}

