import type { AiPythonCategory, AiPythonQuestion } from "../types/aiPythonStudy";

export const AI_PYTHON_CATEGORY_META: Record<
  AiPythonCategory,
  { label: string; shortLabel: string; color: string; description: string }
> = {
  python: {
    label: "Python 기초",
    shortLabel: "Python",
    color: "#4f46e5",
    description: "변수, 자료형, 조건문, 반복문과 함수",
  },
  api: {
    label: "API · JSON",
    shortLabel: "API",
    color: "#2563eb",
    description: "HTTP 요청, 응답 상태와 JSON 파싱",
  },
  numpy: {
    label: "NumPy",
    shortLabel: "NumPy",
    color: "#0891b2",
    description: "배열 생성, 연산, 변형과 집계",
  },
  pandas: {
    label: "Pandas",
    shortLabel: "Pandas",
    color: "#0f9f6e",
    description: "DataFrame 조회, 정제, 그룹화와 결합",
  },
  matplotlib_eda: {
    label: "시각화 · EDA",
    shortLabel: "EDA",
    color: "#9333ea",
    description: "Matplotlib, Seaborn과 탐색적 데이터 분석",
  },
};

export const AI_PYTHON_QUESTION_BANK: AiPythonQuestion[] = [
  // --- [초급: Python 기초 & 자료형] ---
  {
    id: "ai-python-q-001",
    category: "python",
    questionType: "multiple-choice",
    prompt: "다음 중 파이썬에서 자료형이 문자열(str)인 것은?",
    options: ["10", "23.14", "\"10\"", "True"],
    answer: 2,
    explanation: "따옴표로 감싸면 숫자처럼 보여도 문자열(str)입니다.",
    hint: "type() 함수로 확인했을 때 <class 'str'>이 나오는 것을 찾으세요."
  },
  {
    id: "ai-python-q-002",
    category: "python",
    questionType: "multiple-choice",
    prompt: "리스트에서 가장 마지막 항목에 접근할 때 사용하는 인덱스는?",
    options: ["[0]", "[1]", "[-1]", "[a:b]"],
    answer: 2,
    explanation: "리스트에서 -1 인덱스는 가장 마지막 항목을 가리킵니다.",
    hint: "뒤에서부터 셀 때 사용하는 음수 인덱스입니다."
  },
  {
    id: "ai-python-q-003",
    category: "python",
    questionType: "multiple-choice",
    prompt: "파이썬 딕셔너리(dict)에서 특정 키(key)의 값을 꺼낼 때 안전하게 접근하기 위해 사용하는 메서드는?",
    options: ["find()", "get()", "search()", "key()"],
    answer: 1,
    explanation: "get('키', 기본값) 메서드를 사용하면 키가 없을 경우 오류 대신 지정한 기본값을 반환하여 안전하게 접근할 수 있습니다.",
    hint: "키가 없을 때 프로그램이 종료되지 않게 도와주는 메서드입니다."
  },
  {
    id: "ai-python-q-004",
    category: "python",
    questionType: "multiple-choice",
    prompt: "파이썬에서 변수의 자료형을 확인하기 위해 사용하는 내장 함수는?",
    options: ["type()", "check()", "print()", "format()"],
    answer: 0,
    explanation: "type() 함수는 해당 데이터가 int, str, bool 등 어떤 자료형인지 확인하는 데 사용됩니다.",
    hint: "자료형(Type)을 영어로 그대로 쓴 함수입니다."
  },
  {
    id: "ai-python-q-005",
    category: "python",
    questionType: "multiple-choice",
    prompt: "기존 리스트의 맨 끝에 새로운 데이터를 추가할 때 사용하는 메서드는?",
    options: ["add()", "insert()", "append()", "push()"],
    answer: 2,
    explanation: "append() 메서드는 기존 리스트를 수정하여 맨 끝에 요소를 추가하며 None을 반환합니다.",
    hint: "리스트를 확장할 때 가장 자주 쓰이는 메서드입니다."
  },
  {
    id: "ai-python-q-006",
    category: "python",
    questionType: "multiple-choice",
    prompt: "파이썬의 논리 자료형(bool)에 해당하는 값은?",
    options: ["\"True\"", "1", "True", "None"],
    answer: 2,
    explanation: "따옴표 없는 True와 False가 파이썬의 bool 자료형입니다.",
    hint: "문자열이 아닌 파이썬 예약어를 찾으세요."
  },
  {
    id: "ai-python-q-007",
    category: "python",
    questionType: "multiple-choice",
    prompt: "파이썬 리스트 슬라이싱 [a:b]에 대한 올바른 설명은?",
    options: ["a부터 b까지 모두 포함한다.", "끝 인덱스인 b는 포함하지 않는다.", "a와 b 인덱스 두 개만 가져온다.", "b부터 a까지 역순으로 가져온다."],
    answer: 1,
    explanation: "슬라이싱은 인덱스 0부터 시작하며, 끝 인덱스는 포함하지 않습니다.",
    hint: "시작은 포함, 끝은 미포함입니다."
  },
  {
    id: "ai-python-q-008",
    category: "python",
    questionType: "multiple-choice",
    prompt: "조건이 참일 때와 거짓일 때 다른 코드를 실행하도록 분기하는 키워드는?",
    options: ["for, in", "def, return", "if, elif", "list, dict"],
    answer: 2,
    explanation: "if와 elif를 통해 조건 분기를 처리합니다.",
    hint: "조건문을 작성하는 키워드입니다."
  },
  {
    id: "ai-python-q-009",
    category: "python",
    questionType: "multiple-choice",
    prompt: "파이썬에서 함수를 새롭게 정의할 때 사용하는 키워드는?",
    options: ["function", "def", "func", "define"],
    answer: 1,
    explanation: "def 키워드를 사용하여 새로운 함수를 정의합니다.",
    hint: "define의 약자 3글자입니다."
  },
  {
    id: "ai-python-q-010",
    category: "python",
    questionType: "multiple-choice",
    prompt: "숫자와 문자열을 연결(출력)할 때 오류를 방지하기 위해 사용하는 방법은?",
    options: ["더하기(+) 기호만 쓴다.", "str()이나 f-string을 사용한다.", "숫자를 리스트로 바꾼다.", "딕셔너리를 사용한다."],
    answer: 1,
    explanation: "숫자와 문자열을 섞어 쓸 때에는 str()로 변환하거나 f-string 포맷팅을 사용해야 합니다.",
    hint: "자료형을 문자로 맞춰주는 방법을 찾으세요."
  },

  // --- [초급: API, HTTP & JSON 파싱] ---
  {
    id: "ai-python-q-011",
    category: "api",
    questionType: "multiple-choice",
    prompt: "HTTP GET 요청을 보내 데이터를 주고받기 위해 사용하는 파이썬 라이브러리 함수는?",
    options: ["json()", "status_code", "requests.get()", "response.text"],
    answer: 2,
    explanation: "프로그램 간에 요청을 보낼 때는 requests 라이브러리의 get() 함수를 사용합니다.",
    hint: "요청(request)을 보내는 함수입니다."
  },
  {
    id: "ai-python-q-012",
    category: "api",
    questionType: "multiple-choice",
    prompt: "requests.get()으로 요청을 보낸 후, 응답이 성공했는지 확인할 때 확인하는 값은?",
    options: ["response.text", "response.status_code", "response.json()", "response.url"],
    answer: 1,
    explanation: "성공 여부는 상태 코드 숫자(status_code)로 판단합니다.",
    hint: "HTTP 상태를 나타내는 코드를 확인해야 합니다."
  },
  {
    id: "ai-python-q-013",
    category: "api",
    questionType: "multiple-choice",
    prompt: "응답 상태 코드가 '성공'을 의미하는 숫자는?",
    options: ["200", "404", "500", "403"],
    answer: 0,
    explanation: "보통 status_code == 200 인 것을 확인한 뒤 데이터를 파싱합니다.",
    hint: "가장 대표적인 정상 응답 코드입니다."
  },
  {
    id: "ai-python-q-014",
    category: "api",
    questionType: "multiple-choice",
    prompt: "API로부터 받은 JSON 응답을 파이썬의 딕셔너리나 리스트 객체로 변환해주는 메서드는?",
    options: ["dict()", "parse()", "json()", "text()"],
    answer: 2,
    explanation: "requests 응답 객체에 .json()을 호출하여 JSON 응답을 파이썬 객체로 변환합니다.",
    hint: "JSON 형태를 그대로 파싱해주는 메서드입니다."
  },
  {
    id: "ai-python-q-015",
    category: "api",
    questionType: "multiple-choice",
    prompt: "아래 JSON에서 첫 번째 사용자의 도시(city)를 꺼내는 코드는?\n`data = [{\"name\": \"김싸피\", \"address\": {\"city\": \"Seoul\"}}]`",
    options: ["data['city']", "data[0].city", "data[0]['address']['city']", "data['address'][0]['city']"],
    answer: 2,
    explanation: "가장 바깥이 리스트이므로 [0]으로 꺼낸 뒤, 딕셔너리의 키로 ['address']['city'] 순서대로 접근합니다.",
    hint: "파이썬 딕셔너리는 속성이 아닌 ['키'] 형태로 접근해야 합니다."
  },
  {
    id: "ai-python-q-016",
    category: "api",
    questionType: "multiple-choice",
    prompt: "LLM API 응답 등에서 데이터를 추출할 때, 가장 본문 내용이 담기는 일반적인 키(Key) 이름은?",
    options: ["status", "content", "header", "url"],
    answer: 1,
    explanation: "LLM 응답 구조에서는 보통 응답 메시지의 content 값을 추출하여 사용합니다.",
    hint: "본문, 내용을 뜻하는 영단어입니다."
  },
  {
    id: "ai-python-q-017",
    category: "api",
    questionType: "multiple-choice",
    prompt: "API 키(Key)를 코드에서 안전하게 관리하는 방법은?",
    options: ["코드 안에 직접 변수로 하드코딩한다.", "환경 변수로 관리한다.", "주석으로 남겨둔다.", "HTML 파일에 기록한다."],
    answer: 1,
    explanation: "API 키는 코드에 직접 작성하지 않고 환경 변수로 안전하게 관리해야 합니다.",
    hint: "외부로 노출되지 않도록 시스템 차원에서 관리하는 방법입니다."
  },
  {
    id: "ai-python-q-018",
    category: "api",
    questionType: "multiple-choice",
    prompt: "JSON 구조에서 파이썬의 리스트(list)로 파싱되는 기호는?",
    options: ["{ }", "[ ]", "( )", "< >"],
    answer: 1,
    explanation: "대괄호 [ ] 기호는 배열을 의미하며, 파이썬에서는 list로 변환됩니다.",
    hint: "배열이나 리스트를 감싸는 괄호입니다."
  },
  {
    id: "ai-python-q-019",
    category: "api",
    questionType: "multiple-choice",
    prompt: "JSON 구조에서 파이썬의 딕셔너리(dict)로 파싱되는 기호는?",
    options: ["{ }", "[ ]", "( )", "< >"],
    answer: 0,
    explanation: "중괄호 { } 기호는 키와 값의 쌍을 의미하며, 파이썬의 dict로 변환됩니다.",
    hint: "사전형(키-값) 데이터를 묶는 괄호입니다."
  },
  {
    id: "ai-python-q-020",
    category: "api",
    questionType: "multiple-choice",
    prompt: "요청이 실패했을 때 에러를 방지하고 기본 메시지를 띄우기 위해 딕셔너리에 사용할 수 있는 함수는?",
    options: ["find('키', '에러')", "get('키', 기본값)", "append('에러')", "status_code('기본값')"],
    answer: 1,
    explanation: "파싱된 JSON(딕셔너리)에서 키가 없을 경우를 대비해 get('키', 기본값)을 활용합니다.",
    hint: "가져오기 함수에 기본값을 인자로 넣습니다."
  },

  // --- [중급: NumPy 배열 연산] ---
  {
    id: "ai-python-q-021",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "NumPy 배열을 생성할 때 사용하는 기본적인 함수는?",
    options: ["np.list()", "np.create()", "np.array()", "np.make()"],
    answer: 2,
    explanation: "리스트나 튜플 데이터를 NumPy 배열로 만들 때 np.array()를 사용합니다.",
    hint: "배열(Array)을 뜻하는 영단어입니다."
  },
  {
    id: "ai-python-q-022",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "연속된 숫자를 가진 NumPy 배열을 생성할 때 사용하는 함수는?",
    options: ["np.range()", "np.arange()", "np.sequence()", "np.lines()"],
    answer: 1,
    explanation: "np.arange()를 사용하여 규칙적인 숫자 배열을 생성합니다.",
    hint: "파이썬의 range와 array가 결합된 형태의 이름입니다."
  },
  {
    id: "ai-python-q-023",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "NumPy 배열의 차원과 형태(행렬 크기)를 확인할 때 사용하는 속성은?",
    options: ["size", "length", "shape", "dim"],
    answer: 2,
    explanation: "shape 속성은 배열이 몇 차원이고 각 축이 몇 개의 요소를 가지는지 튜플 형태로 알려줍니다.",
    hint: "형태나 모양을 뜻하는 영단어입니다."
  },
  {
    id: "ai-python-q-024",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "NumPy 배열에서 반복문 없이 배열의 각 원소에 한 번에 산술 연산을 적용할 수 있는 기능은?",
    options: ["리스트 반복 연산", "브로드캐스팅 및 벡터 연산", "슬라이싱", "append 연산"],
    answer: 1,
    explanation: "벡터 연산을 사용하면 반복문을 작성하지 않아도 배열 단위로 빠르게 계산을 처리할 수 있습니다.",
    hint: "반복문 없이 통째로 연산하는 방식입니다."
  },
  {
    id: "ai-python-q-025",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "2차원 배열에서 열(컬럼) 방향(수직 방향)으로 집계 계산을 수행할 때 지정하는 축(axis) 값은?",
    options: ["axis=0", "axis=1", "axis=-1", "axis=2"],
    answer: 0,
    explanation: "축별 계산에서 axis=0은 행을 따라 이동하며 열 방향으로 집계합니다.",
    hint: "첫 번째 축을 의미하는 숫자 0을 사용합니다."
  },
  {
    id: "ai-python-q-026",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "2차원 배열에서 행 단위(가로 방향)로 집계 계산을 수행할 때 지정하는 축(axis) 값은?",
    options: ["axis=0", "axis=1", "axis=-1", "axis=2"],
    answer: 1,
    explanation: "축별 계산에서 axis=1은 열을 따라 이동하며 행 방향으로 집계합니다.",
    hint: "두 번째 축을 의미하는 숫자 1을 사용합니다."
  },
  {
    id: "ai-python-q-027",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "NumPy 배열의 차원 형태(예: 1차원 -> 2차원)를 변경하는 메서드는?",
    options: ["reshape()", "resize()", "change()", "shape()"],
    answer: 0,
    explanation: "reshape()를 통해 데이터 개수 유지 하에 배열의 형태를 변경할 수 있습니다.",
    hint: "모양(shape)을 다시(re) 잡는 함수입니다."
  },
  {
    id: "ai-python-q-028",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "NumPy 배열의 행과 열을 뒤바꾸는(전치) 속성은?",
    options: [".R", ".T", ".transpose()", ".rev"],
    answer: 1,
    explanation: ".T 속성을 사용하면 간단하게 행렬의 전치(Transpose)를 수행할 수 있습니다.",
    hint: "Transpose의 첫 글자 대문자입니다."
  },
  {
    id: "ai-python-q-029",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "NumPy 배열의 데이터를 오름차순으로 정렬하는 함수는?",
    options: ["np.order()", "np.align()", "np.sort()", "np.arrange()"],
    answer: 2,
    explanation: "np.sort() 함수를 사용하여 배열의 형태를 정렬합니다.",
    hint: "정렬하다라는 뜻의 영단어입니다."
  },
  {
    id: "ai-python-q-030",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "정렬된 배열 자체가 아닌, 정렬된 값들의 기존 '인덱스'를 반환하는 함수는?",
    options: ["np.argsort()", "np.index_sort()", "np.search()", "np.find()"],
    answer: 0,
    explanation: "np.argsort()는 배열을 정렬했을 때 해당 원소가 원래 있던 위치(인덱스)를 반환합니다.",
    hint: "argument(인수/인덱스)와 sort가 합쳐진 함수명입니다."
  },
  {
    id: "ai-python-q-031",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "배열 내 모든 원소들의 평균을 계산하는 집계 함수는?",
    options: ["avg()", "mean()", "median()", "sum()"],
    answer: 1,
    explanation: "mean() 함수를 통해 배열의 평균을 계산할 수 있습니다.",
    hint: "평균을 뜻하는 가장 대표적인 함수명입니다."
  },
  {
    id: "ai-python-q-032",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "배열 내 모든 원소들의 총합을 계산하는 집계 함수는?",
    options: ["total()", "add()", "sum()", "count()"],
    answer: 2,
    explanation: "sum() 함수를 통해 배열 값의 합계를 구합니다.",
    hint: "합계를 뜻하는 함수명입니다."
  },
  {
    id: "ai-python-q-033",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "배열 내에서 가장 큰 최댓값을 찾는 집계 함수는?",
    options: ["top()", "highest()", "max()", "argmax()"],
    answer: 2,
    explanation: "max() 함수는 배열에서 제일 큰 값을 찾아 반환합니다.",
    hint: "maximum의 축약형입니다."
  },
  {
    id: "ai-python-q-034",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "배열 내에서 가장 작은 최솟값을 찾는 집계 함수는?",
    options: ["bottom()", "lowest()", "min()", "argmin()"],
    answer: 2,
    explanation: "min() 함수는 배열에서 제일 작은 값을 찾아 반환합니다.",
    hint: "minimum의 축약형입니다."
  },
  {
    id: "ai-python-q-035",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "배열 값들이 평균으로부터 얼마나 흩어져 있는지 표준편차를 구하는 함수는?",
    options: ["var()", "std()", "dev()", "mean()"],
    answer: 1,
    explanation: "std() 함수를 통해 데이터의 표준편차를 계산합니다.",
    hint: "Standard Deviation의 약자입니다."
  },
  {
    id: "ai-python-q-036",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "NumPy의 핵심 특징으로, 형태가 다른 두 배열끼리도 일정 조건을 만족하면 자동으로 크기를 맞춰 연산해주는 기능은?",
    options: ["슬라이싱", "인덱싱", "브로드캐스팅", "전치"],
    answer: 2,
    explanation: "NumPy는 브로드캐스팅(Broadcasting)을 통해 반복 연산을 손쉽게 처리합니다.",
    hint: "방송(broadcast)처럼 퍼져서 적용된다는 개념입니다."
  },
  {
    id: "ai-python-q-037",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "하나의 NumPy 배열 안에 여러 개의 서로 다른 자료형(예: int와 str)을 섞어서 저장하는 것에 대한 올바른 설명은?",
    options: ["자유롭게 저장할 수 있다.", "불가능하며 같은 자료형의 데이터만 저장할 수 있다.", "에러는 안 나지만 무조건 리스트로 바뀐다.", "int와 float만 섞을 수 있다."],
    answer: 1,
    explanation: "NumPy 배열은 단일 데이터 타입(같은 자료형)만 가지므로 서로 다른 자료형 저장이 불가합니다.",
    hint: "속도 최적화를 위해 자료형을 통일합니다."
  },
  {
    id: "ai-python-q-038",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "NumPy가 파이썬 기본 리스트보다 수치 계산에서 유리한 주된 이유는?",
    options: ["자동으로 결측치를 지워줘서", "반복문 없이 배열 단위로 벡터 연산을 빠르게 처리해서", "메모리를 아예 사용하지 않아서", "항상 문자열로 계산해서"],
    answer: 1,
    explanation: "NumPy 배열은 숫자 데이터를 반복문 없이 벡터 연산으로 리스트보다 훨씬 빠르게 처리합니다.",
    hint: "벡터 연산과 빠른 처리 속도가 핵심입니다."
  },
  {
    id: "ai-python-q-039",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "배열에서 특정 조건식(예: arr > 5)을 적용했을 때 반환되는 배열의 원소 자료형은?",
    options: ["정수형(int)", "실수형(float)", "논리형(bool)", "문자형(str)"],
    answer: 2,
    explanation: "조건 연산을 적용하면 각 원소가 조건에 참인지 거짓인지 판단하여 True/False 논리형(bool) 배열을 반환합니다.",
    hint: "비교의 결과는 참 또는 거짓입니다."
  },
  {
    id: "ai-python-q-040",
    category: "numpy",
    questionType: "multiple-choice",
    prompt: "코드 `arr.reshape(2, -1)`에서 `-1`이 의미하는 것은?",
    options: ["행렬의 끝을 의미한다.", "에러를 발생시킨다.", "다른 차원에 맞춰 열의 개수를 자동으로 계산한다.", "데이터를 역순으로 정렬한다."],
    answer: 2,
    explanation: "reshape에서 -1을 지정하면 데이터의 전체 개수를 유지할 수 있도록 해당 차원의 크기를 자동으로 계산하여 맞춥니다.",
    hint: "남는 차원을 자동으로 채워달라는 뜻입니다."
  },

  // --- [중급: Pandas 데이터프레임 구조 & 조회] ---
  {
    id: "ai-python-q-041",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "데이터를 행과 열로 구성된 '표' 형태로 다루는 Pandas의 2차원 자료구조는?",
    options: ["Series", "List", "DataFrame", "Array"],
    answer: 2,
    explanation: "Pandas DataFrame은 행과 열로 구성된 표 형태의 자료구조입니다.",
    hint: "데이터의 뼈대(Frame)를 뜻합니다."
  },
  {
    id: "ai-python-q-042",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "DataFrame에서 단일 열(Column)을 추출했을 때 반환되는 1차원 자료구조는?",
    options: ["DataFrame", "Series", "Tuple", "Dict"],
    answer: 1,
    explanation: "DataFrame을 구성하는 각각의 열은 Series 구조입니다.",
    hint: "연속된 데이터라는 뜻입니다."
  },
  {
    id: "ai-python-q-043",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "데이터의 앞부분 일부 행(기본 5개)만 확인하여 구조를 파악할 때 사용하는 메서드는?",
    options: ["head()", "top()", "info()", "tail()"],
    answer: 0,
    explanation: "head() 메서드를 사용하여 표의 구조 중 상위 데이터를 빠르게 확인합니다.",
    hint: "머리 부분을 의미합니다."
  },
  {
    id: "ai-python-q-044",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "DataFrame의 전체 컬럼 수, 각 컬럼의 데이터 타입, 결측치 개수 등 구조 정보를 요약해서 보여주는 메서드는?",
    options: ["describe()", "summary()", "info()", "head()"],
    answer: 2,
    explanation: "info()는 표의 구조 정보(타입, 널 값 등)를 파악할 때 사용합니다.",
    hint: "정보(information)의 약자입니다."
  },
  {
    id: "ai-python-q-045",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "수치형 데이터 컬럼에 대한 요약 통계(평균, 표준편차, 최솟값, 최댓값 등)를 한 번에 계산해 보여주는 메서드는?",
    options: ["info()", "describe()", "stats()", "summary()"],
    answer: 1,
    explanation: "describe() 메서드를 사용하면 수치형 데이터의 주요 요약 통계를 한 번에 확인할 수 있습니다.",
    hint: "묘사/설명하다라는 뜻의 영단어입니다."
  },
  {
    id: "ai-python-q-046",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "DataFrame에서 '나이'가 30 이상인 행만 올바르게 선택(필터링)하는 코드는?",
    options: ["df[df['나이'] >= 30]", "df['나이'] >= 30", "df.filter('나이' >= 30)", "df.loc['나이' >= 30]"],
    answer: 0,
    explanation: "단일 조건을 적용해 True인 행을 선택하려면 df[df['나이'] >= 30] 형식을 사용합니다.",
    hint: "데이터프레임의 대괄호 안에 다시 조건식을 넣어야 합니다."
  },
  {
    id: "ai-python-q-047",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "여러 개의 값 중 하나라도 포함하는 행을 필터링할 때 사용하는 목록 검색 메서드는?",
    options: ["has()", "match()", "isin()", "in()"],
    answer: 2,
    explanation: "isin([목록]) 메서드를 사용하면 여러 개의 값 조건으로 행을 편하게 선택할 수 있습니다.",
    hint: "안에 있는지(is in) 묻는 함수입니다."
  },
  {
    id: "ai-python-q-048",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "문자열(str) 컬럼에서 특정 단어가 포함된 행을 찾을 때 사용하는 메서드는?",
    options: ["str.has()", "str.contains()", "str.find()", "str.search()"],
    answer: 1,
    explanation: "str.contains()를 통해 특정 문자열 조건이 포함된 행을 선택할 수 있습니다.",
    hint: "포함하다(contains)라는 뜻입니다."
  },
  {
    id: "ai-python-q-049",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "문자열 컬럼이 특정 문자로 시작하는지 검사하여 행을 선택할 때 사용하는 메서드는?",
    options: ["str.starts()", "str.begin()", "str.startswith()", "str.first()"],
    answer: 2,
    explanation: "str.startswith() 메서드는 문자열이 특정 문자로 시작하는지 검색합니다.",
    hint: "~로 시작하다라는 의미입니다."
  },
  {
    id: "ai-python-q-050",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "다중 조건을 적용하여 필터링할 때, '그리고(AND)' 조건을 나타내는 기호는?",
    options: ["and", "&&", "&", "||"],
    answer: 2,
    explanation: "Pandas 다중 조건 필터링에서 AND 연산은 & 기호를 사용하고 괄호로 묶어야 합니다.",
    hint: "앰퍼샌드 기호 하나를 씁니다."
  },
  {
    id: "ai-python-q-051",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "다중 조건을 적용하여 필터링할 때, '또는(OR)' 조건을 나타내는 기호는?",
    options: ["or", "||", "|", "&&"],
    answer: 2,
    explanation: "Pandas 다중 조건 필터링에서 OR 연산은 |(파이프) 기호를 사용합니다.",
    hint: "수직선(파이프) 기호 하나를 씁니다."
  },
  {
    id: "ai-python-q-052",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "수치형 컬럼에서 값이 가장 큰 상위 N개의 행을 추출하는 메서드는?",
    options: ["head()", "nlargest()", "top()", "max()"],
    answer: 1,
    explanation: "nlargest() 메서드는 지정한 컬럼 기준 상위 N개의 행을 정렬 및 추출합니다.",
    hint: "N개의 가장 큰(largest) 값입니다."
  },
  {
    id: "ai-python-q-053",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "수치형 컬럼에서 값이 가장 작은 하위 N개의 행을 추출하는 메서드는?",
    options: ["tail()", "nsmallest()", "bottom()", "min()"],
    answer: 1,
    explanation: "nsmallest() 메서드는 하위(작은) 행을 정렬하여 추출합니다.",
    hint: "N개의 가장 작은(smallest) 값입니다."
  },
  {
    id: "ai-python-q-054",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "인덱스(Index)의 레이블(이름)을 기반으로 특정 행이나 열을 선택할 때 사용하는 인덱서는?",
    options: ["iloc", "loc", "ix", "at"],
    answer: 1,
    explanation: "loc는 레이블(이름)을 기반으로 데이터 행/열을 선택합니다.",
    hint: "Location의 약자입니다."
  },
  {
    id: "ai-python-q-055",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "정수 위치(0, 1, 2...) 인덱스를 기반으로 특정 행이나 열을 선택할 때 사용하는 인덱서는?",
    options: ["iloc", "loc", "ix", "iat"],
    answer: 0,
    explanation: "iloc는 위치(정수 인덱스)를 기반으로 데이터 행/열을 선택합니다.",
    hint: "Integer Location의 약자입니다."
  },

  // --- [중급: Pandas 그룹 집계 & 고급 EDA] ---
  {
    id: "ai-python-q-056",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "부서별, 연도별처럼 데이터를 특정 기준으로 그룹화할 때 사용하는 메서드는?",
    options: ["group()", "pivot()", "groupby()", "cluster()"],
    answer: 2,
    explanation: "groupby()를 적용해 특정 컬럼을 기준으로 데이터를 그룹화하고 요약 집계할 수 있습니다.",
    hint: "그룹을 묶는다(group by)는 뜻입니다."
  },
  {
    id: "ai-python-q-057",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "DataFrame에서 부서별 급여의 평균을 구하는 올바른 코드는?",
    options: ["df.mean('부서')['급여']", "df.groupby('부서')['급여'].mean()", "df.sort_values('급여')", "df['부서'].value_counts()"],
    answer: 1,
    explanation: "groupby('부서')로 그룹화한 뒤, ['급여'] 컬럼을 선택하고 mean()을 적용해 평균을 계산합니다.",
    hint: "먼저 그룹화하고, 대상 컬럼을 선택한 뒤 연산을 수행합니다."
  },
  {
    id: "ai-python-q-058",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "그룹화된 데이터에 서로 다른 여러 집계 함수(sum, mean 등)를 한 번에 적용하고 싶을 때 사용하는 메서드는?",
    options: ["multi()", "apply()", "agg()", "map()"],
    answer: 2,
    explanation: "agg() 메서드를 이용해 그룹별 요약과 여러 집계 연산을 동시에 수행할 수 있습니다.",
    hint: "Aggregate(집계하다)의 약어입니다."
  },
  {
    id: "ai-python-q-059",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "행과 열을 크로스(교차)하여 요약 통계를 볼 수 있는 엑셀의 피벗 테이블과 같은 기능을 하는 메서드는?",
    options: ["groupby()", "cross_tab()", "pivot_table()", "reshape()"],
    answer: 2,
    explanation: "pivot_table()은 행과 열을 재배치하여 그룹 요약과 교차 집계를 수행합니다.",
    hint: "이름 자체가 피벗 테이블입니다."
  },
  {
    id: "ai-python-q-060",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "특정 컬럼 안에 들어있는 고유한 값들의 개수(빈도수)를 내림차순으로 세어주는 메서드는?",
    options: ["counts()", "value_counts()", "size()", "count_values()"],
    answer: 1,
    explanation: "value_counts()는 각 범주형 값이 몇 개씩 존재하는지 빠르게 집계해 특징을 확인합니다.",
    hint: "값(value)들의 개수(counts)를 세어줍니다."
  },
  {
    id: "ai-python-q-061",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "데이터 전처리 과정에서 발견된 결측치(NaN)를 평균이나 다른 특정 값으로 채워 넣을 때 사용하는 메서드는?",
    options: ["replace_na()", "dropna()", "fillna()", "impute()"],
    answer: 2,
    explanation: "fillna()는 결측치를 지정한 값으로 처리(채우기)할 때 사용합니다.",
    hint: "비어있는(na) 것을 채운다(fill)는 뜻입니다."
  },
  {
    id: "ai-python-q-062",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "결측치나 이상치를 처리할 때, 특정 열에서 가장 자주 나타난 값(최빈값)을 구하는 메서드는?",
    options: ["mean()", "median()", "mode()", "freq()"],
    answer: 2,
    explanation: "mode()는 데이터 중 가장 빈도수가 높은 최빈값을 반환합니다.",
    hint: "최빈값을 의미하는 통계 용어입니다."
  },
  {
    id: "ai-python-q-063",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "분포를 확인할 때 사분위수(1/4, 2/4 등 특정 비율 위치의 값)를 구하여 이상치 기준을 세울 때 쓰는 메서드는?",
    options: ["quantile()", "quartile()", "percent()", "range()"],
    answer: 0,
    explanation: "quantile()을 사용하여 분위수를 구하고, 결측치와 이상치를 중앙값이나 분위수로 처리할 수 있습니다.",
    hint: "분위수를 뜻하는 통계 용어입니다."
  },
  {
    id: "ai-python-q-064",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "복잡한 연산 로직이나 사용자 정의 함수를 DataFrame의 각 행이나 열에 일괄 적용할 때 사용하는 데이터 변환 메서드는?",
    options: ["map()", "apply()", "transform()", "execute()"],
    answer: 1,
    explanation: "apply() 메서드를 통해 함수를 일괄 적용하여 데이터를 변환할 수 있습니다.",
    hint: "적용하다라는 뜻입니다."
  },
  {
    id: "ai-python-q-065",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "연속형 숫자 데이터를 특정 수치 기준(예: 0~10, 10~20)으로 잘라서 범주형 구간으로 나눌 때 사용하는 함수는?",
    options: ["cut()", "qcut()", "split()", "divide()"],
    answer: 0,
    explanation: "수치형 데이터를 구간화(Binning)할 때 동일 간격 기준이면 cut()을 사용합니다.",
    hint: "자르다라는 뜻의 영단어입니다."
  },
  {
    id: "ai-python-q-066",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "연속형 숫자 데이터를 데이터 분포(비율/분위) 기준으로 동일한 개수가 들어가도록 나눌 때 사용하는 함수는?",
    options: ["cut()", "qcut()", "split()", "percent_cut()"],
    answer: 1,
    explanation: "qcut()은 분위수(Quantile) 기준으로 동일 개수가 들어가도록 구간화합니다.",
    hint: "Quantile과 cut의 합성어입니다."
  },
  {
    id: "ai-python-q-067",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "문자열 데이터 등을 메모리를 아끼고 처리 속도를 높이기 위한 '범주형 자료형'으로 변환할 때 지정하는 타입(astype) 이름은?",
    options: ["string", "object", "category", "factor"],
    answer: 2,
    explanation: "범주형 데이터를 숫자 형식 등 내부적으로 최적화해 관리하는 자료형 변환은 category 타입으로 합니다.",
    hint: "카테고리라는 뜻입니다."
  },
  {
    id: "ai-python-q-068",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "전처리 중 발견된 결측치가 포함된 행이나 열을 아예 삭제해버리고 싶을 때 사용하는 메서드는?",
    options: ["remove_na()", "dropna()", "delete()", "drop_null()"],
    answer: 1,
    explanation: "결측치(NA)를 버릴(drop) 때 dropna()를 사용합니다. (교안에는 fillna가 주로 언급되나 대비 개념입니다)",
    hint: "버리다(drop)와 na가 결합되었습니다."
  },
  {
    id: "ai-python-q-069",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "데이터프레임의 인덱스를 정렬하거나 필터링한 후, 기존 인덱스를 버리고 0부터 새롭게 초기화할 때 사용하는 메서드는?",
    options: ["clear_index()", "reset_index()", "init_index()", "reindex()"],
    answer: 1,
    explanation: "데이터 조작 후 뒤죽박죽된 인덱스를 처음부터 다시 맞출 때 reset_index()를 씁니다.",
    hint: "인덱스를 리셋(reset)합니다."
  },
  {
    id: "ai-python-q-070",
    category: "pandas",
    questionType: "multiple-choice",
    prompt: "데이터를 특정 열 기준으로 오름차순 또는 내림차순 정렬할 때 사용하는 메서드는?",
    options: ["order_by()", "sort_index()", "sort_values()", "arrange()"],
    answer: 2,
    explanation: "sort_values() 메서드는 특정 컬럼의 값을 기준으로 행을 정렬합니다.",
    hint: "값(values)을 정렬(sort)합니다."
  },

  // --- [고급: Matplotlib & Seaborn 시각화 EDA] ---
  {
    id: "ai-python-q-071",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "월별 매출의 변화 추이처럼 '시간에 따른 값의 변화'를 확인할 때 가장 적절한 Matplotlib 차트는?",
    options: ["막대그래프(bar)", "꺾은선그래프(line/plot)", "산점도(scatter)", "히스토그램(hist)"],
    answer: 1,
    explanation: "꺾은선그래프(plot)는 시간에 따른 값의 변화 추이를 확인하므로 정답입니다.",
    hint: "데이터의 흐름을 선으로 연결한 그래프입니다."
  },
  {
    id: "ai-python-q-072",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "부서별 급여 차이처럼 '범주별 값의 크기'를 직관적으로 비교할 때 가장 적절한 차트는?",
    options: ["산점도(scatter)", "히스토그램(hist)", "막대그래프(bar)", "원그래프(pie)"],
    answer: 2,
    explanation: "막대그래프(bar)는 범주별 값을 비교할 때 가장 적합합니다.",
    hint: "기둥의 높이로 값을 비교합니다."
  },
  {
    id: "ai-python-q-073",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "키와 몸무게처럼 '수치형 두 변수의 상관관계'를 점으로 찍어 확인할 때 적절한 차트는?",
    options: ["히스토그램(hist)", "산점도(scatter)", "꺾은선그래프(plot)", "상자그림(boxplot)"],
    answer: 1,
    explanation: "산점도(scatter)는 두 수치형 변수의 관계를 점으로 흩뿌려 확인합니다.",
    hint: "점들이 퍼져있는 모양을 보는 그래프입니다."
  },
  {
    id: "ai-python-q-074",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "학생들의 시험 점수 대역별 인원수처럼 연속된 '값의 분포'를 촘촘한 막대 형태로 확인할 때 적절한 차트는?",
    options: ["상자그림(boxplot)", "막대그래프(bar)", "산점도(scatter)", "히스토그램(hist)"],
    answer: 3,
    explanation: "히스토그램(hist)은 연속된 수치형 데이터 값의 빈도(분포)를 확인합니다.",
    hint: "구간(bins)별로 데이터가 얼마나 있는지 보는 그래프입니다."
  },
  {
    id: "ai-python-q-075",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "Matplotlib 그래프에서 한글 텍스트가 네모(□)로 깨져서 표시될 때 해결 방법은?",
    options: ["그래프의 크기를 키운다.", "데이터를 오름차순으로 정렬한다.", "한글 폰트를 지정한다.", "plt.show()를 여러 번 호출한다."],
    answer: 2,
    explanation: "한글 폰트 지정: rcParams['font.family']에 시스템에 설치된 한글 폰트를 설정하여 해결합니다.",
    hint: "그래프에 글꼴을 명시해 주어야 합니다."
  },
  {
    id: "ai-python-q-076",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "수치형 데이터의 사분위수(25%, 50%, 75%), 중앙값, 그리고 '이상치(Outlier)'를 한눈에 확인할 때 가장 적절한 차트는?",
    options: ["상자그림(boxplot)", "원그래프(pie)", "꺾은선그래프(line)", "산점도(scatter)"],
    answer: 0,
    explanation: "상자그림(boxplot)은 사분위수 분포와 수염을 넘어선 이상치를 함께 표시하므로 정답입니다.",
    hint: "네모난 상자와 수염 모양으로 생긴 그래프입니다."
  },
  {
    id: "ai-python-q-077",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "전체 데이터 중에서 각 항목이 차지하는 '비율(%)'을 나타낼 때 주로 사용하는 차트는?",
    options: ["상자그림(boxplot)", "원그래프(pie)", "막대그래프(bar)", "히스토그램(hist)"],
    answer: 1,
    explanation: "원그래프(pie)는 전체에서 각 항목이 차지하는 비율을 나타내므로 구성비 확인에 적합합니다.",
    hint: "피자 조각처럼 생긴 그래프입니다."
  },
  {
    id: "ai-python-q-078",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "Seaborn 라이브러리에서 범주형 데이터의 그룹별 평균이나 집계값을 오차막대와 함께 시각화하는 함수는?",
    options: ["heatmap()", "boxplot()", "barplot()", "scatterplot()"],
    answer: 2,
    explanation: "Seaborn의 barplot()은 범주별 평균과 신뢰 구간을 시각화합니다.",
    hint: "막대그래프를 그리는 Seaborn 함수입니다."
  },
  {
    id: "ai-python-q-079",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "Seaborn 라이브러리에서 여러 변수 간의 '상관관계'를 색상(온도)으로 2차원 시각화하는 함수는?",
    options: ["boxplot()", "heatmap()", "barplot()", "lineplot()"],
    answer: 1,
    explanation: "heatmap()은 변수 간의 상관계수 행렬 등을 색상의 진하기로 시각화합니다.",
    hint: "열화상 카메라 지도라는 뜻의 단어입니다."
  },
  {
    id: "ai-python-q-080",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "분석과 머신러닝 모델 학습을 진행하기 '전'에 결측치와 이상치를 찾아 처리하는 과정을 무엇이라고 하는가?",
    options: ["하이퍼파라미터 튜닝", "모델 평가", "데이터 전처리", "딥러닝"],
    answer: 2,
    explanation: "데이터 전처리(Preprocessing)는 결측치와 이상치를 정리하고 모델이 이해할 수 있게 숫자 형식으로 인코딩하는 필수 과정입니다.",
    hint: "미리(전) 처리한다는 의미입니다."
  },
  {
    id: "ai-python-q-081",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "데이터를 요약하고 집계해 그 안의 숨겨진 특징과 패턴을 탐색하는 분석 과정을 나타내는 약어는?",
    options: ["API", "EDA", "JSON", "CDN"],
    answer: 1,
    explanation: "탐색적 데이터 분석(Exploratory Data Analysis, EDA)은 describe, groupby 등을 통해 패턴을 찾는 과정입니다.",
    hint: "탐색적(E) 데이터(D) 분석(A)입니다."
  },
  {
    id: "ai-python-q-082",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "범주형 데이터를 머신러닝 알고리즘에 넣기 위해 필요한 경우 어떤 형식으로 변환(인코딩)해야 하는가?",
    options: ["텍스트 형식", "이미지 형식", "숫자 형식", "바이너리 파일"],
    answer: 2,
    explanation: "범주형 데이터는 필요한 경우 알고리즘이 연산할 수 있도록 숫자 형식으로 인코딩해야 합니다.",
    hint: "컴퓨터가 연산할 수 있는 기본 자료형입니다."
  },
  {
    id: "ai-python-q-083",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "그래프를 메모리에만 생성하는 것이 아니라 실제 화면(출력창)에 렌더링하기 위해 가장 마지막에 호출하는 Matplotlib 함수는?",
    options: ["plt.draw()", "plt.show()", "plt.print()", "plt.display()"],
    answer: 1,
    explanation: "그래프 출력을 위해 plt.show()를 호출합니다. (오답 선지 확인 문제에서 언급)",
    hint: "보여주다(show)는 뜻입니다."
  },
  {
    id: "ai-python-q-084",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "히스토그램 함수(hist)를 그릴 때, 데이터를 나눌 '구간의 개수'를 지정하는 파라미터는?",
    options: ["range", "steps", "bins", "width"],
    answer: 2,
    explanation: "bins 파라미터로 히스토그램 막대의 개수(구간)를 조정하여 분포를 더 세밀하게 봅니다.",
    hint: "바구니, 쓰레기통 등을 의미하는 영단어입니다."
  },
  {
    id: "ai-python-q-085",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "산점도(scatter)에서 투명도를 조절해 점들이 겹치는 밀도를 파악하기 위해 사용하는 파라미터는?",
    options: ["alpha", "opacity", "transparent", "color"],
    answer: 0,
    explanation: "산점도에서 alpha 속성(0~1)을 주어 점의 투명도를 설정하면 분포가 겹치는 영역을 식별하기 좋습니다.",
    hint: "투명도를 나타내는 그래픽 용어입니다."
  },
  {
    id: "ai-python-q-086",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "Matplotlib 그래프의 위쪽에 그래프가 의미하는 '제목'을 추가하는 함수는?",
    options: ["plt.header()", "plt.name()", "plt.title()", "plt.legend()"],
    answer: 2,
    explanation: "plt.title('제목') 함수를 이용해 그래프 전체의 제목을 설정합니다.",
    hint: "제목을 뜻하는 영어 단어입니다."
  },
  {
    id: "ai-python-q-087",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "그래프의 가로축(X축)에 무엇을 의미하는지 이름을 다는 함수는?",
    options: ["plt.xlabel()", "plt.xname()", "plt.xaxis()", "plt.xtitle()"],
    answer: 0,
    explanation: "plt.xlabel()을 통해 x축의 레이블(이름표)을 지정합니다.",
    hint: "축(x)과 라벨(label)의 결합입니다."
  },
  {
    id: "ai-python-q-088",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "그래프의 세로축(Y축)에 무엇을 의미하는지 이름을 다는 함수는?",
    options: ["plt.yname()", "plt.yaxis()", "plt.ylabel()", "plt.ytitle()"],
    answer: 2,
    explanation: "plt.ylabel()을 통해 y축의 레이블(이름표)을 지정합니다.",
    hint: "축(y)과 라벨(label)의 결합입니다."
  },
  {
    id: "ai-python-q-089",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "선 그래프(plot)나 막대 그래프(bar) 등에서 어떤 선이 어떤 데이터를 의미하는지 안내하는 '범례'를 띄우는 함수는?",
    options: ["plt.label()", "plt.legend()", "plt.index()", "plt.guide()"],
    answer: 1,
    explanation: "plt.legend()를 호출하면 각 데이터 plot에 부여된 label 값이 범례 상자로 표시됩니다.",
    hint: "전설, 범례를 뜻하는 단어입니다."
  },
  {
    id: "ai-python-q-090",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "그래프의 배경에 모눈종이 같은 격자선을 그려 수치를 읽기 쉽게 만들어주는 함수는?",
    options: ["plt.grid()", "plt.mesh()", "plt.lines()", "plt.box()"],
    answer: 0,
    explanation: "plt.grid(True)를 호출하면 축에 맞춰 가이드라인이 표시됩니다.",
    hint: "격자무늬(그리드)입니다."
  },
  {
    id: "ai-python-q-091",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "그래프의 출력 크기(가로, 세로 인치)를 설정하기 위해 사용하는 함수는?",
    options: ["plt.size()", "plt.figure(figsize=...)", "plt.resize()", "plt.canvas()"],
    answer: 1,
    explanation: "새로운 그림을 선언하면서 크기를 지정할 때는 plt.figure(figsize=(가로, 세로))를 씁니다.",
    hint: "피겨(figure)의 사이즈를 설정합니다."
  },
  {
    id: "ai-python-q-092",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "데이터 분포와 이상치를 동시에 확인하기 위해 상자그림(boxplot)과 함께 EDA에서 세트로 자주 확인하는 차트는?",
    options: ["원그래프(pie)", "꺾은선그래프(plot)", "산점도(scatter)", "히스토그램(hist)"],
    answer: 3,
    explanation: "상자그림과 히스토그램을 결합하여 분석하면 이상치 유무와 전체 분포 형태를 가장 정확히 파악할 수 있습니다.",
    hint: "연속된 값의 빈도(막대)를 그리는 차트입니다."
  },
  {
    id: "ai-python-q-093",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "Pandas의 describe() 메서드는 기본적으로 어떤 형태의 데이터 컬럼에 대해서만 요약 통계를 출력하는가?",
    options: ["문자열(str)", "수치형 데이터(int, float)", "날짜 시간 데이터(datetime)", "불리언(bool)"],
    answer: 1,
    explanation: "describe()는 평균, 표준편차 등을 계산하기 위해 수치형 데이터를 요약 통계 대상으로 합니다.",
    hint: "산술 계산이 가능한 자료형입니다."
  },
  {
    id: "ai-python-q-094",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "이상치(Outlier)를 처리하는 가장 일반적인 방법이 아닌 것은?",
    options: ["정상 범위를 벗어난 행을 삭제한다.", "상한선/하한선을 정해 그 값으로 대체한다.", "결측치(NaN)로 만든 후 평균으로 채운다.", "문자열 텍스트로 바꾸어 숨긴다."],
    answer: 3,
    explanation: "이상치는 모델이 수치로 학습해야 하므로 문자열로 숨기면 연산 오류가 발생합니다.",
    hint: "숫자가 아닌 다른 타입으로 바꾸는 행위입니다."
  },
  {
    id: "ai-python-q-095",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "상자그림(boxplot)에서 중앙값(Median)은 전체 데이터의 몇 퍼센트 위치에 해당하는 값인가?",
    options: ["25%", "50%", "75%", "100%"],
    answer: 1,
    explanation: "중앙값은 정렬된 데이터에서 정확히 가운데(50%)에 위치한 값입니다.",
    hint: "절반을 의미합니다."
  },
  {
    id: "ai-python-q-096",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "극단적인 이상치 하나가 존재할 때, 데이터의 대표값으로 '평균(mean)'보다 적절하게 사용할 수 있는 값은?",
    options: ["최댓값(max)", "중앙값(median)", "분산(var)", "표준편차(std)"],
    answer: 1,
    explanation: "이상치가 섞여 있어 평균이 심하게 왜곡될 때는 중앙값(median)을 사용하는 것이 일반적입니다.",
    hint: "순서대로 세웠을 때 한가운데 있는 값입니다."
  },
  {
    id: "ai-python-q-097",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "두 연속형 변수가 뚜렷한 선형 관계를 가지고 있다면, 산점도(scatter)의 점들은 어떤 모습을 띠는가?",
    options: ["동그랗게 무작위로 퍼져 있다.", "수평으로 일직선에 모여 있다.", "우상향 혹은 우하향하는 대각선 방향으로 띠를 형성한다.", "점들이 모두 하나의 점으로 합쳐진다."],
    answer: 2,
    explanation: "상관관계가 높을수록 점들은 대각선 방향으로 모여 선형(띠)의 패턴을 형성합니다.",
    hint: "선형(Linear)이라는 단어의 느낌입니다."
  },
  {
    id: "ai-python-q-098",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "여러 변수 중에서 모델의 결과에 영향을 미치는 핵심 변수를 찾고 가설을 검증하는 단계를 무엇이라 하는가?",
    options: ["API 통신", "탐색적 데이터 분석(EDA)", "JSON 파싱", "브로드캐스팅"],
    answer: 1,
    explanation: "데이터를 요약하고 집계(groupby, pivot_table)하여 변수 간 관계와 특징을 탐색하는 것이 EDA의 목적입니다.",
    hint: "탐색적이라는 단어가 포함됩니다."
  },
  {
    id: "ai-python-q-099",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "Seaborn에서 상자그림을 그리기 위해 호출하는 함수는?",
    options: ["sns.barplot()", "sns.heatmap()", "sns.boxplot()", "sns.lineplot()"],
    answer: 2,
    explanation: "상자그림은 boxplot() 함수로 생성하며 이상치 파악에 활용합니다.",
    hint: "Box를 뜻합니다."
  },
  {
    id: "ai-python-q-100",
    category: "matplotlib_eda",
    questionType: "multiple-choice",
    prompt: "데이터 전처리 과정에서 범주형 값의 개수를 확인하고 이상치 유무를 체크하는 판다스 메서드는?",
    options: ["describe()", "value_counts()", "pivot_table()", "groupby()"],
    answer: 1,
    explanation: "value_counts()로 값별 개수를 확인하여 존재해서는 안 되는 오타 등의 이상치를 빠르게 찾을 수 있습니다.",
    hint: "값들의 빈도를 카운트하는 메서드입니다."
  }
];

const AI_PYTHON_QUESTION_BY_ID = new Map(
  AI_PYTHON_QUESTION_BANK.map((question) => [question.id, question]),
);

export function getAiPythonQuestion(questionId: string) {
  return AI_PYTHON_QUESTION_BY_ID.get(questionId);
}
