import { writeFile } from "node:fs/promises";
import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "silent",
});

const concepts = [
  {
    id: "supervised-learning",
    category: "2. 지도학습과 문제 유형",
    term: "지도학습",
    aliases: ["supervised learning", "지도 학습"],
    definition: "입력과 정답 라벨이 쌍으로 있는 데이터로 예측 규칙을 학습하고 새로운 데이터에 일반화하는 방법",
    scenario: "고객 정보와 실제 이탈 여부를 함께 학습해 다음 달 이탈 고객을 예측한다.",
    facts: [
      "각 학습 샘플에는 입력 feature와 정답 label이 함께 존재한다.",
      "훈련 데이터뿐 아니라 처음 보는 데이터에서도 정확히 예측하는 것이 목표다.",
      "회귀와 분류는 대표적인 지도학습 문제다.",
    ],
    misconceptions: [
      "정답 라벨 없이 데이터의 숨은 구조만 찾는 학습이다.",
      "훈련 오류가 0이 되어야만 새로운 데이터에 일반화할 수 있다.",
      "feature는 반드시 하나의 수치 변수여야 한다.",
    ],
  },
  {
    id: "regression-classification",
    category: "2. 지도학습과 문제 유형",
    term: "회귀와 분류",
    aliases: ["regression and classification", "회귀/분류"],
    definition: "연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형",
    scenario: "주택 가격을 예측하는 문제와 이메일을 스팸 또는 정상으로 나누는 문제를 구분한다.",
    facts: [
      "가격·점수·온도처럼 연속적인 수치를 예측하면 회귀다.",
      "스팸·정상처럼 유한한 범주를 예측하면 분류다.",
      "문제 유형은 주로 예측 대상인 label의 성격으로 판단한다.",
    ],
    misconceptions: [
      "회귀는 범주만 예측하고 분류는 연속적인 수치만 예측한다.",
      "입력 feature가 두 개 이상이면 문제는 항상 분류가 된다.",
      "회귀와 분류는 정답 라벨을 사용하지 않는 비지도학습이다.",
    ],
  },
  {
    id: "loss-functions",
    category: "2. 지도학습과 문제 유형",
    term: "손실함수",
    aliases: ["loss function", "손실 함수"],
    definition: "모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수",
    scenario: "회귀 모델은 MSE를, 분류 모델은 정답 범주의 예측 확률을 반영하는 교차 엔트로피를 줄이도록 학습한다.",
    facts: [
      "손실값이 작을수록 예측이 정답에 가까운 것으로 해석한다.",
      "MSE는 실제값과 예측값의 차이를 제곱해 평균한다.",
      "교차 엔트로피는 분류에서 정답 범주에 부여한 확률을 반영한다.",
    ],
    misconceptions: [
      "손실값은 클수록 모델의 예측 성능이 좋다.",
      "MSE는 범주형 분류 문제에만 사용할 수 있다.",
      "손실함수를 정하면 부족한 학습 데이터가 자동으로 생성된다.",
    ],
  },
  {
    id: "confusion-matrix",
    category: "2. 지도학습과 문제 유형",
    term: "혼동행렬",
    aliases: ["confusion matrix", "오차행렬"],
    definition: "이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표",
    scenario: "질병 환자가 매우 적은 데이터에서 정확도만 보지 않고 놓친 환자와 잘못 경고한 사람을 따로 계산한다.",
    facts: [
      "정확도는 전체 예측 중 맞힌 예측의 비율이다.",
      "FN은 실제 양성을 음성으로 잘못 예측한 경우다.",
      "클래스가 불균형하면 높은 정확도만으로 좋은 모델이라고 단정하기 어렵다.",
    ],
    misconceptions: [
      "정확도가 99%이면 클래스 비율과 관계없이 항상 좋은 분류 모델이다.",
      "FP는 실제 양성을 음성으로 놓친 경우를 뜻한다.",
      "혼동행렬은 연속적인 수치를 예측하는 회귀에서만 사용한다.",
    ],
  },
  {
    id: "test-generalization",
    category: "3. 검증과 일반화",
    term: "테스트 오류",
    aliases: ["test error", "일반화 오류"],
    definition: "학습에 사용하지 않은 새로운 데이터에서 측정한 예측 오류로 일반화 성능을 판단하는 기준",
    scenario: "훈련 데이터에서는 오차가 작지만 별도로 보관한 새 데이터에서 오차가 크게 증가했는지 확인한다.",
    facts: [
      "테스트 데이터는 모델 학습에 직접 사용하지 않아야 한다.",
      "좋은 모델 선택의 목표는 새로운 데이터에서의 오류를 줄이는 것이다.",
      "훈련 오류와 테스트 오류의 차이는 과적합을 판단하는 단서가 된다.",
    ],
    misconceptions: [
      "테스트 데이터로 반복 학습할수록 일반화 성능을 공정하게 평가할 수 있다.",
      "훈련 오류와 테스트 오류는 어떤 모델에서도 항상 같다.",
      "훈련 오류가 가장 작은 모델은 언제나 테스트 오류도 가장 작다.",
    ],
  },
  {
    id: "over-under-fitting",
    category: "3. 검증과 일반화",
    term: "과적합과 언더피팅",
    aliases: ["overfitting and underfitting", "오버피팅과 언더피팅"],
    definition: "모델이 훈련 데이터에 지나치게 맞으면 과적합, 너무 단순해 중요한 패턴도 못 배우면 언더피팅인 상태",
    scenario: "매우 복잡한 모델은 훈련 오차가 작고 검증 오차가 크며, 지나치게 단순한 모델은 두 오차가 모두 크다.",
    facts: [
      "과적합은 대체로 훈련 오류가 작고 테스트 오류가 큰 상태다.",
      "언더피팅은 훈련 오류와 테스트 오류가 모두 큰 경향이 있다.",
      "검증 성능을 보며 모델 복잡도나 학습 시점을 조절할 수 있다.",
    ],
    misconceptions: [
      "모델을 복잡하게 만들면 과적합과 언더피팅이 항상 함께 해결된다.",
      "과적합은 훈련 오류와 테스트 오류가 모두 큰 상태다.",
      "테스트 데이터를 반복해서 보며 복잡도를 정하는 것이 가장 공정하다.",
    ],
  },
  {
    id: "cross-validation",
    category: "3. 검증과 일반화",
    term: "K-겹 교차검증",
    aliases: ["k-fold cross-validation", "K-fold 교차검증", "교차검증"],
    definition: "데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법",
    scenario: "데이터가 적어 한 번의 검증셋 분할 결과가 불안정하므로 폴드를 바꾸어 K번 학습·평가한다.",
    facts: [
      "각 반복에서 한 폴드는 검증에, 나머지 폴드는 학습에 사용한다.",
      "K번의 검증 결과를 평균해 일반화 성능을 추정한다.",
      "K가 전체 샘플 수와 같으면 LOOCV가 된다.",
    ],
    misconceptions: [
      "모든 폴드를 동시에 검증셋으로 사용하고 학습은 한 번만 수행한다.",
      "K가 커져도 학습 횟수와 계산량은 변하지 않는다.",
      "교차검증을 하면 최종 테스트 데이터가 항상 필요 없어진다.",
    ],
  },
  {
    id: "unsupervised-learning",
    category: "4. 비지도학습과 군집화",
    term: "비지도학습",
    aliases: ["unsupervised learning", "비지도 학습"],
    definition: "정답 라벨 없이 입력 데이터의 구조·패턴·잠재 집단을 찾는 학습 방법",
    scenario: "고객의 실제 등급 정답 없이 구매 행동이 비슷한 고객끼리 묶어 시장을 나눈다.",
    facts: [
      "클러스터링과 차원 축소는 대표적인 비지도학습 과제다.",
      "출력은 정답 예측보다 데이터의 구조나 요약에 가깝다.",
      "정답 라벨이 없어 결과 해석과 평가가 더 어려울 수 있다.",
    ],
    misconceptions: [
      "항상 입력과 정답 라벨의 쌍으로 모델을 학습한다.",
      "분류 정확도 하나만으로 모든 비지도학습 결과를 평가한다.",
      "찾아낸 각 클러스터는 반드시 실제 원인에 따른 정답 범주다.",
    ],
  },
  {
    id: "k-means",
    category: "4. 비지도학습과 군집화",
    term: "K-means",
    aliases: ["K-평균", "k-means clustering", "K-means 클러스터링"],
    definition: "K개의 중심을 계산하고 각 관측치를 가장 가까운 중심에 재할당하는 과정을 반복하는 군집화 방법",
    scenario: "클러스터 수 K를 먼저 정한 뒤 중심 계산과 재할당을 소속이 바뀌지 않을 때까지 반복한다.",
    facts: [
      "클러스터 수 K를 학습 전에 정해야 한다.",
      "각 클러스터의 중심은 보통 소속 관측치의 feature 평균으로 계산한다.",
      "초기 중심에 따라 최종 군집 결과가 달라질 수 있어 여러 번 시도할 수 있다.",
    ],
    misconceptions: [
      "클러스터 수를 정하지 않아도 덴드로그램이 자동으로 K를 결정한다.",
      "초기 중심은 최종 결과에 아무런 영향을 주지 않는다.",
      "한 관측치는 매 반복에서 여러 클러스터에 동시에 속해야 한다.",
    ],
  },
  {
    id: "hierarchical-clustering",
    category: "4. 비지도학습과 군집화",
    term: "계층적 군집",
    aliases: ["hierarchical clustering", "계층적 클러스터링"],
    definition: "관측치에서 시작해 가까운 클러스터를 단계적으로 병합하고 그 과정을 덴드로그램으로 나타내는 방법",
    scenario: "각 관측치를 하나의 클러스터로 시작해 가장 유사한 두 집단을 병합하고 원하는 높이에서 덴드로그램을 자른다.",
    facts: [
      "상향식 방법은 관측치별 클러스터에서 시작해 하나가 될 때까지 병합한다.",
      "Single·Complete·Average linkage는 클러스터 간 거리를 다르게 정의한다.",
      "linkage 선택에 따라 같은 데이터의 덴드로그램도 달라질 수 있다.",
    ],
    misconceptions: [
      "항상 클러스터 수 K를 먼저 고정하고 중심점을 반복 갱신한다.",
      "linkage를 바꾸어도 군집 결과는 절대 달라지지 않는다.",
      "데이터가 많아도 모든 클러스터 쌍의 거리를 계산할 필요가 없다.",
    ],
  },
  {
    id: "scaling-pca",
    category: "4. 비지도학습과 군집화",
    term: "표준화",
    aliases: ["standardization", "StandardScaler", "스케일링"],
    definition: "변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환",
    scenario: "연소득과 방문 횟수처럼 단위와 범위가 크게 다른 변수를 거리 기반 군집화 전에 같은 척도로 바꾼다.",
    facts: [
      "거리 기반 알고리즘은 변수의 단위와 범위 차이에 민감할 수 있다.",
      "표준화는 일반적으로 각 feature의 평균을 0, 분산을 1로 맞춘다.",
      "PCA는 정보를 가능한 한 보존하며 더 적은 주성분으로 차원을 줄인다.",
    ],
    misconceptions: [
      "표준화는 정답 라벨을 자동으로 생성하는 과정이다.",
      "변수 단위 차이는 K-means의 거리 계산에 영향을 주지 않는다.",
      "PCA는 각 샘플에 정답 클러스터 라벨을 부여하는 분류 알고리즘이다.",
    ],
  },
  {
    id: "logistic-regression",
    category: "5. 로지스틱 회귀",
    term: "로지스틱 회귀",
    aliases: ["logistic regression", "로지스틱회귀"],
    definition: "선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 예측하는 이진 분류 모델",
    scenario: "신용카드 사용량을 입력해 연체 확률을 계산하고 임계값에 따라 연체 여부를 분류한다.",
    facts: [
      "시그모이드는 모든 실수 입력을 0과 1 사이 값으로 변환한다.",
      "확률의 odds에 로그를 취한 logit은 입력의 선형 결합으로 표현된다.",
      "모수는 데이터의 likelihood를 최대화하는 MLE로 추정할 수 있다.",
    ],
    misconceptions: [
      "모델 출력이 음의 무한대부터 양의 무한대까지라 확률로 해석할 수 없다.",
      "이진 분류의 표준 모수 추정은 항상 최소제곱 MSE만 사용한다.",
      "이름에 회귀가 있으므로 연속적인 수치만 예측할 수 있다.",
    ],
  },
  {
    id: "neural-network",
    category: "6. 신경망 구조와 표현력",
    term: "ReLU",
    aliases: ["rectified linear unit", "렐루", "활성화 함수 ReLU"],
    definition: "입력이 0보다 작으면 0, 0 이상이면 입력을 그대로 출력해 신경망에 비선형성을 주는 활성화 함수",
    scenario: "은닉 유닛의 선형 결합마다 활성화 함수를 적용해 여러 조각의 선형 구간으로 복잡한 함수를 표현한다.",
    facts: [
      "은닉층의 활성화 함수는 단순한 선형 결합만으로는 만들 수 없는 표현을 가능하게 한다.",
      "은닉층이 하나인 네트워크를 shallow network라고 부를 수 있다.",
      "깊은 네트워크는 층별 함수를 합성해 비슷한 파라미터 수로 더 많은 선형 구역을 만들 수 있다.",
    ],
    misconceptions: [
      "활성화 함수가 없어도 선형층을 여러 개 쌓으면 항상 복잡한 비선형 함수가 된다.",
      "ReLU는 모든 음수 입력을 그대로 출력하고 양수 입력을 0으로 만든다.",
      "보편적 근사 정리는 적은 수의 유닛으로 모든 불연속 함수를 오차 없이 표현한다는 뜻이다.",
    ],
  },
  {
    id: "gradient-descent",
    category: "7. 최적화와 역전파",
    term: "경사하강법",
    aliases: ["gradient descent", "경사 하강법"],
    definition: "손실함수의 기울기 반대 방향으로 파라미터를 반복 갱신해 손실을 줄이는 최적화 알고리즘",
    scenario: "현재 파라미터에서 미분값을 구하고 학습률을 곱한 만큼 반대 방향으로 이동한다.",
    facts: [
      "기울기는 손실이 가장 빠르게 증가하는 방향이므로 그 반대로 이동한다.",
      "학습률은 한 번의 업데이트에서 이동하는 크기를 조절한다.",
      "미니배치 SGD는 일부 샘플로 기울기를 추정해 계산량과 경로의 노이즈를 만든다.",
    ],
    misconceptions: [
      "손실을 줄이기 위해 항상 기울기와 같은 방향으로 이동한다.",
      "학습률은 클수록 언제나 더 빠르고 안정적으로 수렴한다.",
      "SGD는 매 업데이트마다 전체 데이터만 사용해야 한다.",
    ],
  },
  {
    id: "backpropagation",
    category: "7. 최적화와 역전파",
    term: "역전파",
    aliases: ["backpropagation", "backprop", "역전파 알고리즘"],
    definition: "출력의 손실에서 입력 방향으로 계산 그래프를 거슬러 가며 연쇄법칙으로 각 파라미터의 기울기를 구하는 절차",
    scenario: "순전파로 예측과 손실을 계산한 뒤 출력층부터 은닉층 방향으로 각 가중치의 미분값을 전달한다.",
    facts: [
      "순전파는 입력에서 출력 방향으로 예측값과 손실을 계산한다.",
      "역전파는 연쇄법칙을 이용해 각 층 파라미터의 기울기를 효율적으로 구한다.",
      "Early stopping은 검증 성능이 더 이상 좋아지지 않을 때 학습을 멈춰 과적합을 줄인다.",
    ],
    misconceptions: [
      "역전파는 입력에서 출력 방향으로 예측값만 만드는 과정이다.",
      "각 층의 기울기는 다른 층과 무관하므로 연쇄법칙이 필요 없다.",
      "Early stopping은 훈련 오차가 반드시 0이 될 때까지 학습하는 방법이다.",
    ],
  },
];

const essaySets = {
  easy: [
    ["지도학습에서 feature와 label이 각각 어떤 역할을 하는지 예시와 함께 설명하시오.", "지도학습은 feature를 입력으로 사용해 label을 예측하는 규칙을 학습한다. 예를 들어 주택 면적과 연식을 feature로 사용하고 실제 가격을 label로 두어 새 주택의 가격을 예측할 수 있다.", ["feature", "label", "입력", "정답"]],
    ["회귀와 분류의 차이를 예측 대상과 예시를 중심으로 설명하시오.", "회귀는 가격이나 온도처럼 연속적인 수치를 예측하고, 분류는 스팸·정상처럼 정해진 범주를 예측한다. 문제 유형은 주로 label의 성격으로 구분한다.", ["회귀", "분류", "연속", "범주"]],
    ["과적합과 언더피팅의 훈련 오류·테스트 오류 특징을 비교하시오.", "과적합은 훈련 오류는 작지만 테스트 오류가 커지는 경향이 있고, 언더피팅은 모델이 너무 단순해 훈련 오류와 테스트 오류가 모두 큰 경향이 있다.", ["과적합", "언더피팅", "훈련 오류", "테스트 오류"]],
    ["K-means의 중심 계산과 재할당 과정을 순서대로 설명하시오.", "K를 정하고 중심을 초기화한 뒤, 각 관측치를 가장 가까운 중심에 할당한다. 소속 관측치의 평균으로 중심을 다시 계산하고 할당이 바뀌지 않을 때까지 반복한다.", ["K", "중심", "재할당", "반복"]],
    ["로지스틱 회귀가 이진 분류에 적합한 이유를 시그모이드 출력 범위와 연결해 설명하시오.", "선형 결합을 시그모이드에 통과시키면 출력이 0과 1 사이가 되어 양성일 확률로 해석할 수 있으므로 이진 분류에 적합하다.", ["시그모이드", "0", "1", "확률"]],
    ["경사하강법에서 기울기와 학습률이 하는 일을 설명하시오.", "기울기는 손실이 증가하는 방향을 나타내므로 파라미터는 그 반대로 이동한다. 학습률은 한 번의 업데이트에서 이동할 크기를 정한다.", ["기울기", "반대 방향", "학습률", "업데이트"]],
  ],
  medium: [
    ["훈련셋·검증셋·테스트셋의 역할을 구분하고 테스트셋을 반복 튜닝에 쓰면 안 되는 이유를 설명하시오.", "훈련셋은 파라미터 학습, 검증셋은 모델과 설정 선택, 테스트셋은 최종 일반화 성능 평가에 사용한다. 테스트셋을 반복 튜닝에 사용하면 그 정보가 모델 선택에 새어 공정한 최종 평가가 깨진다.", ["훈련셋", "검증셋", "테스트셋", "일반화"]],
    ["클래스 불균형 데이터에서 정확도만으로 분류 모델을 평가하기 어려운 이유를 혼동행렬과 연결해 설명하시오.", "다수 클래스로만 예측해도 정확도가 높을 수 있다. 혼동행렬의 TP·FP·TN·FN을 확인하면 양성을 놓친 FN이나 잘못 경고한 FP를 구분해 실제 오류 유형을 평가할 수 있다.", ["불균형", "정확도", "혼동행렬", "FN"]],
    ["선형회귀를 이진 분류에 그대로 사용했을 때의 한계와 로지스틱 회귀의 해결 방법을 설명하시오.", "선형회귀 출력은 0보다 작거나 1보다 커질 수 있어 확률로 부적절하다. 로지스틱 회귀는 선형 결합을 시그모이드에 통과시켜 0과 1 사이 확률을 만든다.", ["선형회귀", "확률", "시그모이드", "로지스틱"]],
    ["K-means를 단위가 크게 다른 feature에 적용하기 전에 표준화가 필요한 이유와 초기화의 영향을 설명하시오.", "거리 계산에서 범위가 큰 feature가 결과를 지배할 수 있어 표준화가 필요하다. 또한 초기 중심에 따라 지역적으로 다른 군집 결과가 나올 수 있으므로 여러 번 초기화해 비교할 수 있다.", ["거리", "표준화", "초기 중심", "여러 번"]],
    ["shallow network와 deep network의 구조·표현력 차이를 활성화 함수와 함수 합성 관점에서 설명하시오.", "shallow network는 은닉층이 하나이고, deep network는 여러 층의 비선형 변환을 합성한다. ReLU 같은 활성화가 비선형성을 만들며 깊은 구조는 효율적으로 더 복잡한 표현을 만들 수 있다.", ["shallow", "deep", "활성화 함수", "합성"]],
    ["전체 배치 경사하강법과 미니배치 SGD의 업데이트 방식과 장단점을 비교하시오.", "전체 배치 경사하강법은 모든 데이터로 정확한 기울기를 계산하지만 한 스텝의 비용이 크다. 미니배치 SGD는 일부 데이터로 빠르게 갱신하며 노이즈가 있지만 평균적으로 손실을 줄이는 방향을 추정한다.", ["전체 데이터", "미니배치", "계산량", "노이즈"]],
  ],
  hard: [
    ["분류 모델을 개발한다고 할 때 데이터 분할부터 최종 평가까지 과적합을 방지하는 전체 절차를 설명하시오.", "훈련·검증·테스트셋을 분리하고 훈련셋으로 파라미터를 학습한다. 검증셋이나 K-겹 교차검증으로 모델 복잡도와 학습 시점을 정하고, 모든 선택이 끝난 뒤 한 번만 테스트셋으로 일반화 성능을 평가한다.", ["데이터 분할", "검증", "교차검증", "테스트"]],
    ["다중선형회귀에서 서로 강하게 상관된 변수를 함께 사용할 때 생기는 문제와 상관관계를 인과관계로 단정하면 안 되는 이유를 설명하시오.", "강하게 상관된 설명변수는 다중공선성을 만들어 계수 추정의 분산을 키우고 해석을 불안정하게 한다. 또한 관찰된 상관은 숨은 변수나 선택 편향 때문일 수 있어 회귀계수만으로 인과 효과를 단정할 수 없다.", ["다중공선성", "계수", "불안정", "인과관계"]],
    ["로지스틱 회귀에서 시그모이드·odds·logit·최대우도추정의 관계를 설명하시오.", "시그모이드는 선형 결합을 확률로 바꾸고, odds는 p/(1-p)이다. odds의 로그인 logit은 입력의 선형 결합이 되며, 관측된 정답이 나타날 likelihood를 최대화하도록 계수를 추정한다.", ["시그모이드", "odds", "logit", "likelihood"]],
    ["ReLU 신경망의 조각별 선형 표현과 깊은 네트워크의 표현력 증가를 설명하시오.", "ReLU는 입력 공간을 구간으로 나누어 각 구간에서 선형인 함수를 만든다. 여러 은닉층을 합성하면 앞 층이 만든 구간을 뒤 층이 다시 변환하고 접어 비슷한 파라미터 수로 더 많은 선형 구역을 표현할 수 있다.", ["ReLU", "조각별 선형", "합성", "표현력"]],
    ["순전파와 역전파를 연쇄법칙 관점에서 구분하고 경사하강 업데이트까지 연결해 설명하시오.", "순전파는 층별 계산으로 예측과 손실을 구한다. 역전파는 손실에서 출력층·은닉층 방향으로 연쇄법칙을 적용해 각 가중치의 기울기를 구하고, 경사하강법은 그 기울기의 반대 방향으로 가중치를 갱신한다.", ["순전파", "역전파", "연쇄법칙", "경사하강"]],
    ["검증 손실은 증가하지만 훈련 손실은 계속 감소하는 상황을 진단하고 Early stopping이 어떻게 대응하는지 설명하시오.", "훈련 손실만 감소하고 검증 손실이 증가하면 훈련 데이터에 과적합되고 있다는 신호다. Early stopping은 검증 성능이 가장 좋았던 시점의 모델을 선택하고 이후 학습을 중단해 일반화 성능 악화를 줄인다.", ["검증 손실", "훈련 손실", "과적합", "Early stopping"]],
  ],
};

function rotateChoices(choices, correctIndex, shift) {
  const normalized = ((shift % choices.length) + choices.length) % choices.length;
  const rotated = choices.slice(normalized).concat(choices.slice(0, normalized));
  return {
    options: rotated,
    answer: (correctIndex - normalized + choices.length) % choices.length,
  };
}

function makeMultipleChoice({ id, concept, difficulty, prompt, choices, correctIndex, explanation, hint, shift }) {
  const { options, answer } = rotateChoices(choices, correctIndex, shift);
  return {
    id,
    conceptId: concept.id,
    difficulty,
    category: concept.category,
    questionType: "multiple-choice",
    prompt,
    options,
    answer,
    explanation,
    hint,
  };
}

function generateMultipleChoice(difficulty) {
  const questions = [];
  concepts.forEach((concept, index) => {
    const next = concepts[(index + 1) % concepts.length];
    const altA = concepts[(index + 5) % concepts.length];
    const altB = concepts[(index + 9) % concepts.length];
    const serial = String(index * 3 + 1).padStart(3, "0");

    if (difficulty === "easy") {
      questions.push(makeMultipleChoice({
        id: `w1-refresh-easy-mc-${serial}`,
        concept,
        difficulty,
        prompt: `${concept.term}에 대한 설명으로 가장 적절한 것은?`,
        choices: [concept.definition, next.definition, altA.definition, altB.definition],
        correctIndex: 0,
        explanation: `${concept.term}은 ${concept.definition}이다.`,
        hint: `${concept.category}의 정의와 입력·출력의 관계를 떠올린다.`,
        shift: index,
      }));
      questions.push(makeMultipleChoice({
        id: `w1-refresh-easy-mc-${String(index * 3 + 2).padStart(3, "0")}`,
        concept,
        difficulty,
        prompt: `다음 상황에 가장 알맞은 개념은? ${concept.scenario}`,
        choices: [concept.term, next.term, altA.term, altB.term],
        correctIndex: 0,
        explanation: `이 상황은 ${concept.term}의 핵심 절차 또는 사용 목적에 해당한다.`,
        hint: "정답 라벨의 유무, 출력 형태, 계산 절차를 먼저 구분한다.",
        shift: index + 1,
      }));
      questions.push(makeMultipleChoice({
        id: `w1-refresh-easy-mc-${String(index * 3 + 3).padStart(3, "0")}`,
        concept,
        difficulty,
        prompt: `${concept.term}에 대한 설명으로 옳지 않은 것은?`,
        choices: [...concept.facts, concept.misconceptions[0]],
        correctIndex: 3,
        explanation: `${concept.misconceptions[0]}라는 설명은 ${concept.term}의 정의와 맞지 않는다.`,
        hint: "나머지 세 보기가 같은 개념의 특징으로 함께 성립하는지 확인한다.",
        shift: index + 2,
      }));
      return;
    }

    if (difficulty === "medium") {
      const secondIsTrue = index % 2 === 0;
      questions.push(makeMultipleChoice({
        id: `w1-refresh-medium-mc-${serial}`,
        concept,
        difficulty,
        prompt: `다음 두 설명을 모두 만족하는 개념은? (가) ${concept.definition} (나) ${concept.scenario}`,
        choices: [concept.term, next.term, altA.term, altB.term],
        correctIndex: 0,
        explanation: `(가)는 ${concept.term}의 정의이고, (나)는 그 개념이 적용되는 상황이다.`,
        hint: "정의와 사례에서 공통으로 드러나는 핵심 동작을 찾는다.",
        shift: index,
      }));
      questions.push(makeMultipleChoice({
        id: `w1-refresh-medium-mc-${String(index * 3 + 2).padStart(3, "0")}`,
        concept,
        difficulty,
        prompt: `${concept.term}에 대한 두 판단의 옳고 그름을 고르시오. (가) ${concept.facts[0]} (나) ${secondIsTrue ? concept.facts[1] : concept.misconceptions[0]}`,
        choices: ["(가), (나) 모두 옳다.", "(가)만 옳다.", "(나)만 옳다.", "(가), (나) 모두 옳지 않다."],
        correctIndex: secondIsTrue ? 0 : 1,
        explanation: `(가)는 옳고, (나)는 ${secondIsTrue ? "옳다" : "옳지 않다"}.`,
        hint: "두 문장을 하나씩 독립적으로 판단한다.",
        shift: index + 1,
      }));
      questions.push(makeMultipleChoice({
        id: `w1-refresh-medium-mc-${String(index * 3 + 3).padStart(3, "0")}`,
        concept,
        difficulty,
        prompt: `${concept.term}을 적용하거나 해석한 내용으로 가장 적절한 것은?`,
        choices: [concept.facts[2], ...concept.misconceptions],
        correctIndex: 0,
        explanation: concept.facts[2],
        hint: "절대적인 표현이나 개념의 입력·출력을 뒤바꾼 보기를 제외한다.",
        shift: index + 2,
      }));
      return;
    }

    questions.push(makeMultipleChoice({
      id: `w1-refresh-hard-mc-${serial}`,
      concept,
      difficulty,
      prompt: `다음 (가), (나)에 해당하는 개념의 조합으로 옳은 것은? (가) ${concept.definition} (나) ${next.definition}`,
      choices: [
        `(가) ${concept.term} / (나) ${next.term}`,
        `(가) ${next.term} / (나) ${concept.term}`,
        `(가) ${altA.term} / (나) ${next.term}`,
        `(가) ${concept.term} / (나) ${altB.term}`,
      ],
      correctIndex: 0,
      explanation: `(가)는 ${concept.term}, (나)는 ${next.term}의 정의다.`,
      hint: "두 정의의 정답을 각각 구한 뒤 조합한다.",
      shift: index,
    }));
    questions.push(makeMultipleChoice({
      id: `w1-refresh-hard-mc-${String(index * 3 + 2).padStart(3, "0")}`,
      concept,
      difficulty,
      prompt: `${concept.term}에 관한 설명이다. 옳은 것만 고른 것은? ① ${concept.facts[0]} ② ${concept.facts[1]} ③ ${concept.misconceptions[0]}`,
      choices: ["①", "②", "①, ②", "①, ②, ③"],
      correctIndex: 2,
      explanation: "①과 ②는 옳고 ③은 개념의 정의 또는 절차와 어긋난다.",
      hint: "③의 주어와 예측 방향 또는 계산 절차가 뒤바뀌지 않았는지 본다.",
      shift: index + 1,
    }));
    questions.push(makeMultipleChoice({
      id: `w1-refresh-hard-mc-${String(index * 3 + 3).padStart(3, "0")}`,
      concept,
      difficulty,
      prompt: `${concept.scenario} 이 상황에 대한 분석으로 가장 타당한 것은?`,
      choices: [concept.facts[2], ...concept.misconceptions],
      correctIndex: 0,
      explanation: `${concept.facts[2]} 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.`,
      hint: "상황에 사용된 데이터, 출력, 반복 절차가 무엇인지 순서대로 확인한다.",
      shift: index + 2,
    }));
  });
  return questions;
}

function generateBonusMultipleChoice(difficulty) {
  if (difficulty === "easy") {
    return makeMultipleChoice({
      id: "w1-refresh-easy-mc-046",
      concept: concepts[0],
      difficulty,
      prompt: "주택 가격 예측 데이터에서 면적·방 수·연식과 실제 거래 가격의 역할을 올바르게 연결한 것은?",
      choices: [
        "면적·방 수·연식은 feature이고 실제 거래 가격은 label이다.",
        "면적·방 수·연식은 label이고 실제 거래 가격은 feature다.",
        "모든 값이 label이므로 feature는 없다.",
        "실제 거래 가격은 손실함수이고 정답 label은 없다.",
      ],
      correctIndex: 0,
      explanation: "예측에 사용하는 면적·방 수·연식은 feature이고, 예측하려는 실제 거래 가격은 label이다.",
      hint: "모델에 넣는 정보와 모델이 맞혀야 하는 정답을 구분한다.",
      shift: 1,
    });
  }
  if (difficulty === "medium") {
    return makeMultipleChoice({
      id: "w1-refresh-medium-mc-046",
      concept: concepts[6],
      difficulty,
      prompt: "여러 모델 후보의 설정을 비교한 뒤 최종 일반화 성능을 공정하게 보고하려 한다. 데이터 사용 순서로 가장 적절한 것은?",
      choices: [
        "훈련셋으로 학습하고 검증셋으로 모델을 선택한 뒤 테스트셋으로 최종 평가한다.",
        "테스트셋으로 모델을 반복 조정한 뒤 훈련셋으로 최종 평가한다.",
        "검증셋과 테스트셋을 모두 학습에 합친 뒤 같은 데이터로 성능을 보고한다.",
        "모든 모델을 테스트셋에 맞춘 뒤 테스트 오류가 가장 작은 모델을 선택한다.",
      ],
      correctIndex: 0,
      explanation: "모델 선택은 검증 데이터로 수행하고, 모든 선택이 끝난 뒤 테스트 데이터로 최종 일반화 성능을 평가한다.",
      hint: "최종 시험지는 모델 선택 과정에서 미리 보면 안 된다.",
      shift: 2,
    });
  }
  return makeMultipleChoice({
    id: "w1-refresh-hard-mc-046",
    concept: concepts[14],
    difficulty,
    prompt: "신경망의 한 학습 스텝에서 수행되는 계산 순서로 가장 적절한 것은?",
    choices: [
      "순전파로 예측과 손실 계산 → 역전파로 기울기 계산 → 기울기 반대 방향으로 파라미터 갱신",
      "파라미터 갱신 → 순전파 → 정답 라벨 생성 → 역전파 생략",
      "역전파로 예측 생성 → 순전파로 기울기 계산 → 손실 증가 방향으로 갱신",
      "테스트셋으로 파라미터 갱신 → 검증셋으로 손실 생성 → 훈련셋은 사용하지 않음",
    ],
    correctIndex: 0,
    explanation: "순전파가 예측과 손실을 만들고, 역전파가 기울기를 구하며, 최적화 알고리즘이 기울기 반대 방향으로 파라미터를 갱신한다.",
    hint: "예측, 미분, 업데이트의 순서를 구분한다.",
    shift: 3,
  });
}

function generateShortAnswers(difficulty) {
  const offsets = { easy: 0, medium: 5, hard: 10 };
  return Array.from({ length: 9 }, (_, index) => {
    const concept = concepts[(offsets[difficulty] + index) % concepts.length];
    const prompt = difficulty === "easy"
      ? `다음 정의에 해당하는 용어를 작성하시오. ${concept.definition}`
      : difficulty === "medium"
        ? `다음 상황의 핵심 개념을 작성하시오. ${concept.scenario}`
        : `다음 설명과 특징에 공통으로 해당하는 핵심 용어를 작성하시오. ${concept.definition} 또한 ${concept.facts[1]}`;
    return {
      id: `w1-refresh-${difficulty}-short-${String(index + 1).padStart(3, "0")}`,
      conceptId: concept.id,
      difficulty,
      category: concept.category,
      questionType: "short-answer",
      prompt,
      options: [],
      answer: null,
      acceptedAnswers: [concept.term, ...concept.aliases],
      explanation: `정답은 ${concept.term}이다. ${concept.definition}이다.`,
      hint: `${concept.category}에서 사용되는 대표 용어다.`,
    };
  });
}

function generateEssays(difficulty) {
  return essaySets[difficulty].map(([prompt, modelAnswer, rubricKeywords], index) => ({
    id: `w1-refresh-${difficulty}-essay-${String(index + 1).padStart(3, "0")}`,
    conceptId: `integrated-${difficulty}-${index + 1}`,
    difficulty,
    category: difficulty === "easy" ? "8. 핵심 개념 서술" : "8. 통합 사고 서술",
    questionType: "essay",
    prompt,
    options: [],
    answer: null,
    modelAnswer,
    rubricKeywords,
    minLength: 20,
    explanation: `모범답안에는 ${rubricKeywords.join(", ")}의 관계가 포함되어야 한다.`,
    hint: "용어만 나열하지 말고 원인·절차·결과를 연결해 서술한다.",
  }));
}

function sanitizeText(value) {
  if (typeof value !== "string") return value;
  return value
    .replace(/강의자료에서 다음 내용을 나타내는 명칭을 정확히 작성하시오\.\s*/g, "다음 설명에 해당하는 명칭을 정확히 작성하시오. ")
    .replace(/강의자료에서 해당 설명의 핵심 답은/g, "해당 설명의 핵심 개념은")
    .replace(/강의자료의 흐름에 맞춰|강의자료 흐름에 맞춰/g, "학습 과정에 맞춰")
    .replace(/강의자료의 분류상|강의자료의 분류로/g, "개념상")
    .replace(/강의자료의 영어 용어로/g, "영어 용어로")
    .replace(/강의자료 예시에서는|강의 자료 예시에서는/g, "대표 예시에서는")
    .replace(/강의자료를 기준으로|강의자료 기준으로|강의 자료를 기준으로/g, "")
    .replace(/강의자료에 제시된|강의자료에서 제시된|강의자료가 제시한/g, "")
    .replace(/강의자료에 맞는|강의자료에 맞춰|강의자료처럼/g, "")
    .replace(/강의자료 설명에 가장 가까운/g, "개념 설명으로 가장 적절한")
    .replace(/강의자료에서|강의자료는|강의자료가|강의자료의|강의 자료에서|강의 자료는|강의 자료의/g, "")
    .replace(/슬라이드 하단의|슬라이드에는|슬라이드에서|슬라이드는|슬라이드의|슬라이드/g, "")
    .replace(/자료에 따르면|자료에서|자료의 흐름에 맞춰/g, "")
    .replace(/강의 예시/g, "예시")
    .replace(/초기 선택 오류를 되돌리기 어렵다이다/g, "초기 선택 오류를 되돌리기 어렵다는 한계다")
    .replace(/순차 연산 때문에 병렬화가 어렵다이다/g, "RNN의 순차 연산으로 인한 병렬화 한계다")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.?!])/g, "$1")
    .trim();
}

function sanitizeQuestion(question) {
  const next = { ...question };
  for (const key of ["prompt", "explanation", "hint", "modelAnswer"]) {
    if (next[key]) next[key] = sanitizeText(next[key]);
  }
  if (next.options) next.options = next.options.map(sanitizeText);
  const dependentReference = /(강의자료|강의 자료|방법론 강의|강의의|슬라이드|그림|도표|결과표)/;
  if (dependentReference.test(next.hint ?? "")) {
    next.hint = "문제에 제시된 변수와 핵심 개념의 정의를 비교한다.";
  }
  if (dependentReference.test(next.explanation ?? "")) {
    next.explanation = "정답 보기는 문제에 제시된 변수와 핵심 개념의 관계를 올바르게 설명한다.";
  }
  return next;
}

function selectRoundRobin(items, count) {
  const grouped = new Map();
  for (const item of items) {
    if (!grouped.has(item.category)) grouped.set(item.category, []);
    grouped.get(item.category).push(item);
  }
  const groups = [...grouped.values()];
  const selected = [];
  let cursor = 0;
  while (selected.length < count && groups.some((group) => group.length)) {
    const group = groups[cursor % groups.length];
    if (group.length) selected.push(group.shift());
    cursor += 1;
  }
  if (selected.length !== count) throw new Error(`기존 문항 선택 실패: ${selected.length}/${count}`);
  return selected;
}

function isSelfContained(question) {
  const text = [question.prompt, question.modelAnswer, ...(question.options ?? [])].join(" ");
  return !/(강의자료|강의 자료|방법론 강의|강의의|슬라이드|그림|도표|표에서|결과표|하단의|축의 역할)/.test(text);
}

function rebuildWeek1(bank) {
  return Object.fromEntries(["easy", "medium", "hard"].map((difficulty) => {
    const sanitized = bank[difficulty]
      .filter((question) => !question.id.startsWith("w1-refresh-"))
      .map(sanitizeQuestion)
      .filter(isSelfContained);
    const kept = [
      ...selectRoundRobin(sanitized.filter((q) => q.questionType === "multiple-choice"), 29),
      ...selectRoundRobin(sanitized.filter((q) => q.questionType === "short-answer"), 6),
      ...selectRoundRobin(sanitized.filter((q) => q.questionType === "essay"), 4),
    ];
    const generated = [
      ...generateMultipleChoice(difficulty),
      generateBonusMultipleChoice(difficulty),
      ...generateShortAnswers(difficulty),
      ...generateEssays(difficulty),
    ];
    const questions = [...kept, ...generated];
    return [difficulty, questions];
  }));
}

const CATEGORY_GUIDES = [
  {
    match: /(AI, ML, DL|데이터와 학습|피처 기반)/,
    clue: "규칙을 사람이 직접 지정하는지, 데이터에서 학습하는지와 feature·label의 역할",
    rationale: "AI·ML·DL의 포함 관계와 데이터에서 규칙을 학습하는지 여부를 구분해야 한다.",
  },
  {
    match: /(지도학습|문제 유형|혼동행렬|손실함수)/,
    clue: "정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지",
    rationale: "예측 대상의 형태와 TP·FP·TN·FN의 정의를 기준으로 판단해야 한다.",
  },
  {
    match: /(검증|일반화|과적합|언더피팅)/,
    clue: "훈련·검증·테스트 데이터의 역할과 두 오류의 변화",
    rationale: "모델 선택에는 검증 데이터를 사용하고 테스트 데이터는 마지막 일반화 평가에만 사용한다.",
  },
  {
    match: /(비지도|군집|K-means|계층적|표준화|PCA)/,
    clue: "label의 유무, 거리 계산, 중심 재계산 또는 linkage 방식",
    rationale: "군집화는 정답 label 없이 유사성이나 거리를 사용하며 알고리즘마다 군집을 만드는 절차가 다르다.",
  },
  {
    match: /(선형회귀|단순선형|다중선형|회귀 주의사항)/,
    clue: "회귀계수의 의미, 잔차, 최소제곱과 변수 수",
    rationale: "선형회귀는 입력과 연속형 출력의 관계를 계수로 표현하며 계수 해석과 일반화 조건을 함께 살펴야 한다.",
  },
  {
    match: /로지스틱/,
    clue: "선형 결합, 시그모이드, odds와 logit의 연결",
    rationale: "로지스틱 회귀는 선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 만든다.",
  },
  {
    match: /(신경망|표현력|최적화|역전파)/,
    clue: "순전파·손실·미분·파라미터 갱신의 순서",
    rationale: "활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
  },
  {
    match: /(워드 임베딩|RNN|LSTM)/,
    clue: "예측 방향, hidden state의 정보 흐름과 장기 의존성",
    rationale: "단어 표현 방식과 순환 구조가 어떤 정보를 입력받아 무엇을 예측하거나 전달하는지 구분해야 한다.",
  },
  {
    match: /(자연어 생성|Seq2Seq|Attention)/,
    clue: "encoder·decoder의 정보 흐름과 생성 시점의 참조 대상",
    rationale: "Seq2Seq의 병목과 Attention이 어떤 encoder 정보를 선택적으로 참조하는지 연결해야 한다.",
  },
  {
    match: /Transformer/,
    clue: "Query·Key·Value의 출처, masking과 위치 정보",
    rationale: "Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
  },
  {
    match: /사전 학습/,
    clue: "encoder-only·decoder-only·encoder-decoder 구조와 학습 목표",
    rationale: "BERT·GPT·T5는 Transformer를 사용하지만 구조와 사전학습 목표가 서로 다르다.",
  },
  {
    match: /(파운데이션 모델|거대 언어 모델의 학습)/,
    clue: "사전학습·SFT·선호 학습·정책 최적화의 단계",
    rationale: "대규모 사전학습 이후 지시 데이터와 인간 선호를 반영하는 정렬 단계를 순서대로 구분해야 한다.",
  },
  {
    match: /거대 언어 모델의 추론/,
    clue: "후보 토큰의 확률 분포를 제한하거나 조정하는 방식",
    rationale: "temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
  },
  {
    match: /거대 언어 모델의 평가와 응용/,
    clue: "정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계",
    rationale: "평가 지표마다 문자열·의미·확률·사람의 선호 중 측정하는 대상이 다르며 편향 가능성도 있다.",
  },
];

function guideFor(question) {
  return CATEGORY_GUIDES.find(({ match }) => match.test(question.category)) ?? {
    clue: "입력·출력, 학습 목표와 적용 절차",
    rationale: "문제에 제시된 조건과 각 개념의 정의를 순서대로 대응해야 한다.",
  };
}

function replaceQuestionContent(question, replacement) {
  return {
    ...question,
    ...replacement,
    id: question.id,
    conceptId: question.conceptId,
    difficulty: question.difficulty,
    category: question.category,
    questionType: question.questionType,
  };
}

const DIRECT_QUESTION_REWRITES = {
  "ai-ml-easy-001": {
    prompt: "데이터와 주변 환경을 인식하고 학습·추론하여 목표 달성을 위한 판단이나 행동을 수행하는 시스템을 가장 정확하게 설명한 것은?",
    options: [
      "인공지능은 주어진 환경이나 데이터를 바탕으로 학습·추론하여 목표에 맞는 판단이나 행동을 수행할 수 있는 시스템이다.",
      "인공지능은 정답 label 없이 군집만 만드는 비지도학습 알고리즘을 뜻한다.",
      "인공지능은 입력 feature가 하나인 선형회귀 모델만을 뜻한다.",
      "인공지능은 사람이 작성한 모든 규칙을 그대로 실행하는 프로그램만을 뜻한다.",
    ],
    answer: 0,
    explanation: "인공지능은 특정 알고리즘 하나가 아니라 인식·학습·추론을 활용해 목표에 맞는 판단이나 행동을 수행하는 시스템을 포괄한다.",
    hint: "하나의 학습 방법이 아니라 더 넓은 시스템 개념을 묻고 있다.",
  },
  "ai-ml-easy-007": {
    prompt: "콘텐츠 추천과 이메일 스팸 분류가 기계학습 사례로 함께 묶이는 핵심 이유는?",
    options: [
      "사람이 가능한 모든 상황의 규칙을 미리 작성하기 때문이다.",
      "과거 데이터에서 예측에 필요한 규칙이나 패턴을 학습하기 때문이다.",
      "두 문제 모두 정답 label이 없는 군집화 문제이기 때문이다.",
      "두 문제 모두 하나의 수치만 출력하는 회귀 문제이기 때문이다.",
    ],
    answer: 1,
    explanation: "추천과 스팸 분류는 목표 출력은 다르지만 데이터에서 예측 규칙을 학습한다는 기계학습의 공통점을 가진다.",
    hint: "사람이 규칙을 모두 작성하는 방식과 데이터에서 규칙을 찾는 방식을 구분한다.",
  },
  "ai-ml-easy-019": {
    prompt: "단일 피처 기반 1차원 학습에서 ‘1D’가 의미하는 것은?",
    options: [
      "입력 feature가 한 차원이라는 뜻이다.",
      "훈련 데이터를 한 번만 사용한다는 뜻이다.",
      "모델의 파라미터가 반드시 하나라는 뜻이다.",
      "출력 label의 범주가 하나라는 뜻이다.",
    ],
    answer: 0,
    explanation: "1D는 입력을 나타내는 feature 공간이 한 차원이라는 의미이며 학습 횟수나 label 개수를 뜻하지 않는다.",
    hint: "D를 학습 횟수가 아니라 feature 공간의 dimension으로 해석한다.",
  },
  "ai-ml-easy-024": {
    prompt: "선형회귀의 학습 목표를 가장 정확하게 설명한 것은?",
    options: [
      "입력과 연속형 출력의 관계를 선형식으로 근사해 새로운 입력의 값을 예측한다.",
      "정답 label 없이 관측치를 여러 군집으로 나눈다.",
      "입력을 확률값으로 바꿔 이진 범주만 예측한다.",
      "문장 속 다음 토큰의 확률 분포만 계산한다.",
    ],
    answer: 0,
    explanation: "선형회귀는 입력 feature와 연속형 label 사이의 관계를 선형식으로 학습하는 지도학습 방법이다.",
    hint: "예측 대상이 연속형 수치인지 범주인지 먼저 확인한다.",
  },
  "ai-ml-easy-029": {
    prompt: "광고비와 매출 데이터를 단순선형회귀로 분석하기에 가장 적절한 질문은?",
    options: [
      "광고비가 증가할 때 평균 매출이 어떻게 변하는가?",
      "광고 문구를 주제별로 몇 개의 군집으로 나눌 수 있는가?",
      "광고 이미지가 스팸인지 정상인지 분류할 수 있는가?",
      "광고 문장을 생성할 때 다음 토큰은 무엇인가?",
    ],
    answer: 0,
    explanation: "광고비라는 하나의 입력과 연속형 매출 사이의 평균적인 선형 관계를 묻는 질문이 단순선형회귀에 해당한다.",
    hint: "입력 변수가 하나이고 예측 대상이 연속형 수치인 보기를 찾는다.",
  },
  "ai-ml-easy-002": {
    prompt: "사람이 추천 규칙을 일일이 작성하지 않고 사용자 행동 데이터에서 패턴을 학습해 추천 결과를 개선한다. 가장 적절한 설명은?",
    options: [
      "AI의 하위 범주에서 데이터로부터 예측 규칙을 학습하는 ML 사례다.",
      "데이터를 사용하지 않는 고정 규칙 기반 시스템이다.",
      "반드시 여러 은닉층을 사용해야 하므로 모든 ML은 DL이다.",
      "정답 label이 없는 경우에만 가능한 비지도학습이다.",
    ],
    answer: 0,
    explanation: "기계학습은 AI 범주 안에서 데이터로부터 패턴이나 규칙을 학습해 과제 성능을 개선하는 접근이다. 모든 기계학습이 신경망을 사용하는 것은 아니다.",
    hint: "규칙을 사람이 직접 작성했는지 데이터에서 학습했는지 구분한다.",
  },
  "ai-ml-easy-003": {
    prompt: "AI·ML·DL의 관계와 딥러닝의 특징을 올바르게 설명한 것은?",
    options: [
      "DL은 ML에 포함되며 여러 층의 신경망을 이용해 데이터 표현과 예측 규칙을 학습한다.",
      "DL은 데이터를 사용하지 않는 규칙 기반 AI만을 뜻한다.",
      "DL과 ML은 서로 겹치지 않는 독립적인 분야다.",
      "DL은 입력 feature가 하나일 때만 사용할 수 있다.",
    ],
    answer: 0,
    explanation: "딥러닝은 기계학습의 한 분야이며 다층 신경망을 이용한다. 따라서 포함 관계는 AI ⊃ ML ⊃ DL이다.",
    hint: "가장 넓은 개념부터 신경망을 사용하는 하위 개념까지 순서대로 본다.",
  },
  "ai-ml-easy-009": {
    prompt: "머신러닝 개발 과정에서 평가 결과를 확인한 다음 수행할 작업으로 가장 적절한 것은?",
    options: [
      "오류 유형을 분석해 데이터·feature·모델 또는 학습 설정을 수정하고 다시 평가한다.",
      "평가 결과와 관계없이 같은 모델을 변경 없이 계속 사용한다.",
      "정답 label의 이름만 바꾸면 성능이 자동으로 향상된다.",
      "테스트 데이터를 학습 데이터로 반복 사용해 점수를 맞춘다.",
    ],
    answer: 0,
    explanation: "머신러닝은 데이터 준비, 모델 학습, 평가, 개선을 반복하는 과정이다. 평가는 다음 개선 지점을 찾기 위한 근거로 사용된다.",
    hint: "평가가 개발 과정의 끝인지 다음 개선을 위한 피드백인지 판단한다.",
  },
  "ai-ml-easy-020": {
    prompt: "단일 피처 기반 학습을 가장 정확하게 설명한 것은?",
    options: [
      "하나의 입력 feature와 label의 관계를 학습하는 가장 단순한 형태다.",
      "정답 label이 전혀 없는 데이터에서만 사용할 수 있다.",
      "입력 차원과 관계없이 출력 범주가 하나라는 뜻이다.",
      "모델 평가 없이 한 번만 학습하는 방법이다.",
    ],
    answer: 0,
    explanation: "단일 피처 기반 학습에서 ‘단일’은 입력 feature의 수가 하나라는 의미다. label의 유무나 학습 횟수를 뜻하지 않는다.",
    hint: "단일이라는 말이 입력 feature, 출력 label, 학습 횟수 중 무엇을 수식하는지 본다.",
  },
  "ai-ml-easy-021": {
    prompt: "교육연수로 소득을 예측하는 단일 피처 회귀에서 feature와 label을 올바르게 연결한 것은?",
    options: [
      "feature=교육연수, label=소득",
      "feature=소득, label=교육연수만 가능",
      "feature=회귀계수, label=교육연수",
      "feature=오차항, label=모델 이름",
    ],
    answer: 0,
    explanation: "모델에 입력하는 교육연수가 feature이고 모델이 예측해야 하는 소득이 label이다.",
    hint: "모델에 주어지는 값과 모델이 맞혀야 하는 값을 구분한다.",
  },
  "ai-ml-easy-025": {
    prompt: "선형회귀가 지도학습의 기초 모델로 널리 사용되는 이유로 가장 적절한 것은?",
    options: [
      "입력과 연속형 출력의 관계를 비교적 단순한 식으로 표현해 예측과 계수 해석에 활용할 수 있기 때문이다.",
      "모든 비선형 관계를 오차 없이 표현할 수 있기 때문이다.",
      "정답 label이 없어도 분류 정확도를 자동 계산하기 때문이다.",
      "입력 feature 수와 관계없이 항상 같은 예측값을 내기 때문이다.",
    ],
    answer: 0,
    explanation: "선형회귀는 구조가 단순하고 계수의 의미를 해석하기 쉬워 연속형 예측의 기본 모델과 비교 기준으로 유용하다.",
    hint: "모델의 단순성, 예측 가능성, 계수 해석 가능성을 함께 만족하는 보기를 찾는다.",
  },
  "ai-ml-easy-026": {
    prompt: "선형회귀의 장점을 가장 적절하게 설명한 것은?",
    options: [
      "연속형 예측에 사용할 수 있고 각 입력 변수의 계수를 통해 평균적인 관계를 해석할 수 있다.",
      "출력이 항상 0과 1 사이이므로 모든 이진 분류에 완벽하다.",
      "복잡한 비선형 관계도 feature 변환 없이 항상 정확히 표현한다.",
      "훈련 데이터가 없어도 계수를 자동으로 결정한다.",
    ],
    answer: 0,
    explanation: "선형회귀는 연속형 값을 예측하며 계수를 통해 입력과 출력의 평균적인 관계를 해석할 수 있다는 장점이 있다.",
    hint: "선형회귀의 출력 형태와 계수가 제공하는 정보를 확인한다.",
  },
  "ai-ml-easy-027": {
    prompt: "선형회귀를 적용하기에 가장 적절한 사례는?",
    options: [
      "광고비를 입력으로 사용해 연속형 매출액을 예측하고 두 변수의 평균적인 관계를 분석한다.",
      "정답 없이 고객을 구매 성향별 군집으로 나눈다.",
      "이메일을 스팸과 정상 두 범주로만 분류한다.",
      "문장의 다음 토큰을 반복 생성한다.",
    ],
    answer: 0,
    explanation: "광고비로 연속형 매출액을 예측하는 문제는 선형회귀의 대표적인 적용 사례다.",
    hint: "예측 대상이 연속적인 수치인 사례를 찾는다.",
  },
  "ai-ml-easy-028": {
    prompt: "고객의 소득과 소비 패턴을 이용해 신용점수를 예측한다. 이 문제를 회귀로 볼 수 있는 조건은?",
    options: [
      "신용점수가 연속적인 수치로 주어지고 그 값을 예측할 때",
      "고객을 정답 없이 여러 집단으로만 묶을 때",
      "신용점수를 높음·낮음 범주로만 구분할 때",
      "입력 데이터를 사용하지 않고 평균값만 출력할 때",
    ],
    answer: 0,
    explanation: "예측하려는 신용점수가 연속형 수치라면 회귀 문제다. 범주를 예측한다면 분류 문제로 보아야 한다.",
    hint: "입력 변수보다 예측 대상 label의 형태를 먼저 확인한다.",
  },
  "ai-ml-easy-030": {
    prompt: "광고비와 매출의 선형 관계가 얼마나 강한지 평가할 때 함께 살펴볼 수 있는 것은?",
    options: [
      "회귀계수의 크기·불확실성과 모델의 설명력",
      "label을 제거했을 때 생기는 군집의 개수만",
      "feature 이름의 글자 수와 정렬 순서",
      "신경망 은닉층의 개수만",
    ],
    answer: 0,
    explanation: "관계의 방향과 크기는 회귀계수로, 추정의 불확실성과 모델 설명력은 표준오차·검정·R² 등의 정보로 함께 판단할 수 있다.",
    hint: "관계의 크기와 모델이 데이터를 설명하는 정도를 나타내는 회귀 정보를 찾는다.",
  },
  "ai-ml-easy-031": {
    prompt: "TV·라디오·신문 광고비를 함께 사용해 매출을 예측할 때 각 매체의 평균적인 기여를 비교하는 데 직접 활용되는 것은?",
    options: [
      "다른 매체의 광고비를 고정했을 때 각 변수의 회귀계수",
      "매체 이름을 알파벳순으로 정렬한 결과",
      "정답 label을 삭제한 뒤 얻은 클러스터 번호",
      "훈련 데이터의 행 순서",
    ],
    answer: 0,
    explanation: "다중선형회귀의 각 계수는 다른 입력 변수를 고정했을 때 해당 광고비가 한 단위 변함에 따른 평균 매출 변화량을 나타낸다.",
    hint: "다른 입력을 고정한 상태에서 한 변수의 변화 효과를 나타내는 값을 찾는다.",
  },
  "ai-ml-easy-032": {
    prompt: "과거 광고비와 매출 데이터로 학습한 회귀 모델의 일반적인 사용 목적은?",
    options: [
      "새로운 광고비 계획이 주어졌을 때 예상 매출을 예측한다.",
      "미래 데이터의 정답을 학습 전에 미리 복사한다.",
      "광고 매체 이름을 새로운 label로 생성한다.",
      "광고비와 매출을 항상 같은 값으로 만든다.",
    ],
    answer: 0,
    explanation: "학습한 회귀식은 새로운 입력값에 대응하는 연속형 출력의 예상값을 예측하는 데 사용한다.",
    hint: "학습한 입력·출력 관계를 처음 보는 입력에 적용하는 보기를 찾는다.",
  },
  "ai-ml-easy-033": {
    prompt: "TV 광고와 라디오 광고를 함께 집행할 때의 효과가 두 광고 효과의 단순한 합보다 달라질 수 있다. 이를 회귀식에 반영하는 항은?",
    options: ["TV×Radio 상호작용항", "절편만 있는 항", "정답 label 제거 항", "군집 중심 항"],
    answer: 0,
    explanation: "한 변수의 효과가 다른 변수 값에 따라 달라지는 시너지는 두 변수를 곱한 상호작용항으로 모델링할 수 있다.",
    hint: "두 입력 변수가 동시에 변할 때 나타나는 추가 효과를 표현하는 항을 찾는다.",
  },
  "ai-ml-easy-057": {
    prompt: "다중선형회귀를 가장 정확하게 설명한 것은?",
    options: [
      "여러 입력 feature를 함께 사용해 하나의 연속형 label을 선형식으로 예측한다.",
      "입력 feature가 하나인 경우에만 사용할 수 있다.",
      "정답 label 없이 관측치를 군집으로 나누는 방법이다.",
      "모든 입력을 신경망 hidden state로 변환하는 방법이다.",
    ],
    answer: 0,
    explanation: "다중선형회귀는 두 개 이상의 입력 변수를 동시에 고려해 연속형 출력값을 예측하는 선형회귀 모델이다.",
    hint: "입력 feature의 수와 출력 label의 형태를 함께 확인한다.",
  },
  "ai-ml-easy-058": {
    prompt: "단순선형회귀와 다중선형회귀의 차이를 올바르게 설명한 것은?",
    options: [
      "단순선형회귀는 입력 feature 하나를, 다중선형회귀는 입력 feature 여러 개를 사용한다.",
      "단순선형회귀는 분류만 하고 다중선형회귀는 군집화만 한다.",
      "두 방법의 차이는 훈련 데이터 행의 개수뿐이다.",
      "다중선형회귀에는 정답 label이 필요하지 않다.",
    ],
    answer: 0,
    explanation: "두 모델 모두 연속형 값을 예측하지만 사용하는 입력 feature의 수가 하나인지 여러 개인지에서 차이가 난다.",
    hint: "출력 유형이 아니라 입력 변수 개수를 비교한다.",
  },
  "ai-ml-easy-089": {
    prompt: "TV와 라디오 광고비를 입력으로 사용해 판매량을 예측하는 다중선형회귀에서 반응변수는?",
    options: ["판매량(Sales)", "TV 광고비", "라디오 광고비", "각 계수의 표준오차"],
    answer: 0,
    explanation: "반응변수는 모델이 예측하려는 출력값이므로 판매량이다. TV와 라디오 광고비는 설명변수다.",
    hint: "모델에 주어지는 두 입력과 모델이 맞혀야 하는 출력값을 구분한다.",
  },
  "week2-easy-mc-001": {
    prompt: "Word2Vec의 CBOW가 학습하는 예측 방향으로 옳은 것은?",
    options: [
      "중심 단어를 입력해 주변 문맥 단어들을 예측한다.",
      "주변 문맥 단어들을 입력해 중심 단어를 예측한다.",
      "이전 hidden state만으로 문장 전체의 label을 생성한다.",
      "정답 문장을 입력해 encoder의 모든 가중치를 고정한다.",
    ],
    answer: 1,
    explanation: "CBOW는 주변 문맥의 표현을 모아 중심 단어를 예측한다. 중심 단어로 주변 단어를 예측하는 방식은 Skip-gram이다.",
    hint: "CBOW와 Skip-gram의 입력과 예측 대상을 서로 바꾸어 생각하지 않는다.",
  },
  "week2-easy-mc-013": {
    prompt: "Seq2Seq의 고정 길이 context vector 병목을 완화하기 위해 Attention이 수행하는 역할은?",
    options: [
      "모든 encoder hidden state에 항상 같은 가중치를 부여한다.",
      "현재 생성 시점과 관련된 encoder hidden state에 더 큰 가중치를 부여한다.",
      "입력 토큰을 모두 제거하고 decoder의 이전 출력만 사용한다.",
      "정답 문장을 하나의 label로 바꾸어 분류 문제로 만든다.",
    ],
    answer: 1,
    explanation: "Attention은 각 생성 시점마다 관련성이 높은 encoder hidden state를 선택적으로 참조해 고정 길이 벡터의 정보 병목을 줄인다.",
    hint: "모든 입력을 동일하게 보는지, 생성 시점에 따라 중요도를 다르게 주는지 구분한다.",
  },
  "week2-easy-mc-023": {
    prompt: "Encoder-Decoder Transformer의 Cross-Attention에서 Q·K·V의 출처를 올바르게 연결한 것은?",
    options: [
      "Q·K·V가 모두 decoder의 masked self-attention 출력에서 나온다.",
      "Q는 encoder에서, K와 V는 decoder에서 나온다.",
      "Q·K·V가 모두 encoder의 입력 embedding에서 나온다.",
      "Q는 decoder에서, K와 V는 encoder 출력에서 나온다.",
    ],
    answer: 3,
    explanation: "Cross-Attention은 decoder의 현재 표현을 Query로 사용하고 encoder의 출력 표현을 Key와 Value로 사용한다.",
    hint: "무엇을 찾는 쪽이 Query이고, 참조할 정보를 제공하는 쪽이 Key·Value인지 구분한다.",
  },
  "week2-easy-mc-035": {
    prompt: "Transformer encoder와 Masked Language Modeling을 중심으로 사전학습하는 대표 모델은?",
    options: ["GPT", "T5", "Word2Vec", "BERT"],
    answer: 3,
    explanation: "BERT는 Transformer encoder 구조를 사용하며 가려진 토큰을 복원하는 Masked Language Modeling으로 양방향 문맥 표현을 학습한다.",
    hint: "encoder-only 구조와 가려진 토큰 복원을 함께 만족하는 모델을 찾는다.",
  },
  "week2-easy-mc-054": {
    prompt: "사람이 선호하는 응답을 모델의 출력 정책에 반영하기 위해 인간 피드백과 강화학습을 결합한 정렬 방법은?",
    options: ["Supervised Fine-Tuning", "Masked Language Modeling", "RLHF", "Beam Search"],
    answer: 2,
    explanation: "RLHF는 인간이 비교한 응답 선호로 보상 모델을 학습하고 그 보상을 이용해 언어 모델의 정책을 조정한다.",
    hint: "지도학습 단계가 아니라 인간 선호와 강화학습을 함께 사용하는 단계를 찾는다.",
  },
  "week2-easy-mc-034": {
    prompt: "Transformer가 RNN의 순차적인 hidden state 전달 대신 시퀀스 관계를 처리하는 핵심 메커니즘은?",
    options: ["Self-Attention", "K-means 중심 재할당", "최소제곱 회귀", "N-gram 통계만 사용"],
    answer: 0,
    explanation: "Transformer는 Self-Attention으로 문장 안 토큰들이 서로를 직접 참조하게 하며 시점별 hidden state 전달에 의존하지 않는다.",
    hint: "토큰 간 관계를 직접 계산하고 병렬 처리를 가능하게 하는 메커니즘을 찾는다.",
  },
  "week2-easy-mc-045": {
    prompt: "파운데이션 모델이 다양한 다운스트림 과제에 활용될 수 있는 일반적인 표현을 학습하기 위해 필요한 학습 데이터의 특징은?",
    options: ["규모가 크고 다양한 데이터", "정답 하나만 반복한 데이터", "단일 샘플로만 구성된 데이터", "평가용 정답을 포함한 테스트 데이터만"],
    answer: 0,
    explanation: "파운데이션 모델은 대규모의 다양한 데이터에서 폭넓은 패턴과 표현을 사전학습한 뒤 여러 과제에 적용된다.",
    hint: "한 과제에만 맞춘 소량 데이터와 여러 과제에 전이할 표현을 학습할 데이터를 비교한다.",
  },
  "week2-easy-mc-046": {
    prompt: "텍스트 파운데이션 모델의 기반 구조로 널리 사용되며 Attention을 중심으로 시퀀스를 처리하는 모델은?",
    options: ["Transformer", "K-nearest neighbors", "단순선형회귀", "K-means"],
    answer: 0,
    explanation: "현대 텍스트 파운데이션 모델은 주로 Attention 기반 Transformer 구조를 사용해 대규모 시퀀스 데이터를 학습한다.",
    hint: "Self-Attention을 핵심 연산으로 사용하는 시퀀스 모델을 찾는다.",
  },
  "week2-easy-mc-052": {
    prompt: "InstructGPT의 RLHF 단계에서 Reward Model의 점수를 이용해 언어 모델 정책을 최적화하는 데 사용된 알고리즘은?",
    options: ["PPO", "Supervised Fine-Tuning", "Masked Language Modeling", "Perplexity"],
    answer: 0,
    explanation: "InstructGPT는 인간 선호를 근사한 Reward Model의 보상을 이용해 PPO로 정책 모델을 최적화한다.",
    hint: "지시 데이터로 지도학습하는 단계가 아니라 보상을 이용해 정책을 갱신하는 알고리즘을 찾는다.",
  },
  "week2-easy-mc-053": {
    prompt: "같은 질문에 대한 여러 후보 응답을 사람이 비교한 결과로 어떤 응답을 더 선호하는지 학습하는 방법은?",
    options: ["Preference learning", "Masked Language Modeling", "Next Token Prediction", "Beam Search"],
    answer: 0,
    explanation: "Preference learning은 후보 응답 사이의 인간 선호 비교를 학습해 응답의 상대적인 선호도를 모델링한다.",
    hint: "정답 토큰 하나가 아니라 두 응답 중 어느 쪽을 더 선호하는지를 학습한다.",
  },
  "week2-easy-mc-055": {
    prompt: "사람이 작성한 지시문과 모범 응답의 쌍을 이용해 사전학습 모델이 지시를 따르도록 지도학습하는 단계는?",
    options: ["Supervised Fine-Tuning (SFT)", "Reward Model 학습", "PPO 정책 최적화", "Top-p Sampling"],
    answer: 0,
    explanation: "SFT는 사람이 작성한 입력-응답 데이터로 지도학습하여 모델이 지시 형식과 기대 응답을 따르도록 조정하는 단계다.",
    hint: "인간 선호 점수나 강화학습 전에 모범 응답을 정답으로 직접 학습하는 단계를 찾는다.",
  },
  "week2-easy-mc-056": {
    prompt: "다양한 NLP 과제를 자연어 instruction 템플릿으로 통일해 학습함으로써 보지 못한 지시에도 대응하도록 만든 instruction tuning 사례는?",
    options: ["FLAN", "BERT의 MLM", "Word2Vec", "Beam Search"],
    answer: 0,
    explanation: "FLAN은 여러 태스크를 자연어 instruction 형식으로 변환해 학습하여 새로운 지시에 대한 일반화 성능을 높인 사례다.",
    hint: "여러 과제를 자연어 지시 형식으로 통합해 학습한 모델을 찾는다.",
  },
  "week2-easy-mc-067": {
    prompt: "생성된 답변의 품질이나 두 답변 사이의 상대적 선호를 다른 거대 언어 모델이 평가하도록 하는 방식은?",
    options: ["LLM-as-judge", "문자열 Exact Match", "ROUGE n-gram 비교", "사람 평가만 사용"],
    answer: 0,
    explanation: "LLM-as-judge는 평가용 언어 모델이 기준에 따라 생성 결과에 점수를 주거나 후보 응답의 우열을 판단하는 방식이다.",
    hint: "생성 모델이 아니라 별도의 언어 모델을 자동 평가자로 사용하는 방식을 찾는다.",
  },
  "week2-easy-mc-073": {
    prompt: "소량의 사람이 만든 seed instruction을 바탕으로 언어 모델이 새로운 instruction과 응답을 생성하고 필터링해 학습 데이터를 확장하는 방법은?",
    options: ["Self-Instruct", "Masked Language Modeling", "Beam Search", "K-means"],
    answer: 0,
    explanation: "Self-Instruct는 적은 수의 seed instruction에서 출발해 모델이 합성 지시 데이터를 생성하도록 하여 instruction tuning 데이터셋을 확장한다.",
    hint: "사람이 모든 지시를 직접 작성하지 않고 모델이 새 지시 데이터를 합성하는 방법을 찾는다.",
  },
  "week2-easy-mc-075": {
    prompt: "이미지를 텍스트 생성 모델이 처리할 수 있도록 시각 정보를 언어 모델의 입력 표현 공간에 연결하는 구성은?",
    options: ["Vision Encoder와 Projection", "Tokenizer와 Greedy Decoding", "ROUGE와 Perplexity", "Reward Model과 PPO"],
    answer: 0,
    explanation: "Vision Encoder가 이미지 특징을 추출하고 Projection 계층이 그 특징을 언어 모델이 사용할 수 있는 표현으로 변환한다.",
    hint: "이미지 특징 추출과 언어 모델 입력 차원 연결을 각각 담당하는 구성을 찾는다.",
  },
};

const WEEK1_QUALITY_QUESTIONS = [
  {
    match: /지도학습과 문제 유형/,
    prompt: "이진 분류 결과가 TP=36, FP=12, FN=4, TN=48일 때 정밀도(precision)는?",
    options: ["0.75", "0.80", "0.90", "0.96"],
    answer: 0,
    explanation: "정밀도는 TP/(TP+FP)이므로 36/(36+12)=0.75이다. FN은 재현율 계산에 사용된다.",
    hint: "정밀도의 분모에는 모델이 양성으로 예측한 TP와 FP가 들어간다.",
  },
  {
    match: /지도학습과 문제 유형/,
    prompt: "실제값이 [2, 4]이고 모델 예측값이 [3, 1]일 때 평균제곱오차(MSE)는?",
    options: ["2", "4", "5", "10"],
    answer: 2,
    explanation: "오차는 1과 -3이고 제곱은 1과 9이다. 두 값을 평균하면 MSE는 5이다.",
    hint: "각 오차를 제곱한 뒤 샘플 수로 나눈다.",
  },
  {
    match: /검증과 일반화/,
    prompt: "하이퍼파라미터 후보 20개를 테스트셋 정확도로 비교해 가장 높은 모델을 선택했다. 이 평가의 핵심 문제는?",
    options: [
      "테스트셋이 모델 선택에 사용되어 최종 성능 추정이 낙관적으로 편향될 수 있다.",
      "훈련셋을 사용하지 않았으므로 과적합이 원천적으로 불가능하다.",
      "후보가 많으면 테스트셋이 자동으로 검증셋과 훈련셋으로 나뉜다.",
      "정확도는 테스트 데이터에서는 정의할 수 없는 지표다.",
    ],
    answer: 0,
    explanation: "테스트셋을 반복적인 모델 선택에 사용하면 테스트 정보에 간접적으로 과적합되어 공정한 최종 평가가 되지 않는다.",
    hint: "최종 시험지를 여러 후보를 고르는 과정에서 반복해서 사용한 상황과 같다.",
  },
  {
    match: /검증과 일반화/,
    prompt: "100개 샘플에 5-겹 교차검증을 적용한다. 각 반복의 학습·검증 샘플 수와 총 학습 횟수로 옳은 것은?",
    options: ["학습 20, 검증 80, 총 5회", "학습 80, 검증 20, 총 5회", "학습 80, 검증 20, 총 1회", "학습 95, 검증 5, 총 20회"],
    answer: 1,
    explanation: "5개 폴드 중 4개인 80개로 학습하고 1개인 20개로 검증하는 과정을 폴드를 바꾸어 5회 수행한다.",
    hint: "한 폴드만 검증에 사용하고 나머지 K-1개 폴드는 학습에 사용한다.",
  },
  {
    match: /비지도학습과 군집화/,
    prompt: "K-means에서 현재 중심이 0과 10이고 관측값이 1, 3, 8, 12일 때 한 번의 할당과 평균 계산 후 새 중심은?",
    options: ["1과 12", "2와 10", "4와 6", "5와 5"],
    answer: 1,
    explanation: "1과 3은 중심 0에, 8과 12는 중심 10에 배정된다. 각 집단 평균은 2와 10이다.",
    hint: "먼저 가까운 중심에 배정한 뒤 각 집단 값의 평균을 계산한다.",
  },
  {
    match: /비지도학습과 군집화/,
    prompt: "두 클러스터 A={1, 4}, B={8, 10}의 거리를 single linkage와 complete linkage로 계산한 값은?",
    options: ["single=4, complete=9", "single=7, complete=6", "single=6, complete=7", "single=9, complete=4"],
    answer: 0,
    explanation: "클러스터 사이 쌍별 거리는 7, 9, 4, 6이다. 최솟값인 single linkage는 4, 최댓값인 complete linkage는 9이다.",
    hint: "single은 가장 가까운 두 점, complete는 가장 먼 두 점을 사용한다.",
  },
  {
    match: /단순선형회귀/,
    prompt: "회귀식이 매출=120+3×광고비이고 광고비 단위가 만 원일 때 기울기 3의 해석으로 가장 적절한 것은?",
    options: [
      "광고비가 1만 원 증가할 때 평균 매출이 약 3만 원 증가한다.",
      "광고비가 3만 원 증가할 때 매출은 항상 정확히 1만 원 증가한다.",
      "광고비가 0이면 모든 기업의 실제 매출이 반드시 120만 원이다.",
      "매출이 1만 원 증가하면 광고비가 원인으로 정확히 3만 원 증가한다.",
    ],
    answer: 0,
    explanation: "기울기는 입력이 한 단위 증가할 때 조건부 평균 출력이 얼마나 변하는지를 나타낸다. 개별 관측값이나 인과관계를 보장하지 않는다.",
    hint: "기울기는 X가 한 단위 변할 때 예측되는 Y의 평균 변화량이다.",
  },
  {
    match: /다중선형회귀/,
    prompt: "다중선형회귀에서 다른 변수를 고정한 채 면적 계수가 2.5로 추정되었다. 올바른 해석은?",
    options: [
      "다른 설명변수가 같을 때 면적이 한 단위 증가하면 예측값이 평균 2.5 증가한다.",
      "면적이 한 단위 증가하면 다른 변수도 반드시 2.5 증가한다.",
      "면적과 출력 사이에 인과관계가 100% 증명되었다.",
      "면적 계수가 양수이므로 테스트 오류는 항상 0이다.",
    ],
    answer: 0,
    explanation: "다중회귀 계수는 다른 설명변수를 고정했을 때 해당 변수가 한 단위 변함에 따른 예측 평균의 변화다.",
    hint: "‘다른 변수를 고정한다’는 조건을 빠뜨리지 않는다.",
  },
  {
    match: /로지스틱 회귀/,
    prompt: "로지스틱 회귀에서 어떤 입력의 logit이 0이라면 양성 확률과 odds는 각각 얼마인가?",
    options: ["확률 0, odds 0", "확률 0.5, odds 1", "확률 1, odds 0.5", "확률 1, odds 1"],
    answer: 1,
    explanation: "logit=log(p/(1-p))가 0이면 odds가 1이고, p/(1-p)=1이므로 p=0.5이다.",
    hint: "로그값이 0이면 로그를 취하기 전의 odds는 1이다.",
  },
  {
    match: /최적화와 역전파/,
    prompt: "현재 파라미터가 4, 손실의 기울기가 -3, 학습률이 0.1일 때 경사하강법으로 한 번 갱신한 파라미터는?",
    options: ["3.7", "4.0", "4.3", "7.0"],
    answer: 2,
    explanation: "갱신식은 새 파라미터=4-0.1×(-3)이므로 4.3이다. 음의 기울기에서는 파라미터가 증가한다.",
    hint: "파라미터에서 학습률과 기울기의 곱을 뺀다.",
  },
];

const WEEK2_QUALITY_QUESTIONS = [
  {
    match: /워드 임베딩과 순환신경망/,
    prompt: "문장 ‘나는 자연어 처리를 공부한다’에서 중심 단어를 ‘처리를’, window size를 1로 두고 CBOW 학습쌍을 만들 때 입력과 정답은?",
    options: ["입력: 자연어·공부한다 / 정답: 처리를", "입력: 처리를 / 정답: 자연어·공부한다", "입력: 나는·공부한다 / 정답: 자연어", "입력: 문장 전체 / 정답: window size"],
    answer: 0,
    explanation: "window size 1에서는 중심 단어 바로 앞뒤인 ‘자연어’와 ‘공부한다’를 입력으로 사용해 중심 단어 ‘처리를’를 예측한다.",
    hint: "CBOW는 문맥을 입력으로 받고 중심 단어를 정답으로 사용한다.",
  },
  {
    match: /워드 임베딩과 순환신경망/,
    prompt: "길이가 긴 문장에서 기본 RNN의 앞부분 정보가 학습되기 어려운 직접적인 원인은?",
    options: [
      "시간 단계마다 같은 가중치가 반복 곱해지며 gradient가 매우 작아지거나 커질 수 있기 때문이다.",
      "RNN은 현재 입력을 사용하지 않고 항상 마지막 token만 입력받기 때문이다.",
      "hidden state가 매 시간 단계마다 정답 label로 교체되기 때문이다.",
      "RNN에는 학습 가능한 파라미터가 전혀 없기 때문이다.",
    ],
    answer: 0,
    explanation: "BPTT 과정에서 반복되는 미분값의 곱이 0에 가까워지면 앞 시점까지 gradient가 전달되지 않는 기울기 소실이 발생한다.",
    hint: "시간축으로 같은 연산의 미분값이 반복해서 곱해지는 상황을 생각한다.",
  },
  {
    match: /워드 임베딩과 순환신경망/,
    prompt: "LSTM에서 이전 cell state의 정보를 얼마나 유지할지 직접 조절하는 gate는?",
    options: ["Input gate", "Forget gate", "Output gate", "Softmax gate"],
    answer: 1,
    explanation: "Forget gate는 이전 cell state의 각 정보를 0에 가깝게 버릴지 1에 가깝게 유지할지 결정한다.",
    hint: "이전 장기 기억을 지우거나 남기는 역할을 찾는다.",
  },
  {
    match: /자연어 생성 모델/,
    prompt: "학습 시에는 정답 이전 토큰을 decoder 입력으로 사용했지만 추론 시에는 모델이 생성한 이전 토큰을 사용한다. 이 차이로 발생할 수 있는 문제는?",
    options: ["노출 편향(exposure bias)", "차원의 저주", "다중공선성", "데이터 누수"],
    answer: 0,
    explanation: "Teacher forcing으로 학습하면 모델이 자신의 잘못된 출력을 다음 입력으로 받는 상황을 충분히 경험하지 못해 추론 중 오류가 누적될 수 있다.",
    hint: "학습 때 본 입력 분포와 실제 생성 때 만나는 입력 분포가 다르다.",
  },
  {
    match: /자연어 생성 모델/,
    prompt: "Beam Search에서 beam size를 1로 설정했을 때의 동작과 가장 가까운 것은?",
    options: ["Greedy Decoding", "Top-p Sampling", "Teacher Forcing", "Masked Language Modeling"],
    answer: 0,
    explanation: "beam size가 1이면 매 시점 가장 확률이 높은 하나의 후보만 유지하므로 Greedy Decoding과 동일하게 동작한다.",
    hint: "각 단계에서 후보를 몇 개 남기는지 확인한다.",
  },
  {
    match: /Transformer/,
    prompt: "Self-Attention에서 Query와 Key의 내적값이 [2, 0]일 때 softmax 전에 모든 값을 같은 양수로 나누면 attention 분포는 어떻게 변하는가?",
    options: ["두 확률의 차이가 줄어 더 완만해진다.", "두 확률의 차이가 커져 더 뾰족해진다.", "두 확률이 항상 정확히 0.5가 된다.", "Value 벡터의 차원이 자동으로 증가한다."],
    answer: 0,
    explanation: "양수로 나누면 logit 차이가 줄어 softmax 분포가 덜 포화되고 더 완만해진다. Scaled Dot-Product Attention이 큰 내적값을 조정하는 이유다.",
    hint: "softmax에 들어가는 두 점수 사이의 간격이 줄어드는지 확인한다.",
  },
  {
    match: /Transformer/,
    prompt: "Decoder가 세 번째 토큰을 생성할 때 Masked Self-Attention으로 참조할 수 있는 위치는?",
    options: ["첫 번째와 두 번째 토큰 및 현재 위치", "네 번째 이후의 미래 토큰만", "encoder의 마지막 토큰만", "입력과 출력의 모든 미래 위치"],
    answer: 0,
    explanation: "causal mask는 현재 위치까지의 토큰만 보게 하고 아직 생성되지 않은 미래 토큰은 attention 대상에서 차단한다.",
    hint: "자동회귀 생성 시점에 실제로 알려져 있는 토큰만 남긴다.",
  },
  {
    match: /사전 학습 기반 언어 모델/,
    prompt: "문장 분류에는 BERT, 조건부 요약에는 T5, 왼쪽 문맥 기반 생성에는 GPT를 사용하려 한다. 구조 연결로 옳은 것은?",
    options: ["BERT=encoder-only, T5=encoder-decoder, GPT=decoder-only", "BERT=decoder-only, T5=encoder-only, GPT=encoder-decoder", "세 모델 모두 encoder-only", "세 모델 모두 decoder-only"],
    answer: 0,
    explanation: "BERT는 양방향 이해에 강한 encoder-only, T5는 입력을 출력으로 변환하는 encoder-decoder, GPT는 자동회귀 생성용 decoder-only 구조다.",
    hint: "이해·변환·생성 과제가 각각 어떤 Transformer 블록을 필요로 하는지 대응한다.",
  },
  {
    match: /거대 언어 모델의 학습/,
    prompt: "InstructGPT 방식의 정렬 절차를 올바른 순서로 나열한 것은?",
    options: ["사전학습 → SFT → 인간 선호 수집·Reward Model 학습 → PPO 정책 최적화", "SFT → 사전학습 → PPO → tokenization", "Reward Model 학습 → 사전학습 → SFT → 임베딩 제거", "PPO → 인간 선호 수집 → 사전학습 → SFT"],
    answer: 0,
    explanation: "먼저 사전학습 모델을 지시 데이터로 SFT하고, 후보 응답의 인간 선호로 Reward Model을 학습한 뒤 PPO로 정책을 조정한다.",
    hint: "기본 언어 능력, 지시 따르기, 선호 점수 학습, 정책 최적화 순서로 본다.",
  },
  {
    match: /거대 언어 모델의 추론/,
    prompt: "temperature를 매우 낮추고 top-k=1로 설정했을 때 생성 결과의 일반적인 특성은?",
    options: ["결정적이고 반복 가능성이 높아진다.", "낮은 확률 토큰이 더 자주 선택되어 다양성이 커진다.", "모든 토큰이 같은 확률로 선택된다.", "모델의 파라미터가 매 토큰마다 다시 학습된다."],
    answer: 0,
    explanation: "낮은 temperature는 분포를 뾰족하게 만들고 top-k=1은 최고 확률 토큰 하나만 남기므로 greedy decoding에 가까워진다.",
    hint: "후보가 하나만 남을 때 무작위 선택의 여지가 있는지 판단한다.",
  },
  {
    match: /거대 언어 모델의 추론/,
    prompt: "다음 토큰 확률이 A=0.50, B=0.25, C=0.15, D=0.10일 때 top-p=0.70이 선택 후보로 남기는 최소 집합은?",
    options: ["A만", "A와 B", "A·B·C", "A·B·C·D"],
    answer: 1,
    explanation: "확률이 큰 순서로 누적하면 A만으로는 0.50이고 A+B는 0.75이므로 처음으로 0.70 이상이 되는 A와 B를 남긴다.",
    hint: "확률이 큰 토큰부터 더해 누적확률이 p를 처음 넘는 지점에서 멈춘다.",
  },
  {
    match: /거대 언어 모델의 평가와 응용/,
    prompt: "두 요약문이 의미는 거의 같지만 사용한 단어가 많이 다르다. ROUGE 점수는 낮고 BERTScore는 높게 나올 수 있는 이유는?",
    options: ["ROUGE는 표면적인 n-gram 중첩을, BERTScore는 문맥 임베딩 유사도를 주로 보기 때문이다.", "ROUGE는 사람 선호만 측정하고 BERTScore는 학습 시간만 측정하기 때문이다.", "두 지표 모두 문자열이 다르면 항상 0이기 때문이다.", "BERTScore는 정답 문장을 전혀 사용하지 않기 때문이다."],
    answer: 0,
    explanation: "표현이 달라도 의미가 비슷하면 문맥 임베딩 기반 BERTScore는 높을 수 있지만 문자열 중첩 기반 ROUGE는 낮을 수 있다.",
    hint: "각 지표가 문자열 겹침과 의미 유사성 중 무엇을 비교하는지 구분한다.",
  },
];

function applyDirectRewrites(bank) {
  return Object.fromEntries(Object.entries(bank).map(([difficulty, questions]) => [
    difficulty,
    questions.map((question) => {
      const replacement = DIRECT_QUESTION_REWRITES[question.id];
      return replacement ? replaceQuestionContent(question, replacement) : question;
    }),
  ]));
}

function applyQualityQuestions(bank, replacements) {
  const used = new Set();
  return Object.fromEntries(Object.entries(bank).map(([difficulty, questions]) => [
    difficulty,
    questions.map((question) => {
      if (difficulty !== "hard" || question.questionType !== "multiple-choice") return question;
      const replacementIndex = replacements.findIndex((candidate, index) =>
        !used.has(index) && candidate.match.test(question.category),
      );
      if (replacementIndex < 0) return question;
      used.add(replacementIndex);
      const { match: _match, ...replacement } = replacements[replacementIndex];
      return replaceQuestionContent(question, replacement);
    }),
  ]));
}

function rewriteWeakWeek2EasyPrompts(bank) {
  const stems = [
    "다음 설명이 가리키는 개념으로 가장 적절한 것은?",
    "다음 특성과 가장 정확하게 연결되는 항목은?",
    "다음 동작 또는 역할에 해당하는 항목은?",
    "다음 설명을 만족하는 개념을 고르시오.",
    "다음 조건에 부합하는 항목으로 가장 적절한 것은?",
  ];
  const removableStem = /^(?:(?:다음 설명에 해당하는 개념을 고르시오\.|정의에 비추어 빈칸에 들어갈 개념을 고르시오\.|설명과 올바르게 연결되는 항목을 고르시오\.|다음 역할 또는 특징을 수행하는 개념은\?|다음 핵심 설명이 가리키는 개념은\?|다음 설명이 가리키는 개념으로 가장 적절한 것은\?|다음 특성과 가장 정확하게 연결되는 항목은\?|다음 동작 또는 역할에 해당하는 항목은\?|다음 설명을 만족하는 개념을 고르시오\.|다음 조건에 부합하는 항목으로 가장 적절한 것은\?|다음 문장을 가장 정확하게 만족하는 용어·기법은\?|다음 특징을 가진 항목은 무엇인가\?|다음 역할 또는 성질을 나타내는 개념은\?)\s*)+/;
  return {
    ...bank,
    easy: bank.easy.map((question, index) => {
      if (question.questionType !== "multiple-choice" || DIRECT_QUESTION_REWRITES[question.id]) return question;
      const body = question.prompt.replace(removableStem, "").trim();
      return { ...question, prompt: `${stems[index % stems.length]} ${body}` };
    }),
  };
}

function improveGuidance(bank) {
  let questionIndex = 0;
  return Object.fromEntries(Object.entries(bank).map(([difficulty, questions]) => [
    difficulty,
    questions.map((question) => {
      questionIndex += 1;
      const guide = guideFor(question);
      const next = { ...question };
      const hasWeakHint = /(해당 용어의 정의|핵심 개념의 정의|문제에 제시된 변수|문장을 떠올린다|대표 용어다|두 설명을 각각 독립적으로|각 설명을 한 개씩|각 용어를 설명과 하나씩|정의나 역할을 떠올린다|정확한 용어·수식·수치를 떠올린다|정답 라벨의 유무|나머지 세 보기가|정의와 사례에서|두 문장을 하나씩|절대적인 표현이나|상황에 사용된 데이터|두 정의의 정답|③의 주어와|설명에서 .*을 나타내는 핵심 표현|을 기준으로 선택지를 좁힌다|용어만 나열하지 말고|다음 요소를 먼저 정의하고)/.test(next.hint ?? "");
      if (hasWeakHint) {
        if (question.questionType === "multiple-choice") {
          const prefixes = difficulty === "easy"
            ? ["핵심 동작을 먼저 찾는다.", "입력과 출력을 구분한다.", "비슷한 용어의 역할을 대조한다."]
            : difficulty === "medium"
              ? ["각 조건을 따로 판별한 뒤 조합한다.", "두 설명의 주어와 동작을 각각 확인한다.", "개념 간 차이가 드러나는 조건부터 판단한다."]
              : ["선택지의 두 연결을 각각 검증한다.", "정의뿐 아니라 정보 흐름과 결과까지 확인한다.", "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다."];
          next.hint = `${prefixes[questionIndex % prefixes.length]} 다음 기준을 사용해 선택지를 좁힌다: ${guide.clue}.`;
        } else if (question.questionType === "short-answer") {
          next.hint = `설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: ${guide.clue}. 답은 정확한 용어 또는 식으로 작성한다.`;
        } else {
          const required = (next.rubricKeywords ?? []).join(", ");
          next.hint = `다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: ${required || guide.clue}.`;
        }
      }

      if (question.questionType === "multiple-choice" && /근거는 다음과 같다:/.test(next.explanation ?? "")) {
        const correct = next.options[next.answer];
        next.explanation = `정답은 "${correct}"이다. ${guide.rationale}`;
      }
      if (question.questionType === "multiple-choice" && (/^(①과 ②는 옳고 ③은|\(가\)는 옳고, \(나\)는)/.test(next.explanation ?? "") || /각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다\.$/.test(next.explanation ?? ""))) {
        const correct = next.options[next.answer];
        const concept = concepts.find(({ id }) => id === next.conceptId);
        const rationale = concept
          ? `${concept.term}은 ${concept.definition}이다.`
          : guide.rationale;
        next.explanation = `정답은 "${correct}"이다. ${rationale} 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.`;
      }
      if (question.questionType === "essay" && (/(단원의 핵심 개념과 관계를 포함해야 한다\.|모범답안은 문제에서 요구한 개념을 정의한 뒤 작동 원리와 결과를 연결해야 한다\.)$/.test(next.explanation ?? "") || /^모범답안에서는 .*을 빠짐없이 연결해야 한다\./.test(next.explanation ?? ""))) {
        const required = (next.rubricKeywords ?? []).join(", ");
        next.explanation = `모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: ${required || "요구된 핵심 개념"}. ${guide.rationale}`;
      }
      return next;
    }),
  ]));
}

function rebalanceAnswers(bank) {
  let multipleChoiceIndex = 0;
  return Object.fromEntries(Object.entries(bank).map(([difficulty, questions]) => [
    difficulty,
    questions.map((question) => {
      if (question.questionType !== "multiple-choice") return question;
      const targetAnswer = multipleChoiceIndex % 4;
      multipleChoiceIndex += 1;
      const currentAnswer = question.answer;
      if (currentAnswer === targetAnswer) return question;
      const options = [...question.options];
      [options[currentAnswer], options[targetAnswer]] = [options[targetAnswer], options[currentAnswer]];
      return { ...question, options, answer: targetAnswer };
    }),
  ]));
}

function assertPreservedStructure(before, after, label) {
  for (const difficulty of ["easy", "medium", "hard"]) {
    const original = before[difficulty];
    const improved = after[difficulty];
    if (original.length !== improved.length) {
      throw new Error(`${label} ${difficulty}: 문항 수가 변경되었습니다.`);
    }
    original.forEach((question, index) => {
      const next = improved[index];
      for (const key of ["id", "conceptId", "difficulty", "category", "questionType"]) {
        if (question[key] !== next[key]) {
          throw new Error(`${label} ${question.id}: ${key} 구조가 변경되었습니다.`);
        }
      }
    });
  }
}

function improveBank(bank, week) {
  let improved = Object.fromEntries(Object.entries(bank).map(([difficulty, questions]) => [
    difficulty,
    questions.map(sanitizeQuestion),
  ]));
  improved = applyDirectRewrites(improved);
  if (week === "week2") improved = rewriteWeakWeek2EasyPrompts(improved);
  improved = applyQualityQuestions(
    improved,
    week === "week1" ? WEEK1_QUALITY_QUESTIONS : WEEK2_QUALITY_QUESTIONS,
  );
  improved = improveGuidance(improved);
  improved = rebalanceAnswers(improved);
  return improved;
}

function serializeBank(bank, title) {
  return `// ${title}\n// 지정된 출제 범위만 사용한 자기완결형 SSAFY 과목평가 대비 문제은행\n// 난이도별 100문제: 객관식 75 + 단답형 15 + 서술형 10\n\nexport type StudyDifficulty = "easy" | "medium" | "hard";\n\nexport type StudyQuestionType =\n  | "multiple-choice"\n  | "short-answer"\n  | "essay";\n\nexport interface StudyQuestion {\n  id: string;\n  conceptId: string;\n  difficulty: StudyDifficulty;\n  category: string;\n  questionType: StudyQuestionType;\n  prompt: string;\n  code?: string;\n  options: string[];\n  answer: number | null;\n  acceptedAnswers?: string[];\n  modelAnswer?: string;\n  rubricKeywords?: string[];\n  minLength?: number;\n  explanation: string;\n  hint: string;\n}\n\nexport const QUESTION_BANK: Record<StudyDifficulty, StudyQuestion[]> = ${JSON.stringify(bank, null, 2)};\n\nexport const ALL_QUESTIONS: StudyQuestion[] = Object.values(QUESTION_BANK).flat();\n`;
}

try {
  const week1Module = await server.ssrLoadModule(
    "/src/data/questionBanks/week1AiMlQuestions.ts",
  );
  const week2Module = await server.ssrLoadModule(
    "/src/data/questionBanks/week2NlpFoundationQuestions.ts",
  );
  const week1 = improveBank(week1Module.QUESTION_BANK, "week1");
  const week2 = improveBank(week2Module.QUESTION_BANK, "week2");

  assertPreservedStructure(week1Module.QUESTION_BANK, week1, "1주차");
  assertPreservedStructure(week2Module.QUESTION_BANK, week2, "2주차");

  await writeFile(
    "src/data/questionBanks/week1AiMlQuestions.ts",
    serializeBank(week1, "AI Python 1주차 - AI와 기계학습"),
    "utf8",
  );
  await writeFile(
    "src/data/questionBanks/week2NlpFoundationQuestions.ts",
    serializeBank(week2, "AI Python 2주차 - 자연어 처리와 텍스트 파운데이션 모델"),
    "utf8",
  );
} finally {
  await server.close();
}
