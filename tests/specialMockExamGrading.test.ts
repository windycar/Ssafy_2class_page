import assert from "node:assert/strict";
import test from "node:test";
import { SPECIAL_MOCK_EXAM_BANKS as DJANGO_BANKS } from "../src/data/모의고사/8회차/index.ts";
import { gradeSpecialMockExamResponse as grade } from "../src/utils/specialMockExamGrading.ts";
import { SPECIAL_MOCK_EXAM_COLLECTIONS } from "../src/data/모의고사/index.ts";

const DJANGO_MOCK_ESSAYS = Object.values(DJANGO_BANKS).flat().filter((q) => q.questionType === "essay");
const [session, redirect, instance, signup, customUser] = DJANGO_MOCK_ESSAYS;

test("8회차 서술형 5개의 원래 모범 답안과 30자 조건을 유지한다", () => {
  for (const question of DJANGO_MOCK_ESSAYS) {
    assert.equal(grade(question, question.modelAnswer!).correct, true, question.id);
    assert.equal(grade(question, "").correct, false);
    assert.equal(grade(question, "설명").correct, false);
    // Even a factually complete response must still meet the original limit.
    const longerMinimum = { ...question, minLength: question.modelAnswer!.length + 1 };
    assert.equal(grade(longerMinimum, question.modelAnswer!).correct, false);
  }
});

test("키워드 나열과 모범 답안 뒤에 틀렸다는 설명을 섞은 답안은 거부한다", () => {
  for (const question of DJANGO_MOCK_ESSAYS) {
    const keywords = question.rubricKeywords!.join(" / ").repeat(3);
    assert.equal(grade(question, keywords).correct, false, question.id);
    assert.equal(
      grade(question, question.modelAnswer + " 하지만 위 설명은 모두 틀렸으며 반대로 처리해야 한다.").correct,
      false,
      question.id,
    );
  }
});

test("세션 저장 위치와 ID 전달 관계가 맞으면 다른 표현도 인정한다", () => {
  for (const response of [
    "실제 세션 데이터는 DB에 보관한다. 브라우저의 쿠키에는 세션 식별자를 저장한다. 매 요청에서 이 쿠키를 서버로 전달하여 사용자를 확인한다.",
    "서버에 세션 정보를 저장하고 브라우저 쿠키에는 세션 키를 보관한다. 이후 요청마다 쿠키를 서버로 보내 로그인 상태를 확인한다.",
    "세션 데이터는 쿠키에 저장하지 않고 서버 DB에 저장하며, 세션 ID는 브라우저 쿠키에 보관한다. 요청 시 쿠키를 서버로 전송하고 서버가 세션을 조회한다.",
    "세션은 서버 DB에 저장되고 브라우저는 세션 ID를 쿠키에 관리한다. 요청마다 이 쿠키를 서버에 보내 로그인 상태를 확인한다.",
  ]) assert.equal(grade(session, response).correct, true, response);
});

test("세션과 쿠키를 반대로 설명하거나 필수 과정을 빼면 오답이다", () => {
  for (const response of [
    "세션 데이터는 브라우저 쿠키에 저장하고 세션 ID는 서버 DB에 보관하며 이후 요청에서 실제 데이터를 전송한다.",
    "세션 데이터는 서버 DB에 저장하고 세션 ID는 쿠키에 보관하여 요청을 처리한다.",
    session.modelAnswer + " 세션 데이터는 서버에 저장하지 않는다.",
    session.modelAnswer + " 실제 세션 데이터는 쿠키에 저장한다.",
    session.modelAnswer + " 요청마다 세션 ID 쿠키를 서버로 전송하지 않는다.",
  ]) assert.equal(grade(session, response).correct, false, response);
});

test("POST 성공과 검증 실패의 이유를 각각 확인한다", () => {
  assert.equal(grade(redirect,
    "저장 성공 뒤 redirect로 중복 제출을 방지한다. 검증 실패 시 오류가 있는 폼을 다시 표시하여 입력값을 수정하게 한다.",
  ).correct, true);
  for (const response of [
    "POST redirect 중복 재전송 검증 오류 form 렌더링을 모두 사용한다.",
    "POST 저장 뒤 redirect하면 새로고침 때 같은 POST를 재전송한다. 검증 실패한 form은 다시 렌더링해서 오류를 표시한다.",
    "POST 저장 뒤 redirect하여 중복 제출을 막는다. 검증에 실패하면 빈 form으로 교체한다.",
    redirect.modelAnswer + " redirect는 중복 제출을 방지하지 않는다.",
  ]) assert.equal(grade(redirect, response).correct, false, response);
});

test("수정 폼은 GET의 기존 값 표시와 POST의 같은 레코드 갱신을 모두 요구한다", () => {
  assert.equal(grade(instance,
    "GET에서는 기존 데이터를 입력칸에 보여준다. POST에서는 같은 레코드를 갱신하도록 수정 대상을 연결한다.",
  ).correct, true);
  for (const response of [
    "GET POST instance 기존 수정 갱신 업데이트를 이용해 게시글을 처리한다.",
    "GET에서는 기존 값을 입력칸에 표시한다. POST에서는 instance를 전달하여 새 글을 생성한다.",
    "GET에서는 기존 데이터를 저장하고 POST에서는 기존 값을 입력칸에 보여준다.",
    instance.modelAnswer + " POST에서는 기존 레코드를 수정하지 않는다.",
  ]) assert.equal(grade(instance, response).correct, false, response);
});

test("회원가입은 계정 생성과 별도 로그인 세션 연결을 구분한다", () => {
  assert.equal(grade(signup,
    "회원가입은 사용자 계정을 생성하는 작업이고 로그인 처리는 별도로 필요하다. 저장한 사용자를 login(request, user)에 전달하여 세션을 연결한다.",
  ).correct, true);
  assert.equal(grade(signup,
    "회원가입 폼은 사용자 계정을 저장하지만 로그인 세션을 만들지는 않는다. 가입 후 auth_login 함수를 호출하여 로그인 세션을 연결한다.",
  ).correct, true);
  for (const response of [
    "User 저장 생성 세션 로그인 auth_login을 이용하여 회원가입을 처리한다.",
    "회원가입 form.save는 User 계정을 생성하고 자동으로 로그인한다. 별도 세션 연결은 필요하지 않지만 auth_login(request, user)를 호출한다.",
    "User 계정은 저장하지만 로그인 세션을 만들지는 않는다. 가입 처리는 여기서 끝난다.",
    signup.modelAnswer + " form.save()는 로그인 세션을 자동으로 생성한다.",
    signup.modelAnswer + " auth_login(request, user)를 호출하지 않는다.",
  ]) assert.equal(grade(signup, response).correct, false, response);
});

test("Custom User 설정 순서의 반복만으로는 이유 설명을 대신할 수 없다", () => {
  assert.equal(grade(customUser,
    "사용자 모델을 다른 앱의 외래키가 참조하고 마이그레이션이 이에 의존한다. 나중에 사용자 테이블을 교체할 때 스키마 충돌이 생기는 것을 피하기 위해서다.",
  ).correct, true);
  for (const response of [
    "사용자 모델은 AUTH_USER_MODEL에 지정하고 처음 migrate 전에 설정하는 것이 올바른 순서이다.",
    "사용자 모델은 다른 앱의 관계와 마이그레이션에 연결된다. 첫 migrate 이후에 AUTH_USER_MODEL을 설정한다.",
    "사용자 모델 AUTH_USER_MODEL 다른 앱 관계 의존 마이그레이션 충돌 처음 migrate 이전",
    customUser.modelAnswer + " 다른 앱의 마이그레이션은 사용자 모델에 의존하지 않는다.",
  ]) assert.equal(grade(customUser, response).correct, false, response);
});

test("단답형은 앞뒤 공백만 허용하며 대소문자·기호·내부 공백을 구분한다", () => {
  const short = { ...session, questionType: "short-answer" as const, acceptedAnswers: ["request.FILES"] };
  assert.equal(grade(short, " request.FILES\r\n").correct, true);
  for (const response of ["request.files", "REQUEST.FILES", "requestFILES", "request. FILES", "request.FILES()"])
    assert.equal(grade(short, response).correct, false, response);
});

test("기존 문제은행의 객관식 정답과 등록된 단답·서술형 정답은 유지된다", () => {
  for (const collection of Object.values(SPECIAL_MOCK_EXAM_COLLECTIONS)) {
    for (const questions of Object.values(collection.banks)) {
      for (const question of questions) {
        const responses = question.questionType === "multiple-choice"
          ? [question.answer!]
          : question.questionType === "short-answer"
            ? question.acceptedAnswers!
            : [question.modelAnswer!];
        for (const response of responses)
          assert.equal(grade(question, response).correct, true, question.id);
      }
    }
  }
});
