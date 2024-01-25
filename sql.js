module.exports = {
    join: `INSERT INTO tb_user (id, name, email, password, pns) VALUES(?,?,?,?,?)`,
    id_check: `SELECT * FROM tb_user WHERE id = ?`,
    get_user_no: `SELECT user_no FROM tb_user WHERE id = ?`,
    login: `SELECT password FROM tb_user WHERE id = ?`,
    //카카오 로그인
    kakaoJoin: `INSERT INTO tb_user (id, name, email, social) VALUES(?,?,?,1)`,
    kakao_check: `SELECT * FROM tb_user WHERE id = ? and social = 1`,
    //네이버 로그인
    naverlogin: `INSERT INTO tb_user (id, name, email, social) VALUES (?,?,?,2)`,
    naver_id_check: `SELECT * FROM tb_user WHERE id = ? and social = 2`,

    check_pns : `SELECT pns FROM tb_user WEHRE user_no=?`,
    update_pns : `UPDATE tb_user SET pns=? WHERE user_no=?`,
    all_stock_info: `SELECT code, opening_price, high_price, low_price, trade_price FROM tb_stock`,
    insert_stock: `INSERT INTO tb_stock(code, opening_price, high_price, low_price, trade_price) values(?, ?, ?, ?, ?)`,
    update_stock: `UPDATE tb_stock SET opening_price=?, high_price=?, low_price=?, trade_price=? WHERE code=?`,
    check_stock: `SELECT * FROM tb_stock WHERE code=?`,
    stock_info: `SELECT code, opening_price, high_price, low_price, trade_price FROM tb_stock WHERE code=?`,
}
