-- 스키마 생성
CREATE SCHEMA `jolbu`
DEFAULT CHARACTER SET utf8mb4
collate utf8mb4_general_ci

-- 유저 테이블
DROP TABLE TB_USER;
CREATE TABLE TB_USER (
USER_NO INTEGER PRIMARY KEY AUTO_INCREMENT,
ID VARCHAR(50) NOT NULL,
NAME VARCHAR(50) NOT NULL,
EMAIL VARCHAR(50),
PASSWORD VARCHAR(200),
ADMIN INT NOT NULL DEFAULT 0,
SOCIAL INT NOT NULL DEFAULT 0,
PNS VARCHAR(200) DEFAULT NULL,
SIMULATEDAMOUNT INT DEFAULT 10000000,
SIGN_DATE datetime DEFAULT CURRENT_TIMESTAMP
) COMMENT = '회원정보'
ENGINE = InnoDB;


-- 관리자 24-01-24 추가--d안쓰임
DROP TABLE TB_ADMIN;
CREATE TABLE TB_ADMIN (
   USER_NO INT,
   FOREIGN KEY (USER_NO) REFERENCES TB_USER(USER_NO),
   ADMIN_QNA_NO INT PRIMARY KEY AUTO_INCREMENT,
   ADMIN_QNA_NAME VARCHAR(600),
   ADMIN_QNA_CONTENT VARCHAR(2000)
   ) COMMENT = '관리자'
   ENGINE = InnoDB;

-- 검색 테이블
DROP TABLE TB_SEARCH;
CREATE TABLE TB_SEARCH (
   USER_NO INT,
   FOREIGN KEY (USER_NO) REFERENCES TB_USER(USER_NO),
   SEARCH_CON VARCHAR(200) NOT NULL
) COMMENT = '검색'
ENGINE = InnoDB;

-- 나의주식
DROP TABLE TB_MYSTOCK;
CREATE TABLE TB_MYSTOCK (
   USER_NO INT,
   FOREIGN KEY (USER_NO) REFERENCES TB_USER(USER_NO),
   STOCK_NAME VARCHAR(200) NOT NULL,
) COMMENT = '나의주식'
ENGINE = InnoDB;

-- 주식가격
DROP TABLE TB_STOCK;
CREATE TABLE TB_STOCK (
code varchar(50) not null unique,
opening_price double not null,
closing_price double not null,
min_price double not null,
max_price double not null,
units_traded double not null,
acc_trade_value double not null,
prev_closing_price double not null,
units_traded_24H double not null,
acc_trade_value_24H double not null,
fluctate_24H double not null,
fluctate_rate_24H double not null)
COMMENT = '주식가격'
engine=InnoDB;

DROP TABLE TB_AI;
CREATE TABLE TB_AI (
USER_NO INT,
FOREIGN KEY (USER_NO) REFERENCES TB_USER(USER_NO),
   AI_SEND VARCHAR(2000),
   AI_RESPONSE VARCHAR(2000),
   AI_DATE DATETIME DEFAULT CURRENT_TIMESTAMP
   )
   COMMENT='에이아이'
   ENGINE=InnoDB;

-- 모의 투자 테이블
DROP TABLE TB_MOCK;
CREATE TABLE TB_MOCK (
   USER_NO INT,
   FOREIGN KEY (USER_NO) REFERENCES TB_USER(USER_NO),
   MOCK_NAME VARCHAR(200) NOT NULL,
   MOCK_PRICE INT NOT NULL,
   MOCK_AMOUNT INT NOT NULL,
   SALE_MOCK_DATE DATETIME DEFAULT CURRENT_TIMESTAMP,
   SELL_MOCK_DATE DATETIME,
   MOCK_CLOSE_PRICE int DEFAULT 0,
   MOCK_SELL_AMOUNT int DEFAULT 0,
   MOCK_RATE float DEFAULT NULL
) COMMENT = '모의투자'
ENGINE = InnoDB;

--유저 테이블 수정 24-01-31 --
ALTER TABLE TB_USER add COLUMN SIGN_DATE datetime DEFAULT CURRENT_TIMESTAMP; --가입날짜 추가
--my stock 테이블 aicontent 삭제 및 STOCK_NAME UNIQUE 속성 삭제 24-01-31
ALTER TABLE jolbu.tb_mystock DROP COLUMN STOCK_AICONTENT , DROP INDEX STOCK_NAME;
