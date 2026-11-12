# AI Python 2회차 월말평가 모의고사 4회차 — 문제

**주제:** 그룹 EDA · 균형 감정 데이터 · 출처 포함 RAG

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

### Iris 품종별 통계와 상관관계

~~~python
from sklearn.datasets import load_iris

iris = load_iris(as_frame=True)
df = iris.frame.rename(columns={"target": "species"})
target_col = "species"
feature_cols = [column for column in df.columns if column != target_col]
df.head()
~~~

### TODO


            1. 품종별 특성 평균을 `species_summary`에 저장하세요.
            2. 타깃 자신을 제외한 상관계수와 절댓값 1위 특성을 계산하세요.
            3. 1위 특성의 품종별 평균을 `top_feature_means`에 저장하세요.
            4. 품종별 1위 특성 분포를 boxplot으로 그리세요.
            5. 품종 번호가 범주형임을 고려한 주의점을 해석에 포함하세요.

~~~python
species_summary = None
corr_matrix = None
species_corr = None
top_feature = None
top_feature_means = None

plt.figure(figsize=(8, 6))
# TODO: species별 top_feature boxplot을 그리세요.
plt.show()

eda_interpretation = ""
~~~

~~~python
assert species_summary.shape == (3, 4)
assert target_col not in species_corr.index
assert top_feature == species_corr.abs().idxmax()
assert len(top_feature_means) == 3
assert len(eda_interpretation.strip()) >= 60
print("✅ EDA 영역 통과")
~~~

## 2부. 데이터 생성을 위한 프롬프트 설계 — 30점

### 균형 잡힌 감정 분석 데이터

모의 클라이언트가 제공됩니다. 실제 시험과 같은 호출 형태로 프롬프트·메시지·JSON 파싱 코드를 작성하세요.

~~~python
PRACTICE_PAYLOAD = {
    "items": [
        {
            "review": "설명이 명확하고 예제가 풍부해 이해하기 쉬웠다.",
            "sentiment": "positive",
            "evidence": "명확하고 예제가 풍부",
            "style": "학습자"
        },
        {
            "review": "내용은 무난했지만 실습 분량은 평범했다.",
            "sentiment": "neutral",
            "evidence": "무난하고 평범",
            "style": "일반"
        },
        {
            "review": "오류가 자주 발생하고 설명이 부족해 따라가기 어려웠다.",
            "sentiment": "negative",
            "evidence": "오류와 설명 부족",
            "style": "비판적"
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

- 역할: 한국어 리뷰 감정 분석 학습 데이터 생성 전문가
- 목적: 긍정·중립·부정 라벨이 균형을 이루는 리뷰 데이터를 생성하세요.
- 필수 필드: review, sentiment, evidence, style
- 조건: 중복 금지, 사실성 유지, JSON 이외 출력 금지
- `build_user_prompt()`와 `generate_data()`를 완성하세요.

~~~python
# TODO: 역할, 생성 목적, 중복 금지, 사실성, JSON 전용 출력 조건과
# 필수 필드 ['review', 'sentiment', 'evidence', 'style']를 포함하세요.
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
required_tokens = ["review", "sentiment", "evidence", "style", "JSON"]
assert all(token in SYSTEM_PROMPT for token in required_tokens)

request_text = build_user_prompt('온라인 강의 후기', 3, '긍정·중립·부정을 각각 1개씩 생성하고 근거 표현 포함')
assert '온라인 강의 후기' in request_text
assert "3" in request_text
assert '긍정·중립·부정을 각각 1개씩 생성하고 근거 표현 포함' in request_text

generated = generate_data('온라인 강의 후기', 3, '긍정·중립·부정을 각각 1개씩 생성하고 근거 표현 포함')
assert isinstance(generated, dict) and "items" in generated
assert len(generated["items"]) == 3
required_fields = set(["review", "sentiment", "evidence", "style"])
assert all(required_fields.issubset(item) for item in generated["items"])
print(json.dumps(generated, ensure_ascii=False, indent=2))
print("✅ 프롬프트 영역 통과")
~~~

## 3부. RAG 워크플로 구현 — 40점

### 출처 메타데이터를 보존하는 RAG

검색 문맥뿐 아니라 원본 출처 파일명도 State에 보존하세요.

~~~python
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langgraph.graph import StateGraph, START, END

documents = [
    Document(page_content='일반 배송은 결제 완료 후 평균 2~3영업일이 소요됩니다.', metadata={"source_file": 'delivery.md'}),
    Document(page_content='매장 픽업은 준비 완료 알림을 받은 뒤 지정 매장에서 수령할 수 있습니다.', metadata={"source_file": 'pickup.md'}),
    Document(page_content='포인트는 상품 구매와 이벤트 참여로 적립되며 유효기간 내 사용할 수 있습니다.', metadata={"source_file": 'points.md'}),
    Document(page_content='제휴 카드는 조건을 충족하면 결제 할인 또는 추가 적립을 제공합니다.', metadata={"source_file": 'card.md'})
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


            1. `chunk_size=100`, `chunk_overlap=20`, `k=3` Retriever를 만드세요.
            2. State에 `question`, `context`, `sources`, `answer`를 정의하세요.
            3. 검색 노드에서 중복 없는 `source_file` 목록을 반환하세요.
            4. 검색·생성 그래프를 완성하고 출처가 최종 결과에 남는지 확인하세요.

~~~python
splitter = None
chunks = None
vectorstore = None
retriever = None

prompt = ChatPromptTemplate.from_messages([
    ("system", "검색 자료와 출처에 근거해 답변하세요.\n\n{context}"),
    ("human", "{question}"),
])

class CitationRAGState(TypedDict, total=False):
    pass

def retrieve_node(state: CitationRAGState) -> dict:
    pass

def generate_node(state: CitationRAGState) -> dict:
    pass

rag_graph = None
~~~

~~~python
result = rag_graph.invoke({"question": "포인트는 어떻게 적립하나요?"})
assert result["context"].strip() and result["answer"].strip()
assert isinstance(result["sources"], list) and len(result["sources"]) > 0
assert len(result["sources"]) == len(set(result["sources"]))
print("검색 출처:", result["sources"])
print("✅ RAG 영역 통과")
~~~

## 제출 전 점검

- 위에서부터 모든 셀을 다시 실행했는가?
- 세 검증 셀에서 모두 `✅ 통과`가 출력되는가?
- 타깃 자기 자신을 상관관계 후보에서 제외했는가?
- 프롬프트에 역할·제약·출력 형식을 모두 지정했는가?
- RAG가 로딩/청킹 → 임베딩 저장 → 검색 → 생성 순서로 연결되는가?
