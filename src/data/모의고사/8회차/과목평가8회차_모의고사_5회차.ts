export type StudyDifficulty = "easy" | "medium" | "hard" | "extreme";

export type StudyQuestionType =
  | "multiple-choice"
  | "short-answer"
  | "essay";

export interface StudyQuestion {
  id: string;
  conceptId: string;
  difficulty: StudyDifficulty;
  category: string;
  questionType: StudyQuestionType;
  prompt: string;
  code?: string;
  options: string[];
  answer: number | null;
  acceptedAnswers?: string[];
  modelAnswer?: string;
  rubricKeywords?: string[];
  minLength?: number;
  explanation: string;
  hint?: string;
}

export const QUESTION_BANK: Record<StudyDifficulty, StudyQuestion[]> = {
  easy: [
    {
      id: "mock5-006-template-condition-logged-user",
      conceptId: "template-condition-logged-user",
      difficulty: "easy",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "로그인 사용자에게만 마이페이지 링크를 출력하는 템플릿 코드로 적절한 것은?",
      options: [
        "{{ if user.is_authenticated }}<a href=\"/mypage/\">마이페이지</a>{{ endif }}",
        "{% if user.is_authenticated %}<a href=\"/mypage/\">마이페이지</a>{% endif %}",
        "{% if user.is_authenticated %}<a href=\"/mypage/\">마이페이지</a>{% endfor %}",
        "{% if user.is_authenticated() %}<a href=\"/mypage/\">마이페이지</a>{% endif %}",
      ],
      answer: 1,
      explanation: "인증 여부는 괄호 없는 속성으로 확인하고 DTL if 태그로 표시를 분기합니다."
    },
    {
      id: "mock5-008-model-autonow-update",
      conceptId: "model-autonow-update",
      difficulty: "easy",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "글을 수정할 때마다 `updated_at`에 수정 시각을 남기고 싶다. 적합한 Model 옵션은?",
      options: [
        "blank=True",
        "default=None",
        "auto_now_add=True",
        "auto_now=True",
      ],
      answer: 3,
      explanation: "auto_now는 모델 객체가 저장될 때 시각을 갱신합니다."
    },
    {
      id: "mock5-015-http-get-post-separation",
      conceptId: "http-get-post-separation",
      difficulty: "easy",
      category: "ORM with View",
      questionType: "multiple-choice",
      prompt: "게시글 목록은 조회하고, 새 게시글 작성은 DB 값을 변경한다. HTTP 메서드 배치로 적절한 것은?",
      options: [
        "목록 조회와 글 생성 모두 POST로 처리한다.",
        "목록 조회와 글 생성 모두 GET으로 처리한다.",
        "목록 조회에 POST, 글 생성에 GET을 사용한다.",
        "목록 조회에 GET, 글 생성에 POST를 사용한다.",
      ],
      answer: 3,
      explanation: "조회에는 GET, 상태를 변경하는 제출에는 POST를 사용하는 것이 일반적입니다."
    },
    {
      id: "mock5-018-form-modelform-difference",
      conceptId: "form-modelform-difference",
      difficulty: "easy",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "일반 forms.Form과 forms.ModelForm을 비교한 설명으로 알맞은 것은?",
      options: [
        "ModelForm은 연결한 모델의 필드를 이용해 입력 폼을 구성할 수 있다.",
        "Form과 ModelForm 모두 기본적으로 모델 인스턴스를 DB에 저장한다.",
        "Form은 ModelForm과 달리 입력 데이터 유효성 검사를 하지 않는다.",
        "ModelForm은 Form과 달리 입력 데이터 유효성 검사를 하지 않는다.",
      ],
      answer: 0,
      explanation: "ModelForm은 모델 기반 폼이며, 두 Form 모두 검증 기능을 제공합니다."
    },
    {
      id: "mock5-027-request-get-expression",
      conceptId: "request-get-expression",
      difficulty: "easy",
      category: "Template & URLs",
      questionType: "short-answer",
      prompt: "GET 요청의 쿼리 문자열 매개변수를 조회하는 request 속성명을 `request.속성` 형태로 정확히 쓰시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["request.GET"],
      explanation: "GET 방식의 쿼리 매개변수는 request.GET에서 접근합니다."
    },
    {
      id: "mock5-031-is-authenticated-property",
      conceptId: "is-authenticated-property",
      difficulty: "easy",
      category: "Authentication System",
      questionType: "short-answer",
      prompt: "현재 사용자 객체에서 로그인 여부를 Boolean으로 확인하는 속성명만 쓰시오. (괄호 제외)",
      options: [],
      answer: null,
      acceptedAnswers: ["is_authenticated"],
      explanation: "is_authenticated는 호출 괄호 없는 속성입니다."
    }
  ],
  medium: [
    {
      id: "mock5-001-requirements-freeze-output",
      conceptId: "requirements-freeze-output",
      difficulty: "medium",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "팀 프로젝트에서 현재 환경의 설치 패키지와 버전을 파일로 전달하려 한다. 사용할 명령은?",
      options: [
        "python manage.py migrate > requirements.txt",
        "pip install -r requirements.txt",
        "django-admin startproject requirements.txt",
        "pip freeze > requirements.txt",
      ],
      answer: 3,
      explanation: "pip freeze는 설치된 패키지와 버전 목록을 출력하므로 리다이렉션으로 파일에 기록합니다."
    },
    {
      id: "mock5-002-mtv-view-orm-template",
      conceptId: "mtv-view-orm-template",
      difficulty: "medium",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "View 함수가 DB의 게시글 목록을 HTML로 보여 준다. MTV 역할 분담으로 자연스러운 구성은?",
      options: [
        "Model이 URLconf를 실행하고 Template이 요청 경로를 View에 전달한다.",
        "Model을 조회하고 Template에 context를 넘긴 뒤 View가 응답을 반환한다.",
        "Template이 ORM 쿼리를 직접 실행한 뒤 Model이 HTML 응답을 생성한다.",
        "URLconf가 게시글을 조회하고 Model이 Template 변수의 이름을 결정한다.",
      ],
      answer: 1,
      explanation: "데이터 조회는 Model/ORM, 화면 표현은 Template, 요청·응답 처리는 View가 담당합니다."
    },
    {
      id: "mock5-003-dtl-block-scoping",
      conceptId: "dtl-block-scoping",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "base.html의 `{% block content %}` 부분에 목록 화면을 넣으려 한다. 필요한 자식 템플릿 코드 조합은?",
      options: [
        "{% load 'base.html' %}와 {% block content %}...{% endblock %}",
        "{% extends 'base.html' %}와 {% for content %}...{% endfor %}",
        "{% include 'base.html' %}와 {{ block content }}...{{ endblock }}",
        "{% extends 'base.html' %}와 {% block content %}...{% endblock %}",
      ],
      answer: 3,
      explanation: "extends로 부모를 상속하고 block을 재정의하면 지정한 영역에 내용을 삽입합니다."
    },
    {
      id: "mock5-004-url-name-maintenance",
      conceptId: "url-name-maintenance",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "URL 경로 `/boards/<int:pk>/`를 `/posts/<int:pk>/`로 변경할 예정이다. 템플릿 수정량을 줄이는 방법은?",
      options: [
        "URL에 name을 지정하고 템플릿에서 {% url %}로 이름을 참조한다.",
        "템플릿의 href에 URL 전체 문자열을 직접 작성하여 경로를 고정한다.",
        "Template 폴더명을 새 경로인 posts로 바꾸어 경로를 자동 반영한다.",
        "모든 View에서 request.path를 검사해 변경된 경로를 수동으로 생성한다.",
      ],
      answer: 0,
      explanation: "이름 기반 URL 참조는 URL 패턴 문자열이 바뀌어도 이름과 인자가 유지되면 함께 동작합니다."
    },
    {
      id: "mock5-005-url-variable-vs-query-kwargs",
      conceptId: "url-variable-vs-query-kwargs",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "다음 요청에서 View 함수의 `page` 매개변수와 request.GET[\"order\"]로 받는 값은 각각?",
      code: "# urls.py\npath('list/<int:page>/', views.list_view)\n# request URL: /list/2/?order=latest",
      options: [
        "page와 order 모두 request.POST에서 조회한다.",
        "page와 order 모두 문자열 \"latest\"이다.",
        "page는 정수 2, order는 문자열 latest이다.",
        "page는 문자열 \"2\", order는 정수 2이다.",
      ],
      answer: 2,
      explanation: "int 경로 변환기는 정수를 전달하고 쿼리 문자열은 request.GET에서 문자열로 읽습니다."
    },
    {
      id: "mock5-007-form-get-name-vs-id",
      conceptId: "form-get-name-vs-id",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "다음 검색 폼을 제출하면 `/search/?word=django` 형태가 된다. 서버에서 검색어를 얻는 방식은?",
      code: "<form method=\"get\" action=\"/search/\">\n<input id=\"search-input\" name=\"word\" value=\"django\">\n</form>",
      options: [
        "request.GET.get('word')",
        "request.GET.get('search-input')",
        "request.POST.get('word')",
        "request.POST.get('search-input')",
      ],
      answer: 0,
      explanation: "GET form에서 쿼리 키는 name 속성값이며 request.GET으로 읽습니다."
    },
    {
      id: "mock5-009-model-blank-on-form",
      conceptId: "model-blank-on-form",
      difficulty: "medium",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "선택적으로 입력받는 게시글 소개 문구를 ModelForm에서 비워 두어도 통과시키려 한다. 관련 Model Field 옵션은?",
      options: [
        "auto_now=True",
        "primary_key=True",
        "blank=True",
        "null=True",
      ],
      answer: 2,
      explanation: "Form의 빈 입력 허용은 blank로 설정합니다. null은 DB의 NULL 허용 여부입니다."
    },
    {
      id: "mock5-010-showmigrations-purpose",
      conceptId: "showmigrations-purpose",
      difficulty: "medium",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "migration 파일이 DB에 적용됐는지 확인하려 한다. 관련 명령의 기능으로 맞는 것은?",
      options: [
        "showmigrations는 migration 목록과 적용 여부를 보여 준다.",
        "showmigrations는 migration에 포함된 SQL을 출력한다.",
        "showmigrations는 모델 변경을 감지해 migration을 생성한다.",
        "showmigrations는 아직 적용하지 않은 migration을 DB에 적용한다.",
      ],
      answer: 0,
      explanation: "showmigrations는 migration 이력의 적용 상태를 표시하는 명령입니다."
    },
    {
      id: "mock5-011-orm-chain-filter",
      conceptId: "orm-chain-filter",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "게시글 중 제목에 `공지`가 포함되며 pk가 10 이상인 글을 조회하려 한다. 적절한 코드는?",
      options: [
        "Article.objects.filter(title__startswith='공지', pk__lte=10)",
        "Article.objects.filter(title__contains='공지', pk__gte=10)",
        "Article.objects.get(title__contains='공지', pk__gte=10)",
        "Article.objects.filter(title__exact='공지', pk__gt=10)",
      ],
      answer: 1,
      explanation: "contains는 포함 여부, gte는 이상 조건이며 filter는 여러 글을 조회할 수 있습니다."
    },
    {
      id: "mock5-012-orm-get-vs-filter-in-code",
      conceptId: "orm-get-vs-filter-in-code",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "동일한 조건으로 `get()`과 `filter()`를 사용했다. 결과가 한 건일 때 두 반환값에 대한 설명으로 맞는 것은?",
      options: [
        "get은 QuerySet, filter는 모델 인스턴스다.",
        "get과 filter 모두 모델 인스턴스를 반환한다.",
        "get은 모델 인스턴스, filter는 QuerySet이다.",
        "get과 filter 모두 QuerySet을 반환한다.",
      ],
      answer: 2,
      explanation: "get은 단일 객체를, filter는 결과 개수와 상관없이 QuerySet을 반환합니다."
    },
    {
      id: "mock5-013-startswith-lookup",
      conceptId: "startswith-lookup",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "제목이 `공지`로 시작하는 게시글 목록을 가져오려 한다. ORM 표현으로 적절한 것은?",
      options: [
        "Article.objects.filter(title__startswith='공지')",
        "Article.objects.filter(title__exact='공지')",
        "Article.objects.filter(title__contains='공지')",
        "Article.objects.filter(title__endswith='공지')",
      ],
      answer: 0,
      explanation: "__startswith는 문자열의 시작 부분을 비교합니다."
    },
    {
      id: "mock5-016-form-invalid-keep-errors",
      conceptId: "form-invalid-keep-errors",
      difficulty: "medium",
      category: "ORM with View",
      questionType: "multiple-choice",
      prompt: "게시글 작성 View가 POST 데이터를 검증했지만 실패했다. 이때 사용자에게 오류를 보여 주는 가장 자연스러운 방법은?",
      options: [
        "form.save()를 호출해 오류를 데이터베이스에 기록한다.",
        "request.GET에 오류 메시지를 기록하고 다시 저장한다.",
        "새 ArticleForm() 객체로 바꾼 뒤 redirect한다.",
        "검증에 실패한 form 객체를 다시 render한다.",
      ],
      answer: 3,
      explanation: "검증 실패한 form에는 입력값과 오류 정보가 있어 그대로 템플릿에 전달할 수 있습니다."
    },
    {
      id: "mock5-017-post-redirect-after-save",
      conceptId: "post-redirect-after-save",
      difficulty: "medium",
      category: "ORM with View",
      questionType: "multiple-choice",
      prompt: "POST 요청에서 게시글을 저장한 뒤 목록 URL로 redirect했다. 브라우저의 다음 동작으로 적절한 것은?",
      options: [
        "응답의 이동 위치를 따라 목록 페이지를 새로 요청한다.",
        "현재 POST 요청의 본문을 복사해 저장 URL에 다시 전송한다.",
        "브라우저가 URL 이동 없이 같은 POST 응답을 그대로 보관한다.",
        "Django가 이전 View 함수를 호출한 채 템플릿만 교체한다.",
      ],
      answer: 0,
      explanation: "일반적인 POST 처리 후 redirect는 브라우저가 새 GET 요청을 하도록 유도합니다."
    },
    {
      id: "mock5-019-modelform-fields-instead-of-all",
      conceptId: "modelform-fields-instead-of-all",
      difficulty: "medium",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "일반 사용자용 ArticleForm에 `title`과 `content`만 보여주고 싶다. Meta.fields 작성으로 적절한 것은?",
      options: [
        "fields = '__all__'",
        "fields = ('id', 'created_at')",
        "fields = ('title', 'content')",
        "exclude = ('title', 'content')",
      ],
      answer: 2,
      explanation: "사용자가 편집할 필드만 fields에 지정하는 방식이 의도에 맞습니다."
    },
    {
      id: "mock5-021-media-file-url-display",
      conceptId: "media-file-url-display",
      difficulty: "medium",
      category: "Static Files & Media",
      questionType: "multiple-choice",
      prompt: "ImageField에 저장된 이미지를 템플릿의 img 태그 src로 사용할 때 접근할 값은?",
      options: [
        "article.image.path",
        "article.image.url",
        "article.image.name",
        "article.image.upload_to",
      ],
      answer: 1,
      explanation: "웹에서 사용할 접근 주소는 FieldFile의 url 속성입니다. 파일이 있는지 먼저 확인해야 합니다."
    },
    {
      id: "mock5-022-media-root-url-difference",
      conceptId: "media-root-url-difference",
      difficulty: "medium",
      category: "Static Files & Media",
      questionType: "multiple-choice",
      prompt: "사용자 업로드 파일을 저장할 위치와 브라우저에서 접근할 URL 접두사를 각각 지정하는 설정은?",
      options: [
        "MEDIA_URL과 MEDIA_ROOT",
        "STATICFILES_DIRS와 STATIC_URL",
        "MEDIA_ROOT와 MEDIA_URL",
        "STATIC_URL과 STATICFILES_DIRS",
      ],
      answer: 2,
      explanation: "MEDIA_ROOT는 파일시스템 저장 경로이고 MEDIA_URL은 웹 URL 접두사입니다."
    },
    {
      id: "mock5-023-get-user-model-vs-request-user",
      conceptId: "get-user-model-vs-request-user",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "`get_user_model()`과 `request.user`의 차이로 적절한 것은?",
      options: [
        "앞의 것은 로그인된 세션 ID, 뒤의 것은 User 모델 클래스다.",
        "앞의 것은 설정된 User 모델 클래스, 뒤의 것은 현재 요청의 사용자 객체다.",
        "앞의 것은 현재 요청의 사용자 객체, 뒤의 것은 User 모델 클래스다.",
        "앞의 것은 현재 User 비밀번호, 뒤의 것은 로그인 세션 전체다.",
      ],
      answer: 1,
      explanation: "get_user_model()은 모델 클래스를, request.user는 요청에 연결된 사용자 인스턴스를 가리킵니다."
    },
    {
      id: "mock5-024-auth-form-get-user-login",
      conceptId: "auth-form-get-user-login",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "로그인 View에서 `AuthenticationForm` 검증이 성공했다. 다음 처리로 적절한 것은?",
      options: [
        "get_user_model()을 호출한 다음 그 클래스 자체를 auth_login에 넘긴다.",
        "form.get_user()로 받은 사용자 객체를 DB에서 delete한 뒤 redirect한다.",
        "form.save()로 사용자 객체를 생성한 뒤 auth_login(request, user)를 호출한다.",
        "form.get_user()로 사용자 객체를 받은 뒤 auth_login(request, user)를 호출한다.",
      ],
      answer: 3,
      explanation: "AuthenticationForm은 기존 사용자를 인증하고 get_user()로 객체를 반환합니다."
    },
    {
      id: "mock5-025-custom-userchangeform-instance",
      conceptId: "custom-userchangeform-instance",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "회원정보 수정 POST를 처리할 때 기존 사용자 정보를 덮어쓰려 한다. Form 생성 코드로 적절한 것은?",
      options: [
        "CustomUserChangeForm(request.POST, request.FILES)",
        "CustomUserChangeForm(request.POST, instance=request.user)",
        "CustomUserChangeForm(request.user, request.POST)",
        "CustomUserChangeForm(request.POST, user=request.user)",
      ],
      answer: 1,
      explanation: "UserChangeForm 계열은 ModelForm이므로 기존 사용자 객체를 instance로 전달합니다."
    },
    {
      id: "mock5-026-auth-required-versus-object-owner",
      conceptId: "auth-required-versus-object-owner",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "다른 사용자의 게시글을 수정하지 못하도록 제한하려 한다. `@login_required` 외에 필요한 처리는?",
      options: [
        "요청한 사용자가 해당 게시글의 작성자인지 확인한다.",
        "CSRF 토큰을 검사하면 게시글 소유자 여부도 확인된다.",
        "템플릿에서 수정 링크를 숨기면 서버 검사는 생략한다.",
        "작성자가 아니어도 로그인만 하면 수정 요청을 처리한다.",
      ],
      answer: 0,
      explanation: "인증 여부와 객체별 수정 권한은 서로 다른 검사입니다."
    },
    {
      id: "mock5-028-get-user-model-exact",
      conceptId: "get-user-model-exact",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "short-answer",
      prompt: "설정된 Custom User 모델 클래스를 반환하는 django.contrib.auth 함수명만 쓰시오. (괄호 제외)",
      options: [],
      answer: null,
      acceptedAnswers: ["get_user_model"],
      explanation: "get_user_model()은 설정된 User 모델 클래스를 반환합니다."
    },
    {
      id: "mock5-029-auto-now-option",
      conceptId: "auto-now-option",
      difficulty: "medium",
      category: "Model",
      questionType: "short-answer",
      prompt: "DateTimeField가 모델 인스턴스 저장 시마다 현재 시각으로 갱신되게 하는 옵션명만 쓰시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["auto_now"],
      explanation: "수정 시각 자동 갱신은 auto_now=True입니다."
    },
    {
      id: "mock5-030-staticfiles-dirs-variable",
      conceptId: "staticfiles-dirs-variable",
      difficulty: "medium",
      category: "Static Files & Media",
      questionType: "short-answer",
      prompt: "앱 static/ 외의 정적 파일 디렉터리 목록을 지정하는 Django 설정 상수명을 정확히 쓰시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["STATICFILES_DIRS"],
      explanation: "STATICFILES_DIRS는 추가 정적 파일 탐색 경로 목록입니다."
    }
  ],
  hard: [
    {
      id: "mock5-014-save-vs-create-model-state",
      conceptId: "save-vs-create-model-state",
      difficulty: "hard",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "DB에 기존 글 한 건이 있다. 아래 코드를 실행한 직후 DB의 글 수에 대한 설명으로 적절한 것은?",
      code: "old = Article.objects.get(pk=1)\nold.title = \"수정\"\nold.save()\nnew = Article.objects.create(title=\"신규\", content=\"내용\")",
      options: [
        "기존 글을 수정했으므로 신규 행은 없고 전체 글 수는 1건이다.",
        "둘 다 저장되지 않아 전체 글 수는 1건이고 제목도 그대로다.",
        "새 글만 한 건 추가돼 전체 글 수는 2건이다.",
        "new 글과 기존 글이 모두 INSERT돼 전체 글 수는 3건이다.",
      ],
      answer: 2,
      explanation: "기존 글의 save()는 갱신하고 새 객체의 create는 새 행을 추가합니다."
    },
    {
      id: "mock5-020-model-form-update-post-instance",
      conceptId: "model-form-update-post-instance",
      difficulty: "hard",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "기존 글을 수정하는 POST 처리 코드를 검토 중이다. 다음 중 정확히 기존 레코드를 갱신하는 코드는?",
      options: [
        "form = ArticleForm(request.GET, instance=article); form.is_valid() 확인 후 form.save()",
        "form = ArticleForm(request.POST, instance=article); form.is_valid() 확인 후 form.save()",
        "form = ArticleForm(instance=article); form.is_valid() 확인 후 form.save()",
        "form = ArticleForm(request.POST); form.is_valid() 확인 후 form.save()",
      ],
      answer: 1,
      explanation: "수정 시에는 POST 데이터와 기존 인스턴스를 함께 바인딩하고 검증 후 저장합니다."
    },
    {
      id: "mock5-032-custom-user-before-migrate-essay",
      conceptId: "custom-user-before-migrate-essay",
      difficulty: "hard",
      category: "Authentication System",
      questionType: "essay",
      prompt: "Django에서 기본 User 대신 AbstractUser를 상속한 사용자 모델을 쓰기로 했다. 모델 정의와 `AUTH_USER_MODEL` 설정을 처음 migrate 전에 해 두어야 하는 이유를 30자 이상으로 설명하시오.",
      options: [],
      answer: null,
      modelAnswer: "사용자 모델은 다른 앱의 관계와 마이그레이션에 연결되므로 첫 migrate 전에 AbstractUser를 상속한 Custom User 모델을 정의하고 AUTH_USER_MODEL에 지정해야 이후 사용자 테이블 교체로 인한 마이그레이션 충돌을 피하기 쉽다.",
      rubricKeywords: [
        "사용자 (또는 User/유저)",
        "모델",
        "AUTH_USER_MODEL",
        "migrate (또는 마이그레이션/DB)",
        "처음 (또는 이전/먼저/전에)",
      ],
      minLength: 30,
      explanation: "Custom User 모델과 설정을 최초 마이그레이션 전에 결정해야 하는 이유를 설명하는 문제입니다. 의미를 따로 검수해야 합니다."
    }
  ],
  extreme: [

  ],
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
