# AI Python 2회차 월말평가 모의고사 5회차 — 문제

**주제:** 결측치·중복 특성 · 엣지 케이스 · 함수형 RAG

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

### 합성 회귀 데이터의 결측치와 중복 특성

~~~python
from sklearn.datasets import make_regression

X, y = make_regression(n_samples=300, n_features=6, noise=12.0, random_state=42)
df = pd.DataFrame(X, columns=[f"feature_{i}" for i in range(6)])
df["feature_duplicate"] = df["feature_0"] * 0.98 + np.random.default_rng(42).normal(0, 0.02, len(df))
df["target"] = y
df.loc[df.index[::17], "feature_2"] = np.nan
target_col = "target"
df.head()
~~~

### TODO


            1. 컬럼별 결측치 개수를 `missing_counts`에 저장하세요.
            2. `feature_2` 결측치를 중앙값으로 채운 복사본 `df_filled`를 만드세요.
            3. 타깃과 절댓값 상관관계 1위 특성을 찾으세요.
            4. 특성끼리 상관계수가 가장 큰 중복 특성 쌍을 `most_correlated_pair`에 저장하세요.
            5. 데이터 누수와 중복 특성 처리 주의점을 해석에 포함하세요.

~~~python
missing_counts = None
df_filled = None
corr_matrix = None
target_corr = None
top_feature = None
most_correlated_pair = None

plt.figure(figsize=(11, 8))
# TODO: df_filled 상관행렬 히트맵을 그리세요.
plt.show()

eda_interpretation = ""
~~~

~~~python
assert missing_counts["feature_2"] > 0
assert df_filled.isna().sum().sum() == 0
assert target_col not in target_corr.index
assert top_feature == target_corr.abs().idxmax()
assert set(most_correlated_pair) == {"feature_0", "feature_duplicate"}
assert len(eda_interpretation.strip()) >= 60
print("✅ EDA 영역 통과")
~~~

## 2부. 데이터 생성을 위한 프롬프트 설계 — 30점

### RAG 평가용 엣지 케이스 질의응답 데이터

모의 클라이언트가 제공됩니다. 실제 시험과 같은 호출 형태로 프롬프트·메시지·JSON 파싱 코드를 작성하세요.

~~~python
PRACTICE_PAYLOAD = {
    "items": [
        {
            "question": "배송 지연 시 보상을 받을 수 있나요?",
            "answer": "정책에 따라 신청할 수 있습니다.",
            "source_hint": "delay_policy",
            "is_edge_case": False
        },
        {
            "question": "품절 취소 환불은 어떻게 되나요?",
            "answer": "원 결제 수단으로 환불됩니다.",
            "source_hint": "refund_policy",
            "is_edge_case": False
        },
        {
            "question": "내년 해외 배송 요금은 얼마인가요?",
            "answer": "제공 문서에서 확인할 수 없습니다.",
            "source_hint": "none",
            "is_edge_case": True
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

- 역할: RAG 평가 데이터 및 어려운 질의 생성 전문가
- 목적: 문서에 답이 있는 질문과 답이 없는 엣지 케이스를 함께 생성하세요.
- 필수 필드: question, answer, source_hint, is_edge_case
- 조건: 중복 금지, 사실성 유지, JSON 이외 출력 금지
- `build_user_prompt()`와 `generate_data()`를 완성하세요.

~~~python
# TODO: 역할, 생성 목적, 중복 금지, 사실성, JSON 전용 출력 조건과
# 필수 필드 ['question', 'answer', 'source_hint', 'is_edge_case']를 포함하세요.
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
required_tokens = ["question", "answer", "source_hint", "is_edge_case", "JSON"]
assert all(token in SYSTEM_PROMPT for token in required_tokens)

request_text = build_user_prompt('배송·환불 정책', 3, '답변 가능 2개와 문서 밖 질문 1개를 포함')
assert '배송·환불 정책' in request_text
assert "3" in request_text
assert '답변 가능 2개와 문서 밖 질문 1개를 포함' in request_text

generated = generate_data('배송·환불 정책', 3, '답변 가능 2개와 문서 밖 질문 1개를 포함')
assert isinstance(generated, dict) and "items" in generated
assert len(generated["items"]) == 3
required_fields = set(["question", "answer", "source_hint", "is_edge_case"])
assert all(required_fields.issubset(item) for item in generated["items"])
print(json.dumps(generated, ensure_ascii=False, indent=2))
print("✅ 프롬프트 영역 통과")
~~~

## 3부. RAG 워크플로 구현 — 40점

### 함수로 조립하는 전체 LangGraph RAG

Retriever 생성 함수와 그래프 생성 함수를 분리하여 재사용 가능한 파이프라인을 만드세요.

~~~python
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langgraph.graph import StateGraph, START, END

documents = [
    Document(page_content='배송 가능 지역과 예상 일정은 상품과 주문 시점에 따라 달라집니다.', metadata={"source_file": 'shipping_policy.txt'}),
    Document(page_content='배송 지연이 확인되면 고객은 보상 신청을 제출할 수 있습니다.', metadata={"source_file": 'delay_policy.txt'}),
    Document(page_content='품절 취소 건은 원래 결제 수단으로 환불 처리됩니다.', metadata={"source_file": 'refund_policy.txt'}),
    Document(page_content='구매 포인트는 결제 완료 후 지급되며 유효기간이 있습니다.', metadata={"source_file": 'point_policy.txt'})
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


            1. `create_retriever(documents, chunk_size=90, overlap=15, k=2)`를 완성하세요.
            2. `build_rag_graph(retriever)` 안에서 State, 검색 노드, 생성 노드와 간선을 구성하세요.
            3. 함수가 반환한 그래프를 서로 다른 두 질문으로 실행하세요.
            4. 최종 결과에 질문·문맥·답변이 모두 남아야 합니다.

~~~python
def create_retriever(documents, chunk_size=90, overlap=15, k=2):
    pass

def build_rag_graph(retriever):
    # TODO: 프롬프트, State, 검색·생성 노드, 그래프를 이 함수 안에 작성하세요.
    pass

retriever = None
rag_graph = None
rag_results = None
~~~

~~~python
assert len(retriever.invoke("배송 지연")) == 2
assert len(rag_results) == 2
assert all({"question", "context", "answer"}.issubset(result) for result in rag_results)
assert all(result["context"].strip() and result["answer"].strip() for result in rag_results)
print("✅ RAG 영역 통과")
~~~

## 제출 전 점검

- 위에서부터 모든 셀을 다시 실행했는가?
- 세 검증 셀에서 모두 `✅ 통과`가 출력되는가?
- 타깃 자기 자신을 상관관계 후보에서 제외했는가?
- 프롬프트에 역할·제약·출력 형식을 모두 지정했는가?
- RAG가 로딩/청킹 → 임베딩 저장 → 검색 → 생성 순서로 연결되는가?
