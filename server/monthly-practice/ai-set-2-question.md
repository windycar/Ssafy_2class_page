# AI Python 2회차 월말평가 모의고사 2회차 — 문제

**주제:** 상위 특성 순위 · 페르소나 데이터 · 청킹 비교

- 제한 시간: 90분
- EDA·상관관계 30점 / 프롬프트 설계 30점 / RAG 워크플로 40점
- 문제 노트북에서는 모든 TODO를 직접 입력하세요.
- 외부 API를 호출하지 않는 오프라인 모의 환경입니다.

~~~python
import json
import hashlib
import re
import uuid
from types import SimpleNamespace
from typing import TypedDict

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme()
~~~

## 1부. EDA 및 상관관계 — 30점

### Diabetes 회귀 데이터의 상위 상관 특성

~~~python
from sklearn.datasets import load_diabetes

diabetes = load_diabetes(as_frame=True)
df = diabetes.frame.rename(columns={"target": "progression"})
target_col = "progression"
df.head()
~~~

### TODO


            1. 타깃 자신을 제외한 상관계수를 절댓값 내림차순으로 정렬하세요.
            2. 상위 특성 3개를 `top3_features`에 저장하세요.
            3. 1위 특성과 타깃의 회귀선을 `sns.regplot()`으로 그리세요.
            4. 상위 3개 특성의 상관 방향을 `feature_directions` 딕셔너리로 만드세요.
            5. 결과를 `eda_interpretation`에 작성하세요.

~~~python
corr_matrix = None
progression_corr = None
top3_features = None
feature_directions = None

plt.figure(figsize=(8, 6))
# TODO: 1위 특성과 progression의 산점도 및 회귀선을 그리세요.
plt.show()

eda_interpretation = ""
~~~

~~~python
assert target_col not in progression_corr.index
assert top3_features == progression_corr.index[:3].tolist()
assert len(top3_features) == 3
assert set(feature_directions) == set(top3_features)
assert set(feature_directions.values()).issubset({"positive", "negative"})
assert len(eda_interpretation.strip()) >= 60
print("✅ EDA 영역 통과")
~~~

## 2부. 데이터 생성을 위한 프롬프트 설계 — 30점

### 페르소나 기반 Text-to-SQL 데이터

모의 클라이언트가 제공됩니다. 실제 시험과 같은 호출 형태로 프롬프트·메시지·JSON 파싱 코드를 작성하세요.

~~~python
PRACTICE_PAYLOAD = {
    "items": [
        {
            "question": "영업부 직원은 몇 명이에요?",
            "sql": "SELECT COUNT(*) FROM employees WHERE department='sales';",
            "persona": "학생",
            "difficulty": "하"
        },
        {
            "question": "영업부 소속 인원수를 조회해 주세요.",
            "sql": "SELECT COUNT(*) FROM employees WHERE department='sales';",
            "persona": "직장인",
            "difficulty": "중"
        },
        {
            "question": "영업 부서 재직 인원의 총원을 산출하십시오.",
            "sql": "SELECT COUNT(*) FROM employees WHERE department='sales';",
            "persona": "공식 문서",
            "difficulty": "중"
        }
    ]
}

class PracticeCompletions:
    def create(self, model, messages, response_format=None, temperature=None):
        message = SimpleNamespace(
            content=json.dumps(PRACTICE_PAYLOAD, ensure_ascii=False)
        )
        return SimpleNamespace(
            choices=[SimpleNamespace(message=message)]
        )

practice_client = SimpleNamespace(
    chat=SimpleNamespace(completions=PracticeCompletions())
)
practice_response_format = {"type": "json_object"}
~~~

### TODO

- 역할: 한국어 Text-to-SQL 데이터 증강 전문가
- 목적: 동일한 SQL 의미를 유지하면서 다양한 화자 스타일의 한국어 질문을 생성하세요.
- 필수 필드: question, sql, persona, difficulty
- 조건: 중복 금지, 사실성 유지, JSON 이외 출력 금지
- `build_user_prompt()`와 `generate_data()`를 완성하세요.

~~~python
# TODO: 역할, 생성 목적, 중복 금지, 사실성, JSON 전용 출력 조건과
# 필수 필드 ['question', 'sql', 'persona', 'difficulty']를 포함하세요.
SYSTEM_PROMPT = """
여기에 시스템 프롬프트를 작성하세요.
"""

def build_user_prompt(topic: str, count: int, condition: str) -> str:
    # TODO: topic, count, condition을 모두 포함한 요청문을 반환하세요.
    pass

def generate_data(topic: str, count: int, condition: str) -> dict:
    # TODO: practice_client.chat.completions.create()를 호출하세요.
    # model, messages, response_format, temperature를 모두 전달하고
    # 응답 content를 json.loads()로 파싱해 반환하세요.
    pass
~~~

~~~python
# 프롬프트 영역 검증 — 수정 금지
required_tokens = ["question", "sql", "persona", "difficulty", "JSON"]
assert all(token in SYSTEM_PROMPT for token in required_tokens)

request_text = build_user_prompt('직원 수 조회 SQL', 3, '학생·직장인·공식 문서 페르소나를 서로 다르게 적용')
assert '직원 수 조회 SQL' in request_text
assert "3" in request_text
assert '학생·직장인·공식 문서 페르소나를 서로 다르게 적용' in request_text

generated = generate_data('직원 수 조회 SQL', 3, '학생·직장인·공식 문서 페르소나를 서로 다르게 적용')
assert isinstance(generated, dict) and "items" in generated
assert len(generated["items"]) == 3
required_fields = set(["question", "sql", "persona", "difficulty"])
assert all(required_fields.issubset(item) for item in generated["items"])
print(json.dumps(generated, ensure_ascii=False, indent=2))
print("✅ 프롬프트 영역 통과")
~~~

## 3부. RAG 워크플로 구현 — 40점

### 청킹 크기 비교 RAG

같은 문서를 작은 청크와 큰 청크로 나누고 검색 결과 크기를 비교하세요.

~~~python
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langgraph.graph import StateGraph, START, END

documents = [
    Document(page_content='수강 신청은 학기 시작 전 지정 기간에 진행하며 정원이 초과되면 대기 순번이 부여됩니다.', metadata={"source_file": 'course.txt'}),
    Document(page_content='성적 이의 신청은 성적 공개 후 7일 이내에 담당 교수에게 제출해야 합니다.', metadata={"source_file": 'grade.txt'}),
    Document(page_content='도서 대출 기간은 14일이며 예약자가 없으면 한 번 연장할 수 있습니다.', metadata={"source_file": 'library.txt'}),
    Document(page_content='장학금은 성적과 소득 기준을 종합하여 심사하고 결과는 포털에서 확인합니다.', metadata={"source_file": 'scholarship.txt'})
]

class LocalHashEmbeddings(Embeddings):
    def __init__(self, dimension: int = 128):
        self.dimension = dimension

    def _embed(self, text: str) -> list[float]:
        vector = np.zeros(self.dimension, dtype=float)
        tokens = re.findall(r"[가-힣A-Za-z0-9]+", text.lower())
        for token in tokens:
            index = int(
                hashlib.sha256(token.encode("utf-8")).hexdigest(), 16
            ) % self.dimension
            vector[index] += 1.0
        norm = np.linalg.norm(vector)
        return (vector / norm).tolist() if norm else vector.tolist()

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return [self._embed(text) for text in texts]

    def embed_query(self, text: str) -> list[float]:
        return self._embed(text)

class PracticeLLM:
    def invoke(self, messages):
        return SimpleNamespace(
            content="검색된 자료를 근거로 작성한 모의 답변입니다."
        )

embeddings = LocalHashEmbeddings()
llm = PracticeLLM()
collection_prefix = f"mock_{uuid.uuid4().hex[:8]}"
~~~

### TODO


            1. `build_retriever(documents, chunk_size, overlap, k, name)` 함수를 작성하세요.
            2. 작은 설정 `(60, 10)`과 큰 설정 `(160, 30)`을 각각 `k=2`로 만드세요.
            3. 작은 청크 수가 큰 청크 수 이상인지 확인하세요.
            4. 큰 청크 Retriever를 사용해 `answer_with_rag()`를 완성하세요.

~~~python
def build_retriever(documents, chunk_size, overlap, k, name):
    pass

small_retriever = None
small_chunks = None
large_retriever = None
large_chunks = None

RAG_PROMPT = ChatPromptTemplate.from_messages([
    ("system", "대학 규정 자료만 사용하세요.\n\n{context}"),
    ("human", "{question}"),
])

def answer_with_rag(question: str) -> str:
    pass
~~~

~~~python
assert len(small_chunks) >= len(large_chunks)
assert len(small_retriever.invoke("성적 이의 신청")) == 2
assert len(large_retriever.invoke("성적 이의 신청")) == 2
assert answer_with_rag("성적 이의 신청 기간은 언제인가요?").strip()
print("✅ RAG 영역 통과")
~~~

## 제출 전 점검

- 위에서부터 모든 셀을 다시 실행했는가?
- 세 검증 셀에서 모두 `✅ 통과`가 출력되는가?
- 타깃 자기 자신을 상관관계 후보에서 제외했는가?
- 프롬프트에 역할·제약·출력 형식을 모두 지정했는가?
- RAG가 로딩/청킹 → 임베딩 저장 → 검색 → 생성 순서로 연결되는가?
