
-- TB_USER
INSERT INTO
TB_USER(ID, NAME, EMAIL, PASSWORD, PNS)
VALUE(?,?,?,?,?);
-- EX:VALUE('test1','병배','TEST@TEST.COM',1234,'당신의 성향은 XX입니다');

--TB_SEARCH
INSER INTO
TB_SEARCH(USER_NO, SEARCH_CON)
VALUE(?,?);
-- EX:VALUE(1,'잡주사서 겁나불리는 종목');

--TB_MYSTOCK
INSERT INTO
TB_MYSTOCK(USER_NO, STOCK_NAME, STOCK_AICONTENT)
VALUE(?,?,?);
-- EX:VALUE(1,'나만죽을수 없지 주식회사','완벽한 한탕입니다 휴먼');

--tb_rate 업데이트
DELIMITER //
CREATE TRIGGER update_mock_rate
AFTER UPDATE ON tb_stock
FOR EACH ROW
BEGIN
    DECLARE finished INTEGER DEFAULT 0;
    DECLARE mock_price_val FLOAT;
    DECLARE rate_val FLOAT;
    DECLARE user_no_val INT;
    DECLARE mock_name_val VARCHAR(255);

    DECLARE cur CURSOR FOR SELECT user_no, mock_name, mock_price FROM tb_mock WHERE mock_name = NEW.code;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO user_no_val, mock_name_val, mock_price_val;

        IF finished = 1 THEN 
            LEAVE read_loop;
        END IF;

        SET rate_val = (mock_price_val - NEW.closing_price) / mock_price_val * 100;

        UPDATE tb_mock SET mock_rate = rate_val WHERE user_no = user_no_val AND mock_name = mock_name_val;
    END LOOP;

    CLOSE cur;
END;
//
DELIMITER ;