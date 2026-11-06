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
      id: "mock2-001-venv-local-isolation",
      conceptId: "venv-local-isolation",
      difficulty: "easy",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "두 Django 프로젝트가 서로 다른 패키지 버전을 사용한다. 충돌을 피하기 위한 방법으로 적절한 것은?",
      options: [
        "두 프로젝트의 패키지 버전을 동일하게 변경하고 하나의 환경을 사용한다.",
        "프로젝트마다 별도의 가상 환경을 만들고 필요한 패키지를 설치한다.",
        "Python 설치 폴더에 패키지를 모두 설치한 뒤 프로젝트별로 경로를 바꾼다.",
        "가상 환경 하나를 복사한 뒤 두 프로젝트에서 계속 공동으로 사용한다.",
      ],
      answer: 1,
      explanation: "가상 환경은 프로젝트별 패키지와 버전을 독립적으로 관리할 수 있도록 합니다."
    },
    {
      id: "mock2-002-startproject-startapp",
      conceptId: "startproject-startapp",
      difficulty: "easy",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "Django에서 프로젝트 생성과 앱 생성에 사용하는 명령어를 순서대로 고르면?",
      options: [
        "python manage.py runserver config → django-admin startapp articles",
        "django-admin startproject config → python manage.py startapp articles",
        "django-admin startapp config → python manage.py startproject articles",
        "python manage.py startproject config → django-admin runserver articles",
      ],
      answer: 1,
      explanation: "프로젝트는 startproject로 만들고, 프로젝트 내부에서 앱은 manage.py startapp으로 생성합니다."
    },
    {
      id: "mock2-006-context-variable-access",
      conceptId: "context-variable-access",
      difficulty: "easy",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "View가 `render(request, \"posts/index.html\", {\"nickname\": \"민수\"})`를 반환한다. 템플릿에서 이름을 출력할 표현은?",
      options: [
        "{{ nickname }}",
        "{% nickname %}",
        "{{ request.nickname }}",
        "{{ context.nickname }}",
      ],
      answer: 0,
      explanation: "context 딕셔너리에 넣은 키는 템플릿에서 변수명으로 바로 사용합니다."
    },
    {
      id: "mock2-008-charfield-max-length",
      conceptId: "charfield-max-length",
      difficulty: "easy",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "게시글 제목을 최대 100자까지 저장하는 문자열 필드를 정의할 때 옳은 코드는?",
      options: [
        "title = models.CharField(max_length=100)",
        "title = models.TextField(limit=100)",
        "title = models.TextField(max_length=100, required=True)",
        "title = models.CharField(length=100)",
      ],
      answer: 0,
      explanation: "CharField는 max_length 인자가 필요하며 문자열 길이 제한에 사용됩니다."
    },
    {
      id: "mock2-011-admin-register-model",
      conceptId: "admin-register-model",
      difficulty: "easy",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "Article 모델을 Django 관리자 사이트의 모델 목록에서 관리하려면 무엇이 필요한가?",
      options: [
        "urls.py에서 Article 모델을 urlpatterns에 추가한다.",
        "admin.py에서 Article 모델을 관리자 사이트에 등록한다.",
        "views.py에서 Article 모델에 admin=True를 설정한다.",
        "settings.py에서 Article 모델을 MIDDLEWARE에 등록한다.",
      ],
      answer: 1,
      explanation: "관리자 사이트 노출은 admin.py의 admin.site.register(Article) 등으로 설정합니다."
    },
    {
      id: "mock2-012-orm-get-vs-filter-single",
      conceptId: "orm-get-vs-filter-single",
      difficulty: "easy",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "Article.objects.filter(title=\"Django\")의 조회 결과가 딱 1개다. 반환값의 자료형은?",
      options: [
        "Article 인스턴스를 담은 QuerySet이다.",
        "딕셔너리 한 개를 담은 list이다.",
        "Article 모델 인스턴스 하나이다.",
        "기본 키를 원소로 갖는 tuple이다.",
      ],
      answer: 0,
      explanation: "filter는 결과 개수와 상관없이 QuerySet을 반환합니다."
    },
    {
      id: "mock2-017-csrf-post-form-placement",
      conceptId: "csrf-post-form-placement",
      difficulty: "easy",
      category: "ORM with View",
      questionType: "multiple-choice",
      prompt: "다음 중 Django의 CSRF 보호를 사용하는 POST Form 작성 방식으로 맞는 것은?",
      options: [
        "<form method=\"get\">{% csrf_token %}<button>저장</button></form>",
        "<form method=\"post\">{% load csrf_token %}<button>저장</button></form>",
        "<form method=\"post\">{% csrf_token %}<button>저장</button></form>",
        "<form method=\"post\">{{ csrf_token }}<button>저장</button></form>",
      ],
      answer: 2,
      explanation: "POST Form 내부에 `{% csrf_token %}` 태그를 사용해야 합니다."
    },
    {
      id: "mock2-018-modelform-meta-fields",
      conceptId: "modelform-meta-fields",
      difficulty: "easy",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "ArticleForm에서 Article 모델의 title과 content만 노출하려면 Meta에 무엇을 작성해야 하는가?",
      options: [
        "model = Article; exclude = ('title', 'content')",
        "model = Article; fields = ('title', 'content')",
        "model = Article; exclude = ('content',)",
        "model = Article; fields = ('id', 'created_at')",
      ],
      answer: 1,
      explanation: "fields는 포함할 모델 필드를 명시합니다. exclude는 제외할 필드를 뜻합니다."
    },
    {
      id: "mock2-020-static-load-tag",
      conceptId: "static-load-tag",
      difficulty: "easy",
      category: "Static Files & Media",
      questionType: "multiple-choice",
      prompt: "템플릿에서 앱의 `static/` 파일을 `{% static %}`으로 참조하려면 먼저 작성해야 할 태그는?",
      options: [
        "{% extends static %}",
        "{% import static %}",
        "{% include static %}",
        "{% load static %}",
      ],
      answer: 3,
      explanation: "정적 파일의 URL을 템플릿 태그로 만들려면 static 태그 라이브러리를 load해야 합니다."
    },
    {
      id: "mock2-022-session-cookie-id-location",
      conceptId: "session-cookie-id-location",
      difficulty: "easy",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "기본 DB 세션 방식에서 로그인 상태를 이어 주는 두 값의 위치로 맞는 것은?",
      options: [
        "세션 식별자는 쿠키에, 실제 세션 데이터는 서버 DB에 있다.",
        "세션 식별자와 데이터 모두 쿠키 안에서 각각 관리된다.",
        "세션 식별자와 데이터 모두 브라우저 localStorage에 있다.",
        "세션 식별자는 서버 DB에, 실제 세션 데이터는 쿠키에 있다.",
      ],
      answer: 0,
      explanation: "브라우저는 세션 ID를 쿠키로 보내고 서버가 보관한 세션 데이터를 조회합니다."
    },
    {
      id: "mock2-026-migrate-command",
      conceptId: "migrate-command",
      difficulty: "easy",
      category: "Model",
      questionType: "short-answer",
      prompt: "생성된 migration 파일을 데이터베이스에 실제 적용할 때 `python manage.py` 다음에 붙이는 명령어를 쓰시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["migrate"],
      explanation: "DB에 변경 내용을 반영하는 명령은 migrate입니다."
    },
    {
      id: "mock2-028-form-is-valid-method",
      conceptId: "form-is-valid-method",
      difficulty: "easy",
      category: "Form & ModelForm",
      questionType: "short-answer",
      prompt: "Django Form의 입력값 검증 결과를 True 또는 False로 반환하는 메서드 이름만 쓰시오. (괄호 제외)",
      options: [],
      answer: null,
      acceptedAnswers: ["is_valid"],
      explanation: "is_valid()는 바인딩된 폼의 유효성을 검사합니다."
    }
  ],
  medium: [
    {
      id: "mock2-003-mtv-url-view-responsibility",
      conceptId: "mtv-url-view-responsibility",
      difficulty: "medium",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "`/articles/` 요청이 들어왔을 때 Django의 처리 흐름을 설명한 내용으로 알맞은 것은?",
      options: [
        "Model이 URLconf를 호출하여 요청에 맞는 Template 경로를 결정한다.",
        "URLconf가 View를 연결하고 View는 필요에 따라 Model과 Template을 사용한다.",
        "URLconf가 DB 데이터를 조회하고 Template이 요청별 Python 로직을 처리한다.",
        "Template이 요청 URL을 분석한 뒤 Model에서 사용할 View를 직접 선택한다.",
      ],
      answer: 1,
      explanation: "URLconf는 요청 경로를 View에 연결하고, View가 처리 결과를 응답으로 돌려줍니다."
    },
    {
      id: "mock2-004-url-int-converter",
      conceptId: "url-int-converter",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "다음 URL 패턴과 View가 있을 때 `/posts/12/` 요청에 대한 설명으로 맞는 것은?",
      code: "# urls.py\npath('posts/<int:post_pk>/', views.detail, name='detail')\n\n# views.py\ndef detail(request, post_pk):\n    ...",
      options: [
        "View에는 정수 12가 `post_pk` 인자로 전달된다.",
        "View에는 정수 12가 `pk` 인자로 전달된다.",
        "View에는 `request.GET[\"post_pk\"]` 값이 전달된다.",
        "View에는 문자열 \"12\"가 `post_pk` 인자로 전달된다.",
      ],
      answer: 0,
      explanation: "`int` 경로 변환기는 해당 경로 부분을 정수로 변환해 이름이 같은 View 인자로 전달합니다."
    },
    {
      id: "mock2-005-template-for-loop",
      conceptId: "template-for-loop",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "템플릿에서 `articles` 목록의 각 제목을 출력하는 코드로 알맞은 것은?",
      options: [
        "{% for article of articles %}{{ article.title }}{% endfor %}",
        "{% for article in articles %}{{ article.title }}{% endfor %}",
        "{{ for article in articles }}{{ article.title }}{{ endfor }}",
        "{% for articles in article %}{{ article.title }}{% endfor %}",
      ],
      answer: 1,
      explanation: "DTL 반복문은 `{% for 항목 in 목록 %}`으로 시작하고 `{% endfor %}`로 닫습니다."
    },
    {
      id: "mock2-007-template-block-inheritance",
      conceptId: "template-block-inheritance",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "부모 템플릿의 `{% block content %}` 영역에 자식 페이지 내용을 넣으려 한다. 자식 템플릿의 작성 방법은?",
      options: [
        "{% include 'base.html' %} 다음에 {% block content %}...{% endblock content %}를 작성한다.",
        "{% block content %}...{% endblock content %} 다음에 {% extends 'base.html' %}를 작성한다.",
        "{% extends 'base.html' %} 다음에 {{ block content }}...{{ endblock }}를 작성한다.",
        "{% extends 'base.html' %} 다음에 {% block content %}...{% endblock content %}를 작성한다.",
      ],
      answer: 3,
      explanation: "상속은 extends로 지정하며, 부모의 영역은 이름이 같은 block으로 재정의합니다."
    },
    {
      id: "mock2-009-model-auto-datetime",
      conceptId: "model-auto-datetime",
      difficulty: "medium",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "다음 모델에서 새 글 생성 시각과 수정 시각을 자동 기록하고 싶다. 필드 옵션을 바르게 지정한 것은?",
      options: [
        "created_at과 updated_at 모두 auto_now_add=True를 지정한다.",
        "created_at에는 auto_now=True, updated_at에는 auto_now_add=True를 지정한다.",
        "created_at과 updated_at 모두 auto_now=True를 지정한다.",
        "created_at에는 auto_now_add=True, updated_at에는 auto_now=True를 지정한다.",
      ],
      answer: 3,
      explanation: "auto_now_add는 생성 당시, auto_now는 save 시 갱신 시각을 기록합니다."
    },
    {
      id: "mock2-010-migration-file-vs-table",
      conceptId: "migration-file-vs-table",
      difficulty: "medium",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "모델에 `content` 필드를 추가한 뒤 `makemigrations`만 실행했다. 현재 상태를 정확히 설명한 것은?",
      options: [
        "admin 화면에만 필드가 추가되고 DB와 migration 파일에는 변화가 없다.",
        "모델 필드는 Python 코드에만 있으므로 migration 파일은 생성할 수 없다.",
        "변경 내용을 담은 migration 파일이 생겼지만 DB 스키마에는 아직 반영되지 않았다.",
        "DB 스키마는 변경됐지만 migration 파일은 migrate 시점에 새로 생성된다.",
      ],
      answer: 2,
      explanation: "makemigrations는 변경 이력 파일 생성, migrate는 DB 반영 단계입니다."
    },
    {
      id: "mock2-013-orm-icontains",
      conceptId: "orm-icontains",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "제목에 `django`가 포함된 글을 대소문자 구분 없이 검색할 때 사용할 lookup은?",
      options: [
        "Article.objects.filter(title__iexact=\"django\")",
        "Article.objects.get(title__icontains=\"django\")",
        "Article.objects.filter(title__contains=\"django\")",
        "Article.objects.filter(title__icontains=\"django\")",
      ],
      answer: 3,
      explanation: "icontains는 대소문자 구분 없는 포함 검색이며, filter는 여러 결과를 처리합니다."
    },
    {
      id: "mock2-014-orm-save-existing-object",
      conceptId: "orm-save-existing-object",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "이미 DB에 저장된 `article` 객체의 제목만 변경한 뒤 `article.save()`를 호출했다. 결과로 옳은 것은?",
      options: [
        "변경된 값은 메모리에만 남는다.",
        "기존 레코드가 삭제된 뒤 생성된다.",
        "기존 레코드의 제목이 갱신된다.",
        "같은 내용으로 새 레코드가 추가된다.",
      ],
      answer: 2,
      explanation: "기존 기본 키를 가진 모델 인스턴스의 save는 해당 행을 갱신합니다."
    },
    {
      id: "mock2-015-post-delete-method-check",
      conceptId: "post-delete-method-check",
      difficulty: "medium",
      category: "ORM with View",
      questionType: "multiple-choice",
      prompt: "삭제 기능의 View가 GET 요청에서도 삭제를 실행하고 있다. 가장 적절한 수정은?",
      options: [
        "POST 요청에서만 삭제 코드를 실행하도록 request.method를 확인한다.",
        "삭제 직전에 render를 호출해 템플릿을 먼저 표시한다.",
        "GET 요청에만 CSRF 토큰을 전달하도록 템플릿을 변경한다.",
        "삭제 기능에 사용할 URL 이름을 delete에서 detail로 바꾼다.",
      ],
      answer: 0,
      explanation: "데이터를 변경하는 삭제 처리는 GET 조회와 분리하여 POST에서 처리합니다."
    },
    {
      id: "mock2-016-post-redirect-get",
      conceptId: "post-redirect-get",
      difficulty: "medium",
      category: "ORM with View",
      questionType: "multiple-choice",
      prompt: "게시글 생성 POST 요청을 처리한 뒤 `redirect`를 반환한다. 이 구성의 주된 이점은?",
      options: [
        "렌더링에 사용되는 Template을 생략해도 화면 HTML이 자동 생성된다.",
        "저장 전 Form의 유효성 검사를 생략해도 DB 오류가 발생하지 않는다.",
        "저장 완료 화면을 새로고침해도 같은 POST 재제출을 피할 수 있다.",
        "처음 POST 요청에서 조회한 데이터가 다음 요청에도 자동으로 유지된다.",
      ],
      answer: 2,
      explanation: "POST 완료 후 새로운 GET 요청으로 화면을 보여주는 PRG 흐름입니다."
    },
    {
      id: "mock2-019-form-invalid-post-render",
      conceptId: "form-invalid-post-render",
      difficulty: "medium",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "POST 데이터를 바인딩한 ModelForm에서 `is_valid()`가 False였다. 일반적인 View 처리로 알맞은 것은?",
      options: [
        "검증 오류가 담긴 form을 그대로 템플릿에 다시 전달한다.",
        "request.POST를 직접 DB에 넣고 나서 오류 메시지를 표시한다.",
        "form.save()를 실행한 뒤 수정 화면으로 redirect한다.",
        "입력 데이터를 무시하고 빈 form으로 교체한 뒤 저장한다.",
      ],
      answer: 0,
      explanation: "유효성 검사에 실패한 바인딩 Form은 오류 정보를 가진 채 다시 렌더링할 수 있습니다."
    },
    {
      id: "mock2-021-media-upload-parameters",
      conceptId: "media-upload-parameters",
      difficulty: "medium",
      category: "Static Files & Media",
      questionType: "multiple-choice",
      prompt: "이미지를 선택한 Form을 POST로 전송했지만 View에서 파일이 비어 있다. 가장 먼저 점검할 조합은?",
      options: [
        "STATIC_URL과 View의 request.POST 인덱싱 여부",
        "STATICFILES_DIRS와 View의 request.session 여부",
        "form의 action과 View의 request.GET 전달 여부",
        "form의 enctype과 View의 request.FILES 전달 여부",
      ],
      answer: 3,
      explanation: "업로드 파일은 multipart/form-data로 전송하고 request.FILES로 Form에 바인딩합니다."
    },
    {
      id: "mock2-023-signup-no-auto-login",
      conceptId: "signup-no-auto-login",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "`UserCreationForm`으로 회원가입 처리를 구현했다. `form.save()` 이후 상태에 대한 설명으로 옳은 것은?",
      options: [
        "User 객체의 생성 여부는 별도 migrate 호출이 있어야 확인할 수 있다.",
        "User 객체는 생성되지만 로그인 처리에는 별도 auth_login 호출이 필요하다.",
        "User 객체가 임시 저장되며 auth_login 호출 때 DB에 최종 저장된다.",
        "User 객체가 생성되는 즉시 브라우저의 로그인 세션도 자동 생성된다.",
      ],
      answer: 1,
      explanation: "회원가입과 로그인은 별도 작업입니다. 필요하면 auth_login(request, user)를 호출합니다."
    },
    {
      id: "mock2-024-get-user-model-custom-form",
      conceptId: "get-user-model-custom-form",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "Custom User 모델을 사용하는 프로젝트에서 사용자 모델 클래스를 받아오려 한다. 가장 적절한 표현은?",
      options: [
        "request.user()",
        "settings.AUTH_USER_MODEL()",
        "AuthenticationForm.get_user()",
        "get_user_model()",
      ],
      answer: 3,
      explanation: "get_user_model()은 설정에 연결된 User 모델 클래스를 반환합니다."
    },
    {
      id: "mock2-025-login-required-not-owner",
      conceptId: "login-required-not-owner",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "게시글 수정 View에 `@login_required`를 적용했다. 추가로 확인할 항목으로 맞는 것은?",
      options: [
        "로그인한 사용자는 모든 게시글을 수정할 수 있으므로 별도 확인이 필요 없다.",
        "CSRF 토큰이 있으면 수정할 게시글의 소유권도 자동 검증된다.",
        "로그인한 사용자가 해당 게시글을 수정할 권한이 있는지도 확인한다.",
        "템플릿에서 수정 링크를 감추면 다른 사용자의 접근이 자동 차단된다.",
      ],
      answer: 2,
      explanation: "login_required는 인증 여부만 확인하므로 소유권 등 권한 검사는 별도로 해야 합니다."
    },
    {
      id: "mock2-027-url-include-function",
      conceptId: "url-include-function",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "short-answer",
      prompt: "프로젝트의 URLconf에서 앱의 urls.py를 연결할 때 사용하는 Django 함수 이름만 쓰시오. (괄호 제외)",
      options: [],
      answer: null,
      acceptedAnswers: ["include"],
      explanation: "include는 하위 URL 패턴을 프로젝트의 URL에 연결합니다."
    },
    {
      id: "mock2-029-request-files-attribute",
      conceptId: "request-files-attribute",
      difficulty: "medium",
      category: "Static Files & Media",
      questionType: "short-answer",
      prompt: "업로드된 파일 정보를 View에서 참조하는 request의 속성을 대소문자와 점(.)을 포함해 쓰시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["request.FILES"],
      explanation: "파일 업로드 데이터는 request.FILES로 참조합니다."
    },
    {
      id: "mock2-030-login-required-decorator",
      conceptId: "login-required-decorator",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "short-answer",
      prompt: "로그인하지 않은 사용자의 View 접근을 제한하는 Django 데코레이터 이름을 @ 기호 없이 쓰시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["login_required"],
      explanation: "@login_required는 인증되지 않은 요청을 로그인 페이지로 유도합니다."
    },
    {
      id: "mock2-031-form-validation-post-redirect-essay",
      conceptId: "form-validation-post-redirect-essay",
      difficulty: "medium",
      category: "ORM with View",
      questionType: "essay",
      prompt: "게시글 작성 Form을 POST로 제출한 뒤 정상 저장되었을 때 redirect를 반환하고, 입력값 검증에 실패했을 때는 form을 다시 렌더링하는 이유를 각각 30자 이상으로 설명하시오.",
      options: [],
      answer: null,
      modelAnswer: "검증에 성공해 저장한 뒤 redirect하면 새로고침 시 같은 POST가 재전송되는 일을 줄일 수 있다. 검증에 실패하면 오류가 담긴 form을 다시 렌더링하여 사용자가 입력값을 수정하도록 한다.",
      rubricKeywords: [
        "POST",
        "redirect (또는 리다이렉트)",
        "중복 (또는 재전송/새로고침)",
        "검증 (또는 오류)",
        "form (또는 폼/입력)",
      ],
      minLength: 30,
      explanation: "저장 성공 시 PRG 흐름과 검증 실패 시 오류를 보존한 폼 재표시를 모두 설명해야 합니다. 자동 채점 결과는 의미 검수가 필요합니다."
    },
    {
      id: "mock2-032-modelform-new-vs-update",
      conceptId: "modelform-new-vs-update",
      difficulty: "medium",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "게시글 작성 화면과 수정 화면을 모두 ArticleForm으로 구현한다. Form을 만들 때 차이가 나는 부분은?",
      options: [
        "수정에서는 ModelForm 대신 반드시 일반 forms.Form으로 교체한다.",
        "작성에서는 forms.Form으로 바꾸어야만 form.save()를 호출할 수 있다.",
        "수정에서는 기존 article을 instance로 연결하고 작성에서는 새 Form을 사용한다.",
        "작성에서는 기존 article을 instance로 연결하고 수정에서는 새 Form을 사용한다.",
      ],
      answer: 2,
      explanation: "동일한 ModelForm을 사용하더라도 작성과 수정은 instance 연결 여부가 다릅니다."
    }
  ],
  hard: [

  ],
  extreme: [

  ],
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
