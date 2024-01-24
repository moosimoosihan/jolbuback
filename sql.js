module.exports = {
    all_stock_info: `SELECT code, opening_price, high_price, low_price, trade_price FROM tb_stock`,
    insert_stock: `INSERT INTO tb_stock(code, opening_price, high_price, low_price, trade_price) values(?, ?, ?, ?, ?)`,
    update_stock: `UPDATE tb_stock SET opening_price=?, high_price=?, low_price=?, trade_price=? WHERE code=?`,
    check_stock: `SELECT * FROM tb_stock WHERE code=?`,
    stock_info: `SELECT code, opening_price, high_price, low_price, trade_price FROM tb_stock WHERE code=?`,
}
