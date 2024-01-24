const db = require('./db/db.js');
const sql = require('./sql.js');

module.exports = async (data) => {
    await db.query(sql.check_stock, [data.code], (err, result) => {
        if(err) {
            console.log(err);
            return;
        }
        if(result.length === 0) {
            db.query(sql.insert_stock, [data.code, data.opening_price, data.high_price, data.low_price, data.trade_price], (err, result) => {
                if(err) {
                    console.log(err);
                    return;
                }
            })
        } else {
            db.query(sql.update_stock, [data.opening_price, data.high_price, data.low_price, data.trade_price, data.code], (err, result) => {
                if(err) {
                    console.log(err);
                    return;
                }
            })
        }
    })
}

