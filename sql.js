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

    //openai
    ai_time_check : `select AI_DATE from tb_ai where user_no = ? ORDER BY AI_DATE desc limit 1`,
    update_ai: `update tb_ai set ai_date = ? where user_no = ?`,
    openai_response: `insert into tb_ai (user_no, ai_send, ai_response) values(?,?,?)`,

    //마이페이지
    get_user_info: `SELECT * FROM TB_USER WHERE USER_NO =?`,
    get_AImock: `select * from tb_mock WHERE USER_NO = ?`,
    get_password: 'SELECT PASSWORD FROM tb_user WHERE user_no = ?',
    pass_update: 'UPDATE tb_user SET PASSWORD = ? WHERE user_no = ?',
    get_user_info: `SELECT * FROM TB_USER WHERE USER_NO =?`,
    mypage_update: `UPDATE tb_user SET name =?, email =?, pns =? WHERE user_no = ?`,
    delete_user: `DELETE FROM tb_user WHERE id = ?`,

    // 모의 투자
    insert_mock_stock : `INSERT INTO tb_mock (USER_NO, MOCK_NAME, MOCK_PRICE, MOCK_AMOUNT) VALUES(?,?,?,?)`,
    simulatedAmount: `SELECT simulatedamount FROM tb_user WHERE user_no = ?`,
    update_simulated_amount: `UPDATE tb_user SET simulatedamount = ? WHERE user_no = ?`,
    check_mock_stock : `SELECT * FROM tb_mock WHERE USER_NO = ? AND MOCK_NAME = ? AND SELL_MOCK_DATE IS NULL`,
    update_mock_stock : `UPDATE tb_mock SET MOCK_PRICE = ?, MOCK_AMOUNT = ? WHERE USER_NO = ? AND MOCK_NAME = ?`,
    delete_mock_stock : `UPDATE tb_mock SET SELL_MOCK_DATE = NOW() WHERE USER_NO = ? AND MOCK_NAME = ?`,
    update_mock_stock_amount : `UPDATE tb_mock SET MOCK_AMOUNT = ? WHERE USER_NO = ? AND MOCK_NAME = ?`,
    all_mock_stock: `SELECT MOCK_NAME, MOCK_PRICE, MOCK_AMOUNT FROM tb_mock WHERE USER_NO = ? AND SELL_MOCK_DATE IS NULL`,

    check_pns : `SELECT pns FROM tb_user WHERE user_no=?`,
    update_pns : `UPDATE tb_user SET pns=? WHERE user_no=?`,
    all_stock_info: `SELECT code, opening_price, high_price, low_price, trade_price FROM tb_stock`,
    insert_stock: `INSERT INTO tb_stock(code, opening_price, high_price, low_price, trade_price) values(?, ?, ?, ?, ?)`,
    update_stock: `UPDATE tb_stock SET opening_price=?, high_price=?, low_price=?, trade_price=? WHERE code=?`,
    check_stock: `SELECT * FROM tb_stock WHERE code=?`,
    stock_info: `SELECT code, opening_price, high_price, low_price, trade_price FROM tb_stock WHERE code=?`,
    stock_like: `INSERT INTO TB_MYSTOCK(USER_NO, STOCK_NAME) VALUE(?,?)`,
    stock_like_delete: `DELETE FROM TB_MYSTOCK WHERE USER_NO=? AND STOCK_NAME=?`,
    stock_like_check : `SELECT STOCK_NAME FROM TB_MYSTOCK WHERE USER_NO=?`,
    mystock_list : `SELECT STOCK_NAME FROM TB_MYSTOCK WHERE USER_NO=?`,
    check_id: `SELECT id FROM tb_user WHERE email=? and name=?`,
    check_pw: `SELECT password FROM tb_user WHERE email=? and name=?`,
    find_pass:`SELECT password FROM tb_user WHERE email=? and name = ?`,
    pass_update: 'UPDATE tb_user SET password = ? WHERE name = ? and email = ?',
}
