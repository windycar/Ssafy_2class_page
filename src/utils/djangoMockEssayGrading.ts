// These rules check the relationships requested by the Django essays.
// They are deliberately scoped by concept ID: a keyword match alone cannot
// establish who stores data, which request updates it, or why ordering matters.
type EssayRule = (clauses: string[], response: string) => boolean;

function clausesOf(response: string) {
  return response
    .toLowerCase()
    .replace(/[`“”"']/g, "")
    .split(/[。！？!?;；\n]+|\.(?=\s|$)|하지만|그러나/)
    .map((clause) => clause.replace(/\s+/g, ""))
    .filter(Boolean);
}

function isNegated(suffix: string) {
  return /^(?:하|되|시키|이|히)?(?:지않|지못|지말)|^(?:하지|되지|시키지)(?:않|못)|^(?:할|될)수없|^(?:은|는)?(?:아니|불가|금지)/.test(suffix);
}

function hasClaim(clauses: string[], pattern: RegExp, negated: boolean) {
  return clauses.some((clause) => {
    const matches = clause.matchAll(new RegExp(pattern.source, "g"));
    return [...matches].some(
      (match) => isNegated(clause.slice(match.index! + match[0].length)) === negated,
    );
  });
}

function asserts(clauses: string[], pattern: RegExp) {
  return hasClaim(clauses, pattern, false);
}

function denies(clauses: string[], pattern: RegExp) {
  return hasClaim(clauses, pattern, true);
}

const DATA = "(?:세션데이터|세션정보|sessiondata|실제(?:세션)?데이터|세션(?!id|아이디|식별자|키))";
const SERVER = "(?:서버(?:측)?(?:\\(?db\\)?)?|데이터베이스|db)";
const COOKIE = "(?:브라우저(?:의)?쿠키|클라이언트(?:의)?쿠키|쿠키|cookie)";
const ID = "(?:세션(?:id|아이디|식별자|키)|sessionid|식별값)";
const STORE = "(?:저장|보관|유지|관리)";
// Do not carry a subject past an earlier storage verb into the next claim.
const GAP = `(?:(?:${STORE})하지않고|(?!(?:${STORE})).)`;
const STORAGE_TAIL = `(?:(?!${STORE}|${SERVER}|${COOKIE}|세션|session).){0,16}${STORE}`;
const SERVER_DATA = new RegExp(`${DATA}${GAP}{0,24}${SERVER}${STORAGE_TAIL}|${SERVER}${GAP}{0,12}${DATA}${STORAGE_TAIL}`);
const COOKIE_ID = new RegExp(`${ID}${GAP}{0,12}${COOKIE}${STORAGE_TAIL}|${COOKIE}${GAP}{0,12}${ID}${STORAGE_TAIL}`);

const sessionRule: EssayRule = (clauses) => {
  const serverStoresData = asserts(clauses, SERVER_DATA) && !denies(clauses, SERVER_DATA);
  const cookieStoresId = asserts(clauses, COOKIE_ID) && !denies(clauses, COOKIE_ID);
  const requestSendsId = clauses.some(
    (clause) =>
      /요청|request/.test(clause) &&
      new RegExp(`${ID}|${COOKIE}`).test(clause) &&
      asserts([clause], /서버.{0,18}(?:전송|전달|보내|보낸|보냄)|(?:전송|전달|보내|보낸|보냄).{0,18}서버/),
  );
  const checksSession = clauses.some(
    (clause) => /서버|세션|쿠키/.test(clause) &&
      asserts([clause], /확인|조회|식별|인증상태를유지|로그인상태를유지/),
  );
  const cookieStoresData = asserts(
    clauses,
    new RegExp(`${DATA}${GAP}{0,12}${COOKIE}${STORAGE_TAIL}|${COOKIE}${GAP}{0,12}${DATA}${STORAGE_TAIL}`),
  );
  const deniesSending = clauses.some(
    (clause) => /요청|request/.test(clause) &&
      denies([clause], /서버.{0,18}(?:전송|전달|보내)/),
  );
  return serverStoresData && cookieStoresId && requestSendsId && checksSession && !cookieStoresData && !deniesSending;
};

const redirectRule: EssayRule = (clauses) => {
  const avoidsResubmission = clauses.some(
    (clause) =>
      /redirect|리다이렉트/.test(clause) &&
      ((/(?:중복|재전송|재제출|다시전송)/.test(clause) &&
        asserts([clause], /줄|방지|막|피할|피하|예방/)) ||
        /(?:새로운?|다시|별도).{0,8}get|쪽으로get|로get/.test(clause)),
  );
  const keepsErrors = clauses.some(
    (clause) =>
      /실패|오류|유효하지/.test(clause) &&
      /form|폼/.test(clause) &&
      asserts([clause], /다시렌더링|재렌더링|다시render|다시표시|오류.{0,12}(?:보존|표시|전달)|입력값.{0,12}(?:유지|수정|보존)/),
  );
  const repeatsPost = clauses.some(
    (clause) =>
      !/(?:중복|재전송|재제출).{0,16}(?:줄|방지|막|피|예방)/.test(clause) &&
      asserts([clause], /redirect.{0,24}(?:같은|동일한)post.{0,12}(?:재전송|반복|다시전송)/),
  );
  const savesInvalid = asserts(
    clauses,
    /(?:검증|유효성검사)(?:에)?실패.{0,20}(?:db에저장|save\(\))|(?:빈|새로운?)form.{0,10}(?:교체|만들)/,
  );
  const deniesPrevention = denies(clauses, /(?:중복|재전송|재제출).{0,16}(?:줄이|방지|막|예방)/);
  return avoidsResubmission && keepsErrors && !repeatsPost && !savesInvalid && !deniesPrevention;
};

const instanceRule: EssayRule = (clauses) => {
  const fillsExistingValues = clauses.some(
    (clause) =>
      /get/.test(clause) &&
      /기존|원래|수정할/.test(clause) &&
      asserts([clause], /(?:값|내용|입력칸|데이터).{0,14}(?:채우|채워|표시|보여|불러)/),
  );
  const updatesSameRecord = clauses.some(
    (clause) =>
      /post/.test(clause) &&
      /기존|같은|해당|원래|수정대상|그객체/.test(clause) &&
      asserts([clause], /(?:글|객체|레코드|인스턴스|게시글|데이터).{0,12}(?:수정|갱신|업데이트|반영)/),
  );
  const insertsWithInstance = clauses.some(
    (clause) =>
      /post/.test(clause) &&
      !/instance.{0,8}(?:생략|누락|없|않)|instance없이/.test(clause) &&
      asserts([clause], /(?:새글|새로운글|새객체|새레코드).{0,8}(?:추가|생성|저장)/),
  );
  const deniesUpdate = clauses.some(
    (clause) => /post/.test(clause) &&
      denies([clause], /(?:기존|같은|해당|원래).{0,12}(?:수정|갱신|업데이트|반영)/),
  );
  return fillsExistingValues && updatesSameRecord && !insertsWithInstance && !deniesUpdate;
};

const signupRule: EssayRule = (clauses) => {
  const createsAccount = asserts(
    clauses,
    /(?:user|사용자|계정).{0,18}(?:생성|저장)/,
  );
  const requiresLogin = clauses.some(
    (clause) =>
      asserts([clause], /(?:auth_)?login(?:\([^)]*\))?.{0,10}(?:호출|실행|전달)|(?:auth_)?login\([^)]*\).{0,12}(?:연결|생성)/),
  );
  const noAutomaticSession = clauses.some(
    (clause) =>
      /(?:세션|로그인)/.test(clause) &&
      /(?:만들|생성|로그인|연결).{0,6}(?:않|아니|못)|(?:별도|따로).{0,12}(?:작업|처리|호출|필요)/.test(clause),
  );
  const automaticLogin = asserts(
    clauses,
    /save.{0,24}(?:자동|즉시).{0,10}(?:로그인|세션생성)|save.{0,16}(?:로그인)?세션.{0,10}자동.{0,8}생성|(?:계정|user).{0,12}생성.{0,10}(?:자동|즉시).{0,6}로그인/,
  );
  const deniesLogin = denies(clauses, /(?:auth_)?login\(request,user\).{0,8}(?:호출|실행|전달)/);
  return createsAccount && requiresLogin && noAutomaticSession && !automaticLogin && !deniesLogin;
};

const customUserRule: EssayRule = (clauses) => {
  const dependency = clauses.some(
    (clause) =>
      /사용자|user|유저/.test(clause) &&
      /모델|테이블/.test(clause) &&
      /다른앱|관계|참조|의존|외래키|foreignkey/.test(clause) &&
      asserts([clause], /(?:관계|마이그레이션|모델|테이블|외래키).{0,24}(?:연결|참조|의존)(?=하|한|되|된)/),
  );
  const migrationReason = clauses.some(
    (clause) =>
      /마이그레이션|migration|migrate|스키마/.test(clause) &&
      /충돌|오류|복잡|어려|어렵|의존|일관|참조|연결/.test(clause),
  );
  const lateSetup = asserts(
    clauses,
    /(?:첫|처음|최초)migrate(?:를|를실행)?(?:한)?(?:후|이후).{0,24}(?:정의|설정|지정)/,
  );
  const deniesDependency = denies(clauses, /(?:사용자|user|모델|마이그레이션).{0,32}(?:연결|참조|의존)/);
  return dependency && migrationReason && !lateSetup && !deniesDependency;
};

function isImageUpdateCall(argumentsText: string) {
  const positionalNames = ["data", "files", "instance"];
  const values = new Map<string, string>();
  let hasKeywordArgument = false;
  const args = argumentsText.split(",").filter(Boolean);
  for (const [index, argument] of args.entries()) {
    const parts = argument.split("=");
    const named = parts.length === 2;
    if (parts.length > 2 || (!named && hasKeywordArgument)) return false;
    const name = named ? parts[0] : positionalNames[index];
    const value = named ? parts[1] : argument;
    if (!positionalNames.includes(name) || values.has(name)) return false;
    values.set(name, value);
    hasKeywordArgument ||= named;
  }
  return values.size === 3 && values.get("data") === "request.POST" &&
    values.get("files") === "request.FILES" && values.get("instance") === "article";
}

const imageUpdateRule: EssayRule = (clauses, response) => {
  const missingFiles = /(?:request\.files|파일(?:데이터)?|이미지).{0,32}(?:누락|생략|빠뜨|빠져|빠졌|전달하지|전달되지|넘기지|받지못|바인딩하지|바인딩되지|안넘겨).{0,12}(?:했|됐|되|때문|어서|므로|않|못|있|것|다)/;
  const explainsCause = asserts(clauses, missingFiles) && !denies(clauses, missingFiles);
  // The old constructor may be quoted while explaining the cause. Any proposed
  // constructor containing uploaded files must bind all three inputs correctly.
  const codeText = response.replace(/\s+|`/g, "");
  const calls = [...codeText.matchAll(/ArticleForm\(([^()]*)\)/g)].map(match => match[1]);
  const fileCalls = calls.filter(args => /request\.files/i.test(args));
  const fixesBinding = fileCalls.length > 0 && fileCalls.every(isImageUpdateCall);
  const removesInput = asserts(clauses,
    /(?:request\.(?:files|post)|instance=article)(?:를|을)?(?:제거|삭제|빼|생략)/,
  );
  const wrongSource = asserts(clauses,
    /(?:request\.get.{0,16}파일|파일.{0,16}request\.get).{0,12}(?:받|전달|읽|바인딩)/,
  );
  const deniesFix = clauses.some(clause =>
    /request\.files.{0,16}(?:전달|추가|바인딩)하지(?:않아야|말아야|않도록)/.test(clause),
  );
  const storesBinary = asserts(clauses,
    /(?:파일|이미지)(?:원본|바이너리|자체).{0,12}(?:db|데이터베이스).{0,10}저장/,
  );
  return explainsCause && fixesBinding && !removesInput && !wrongSource && !deniesFix && !storesBinary;
};

const DJANGO_ESSAY_RULES: Record<string, EssayRule> = {
  "http-stateless-cookie-session": sessionRule,
  "form-validation-post-redirect-essay": redirectRule,
  "modelform-instance-update-essay": instanceRule,
  "signup-and-login-difference-essay": signupRule,
  "custom-user-before-migrate-essay": customUserRule,
  "media-image-update-request-files-essay": imageUpdateRule,
};

export function gradeDjangoMockEssay(conceptId: string, response: string) {
  if (!Object.hasOwn(DJANGO_ESSAY_RULES, conceptId)) return undefined;
  const rule = DJANGO_ESSAY_RULES[conceptId];
  const clauses = clausesOf(response);
  // Appending a repudiation must not turn a mixed answer into a correct one.
  if (clauses.some((clause) => /(?:위|앞|모든|전체).{0,12}(?:설명|내용|답).{0,10}(?:틀|잘못|오답)|(?:위|앞|모든|전체).{0,12}(?:반대|거짓)/.test(clause))) {
    return false;
  }
  return rule(clauses, response);
}
