MySql 문법

DB 접속 코드: mysql -u admin -p -h masters.cikt1o6c5cp1.us-east-1.rds.amazonaws.com

----------------------------------------------기본스키마----------------------------------------------
CREATE TABLE Reservation(ID INT, Name VARCHAR(30), ReserveDate DATE, RoomNum INT);
CREATE TABLE Customer (ID INT, Name VARCHAR(30), Age INT, Address VARCHAR(20));

INSERT INTO Reservation(ID, Name, ReserveDate, RoomNum) VALUES(1, '홍길동', '2016-01-05', 2014);
INSERT INTO Reservation(ID, Name, ReserveDate, RoomNum) VALUES(2, '임꺽정', '2016-02-12', 918);
INSERT INTO Reservation(ID, Name, ReserveDate, RoomNum) VALUES(3, '장길산', '2016-01-16', 1208);
INSERT INTO Reservation(ID, Name, ReserveDate, RoomNum) VALUES(4, '홍길동', '2016-03-17', 504);

INSERT INTO Customer (ID, Name, Age, Address) VALUES (1, '홍길동', 17, '서울');
INSERT INTO Customer (ID, Name, Age, Address) VALUES (2, '임꺽정', 11, '인천');
INSERT INTO Customer (ID, Name, Age, Address) VALUES (3, '장길산', 13, '서울');
INSERT INTO Customer (ID, Name, Age, Address) VALUES (4, '전우치', 17, '수원');


----------------------------------------------주요 구문----------------------------------------------

1. CREATE DATABASE

	1.1 생성 
		CREATE DATABASE 데이터베이스이름 
		ex) CREATE DATABASE Hotel;

	1.2 선택 
		USE 데이터베이스이름 
		ex) USE Hotel;

2. ALTER DATABASE

	2.1. ALTER DATABASE 데이터베이스이름 CHARACTER SET=문자집합이름

	2.2. ALTER DATABASE 데이터베이스이름 COLLATE=콜레이션이름
		ex) ALTER DATABASE Hotel CHARACTER SET=euckr_bin COLLATE=euckr_korean_ci;
			Hotel 데이터베이스의 문자 집합과 콜레이션을 변경

	2.3. 대표적인 CHARACTER SET
		utf8 : UTF-8 유니코드를 지원하는 문자셋 (1~3바이트)
		euckr : 한글을 지원하는 문자셋 (1~2바이트)

	2.4. 대표적인 COLLATE
		utf8_bin
		utf8_general_ci (기본 설정)
		euckr_bin
		euckr_korean_ci

3. CREATE TABLE

	3.1 생성: CREATE TABLE 테이블이름  
		(
			필드이름1 필드타입1,
			필드이름2 필드타입2,
			...
		)
	ex) CREATE TABLE Test
		(
		    ID INT,
		    Name VARCHAR(30),
		    ReserveDate DATE,
		    RoomNum INT
		);

	3.2 제약조건
		3.2.1. NOT NULL : 해당 필드는 NULL 값을 저장할 수 없게 됩니다.
		3.2.2. UNIQUE : 해당 필드는 서로 다른 값을 가져야만 합니다.
		3.2.3. PRIMARY KEY : 해당 필드가 NOT NULL과 UNIQUE 제약 조건의 특징을 모두 가지게 됩니다.
		3.2.4. FOREIGN KEY : 하나의 테이블을 다른 테이블에 의존하게 만듭니다.
		3.2.5. DEFAULT : 해당 필드의 기본값을 설정합니다.

4. ALTER TABLE

	4.1. ADD
		ALTER TABLE 테이블이름 ADD 필드이름 필드타입
		ex) ALTER TABLE Reservation ADD Phone INT;

	4.2. DROP
		ALTER TABLE 테이블이름 DROP 필드이름
		ex) ALTER TABLE Reservation DROP RoomNum;

	4.3. MODIFY COLUMN
		ALTER TABLE 테이블이름 MODIFY COLUMN 필드이름 필드타입
		ex) ALTER TABLE Reservation MODIFY COLUMN ReserveDate VARCHAR(20);

5. DROP TABLE

	5.1. DROP DATABASE
		DROP DATABASE 데이터베이스이름
		ex) DROP DATABASE Hotel;
		
	5.2. DROP TABLE
		5.2.1. DROP TABLE 테이블이름 (해당 테이블을 삭제)
		ex) DROP TABLE Reservation;
		5.2.2. TRUNCATE TABLE 테이블이름 (테이블의 데이터만을 지우기)
		ex) TRUNCATE TABLE Reservation;

	5.3. IF EXISTS (데이터베이스나 테이블이 존재하지 않아서 발생하는 에러를 방지)
		5.3.1. DROP DATABASE IF EXISTS Hotel;
		5.3.2. DROP TABLE IF EXISTS Reservation;

6. INSERT INTO

	6.1. INSERT INTO 테이블이름(필드이름1, 필드이름2, 필드이름3, ...) VALUES (데이터값1, 데이터값2, 데이터값3, ...)
		ex) INSERT INTO Reservation(ID, Name, ReserveDate, RoomNum) VALUES(5, '이순신', '2016-02-16', 1108);
			INSERT INTO Reservation(ID, Name) VALUES (6, '김유신'); [모든 필드의 값을 가져야할 필요x]

	6.2. INSERT INTO 테이블이름 VALUES (데이터값1, 데이터값2, 데이터값3, ...)
		* 생략할 수 있는 필드
		6.2.1. NULL을 저장할 수 있도록 설정된 필드
		6.2.2. DEFAULT 제약 조건이 설정된 필드
		6.2.3. AUTO_INCREMENT 키워드가 설정된 필드

7. UPDATE

	7.1. UPDATE 테이블이름 SET 필드이름1=데이터값1, 필드이름2=데이터값2, ... WHERE 필드이름=데이터값
		ex) UPDATE Reservation SET RoomNum = 2002 WHERE Name = '홍길동';
			Reservation 테이블에서 홍길동이란 이름을 가진 데이터들의 RoomNum 데이터를 2002로 변경한다.
			UPDATE Reservation SET RoomNum = 2002;

8. DELETE

	8.1. DELETE FROM 테이블이름 WHERE 필드이름=데이터값
		ex) DELETE FROM Reservation WHERE Name = '홍길동';

	8.2. DELETE FROM 테이블이름; (모든 데이터 삭제)

9. SELECT

	9.1. SELECT 필드타입 FROM 테이블이름 [WHERE 조건]
		9.1.1 전체선택
			ex) SELECT * FROM Reservation WHERE Name = '홍길동';
				Name 필드의 값이 '홍길동'인 레코드만을 선택
				SELECT * FROM Reservation WHERE ID <= 3 AND ReserveDate > '2016-02-01';
				ID 값이 3 이하이면서 ReserveDate 필드의 값이 2016년 2월 1일 이후인 레코드만을 선택
		
		9.1.2. 부분선택
			ex) SELECT Name, RoomNum FROM Reservation;
				Reservation 테이블에서 Name 필드와 RoomNum 필드만을 선택
				SELECT Name, ReserveDate FROM Reservation WHERE ID <= 3 AND ReserveDate > '2016-02-01';
				ID 값이 3 이하이면서 ReserveDate 필드의 값이 2016년 2월 1일 이후인 레코드의 Name 필드와 ReserveDate 필드만을 선택

	9.2. SELECT DISTINCT 필드타입 FROM 테이블이름 (중복값 제거)
		ex) SELECT DISTINCT Name FROM Reservation;

	9.3. SELECT 필드타입 FROM 테이블이름 ORDER BY 필드타입 (정렬)
		기본값이 오름차순, 내림차순은 문법마지막에 DESC 키워드 추가.
		ex) SELECT * FROM Reservation ORDER BY ReserveDate;
			Reservation 테이블의 모든 레코드를 ReserveDate 필드의 오름차순으로 정렬하여 선택
			SELECT * FROM Reservation ORDER BY ReserveDate DESC;
			Reservation 테이블의 모든 레코드를 ReserveDate 필드의 내림차순으로 정렬하여 선택
			SELECT * FROM Reservation ORDER BY ReserveDate DESC, RoomNum ASC;
			Reservation 테이블의 모든 레코드를 먼저 ReserveDate 필드의 내림차순으로 정렬한 뒤에, 또다시 RoomNum 필드의 내림차순으로 정렬하여 선택

	9.4. SELECT 필드이름 AS 별칭 FROM 테이블이름; (해당 필드에 새로운 별칭 부여)
		SELECT 필드이름 FROM 테이블이름 AS 별칭; (해당 테이블에 새로운 별칭 부여)
		ex) SELECT ReserveDate, CONCAT(RoomNum, " : ", Name) AS ReserveInfo FROM Reservation;
		Reservation 테이블의 RoomNum 필드와 Name 필드에 하나의 새로운 별칭을 부여

10. CREATE INDEX

	인덱스는 자주 사용되는 필드 값으로 만들어진 원본 테이블의 사본
	인덱스는 사용자가 직접 접근할 수는 없으며, 검색과 질의에 대한 처리에서만 사용
	따라서 인덱스는 수정보다는 검색이 자주 사용되는 테이블에서 사용

	10.1. CREATE INDEX 인덱스이름 ON 테이블이름 (필드이름1, 필드이름2, ...)
		ex) CREATE INDEX NameIdx On Reservation (Name);

	10.2. 인덱스 정보보기
		SHOW INDEX FROM 테이블이름
			10.2.1. Table : 테이블의 이름을 표시함.
			10.2.2. Non_unique : 인덱스가 중복된 값을 저장할 수 있으면 1, 저장할 수 없으면 0을 표시함.
			10.2.3. Key_name : 인덱스의 이름을 표시하며, 인덱스가 해당 테이블의 기본 키라면 PRIMARY로 표시함.
			10.2.4. Seq_in_index : 인덱스에서의 해당 필드의 순서를 표시함.
			10.2.5. Column_name : 해당 필드의 이름을 표시함.
			10.2.6. Collation : 인덱스에서 해당 필드가 정렬되는 방법을 표시함.
			10.2.7. Cardinality : 인덱스에 저장된 유일한 값들의 수를 표시함.
			10.2.8. Sub_part : 인덱스 접두어를 표시함.
			10.2.9. Packed : 키가 압축되는(packed) 방법을 표시함.
			10.2.10. Null : 해당 필드가 NULL을 저장할 수 있으면 YES를 표시하고, 저장할 수 없으면 ''를 표시함.
			10.2.11. Index_type : 인덱스에 사용되는 메소드(method)를 표시함.
			10.2.12. Comment : 해당 필드를 설명하는 것이 아닌 인덱스에 관한 기타 정보를 표시함.
			10.2.13. Index_comment : 인덱스에 관한 모든 기타 정보를 표시함.

	10.3. CREATE UNIQUE INDEX 인덱스이름 ON 테이블이름 (필드이름1, 필드이름2, ...) (중복 값을 허용하지 않는 인덱스)
		CREATE UNIQUE INDEX IdIdx On Reservation (ID);

	10.4. CREATE INDEX 인덱스이름 ON 테이블이름 (필드이름 DESC)
		 CREATE INDEX 인덱스이름 ON 테이블이름 (필드이름 ASC)
		ex) CREATE INDEX NameDescIdx On Reservation (Name DESC);
		Reservation 테이블의 Name 필드에 NameDescIdx라는 인덱스를 설정. name 필드의 값들은 내림차순 정렬.

11. DROP INDEX

	11.1. ALTER TABLE 테이블이름 DROP INDEX 인덱스이름
	ex) ALTER TABLE Reservation DROP INDEX NameIdx;
		 Reservation 테이블에서 NameIdx라는 이름의 인덱스를 삭제

	11.2. DROP INDEX 인덱스이름 ON 테이블이름
	ex) DROP INDEX IdIdx ON Reservation;


출처: tcpshool.com/mysql