import type { ReactNode } from "react";

export const MONTHLY_REST_API_SUBJECT = "디버깅(REST API)";

const REST_API_1 = "https://project.ssafy.com/practice/user/course/CS00002819/home/chapter/CT00023008";
const REST_API_2 = "https://project.ssafy.com/practice/user/course/CS00002819/home/chapter/CT00023009";

const checklist: ReactNode[] = [
  "공식 예시 문항으로 프로젝트 열기, 실행, 저장, 제출 절차를 확인했습니다.",
  "문제마다 HTTP 메서드·URL·요청 본문·응답 형식을 먼저 읽었습니다.",
  "정상 요청과 오류 요청을 Postman에서 각각 확인했습니다.",
  "수정한 곳에 짧은 주석을 남기고, 제출 파일을 직접 열어 작성 내용이 들어 있는지 확인했습니다.",
  <>제출 전 <code>python manage.py runserver</code>로 서버가 정상 실행되는지 확인했습니다.</>,
];

function practiceHref(chapter: string, practice: string) {
  const from = encodeURIComponent(new URL(chapter).pathname);
  return `${chapter}/practice/${practice}?from=${from}`;
}

function GuideTable({ headings, rows }: { headings: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-violet-100">
      <table className="w-full min-w-[24rem] border-collapse text-left">
        <thead className="bg-violet-50 text-violet-950">
          <tr>
            {headings.map((heading) => (
              <th key={heading} scope="col" className="px-3 py-2 font-bold">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-violet-100 bg-white">
          {rows.map(([heading, ...cells], index) => (
            <tr key={index}>
              <th scope="row" className="px-3 py-2 align-top font-bold text-slate-900">{heading}</th>
              {cells.map((cell, column) => <td key={column} className="px-3 py-2 align-top">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GuideTopic({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="space-y-3 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-lg font-black text-violet-950">{title}</h3>
      {children}
    </article>
  );
}

function PracticeLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="font-semibold text-violet-800 underline underline-offset-2">{children}</a>;
}

export default function MonthlyRestApiGuide() {
  return (
    <div className="space-y-8 text-sm leading-7 text-slate-700 [&_code]:break-words [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:text-slate-950 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
      <section aria-labelledby="monthly-assessment-format" className="space-y-3 rounded-2xl border border-violet-100 bg-violet-50 p-5 sm:p-6">
        <h2 id="monthly-assessment-format" className="text-lg font-black text-violet-950">평가 안내</h2>
        <GuideTable headings={["항목", "내용"]} rows={[
          ["일시", "2026년 11월 23일(월) 10:00~12:00"],
          ["평가 방식", "코드베이스 실습형(Quest) · 코드 작성 9문제, 서술형 2문제"],
          ["시험 범위", "DRF 수업 전 범위. DRF에서 사용하는 Django 모델·뷰, QuerySet과 단축 함수도 함께 복습합니다."],
          ["평가 도구", <strong>Postman 사용 필수</strong>],
        ]} />
      </section>

      <section aria-labelledby="monthly-assessment-types" className="space-y-4">
        <h2 id="monthly-assessment-types" className="text-2xl font-black text-slate-950">시험 전 복습 유형</h2>
        <p>아래는 공식 범위와 10·11차 실습을 바탕으로 정리한 <strong>시험 전 복습 유형</strong>입니다. 메서드, URL, 입력값, 출력 필드와 상태 코드는 각 문제 지문에서 확인하세요.</p>

        <GuideTopic title="1. URL과 요청 흐름">
          <p>REST API에서는 URL로 대상을 정하고 HTTP 메서드로 그 대상에 무엇을 할지 표현합니다. 예를 들어 <code>GET /api/v1/todos/7/</code>은 7번 Todo를 조회합니다.</p>
          <ul>
            <li><code>urls.py → views.py → Model·QuerySet → Serializer → Response</code> 순서로 요청을 추적합니다. URL의 <code>{"<int:todo_pk>"}</code>와 뷰의 매개변수 이름을 맞추고, <code>@api_view</code>의 허용 메서드를 확인합니다.</li>
            <li>주소의 PK는 조회 대상을, <code>request.query_params</code>는 조회 조건을, <code>request.data</code>는 POST·PUT 등에서 보낸 요청 본문을 읽는 데 사용합니다.</li>
          </ul>
        </GuideTopic>

        <GuideTopic title="2. 목록·상세·조건 조회">
          <ul>
            <li><code>all()</code>과 <code>filter()</code>는 QuerySet을 반환합니다. 목록을 직렬화할 때는 <code>many=True</code>를 사용하고, 상세 조회에서는 객체 한 개를 전달합니다.</li>
            <li>상세 객체가 없을 때 404가 필요하면 <code>get_object_or_404(Model, pk=값)</code>을 사용합니다. 목록 결과가 없을 때 빈 배열과 404 중 무엇을 반환할지는 지문을 확인합니다. <code>get_list_or_404()</code>는 결과가 비면 404로 이어집니다.</li>
            <li>같은 모델도 목록과 상세의 출력 필드가 다를 수 있습니다. 응답이 200이어도 JSON의 형태와 필드를 확인합니다.</li>
          </ul>
        </GuideTopic>

        <GuideTopic title="3. 생성·수정·삭제와 입력 검증">
          <GuideTable headings={["작업", "코드 흐름", "대표 응답"]} rows={[
            ["생성", <><code>Serializer(data=request.data)</code> → <code>is_valid(raise_exception=True)</code> → <code>save()</code></>, "201"],
            ["수정", <><code>Serializer(instance, data=request.data)</code> → 검증 → 저장</>, "200"],
            ["삭제", <>대상 조회 → <code>delete()</code> → 본문 없는 응답</>, "204"],
          ]} />
          <ul>
            <li>수정할 때 기존 객체를 빠뜨리면 새 레코드가 생길 수 있습니다. 14기 연습에서 <code>ModelForm</code>에 <code>instance=todo</code>를 넘겼던 것과 같은 원리입니다. 수정 후 같은 PK를 다시 조회하세요.</li>
            <li>2943번은 <code>agency</code>와 <code>is_group</code>만 수정합니다. 수정용 serializer에 허용 필드를 명시하고, 이름과 데뷔일이 유지되는지 확인합니다. 필수 필드를 일부 생략할 수 있는지는 지문에 맞춰 <code>partial=True</code> 적용을 판단합니다.</li>
          </ul>
        </GuideTopic>

        <GuideTopic title="4. N:1 관계 데이터 생성">
          <ul>
            <li>Todo 한 개에 추천 여러 개를 연결하는 경우, 자식인 Recommend 모델에 Todo를 참조하는 <code>ForeignKey</code>를 둡니다.</li>
            <li>부모는 URL의 PK로 조회합니다. 요청 본문의 <code>content</code>를 검증한 뒤 <code>serializer.save(todo=todo)</code>로 확인한 부모를 연결합니다. URL에서 부모를 정하는 실습에서는 serializer의 <code>todo</code>를 읽기 전용으로 설정합니다.</li>
            <li>정상 입력은 201, 존재하지 않는 부모는 404, 필수 입력이 빠졌을 때는 400을 각각 확인합니다.</li>
          </ul>
        </GuideTopic>

        <GuideTopic title="5. 역참조와 응답 필드 구성">
          <ul>
            <li>부모에서 자식 목록을 조회할 땐 <code>todo.recommend_set.all()</code> 같은 역참조를 사용합니다. 모델에 <code>related_name</code>이 지정돼 있으면 그 이름을 사용합니다.</li>
            <li>부모 상세 응답에 자식 목록을 넣을 땐 중첩 serializer에 <code>many=True, read_only=True</code>를 지정합니다. 관계 이름이 맞고 해당 필드가 응답에 포함되는지 확인합니다.</li>
            <li>개수에는 <code>review_set.count()</code>나 <code>annotate()</code>와 <code>Count()</code>를, 계산한 필드에는 <code>SerializerMethodField</code>를 복습합니다. 2947번에서는 도서 상세의 리뷰 목록·개수와 리뷰 목록의 도서 ISBN을 대조합니다.</li>
          </ul>
        </GuideTopic>
      </section>

      <section aria-labelledby="monthly-assessment-review-notes" className="space-y-4">
        <h2 id="monthly-assessment-review-notes" className="text-2xl font-black text-slate-950">시험 전 정리</h2>
        <GuideTopic title="먼저 풀 실습">
          <p><PracticeLink href={REST_API_1}>10차 REST API 1</PracticeLink> · <PracticeLink href={REST_API_2}>11차 REST API 2</PracticeLink></p>
          <GuideTable headings={["순서", "실습", "Postman으로 확인할 동작"]} rows={[
            [1, <PracticeLink href={practiceHref(REST_API_2, "PR00175759")}>3067 · Postman 요청</PracticeLink>, <>초기 데이터를 넣고 <code>GET /api/v1/todos/</code>에서 200과 JSON 배열을 확인합니다.</>],
            [2, "2942 · 가수 정보 조회", "목록과 상세가 반환하는 JSON 구조와 필드의 차이를 비교합니다."],
            [3, <PracticeLink href={practiceHref(REST_API_1, "PR00175746")}>2943 · 가수 수정·삭제</PracticeLink>, "수정 허용 필드만 바뀌었는지 확인하고, DELETE 이후 다시 조회합니다."],
            [4, "3068 · Todo CRUD", "목록 GET·POST와 상세 DELETE를 실습하며 응답 코드를 확인합니다."],
            [5, <PracticeLink href={practiceHref(REST_API_2, "PR00175761")}>3069 · Todo와 추천 1:N</PracticeLink>, <><code>{"POST /api/v1/todos/<todo_pk>/recommends/"}</code>로 추천을 만들고, Todo 상세의 추천 목록을 확인합니다.</>],
            [6, "2947 · 도서·리뷰 응답", "도서 상세의 리뷰 목록·개수와 리뷰 목록의 ISBN을 확인합니다."],
          ]} />
          <p>이어서 <strong>2944번 조건 조회</strong>, <strong>2949·2951번 관계 저장과 수정</strong>을 복습합니다. 교안의 OpenAPI에서는 경로·메서드·입력·응답 구조를 읽는 연습을 합니다.</p>
        </GuideTopic>

        <GuideTopic title="Postman 요청과 오류 진단">
          <ol>
            <li>지문에 안내된 의존성과 초기 데이터를 준비하고 <code>python manage.py runserver</code>를 실행합니다.</li>
            <li>Postman에서 메서드와 URL을 선택합니다. POST·PUT에서 JSON이 필요하면 <strong>Body → raw → JSON</strong>을 선택합니다.</li>
            <li>3069번의 추천 생성 본문은 <code>{'{"content":"먼저 복습하세요."}'}</code>처럼 작성합니다. URL에는 실제 Todo의 PK를 넣고, 201이 나오면 Todo 상세를 다시 조회합니다.</li>
          </ol>
          <GuideTable headings={["증상", "먼저 확인할 곳"]} rows={[
            ["400", "요청 JSON 형식과 serializer의 필수 입력"],
            ["404", "URL 경로와 실제 존재하는 PK"],
            ["405", <>요청 메서드와 <code>@api_view</code>에 등록된 메서드</>],
            ["415", <>요청 본문 형식과 <code>Content-Type</code></>],
            ["500", "터미널 traceback에 찍힌 예외와 내 코드의 줄 번호"],
            ["200인데 결과가 다름", <>QuerySet의 조건과 serializer의 출력 필드·<code>many=True</code></>],
          ]} />
        </GuideTopic>

        <GuideTopic title="서술형 자가 점검">
          <ul>
            <li>목록에 <code>many=True</code>가 필요한 이유와 상세 응답의 형태를 설명해 보세요.</li>
            <li>수정 요청 뒤 새 레코드가 생겼다면 serializer의 어느 인자를 확인해야 하는지 설명해 보세요.</li>
            <li>부모 필드를 읽기 전용으로 두면서도 추천을 올바른 Todo에 연결하는 방법을 설명해 보세요.</li>
          </ul>
          <p>답안은 <strong>재현한 증상 → 원인 → 수정 방법 → Postman에서 확인한 결과</strong> 순서로 쓰는 연습을 하세요.</p>
        </GuideTopic>
      </section>

      <section aria-labelledby="monthly-assessment-checklist" className="space-y-3 rounded-2xl border border-violet-100 bg-violet-50 p-5 sm:p-6">
        <h2 id="monthly-assessment-checklist" className="text-lg font-black text-violet-950">복습 체크리스트</h2>
        {checklist.map((item, index) => (
          <label key={index} className="flex items-start gap-2.5">
            <input type="checkbox" className="mt-1.5 size-4 shrink-0 accent-violet-700" />
            <span>{item}</span>
          </label>
        ))}
      </section>
    </div>
  );
}
