# AI Python 2회차 월말평가 모의고사 1회차 — 문제

**주제:** 기본 상관관계 · 구조화 출력 · 전체 RAG 그래프

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

### Wine 데이터의 타깃 상관관계 분석

~~~python
from sklearn.datasets import load_wine

wine = load_wine(as_frame=True)
df = wine.frame.rename(columns={"target": "quality"})
target_col = "quality"
df.head()
~~~

### TODO


            1. 상관행렬 `corr_matrix`를 계산하세요.
            2. 타깃 자신을 제외한 `target_corr`를 계산하세요.
            3. 절댓값이 가장 큰 특성과 실제 상관계수를 `top_feature`, `top_value`에 저장하세요.
            4. 상삼각형을 가린 히트맵과 타깃-특성 산점도를 그리세요.
            5. 결과를 `eda_interpretation`에 2문장 이상으로 작성하세요.

~~~python
corr_matrix = None
target_corr = None
top_feature = None
top_value = None
mask = None

fig, axes = plt.subplots(1, 2, figsize=(17, 6))
# TODO: axes[0]에 히트맵을 작성하세요.
# TODO: axes[1]에 산점도를 작성하세요.
plt.tight_layout()
plt.show()

eda_interpretation = ""
~~~

~~~python
assert isinstance(corr_matrix, pd.DataFrame)
assert target_col not in target_corr.index
assert top_feature == target_corr.abs().idxmax()
assert np.isclose(top_value, target_corr.loc[top_feature])
assert isinstance(mask, np.ndarray) and mask.shape == corr_matrix.shape
assert len(eda_interpretation.strip()) >= 60
print("✅ EDA 영역 통과")
~~~

## 2부. 데이터 생성을 위한 프롬프트 설계 — 30점

### 영화 추천 합성 데이터

모의 클라이언트가 제공됩니다. 실제 시험과 같은 호출 형태로 프롬프트·메시지·JSON 파싱 코드를 작성하세요.

~~~python
PRACTICE_PAYLOAD = {
    "items": [
        {
            "title": "기생충",
            "year": 2019,
            "genre": "스릴러",
            "reason": "긴장감 있는 계층 갈등"
        },
        {
            "title": "살인의 추억",
            "year": 2003,
            "genre": "스릴러",
            "reason": "미제 사건을 다룬 밀도 높은 전개"
        },
        {
            "title": "끝까지 간다",
            "year": 2014,
            "genre": "스릴러",
            "reason": "빠른 전개와 연속되는 위기"
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

- 역할: 영화 추천 학습 데이터 생성 전문가
- 목적: 사용자가 지정한 장르의 영화 추천 학습 데이터를 생성하세요.
- 필수 필드: title, year, genre, reason
- 조건: 중복 금지, 사실성 유지, JSON 이외 출력 금지
- `build_user_prompt()`와 `generate_data()`를 완성하세요.

~~~python
# TODO: 역할, 생성 목적, 중복 금지, 사실성, JSON 전용 출력 조건과
# 필수 필드 ['title', 'year', 'genre', 'reason']를 포함하세요.
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
required_tokens = ["title", "year", "genre", "reason", "JSON"]
assert all(token in SYSTEM_PROMPT for token in required_tokens)

request_text = build_user_prompt('스릴러 영화', 3, '실제 작품만 사용하고 추천 이유를 구체적으로 작성')
assert '스릴러 영화' in request_text
assert "3" in request_text
assert '실제 작품만 사용하고 추천 이유를 구체적으로 작성' in request_text

generated = generate_data('스릴러 영화', 3, '실제 작품만 사용하고 추천 이유를 구체적으로 작성')
assert isinstance(generated, dict) and "items" in generated
assert len(generated["items"]) == 3
required_fields = set(["title", "year", "genre", "reason"])
assert all(required_fields.issubset(item) for item in generated["items"])
print(json.dumps(generated, ensure_ascii=False, indent=2))
print("✅ 프롬프트 영역 통과")
~~~

## 3부. RAG 워크플로 구현 — 40점

### 고객 정책 RAG 전체 파이프라인

청킹, Chroma, Retriever, 검색·생성 노드, StateGraph를 모두 연결하세요.

~~~python
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langgraph.graph import StateGraph, START, END

documents = [
    Document(page_content='총알배송 상품은 지정 지역과 주문 시간 조건을 충족하면 빠르게 배송됩니다.', metadata={"source_file": 'shipping.txt'}),
    Document(page_content='배송이 예정일보다 늦으면 배송지연 보상을 신청할 수 있고 심사 후 포인트가 지급됩니다.', metadata={"source_file": 'delay.txt'}),
    Document(page_content='신규 회원은 첫 구매 쿠폰과 추가 적립 혜택을 받을 수 있습니다.', metadata={"source_file": 'member.txt'}),
    Document(page_content='품절로 주문이 취소되면 원래 결제 수단으로 환불됩니다.', metadata={"source_file": 'refund.txt'})
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


            1. `chunk_size=100`, `chunk_overlap=20`으로 청킹하세요.
            2. Chroma Vector Store와 `k=2` Retriever를 만드세요.
            3. `RAGState(question, context, answer)`와 검색·생성 노드를 완성하세요.
            4. `START → retrieve → generate → END` 그래프를 구성하세요.

~~~python
text_splitter = None
chunks = None
vectorstore = None
retriever = None

RAG_PROMPT = ChatPromptTemplate.from_messages([
    ("system", "검색된 자료만 사용하세요.\n\n{context}"),
    ("human", "{question}"),
])

class RAGState(TypedDict, total=False):
    pass

def retrieve_node(state: RAGState) -> dict:
    pass

def generate_node(state: RAGState) -> dict:
    pass

workflow = None
rag_graph = None
~~~

~~~python
assert text_splitter._chunk_size == 100 and text_splitter._chunk_overlap == 20
assert len(retriever.invoke("배송 지연 보상")) == 2
result = rag_graph.invoke({"question": "배송이 늦으면 보상이 있나요?"})
assert {"question", "context", "answer"}.issubset(result)
assert result["context"].strip() and result["answer"].strip()
print("✅ RAG 영역 통과")
~~~

## 제출 전 점검

- 위에서부터 모든 셀을 다시 실행했는가?
- 세 검증 셀에서 모두 `✅ 통과`가 출력되는가?
- 타깃 자기 자신을 상관관계 후보에서 제외했는가?
- 프롬프트에 역할·제약·출력 형식을 모두 지정했는가?
- RAG가 로딩/청킹 → 임베딩 저장 → 검색 → 생성 순서로 연결되는가?
