
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

--tb_rate 업데이트 트리거
DELIMITER //    

/*DELIMITER// // DELIMITER = 각프로시저의 시작과끝을 선언함 고로 한 프로시저 안에서의 여러 세미콜론이 허용되고 순서대로 진행되게함
node.js등에서 sql문으로 사용할땐 빼서 사용해야함*/

CREATE TRIGGER update_mock_rate
AFTER UPDATE ON tb_stock
FOR EACH ROW

/*tb_stock이 업데이트 된 후에 트리거실행*/

BEGIN
    DECLARE finished INTEGER DEFAULT 0;
    DECLARE mock_price_val FLOAT;
    DECLARE rate_val FLOAT;
    DECLARE user_no_val INT;
    DECLARE mock_name_val VARCHAR(255);
    
    /*declare=선언 --- 기존 변수들에 새값을 대입하기위해 임시변수_val시리즈를 선언*/

    DECLARE cur CURSOR FOR SELECT user_no, mock_name, mock_price FROM tb_mock WHERE mock_name = NEW.code;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;
    
    /*셀렉트한 결과를 cur라는 커서로 선언 및 결과가 없을 경우 finished 변수를 1로 설정, 오류가 발생하더라도 다음 코드를 계속 실행하라는 핸들러 선언*/

    OPEN cur; 

    read_loop: LOOP /*앞서 선언한 커서(셀렉트문과 비슷한 지정문 LOOP등을 사용할때 사용됨) cur을 연뒤 루프를 실행*/
        FETCH cur INTO user_no_val, mock_name_val, mock_price_val;
       /*패치(커서와 같이쓰이며 선언한 값을 할당할때 사용)앞서 선언한 셀렉트문의 변수에 _val로 선언했던 변수들을 할당*/
        IF finished = 1 THEN 
            LEAVE read_loop;
        END IF;
        /*만약 finished라는 변수의 값이 1일 시, 루프(read_loop)를 빠져나온뒤 if문을 닫음*/
        SET rate_val = (NEW.closing_price - mock_price_val) / mock_price_val * 100;
        /*할당한 _val변수들을 계산한 후 rate_val이란 변수에 결과값을 삽입*/
        UPDATE tb_mock SET mock_rate = rate_val WHERE user_no = user_no_val AND mock_name = mock_name_val;
        /*tb_mock테이블에 각각 선언했던 변수들을 대입해 update문을 생성 결과적으로 mock_rate라는 칼럼에 앞서 계산한 rate_val값을 대입 이 일련의 작업들은 루프로 진행되어 각각의 유저들의 모의투자내역에 삽입딤*/
    END LOOP;

    CLOSE cur;
END;/*루프를 끝낸 후, 커서를 닫고 트리거 프로시저를 종료함*/
//
DELIMITER ;