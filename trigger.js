const db = require('./db/db');
const sql = require('./sql.js');

module.exports = () => {
    db.query(sql.show_trigger, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                db.query(sql.rate_trigger, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Trigger 생성 완료');
                    }
                });
            } else {
                console.log('Trigger 이미 있음');
            }
        }
    });
}
