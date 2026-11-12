제한 시간 120분. 함수 이름과 매개변수를 유지하고 결과를 반환하세요.

## 문제 01 - 점수 구간 분류

배점: 8점

김싸피는 과목별 시험 점수를 세 구간으로 분류하려고 한다.
점수 리스트 scores를 전달받아 각 구간에 속하는 과목의 개수를
딕셔너리로 반환하는 score_distribution 함수를 완성하시오.

[분류 기준]
- fail: 60점 미만
- pass: 60점 이상 80점 미만
- excellent: 80점 이상

[조건]
- scores는 0 이상 100 이하의 정수로 구성된다.
- scores에는 한 개 이상의 점수가 들어 있다.
- input 함수는 사용할 수 없다.

~~~python
def score_distribution(scores):
    pass
~~~

## 문제 02 - 이름 목록 정리

배점: 8점

회원 이름 목록 names를 전달받아 이름을 정리하는 normalize_names 함수를
완성하시오.

[정리 규칙]
1. 이름 양쪽의 공백을 제거한다.
2. 공백 제거 후 빈 문자열이면 결과에서 제외한다.
3. 영문 이름의 각 단어 첫 글자를 대문자로 변경한다.
4. 대소문자를 무시했을 때 같은 이름은 처음 한 번만 저장한다.
5. 결과는 입력에서 처음 등장한 순서를 유지한다.

[조건]
- names는 문자열로 구성된 리스트다.
- 원본 names를 변경하지 않는다.
- input 함수는 사용할 수 없다.

~~~python
def normalize_names(names):
    pass
~~~

## 문제 03 - 문자 등장 횟수

배점: 8점

문자열 text를 전달받아 각 문자의 등장 횟수를 딕셔너리로 반환하는
count_characters 함수를 완성하시오.

[처리 규칙]
1. 영문 대소문자를 구분하지 않는다.
2. 공백 문자는 세지 않는다.
3. 결과 딕셔너리의 키는 각 문자가 처음 등장한 순서를 유지한다.

[조건]
- text는 문자열이다.
- input 함수는 사용할 수 없다.

~~~python
def count_characters(text):
    pass
~~~

## 문제 04 - 여러 집합의 공통 원소

배점: 8점

두 개 이상의 정수 집합을 전달받아 모든 집합에 공통으로 들어 있는 값을
분석하는 common_values 함수를 완성하시오.

[반환 형식]
{
    'count': 공통 원소의 개수,
    'values': 공통 원소를 오름차순으로 정렬한 리스트,
}

[조건]
- 함수에는 두 개 이상의 집합이 전달된다.
- 각 집합의 원소는 정수다.
- 원본 집합을 변경하지 않는다.
- input 함수는 사용할 수 없다.

~~~python
def common_values(*number_sets):
    pass
~~~

## 문제 05 - 행별 합계 분석

배점: 10점

각 행의 길이가 서로 다를 수 있는 정수 행렬 matrix를 전달받아
각 행의 합계와 가장 큰 행 합계를 가진 행을 분석하는 analyze_rows 함수를
완성하시오.

[처리 규칙]
- 빈 행의 합계는 0이다.
- 가장 큰 행 합계를 가진 행이 여러 개면 모든 행 인덱스를 저장한다.
- 행 인덱스는 입력 순서를 유지한다.

[반환 형식]
{
    'row_sums': [각 행의 합계, ...],
    'max_sum': 가장 큰 행 합계,
    'max_rows': [가장 큰 합계를 가진 행 인덱스, ...],
}

[조건]
- matrix에는 한 개 이상의 행이 들어 있다.
- 각 행은 정수로 구성된 리스트다.
- 내장 함수 sum과 max를 사용하지 않으면 추가 점수를 부여한다.
- input 함수는 사용할 수 없다.

~~~python
def analyze_rows(matrix):
    pass
~~~

## 문제 06 - 도서 대여 처리

배점: 12점

도서관 회원 정보 users와 현재 보유 도서 수 total_books를 전달받아
회원의 대여 요청을 입력 순서대로 처리하는 rental_books 함수를 완성하시오.

[대여 규칙]
- 회원이 요청하는 도서 수는 age // 10이다.
- 현재 남은 도서가 요청 수 이상이면 대여를 승인하고 도서 수를 차감한다.
- 도서가 부족하면 대여를 거절하고 남은 도서 수를 변경하지 않는다.

[반환 형식]
{
    'remaining_books': 처리 후 남은 도서 수,
    'rented': [{'name': 승인된 회원 이름, 'books': 대여 수}, ...],
    'rejected': [거절된 회원 이름, ...],
}

[조건]
- 각 회원은 name과 age 키를 가진 딕셔너리다.
- 모든 회원의 age는 10 이상의 정수다.
- 원본 users를 변경하지 않는다.
- input 함수는 사용할 수 없다.

~~~python
def rental_books(users, total_books):
    pass
~~~

## 문제 07 - 상품 데이터 보완

배점: 10점

상품 딕셔너리 리스트 products와 필수 키 목록 required_keys를 전달받아
모든 상품의 데이터 형식을 통일하는 complete_products 함수를 완성하시오.

[처리 규칙]
1. 각 결과 딕셔너리는 required_keys에 있는 키만 가진다.
2. 키의 순서는 required_keys의 순서를 따른다.
3. 상품에 필수 키가 없으면 해당 값으로 'unknown'을 저장한다.
4. required_keys에 없는 기존 키는 결과에서 제외한다.

[조건]
- products와 각 상품 딕셔너리를 변경하지 않는다.
- required_keys는 문자열 리스트다.
- input 함수는 사용할 수 없다.

~~~python
def complete_products(products, required_keys):
    pass
~~~

## 문제 08 - 유효 사용자 혈액형 그룹화

배점: 12점

사용자 정보 users, 허용 혈액형 집합 blood_types, 차단 회사 집합 black_list를
전달받아 가입 가능한 사용자를 혈액형별로 그룹화하는 group_valid_users 함수를
완성하시오.

[처리 규칙]
1. blood_group이 blood_types에 없는 사용자는 제외한다.
2. company가 black_list에 있는 사용자는 제외한다.
3. 가입 가능한 사용자는 혈액형을 키, 이름 리스트를 값으로 그룹화한다.
4. 가입 가능한 사용자가 없는 혈액형은 결과에 넣지 않는다.
5. 혈액형 키와 사용자 이름은 입력에서 처음 등장한 순서를 유지한다.

[조건]
- 각 사용자는 name, blood_group, company 키를 가진다.
- 원본 users를 변경하지 않는다.
- input 함수는 사용할 수 없다.

~~~python
def group_valid_users(users, blood_types, black_list):
    pass
~~~

## 문제 09 - 중첩 데이터의 고유 키 수집

배점: 12점

딕셔너리와 리스트로 중첩된 data를 전달받아 모든 딕셔너리 키를 수집하는
collect_unique_keys 함수를 완성하시오.

[처리 규칙]
1. 딕셔너리의 키는 삽입 순서대로 확인한다.
2. 리스트의 원소는 인덱스 순서대로 확인한다.
3. 같은 키가 여러 번 등장하면 처음 한 번만 결과에 저장한다.
4. 결과는 키가 전체 탐색에서 처음 등장한 순서를 유지한다.
5. 딕셔너리와 리스트 안에 다시 딕셔너리 또는 리스트가 들어갈 수 있다.

[조건]
- 모든 딕셔너리 키는 문자열이다.
- 원본 data를 변경하지 않는다.
- 재귀 호출을 사용하면 추가 점수를 부여한다.
- input 함수는 사용할 수 없다.

~~~python
def collect_unique_keys(data):
    pass
~~~

## 문제 10 - 재고 입출고 처리

배점: 12점

현재 재고 stock과 입출고 내역 transactions를 전달받아 내역을 입력 순서대로
처리하는 process_inventory 함수를 완성하시오.

[입출고 내역 형식]
{
    'action': 'in' 또는 'out',
    'item': 상품명,
    'quantity': 수량,
}

[처리 규칙]
1. in은 기존 재고에 수량을 더한다. 없는 상품이면 새로 추가한다.
2. out은 상품이 존재하고 재고가 충분할 때만 수량을 뺀다.
3. out 상품이 없으면 실패 이유는 'missing'이다.
4. out 재고가 부족하면 실패 이유는 'insufficient'다.
5. 실패한 내역은 어떤 재고도 변경하지 않는다.
6. processed에는 성공한 내역의 인덱스를 저장한다.

[반환 형식]
{
    'stock': 처리 후의 새 재고 딕셔너리,
    'processed': [성공한 내역 인덱스, ...],
    'failed': [
        {'index': 실패 인덱스, 'item': 상품명, 'reason': 실패 이유},
        ...
    ],
}

[조건]
- action은 in 또는 out만 주어진다.
- quantity는 양의 정수다.
- 원본 stock과 transactions를 변경하지 않는다.
- input 함수는 사용할 수 없다.

~~~python
def process_inventory(stock, transactions):
    pass
~~~
