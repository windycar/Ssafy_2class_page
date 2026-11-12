# AI Python 2회차 월말평가 모의시험 — 문제

- 시험 시간: **90분**
- 총점: **100점**
- 구성: EDA·상관관계 30점 / 합성 데이터 프롬프트 30점 / RAG 워크플로 40점
- 아래 `TODO` 영역을 직접 작성하세요. 정답 노트북은 시험 종료 후 확인하세요.
- 각 문제의 검증 셀은 수정하지 마세요.

## 1부. 탐색적 데이터 분석 및 상관관계 해석 — 30점 / 25분

Wine 데이터셋의 특성과 `quality` 사이 상관관계를 분석합니다. 데이터 로딩 코드는 제공됩니다.

~~~python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_wine

sns.set_theme()

wine = load_wine(as_frame=True)
df = wine.frame.copy()
df = df.rename(columns={"target": "quality"})

print(f"데이터 크기: {df.shape}")
df.head()
~~~

### TODO 1. 데이터 구조와 기초 통계량 — 8점

1. 전체 샘플 수를 `sample_count`에 저장하세요.
2. 타깃을 제외한 특성 수를 `feature_count`에 저장하세요.
3. 수치형 컬럼의 기초 통계량을 `summary`에 저장하세요.

~~~python
# TODO 1
sample_count = None
feature_count = None
summary = None

print("샘플 수:", sample_count)
print("특성 수:", feature_count)
summary
~~~

~~~python
# TODO 1 검증 — 수정 금지
assert sample_count == 178
assert feature_count == 13
assert isinstance(summary, pd.DataFrame)
assert "quality" in summary.columns
print("✅ TODO 1 통과")
~~~

### TODO 2. 상관관계 계산 및 시각화 — 17점

1. 수치형 데이터만 `numeric_df`에 저장하세요.
2. 피어슨 상관행렬을 `corr_matrix`에 저장하세요.
3. `quality` 자기 자신을 제외한 상관계수를 `target_corr`에 저장하세요.
4. 절댓값 기준 가장 강한 특성과 실제 상관계수를 각각 `top_feature`, `top_corr_value`에 저장하세요.
5. 상삼각형과 대각선을 가린 상관관계 히트맵을 그리세요.
6. `top_feature`와 `quality`의 관계를 산점도로 그리세요.

~~~python
# TODO 2-1: 상관관계 계산
numeric_df = None
corr_matrix = None
target_corr = None
top_feature = None
top_corr_value = None

print("quality와 가장 강한 특성:", top_feature)
print("상관계수:", top_corr_value)
~~~

~~~python
# TODO 2-2: 히트맵과 산점도
mask = None

fig, axes = plt.subplots(1, 2, figsize=(18, 7))

# axes[0]에 하삼각 상관관계 히트맵을 작성하세요.

# axes[1]에 top_feature와 quality의 산점도를 작성하세요.

plt.tight_layout()
plt.show()
~~~

~~~python
# TODO 2 검증 — 수정 금지
assert isinstance(numeric_df, pd.DataFrame)
assert isinstance(corr_matrix, pd.DataFrame)
assert "quality" not in target_corr.index
assert top_feature == target_corr.abs().idxmax()
assert np.isclose(top_corr_value, target_corr.loc[top_feature])
assert isinstance(mask, np.ndarray) and mask.shape == corr_matrix.shape
print("✅ TODO 2 통과")
~~~

### TODO 3. 상관관계 해석 — 5점

`top_corr_value`의 부호와 절댓값을 이용하여 두 변수의 관계를 2문장 이상으로 작성하세요. 상관관계와 인과관계가 다르다는 내용도 포함하세요.

~~~python
# TODO 3
correlation_interpretation = ""

print(correlation_interpretation)
~~~

~~~python
# TODO 3 검증 — 수정 금지
assert isinstance(correlation_interpretation, str)
assert len(correlation_interpretation.strip()) >= 60
print("✅ TODO 3 통과")
~~~

## 2부. 데이터 생성을 위한 프롬프트 설계 — 30점 / 25분

주어진 주제에 대한 한국어 질의응답 학습 데이터를 JSON으로 생성합니다. 클라이언트와 JSON Schema는 제공됩니다.

~~~python
import json
import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

workspace_candidates = [Path.cwd(), *Path.cwd().parents]
WORKSPACE_ROOT = next((p for p in workspace_candidates if (p / "2.실습과제").exists()), None)
if WORKSPACE_ROOT is None:
    raise FileNotFoundError("Ssafy_Drive 작업공간을 찾지 못했습니다.")

RAG_DIR = WORKSPACE_ROOT / "2.실습과제" / "4.AI_Python" / "DAY7.RAG 실습"
load_dotenv(RAG_DIR / ".env")
GMS_KEY = os.getenv("GMS_KEY")

client = OpenAI(
    api_key=GMS_KEY,
    base_url="https://gms.ssafy.io/gmsapi/api.openai.com/v1/",
) if GMS_KEY else None

generation_response_format = {
    "type": "json_schema",
    "json_schema": {
        "name": "synthetic_qa_dataset",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "items": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "question": {"type": "string"},
                            "answer": {"type": "string"},
                            "category": {"type": "string"},
                            "difficulty": {"type": "string"}
                        },
                        "required": ["question", "answer", "category", "difficulty"],
                        "additionalProperties": False
                    }
                }
            },
            "required": ["items"],
            "additionalProperties": False
        },
    },
}

print("✅ 프롬프트 실습 환경 준비 완료" if client else "⚠️ GMS_KEY가 없어 실제 API 호출은 건너뜁니다.")
~~~

### TODO 4. 생성 프롬프트 작성 — 15점

다음 조건을 충족하는 `GENERATOR_SYSTEM_PROMPT`를 작성하세요.

- 역할: 한국어 질의응답 학습 데이터 생성 전문가
- 데이터 간 중복 금지
- 사실과 논리의 일관성 유지
- 필수 필드: `question`, `answer`, `category`, `difficulty`
- JSON 이외의 문장 출력 금지

그리고 `topic`, `count`, `difficulty`를 반영하는 `build_user_prompt()`를 완성하세요.

~~~python
# TODO 4
GENERATOR_SYSTEM_PROMPT = """
여기에 시스템 프롬프트를 작성하세요.
"""

def build_user_prompt(topic: str, count: int, difficulty: str) -> str:
    # TODO: 세 인자를 모두 포함한 구체적인 요청문을 반환하세요.
    pass
~~~

~~~python
# TODO 4 검증 — 수정 금지
required_prompt_tokens = ["question", "answer", "category", "difficulty", "JSON"]
assert all(token in GENERATOR_SYSTEM_PROMPT for token in required_prompt_tokens)
test_user_prompt = build_user_prompt("파이썬 자료형", 3, "중")
assert isinstance(test_user_prompt, str)
assert all(token in test_user_prompt for token in ["파이썬 자료형", "3", "중"])
print("✅ TODO 4 통과")
~~~

### TODO 5. LLM 호출과 JSON 파싱 — 15점

`client.chat.completions.create()`를 사용하여 데이터를 생성하고, 응답을 파싱한 `dict`를 반환하세요.

- 모델: `gpt-5-mini`
- 시스템 메시지와 사용자 메시지를 모두 전달
- 제공된 `generation_response_format` 사용
- `temperature=0.8` 적용
- `json.loads()`로 파싱

~~~python
# TODO 5
def generate_synthetic_data(topic: str, count: int = 3, difficulty: str = "중") -> dict:
    if client is None:
        raise RuntimeError("GMS_KEY가 필요합니다.")

    user_prompt = None
    response = None
    result = None
    return result
~~~

~~~python
# TODO 5 실제 호출 검증 — GMS_KEY가 있을 때 실행
if client:
    generated = generate_synthetic_data("파이썬 리스트와 딕셔너리", count=3, difficulty="중")
    assert isinstance(generated, dict)
    assert "items" in generated
    assert len(generated["items"]) == 3
    print(json.dumps(generated, ensure_ascii=False, indent=2))
    print("✅ TODO 5 통과")
else:
    print("⚠️ GMS_KEY가 없어 TODO 5 실제 호출 검증을 건너뜁니다.")
~~~

## 3부. RAG 워크플로 이해 및 구현 — 40점 / 40분

Yes24 PDF 문서를 로딩하고, 청킹·임베딩·Vector Store·Retriever·LangGraph를 연결합니다.

~~~python
import os
import uuid
from typing import TypedDict

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import StateGraph, START, END

RAG_DATA_DIR = RAG_DIR / "data"
pdf_files = sorted(RAG_DATA_DIR.glob("*.pdf"))
COLLECTION_NAME = f"mock_exam_{uuid.uuid4().hex[:8]}"

llm = ChatOpenAI(
    model="gpt-5-mini",
    api_key=GMS_KEY,
    base_url="https://gms.ssafy.io/gmsapi/api.openai.com/v1/",
) if GMS_KEY else None

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    api_key=GMS_KEY,
    base_url="https://gms.ssafy.io/gmsapi/api.openai.com/v1/",
) if GMS_KEY else None

print(f"PDF 파일 수: {len(pdf_files)}")
print("✅ RAG 환경 준비 완료" if llm and embeddings else "⚠️ GMS_KEY가 없어 실제 RAG 실행은 할 수 없습니다.")
~~~

### TODO 6. 문서 로딩 — 8점

모든 PDF를 `PyMuPDFLoader`로 로드하여 `all_documents`에 저장하세요. 각 문서의 메타데이터 `source_file`에는 원본 파일명을 저장하세요.

~~~python
# TODO 6
all_documents = []

# 모든 pdf_files를 순회하면서 문서를 로드하세요.

print(f"로드된 페이지 수: {len(all_documents)}")
~~~

~~~python
# TODO 6 검증 — 수정 금지
assert len(pdf_files) > 0
assert len(all_documents) > 0
assert all("source_file" in doc.metadata for doc in all_documents)
print("✅ TODO 6 통과")
~~~

### TODO 7. 청킹, Vector Store, Retriever — 14점

1. `chunk_size=300`, `chunk_overlap=50`으로 문서를 청킹하세요.
2. `Chroma.from_documents()`로 Vector Store를 생성하세요.
3. 상위 3개 문서를 반환하는 Retriever를 생성하세요.

~~~python
# TODO 7
if embeddings is None:
    raise RuntimeError("GMS_KEY가 필요합니다.")

text_splitter = None
chunked_documents = None
vectorstore = None
retriever = None

print(f"청크 수: {len(chunked_documents) if chunked_documents is not None else 0}")
~~~

~~~python
# TODO 7 검증 — 수정 금지
assert text_splitter._chunk_size == 300
assert text_splitter._chunk_overlap == 50
assert len(chunked_documents) >= len(all_documents)
test_docs = retriever.invoke("배송이 늦으면 어떤 보상을 받을 수 있나요?")
assert len(test_docs) == 3
print("✅ TODO 7 통과")
~~~

### TODO 8. LangGraph RAG 파이프라인 — 18점

1. `RAGState`에 `question`, `context`, `answer`를 정의하세요.
2. `retrieve_node`에서 질문으로 문서를 검색하고 본문을 합쳐 `context`로 반환하세요.
3. `generate_node`에서 프롬프트를 완성하고 LLM 답변을 `answer`로 반환하세요.
4. `START → retrieve → generate → END` 순서로 그래프를 구성하세요.

~~~python
RAG_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """당신은 Yes24 고객 서비스 상담원입니다.
검색된 자료만 근거로 정확하게 답변하세요.
자료에 답이 없으면 추측하지 말고 확인할 수 없다고 말하세요.

[검색된 자료]
{context}"""),
    ("human", "{question}"),
])

# TODO 8-1: 상태 타입 완성
class RAGState(TypedDict, total=False):
    pass

# TODO 8-2: 검색 노드 완성
def retrieve_node(state: RAGState) -> dict:
    pass

# TODO 8-3: 생성 노드 완성
def generate_node(state: RAGState) -> dict:
    pass

# TODO 8-4: 그래프 구성
workflow = None
rag_graph = None
~~~

~~~python
# TODO 8 최종 실행 검증 — 수정 금지
question = "Yes24에서 배송이 지연되면 어떤 보상을 받을 수 있나요?"
result = rag_graph.invoke({"question": question})

assert set(["question", "context", "answer"]).issubset(result.keys())
assert len(result["context"].strip()) > 0
assert len(result["answer"].strip()) > 0

print("질문:", question)
print("답변:", result["answer"])
print("✅ TODO 8 통과")
~~~

## 제출 전 점검

- 모든 셀을 위에서부터 다시 실행했는가?
- 모든 검증 셀에 `✅ 통과`가 출력되는가?
- `target` 자기 자신을 상관관계 후보에서 제외했는가?
- 프롬프트가 JSON 필드와 제약조건을 명확히 지정하는가?
- RAG 순서가 로딩 → 청킹 → 저장 → 검색 → 생성으로 연결되는가?
