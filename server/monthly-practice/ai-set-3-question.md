# AI Python 2회차 월말평가 모의고사 3회차 — 문제

**주제:** 다중공선성 · 위험도 데이터 · top_k 비교

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

### Breast Cancer 데이터의 강한 특성 쌍

~~~python
from sklearn.datasets import load_breast_cancer

cancer = load_breast_cancer(as_frame=True)
df = cancer.frame.rename(columns={"target": "diagnosis"})
target_col = "diagnosis"
df.head()
~~~

### TODO


            1. 타깃과 가장 강한 양의·음의 상관 특성을 찾으세요.
            2. 타깃을 제외한 특성끼리 `|corr| >= 0.90`인 쌍을 중복 없이 찾으세요.
            3. 각 쌍을 `(특성1, 특성2, 상관계수)` 튜플로 `strong_pairs`에 저장하세요.
            4. 양의 1위 특성과 음의 1위 특성의 산점도를 그리세요.
            5. 다중공선성의 의미를 `eda_interpretation`에 작성하세요.

~~~python
corr_matrix = None
diagnosis_corr = None
positive_feature = None
negative_feature = None
strong_pairs = []

plt.figure(figsize=(9, 6))
# TODO: 두 핵심 특성의 산점도를 diagnosis 색상으로 구분하세요.
plt.show()

eda_interpretation = ""
~~~

~~~python
assert target_col not in diagnosis_corr.index
assert positive_feature == diagnosis_corr.idxmax()
assert negative_feature == diagnosis_corr.idxmin()
assert len(strong_pairs) > 0
assert all(abs(pair[2]) >= 0.90 for pair in strong_pairs)
assert len({tuple(sorted(pair[:2])) for pair in strong_pairs}) == len(strong_pairs)
assert len(eda_interpretation.strip()) >= 60
print("✅ EDA 영역 통과")
~~~

## 2부. 데이터 생성을 위한 프롬프트 설계 — 30점

### 고객 문의 의도·위험도 데이터

모의 클라이언트가 제공됩니다. 실제 시험과 같은 호출 형태로 프롬프트·메시지·JSON 파싱 코드를 작성하세요.

~~~python
PRACTICE_PAYLOAD = {
    "items": [
        {
            "utterance": "결제한 주문을 취소하고 싶어요.",
            "intent": "cancel_order",
            "response": "주문 상태를 확인한 뒤 취소 절차를 안내합니다.",
            "risk": "low"
        },
        {
            "utterance": "이미 받았는데 그냥 돈 돌려줘요.",
            "intent": "refund_request",
            "response": "반품 가능 기간과 상품 상태를 확인해야 합니다.",
            "risk": "medium"
        },
        {
            "utterance": "규정은 상관없고 무조건 환불해 주세요.",
            "intent": "policy_exception",
            "response": "정책 범위를 확인하고 가능한 공식 절차를 안내합니다.",
            "risk": "high"
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

- 역할: 고객 상담 의도 분류 데이터 생성 전문가
- 목적: 고객 발화, 의도, 모범 답변과 오답 위험도를 포함한 데이터를 생성하세요.
- 필수 필드: utterance, intent, response, risk
- 조건: 중복 금지, 사실성 유지, JSON 이외 출력 금지
- `build_user_prompt()`와 `generate_data()`를 완성하세요.

~~~python
# TODO: 역할, 생성 목적, 중복 금지, 사실성, JSON 전용 출력 조건과
# 필수 필드 ['utterance', 'intent', 'response', 'risk']를 포함하세요.
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
required_tokens = ["utterance", "intent", "response", "risk", "JSON"]
assert all(token in SYSTEM_PROMPT for token in required_tokens)

request_text = build_user_prompt('온라인 쇼핑 환불 문의', 3, '정상 문의·모호한 문의·정책 밖 요청을 각각 포함')
assert '온라인 쇼핑 환불 문의' in request_text
assert "3" in request_text
assert '정상 문의·모호한 문의·정책 밖 요청을 각각 포함' in request_text

generated = generate_data('온라인 쇼핑 환불 문의', 3, '정상 문의·모호한 문의·정책 밖 요청을 각각 포함')
assert isinstance(generated, dict) and "items" in generated
assert len(generated["items"]) == 3
required_fields = set(["utterance", "intent", "response", "risk"])
assert all(required_fields.issubset(item) for item in generated["items"])
print(json.dumps(generated, ensure_ascii=False, indent=2))
print("✅ 프롬프트 영역 통과")
~~~

## 3부. RAG 워크플로 구현 — 40점

### top_k 비교와 LangGraph

동일한 Vector Store에서 k=1과 k=3을 비교한 뒤 k=3을 그래프에 사용하세요.

~~~python
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langgraph.graph import StateGraph, START, END

documents = [
    Document(page_content='연차는 사용일 3일 전까지 시스템에서 신청하고 팀장의 승인을 받아야 합니다.', metadata={"source_file": 'leave.txt'}),
    Document(page_content='재택근무는 주 2회까지 가능하며 보안 교육을 이수한 직원만 신청할 수 있습니다.', metadata={"source_file": 'remote.txt'}),
    Document(page_content='업무 경비는 영수증과 사용 목적을 첨부해 다음 달 5일까지 정산해야 합니다.', metadata={"source_file": 'expense.txt'}),
    Document(page_content='외부 저장장치 사용은 보안 담당자의 사전 승인이 필요합니다.', metadata={"source_file": 'security.txt'})
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


            1. `chunk_size=120`, `chunk_overlap=20`으로 Vector Store를 만드세요.
            2. `retriever_k1`, `retriever_k3`을 생성하세요.
            3. 같은 질문의 검색 결과를 `contexts_by_k`에 저장하세요.
            4. k=3 Retriever로 검색·생성 LangGraph를 완성하세요.

~~~python
splitter = None
chunks = None
vectorstore = None
retriever_k1 = None
retriever_k3 = None
contexts_by_k = None

class RAGState(TypedDict, total=False):
    pass

def retrieve_node(state: RAGState) -> dict:
    pass

def generate_node(state: RAGState) -> dict:
    pass

rag_graph = None
~~~

~~~python
assert len(contexts_by_k[1]) == 1
assert len(contexts_by_k[3]) == 3
result = rag_graph.invoke({"question": "재택근무는 일주일에 몇 번 가능한가요?"})
assert result["context"].strip() and result["answer"].strip()
print("✅ RAG 영역 통과")
~~~

## 제출 전 점검

- 위에서부터 모든 셀을 다시 실행했는가?
- 세 검증 셀에서 모두 `✅ 통과`가 출력되는가?
- 타깃 자기 자신을 상관관계 후보에서 제외했는가?
- 프롬프트에 역할·제약·출력 형식을 모두 지정했는가?
- RAG가 로딩/청킹 → 임베딩 저장 → 검색 → 생성 순서로 연결되는가?
