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
      id: "mock4-001-client-server-request-response",
      conceptId: "client-server-request-response",
      difficulty: "easy",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "웹 서비스에서 브라우저와 Django 서버의 역할을 설명한 문장으로 적절한 것은?",
      options: [
        "브라우저는 요청을 보내고 Django 서버는 처리 결과를 응답한다.",
        "브라우저는 DB 테이블을 직접 수정하고 Django는 화면만 표시한다.",
        "브라우저는 요청 메서드를 정하지 않고 Django 서버가 요청을 먼저 전송한다.",
        "브라우저는 응답을 생성하고 Django 서버는 이를 요청으로 해석한다.",
      ],
      answer: 0,
      explanation: "HTTP 통신에서 클라이언트가 요청하고 서버가 응답합니다."
    },
    {
      id: "mock4-004-dtl-variable-length-filter",
      conceptId: "dtl-variable-length-filter",
      difficulty: "easy",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "템플릿에 문자열 변수 `title`이 전달됐다. 글자 수를 표시하려면 어느 DTL 표현을 쓰는가?",
      options: [
        "{% length title %}",
        "{% title|length %}",
        "{{ title|length }}",
        "{{ length(title) }}",
      ],
      answer: 2,
      explanation: "DTL 필터는 `{{ 변수|필터 }}` 형태로 사용합니다."
    },
    {
      id: "mock4-009-model-textfield-use",
      conceptId: "model-textfield-use",
      difficulty: "easy",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "길이가 일정하지 않은 게시글 본문을 저장할 필드로 가장 알맞은 것은?",
      options: [
        "models.DateTimeField()",
        "models.CharField()",
        "models.IntegerField()",
        "models.TextField()",
      ],
      answer: 3,
      explanation: "게시글처럼 길이가 큰 문자열은 일반적으로 TextField를 사용합니다."
    },
    {
      id: "mock4-011-orm-all-type",
      conceptId: "orm-all-type",
      difficulty: "easy",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "`articles = Article.objects.all()`을 실행한 직후 `articles`에 관한 설명으로 맞는 것은?",
      options: [
        "Article 객체의 pk만 담은 Python dict다.",
        "Article 객체들을 조회하는 QuerySet이다.",
        "Article 객체를 한 건만 담은 Model 인스턴스다.",
        "Article 테이블을 그대로 복제한 별도 DB 테이블이다.",
      ],
      answer: 1,
      explanation: "all()은 해당 모델의 전체 QuerySet을 반환합니다."
    },
    {
      id: "mock4-027-auth-user-model-setting",
      conceptId: "auth-user-model-setting",
      difficulty: "easy",
      category: "Authentication System",
      questionType: "short-answer",
      prompt: "프로젝트에서 사용할 Custom User 모델을 `accounts.User`로 등록할 때 settings.py에 쓰는 설정 상수명을 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["AUTH_USER_MODEL"],
      explanation: "AUTH_USER_MODEL은 현재 프로젝트에서 사용할 사용자 모델을 지정합니다."
    },
    {
      id: "mock4-031-url-patterns-variable",
      conceptId: "url-patterns-variable",
      difficulty: "easy",
      category: "Template & URLs",
      questionType: "short-answer",
      prompt: "Django의 urls.py에서 경로 규칙들을 저장하는 리스트 변수명을 정확히 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["urlpatterns"],
      explanation: "Django URLconf는 urlpatterns 목록에 경로들을 정의합니다."
    }
  ],
  medium: [
    {
      id: "mock4-002-installed-app-configuration",
      conceptId: "installed-app-configuration",
      difficulty: "medium",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "`python manage.py startapp boards`로 앱을 생성했다. 프로젝트에서 앱을 사용하도록 등록할 위치는?",
      options: [
        "models.py의 Meta",
        "settings.py의 MIDDLEWARE",
        "settings.py의 INSTALLED_APPS",
        "manage.py의 urlpatterns",
      ],
      answer: 2,
      explanation: "생성한 앱은 settings.py의 INSTALLED_APPS에 등록합니다."
    },
    {
      id: "mock4-003-project-route-and-app-route",
      conceptId: "project-route-and-app-route",
      difficulty: "medium",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "프로젝트 urls.py와 boards/urls.py를 분리했다. `/boards/5/` 요청이 View에 도달하도록 설정한 코드 조합은?",
      options: [
        "프로젝트에 path('boards/', views.detail), 앱에 path('<int:pk>/', include('boards.urls'))",
        "프로젝트에 path('boards/', include('boards.urls')), 앱에 path('<int:pk>/', views.detail, name='detail')",
        "프로젝트에 path('boards/', views.detail), 앱에 path('detail/', views.detail, name='detail')",
        "프로젝트에 path('<int:pk>/', include('boards.urls')), 앱에 path('boards/', views.detail)",
      ],
      answer: 1,
      explanation: "프로젝트 경로 접두사와 앱의 변수 경로가 결합되어 최종 URL을 구성합니다."
    },
    {
      id: "mock4-005-dtl-condition-syntax",
      conceptId: "dtl-condition-syntax",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "`is_notice`가 참인 글에만 공지 표시를 하려 한다. 올바른 DTL 조건문은?",
      options: [
        "{% elif is_notice %}공지{% endif %}",
        "{% if is_notice %}공지{% endfor %}",
        "{{ if is_notice }}공지{{ endif }}",
        "{% if is_notice %}공지{% endif %}",
      ],
      answer: 3,
      explanation: "DTL의 if 태그는 {% if %}로 시작하여 {% endif %}로 종료합니다."
    },
    {
      id: "mock4-006-url-reverse-pk",
      conceptId: "url-reverse-pk",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "`<int:article_pk>`를 받는 URL 패턴에 게시글의 pk를 연결하는 템플릿 코드는?",
      options: [
        "{% url 'articles:detail' %}",
        "{% url 'articles:detail' article.pk %}",
        "{% url 'articles.detail' article.pk %}",
        "{% url 'articles:detail' 'article.pk' %}",
      ],
      answer: 1,
      explanation: "URL 이름 공간과 name을 :으로 연결하고, 변수 경로에 필요한 값을 전달합니다."
    },
    {
      id: "mock4-007-html-form-name",
      conceptId: "html-form-name",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "다음 HTML을 전송했다. Django View에서 `keyword` 값을 읽으려면 어떤 속성이 기준이 되는가?",
      code: "<form method=\"get\">\n<input id=\"search\" class=\"search-input\" type=\"text\" name=\"keyword\">\n</form>",
      options: [
        "class=\"search-input\"",
        "id=\"search\"",
        "type=\"text\"",
        "name=\"keyword\"",
      ],
      answer: 3,
      explanation: "폼 데이터는 name 속성을 키로 사용합니다."
    },
    {
      id: "mock4-008-field-null-blank-distinction",
      conceptId: "field-null-blank-distinction",
      difficulty: "medium",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "`CharField(blank=False, null=True)`에 대한 설명 중 맞는 것은?",
      options: [
        "폼 입력 검증에서는 빈 값을 허용하지 않으며 DB는 NULL을 허용한다.",
        "폼 입력 검증에서는 빈 값을 허용하며 DB는 NULL을 허용하지 않는다.",
        "폼 입력 검증과 DB 저장 모두 빈 값을 허용하지 않는다.",
        "폼 입력 검증과 DB 저장 모두 무조건 빈 값을 허용한다.",
      ],
      answer: 0,
      explanation: "blank는 Form에서, null은 DB에서 적용되는 설정입니다."
    },
    {
      id: "mock4-010-admin-superuser-command",
      conceptId: "admin-superuser-command",
      difficulty: "medium",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "관리자 사이트에 로그인할 관리자 계정을 만들 때 사용할 명령은?",
      options: [
        "python manage.py makemigrations",
        "python manage.py runserver",
        "python manage.py createsuperuser",
        "python manage.py migrate",
      ],
      answer: 2,
      explanation: "createsuperuser는 관리자 권한 계정 생성 명령입니다."
    },
    {
      id: "mock4-012-orm-pk-get",
      conceptId: "orm-pk-get",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "pk가 7인 글을 단일 인스턴스로 가져오는 ORM 코드는?",
      options: [
        "Article.objects.get(pk=7)",
        "Article.objects.all(pk=7)",
        "Article.objects.create(pk=7)",
        "Article.objects.filter(pk=7)",
      ],
      answer: 0,
      explanation: "get(pk=7)은 조건에 맞는 한 객체를 조회합니다."
    },
    {
      id: "mock4-013-contains-vs-icontains",
      conceptId: "contains-vs-icontains",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "제목이 `Django`와 `django`인 두 글을 같은 검색 결과에 포함하려 한다. 적합한 필터는?",
      options: [
        "title__startswith=\"django\"",
        "title__iexact=\"djan\"",
        "title__contains=\"django\"",
        "title__icontains=\"django\"",
      ],
      answer: 3,
      explanation: "대소문자 구분 없는 부분 문자열 검색에는 icontains를 사용합니다."
    },
    {
      id: "mock4-014-orm-less-than",
      conceptId: "orm-less-than",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "조회 대상이 `pk < 10`인 게시글들이다. 올바른 ORM 조건은?",
      options: [
        "pk__lt=10",
        "pk__gt=10",
        "pk__lte=10",
        "pk__gte=10",
      ],
      answer: 0,
      explanation: "__lt는 미만을 의미하므로 10을 제외합니다."
    },
    {
      id: "mock4-015-instance-not-yet-in-db",
      conceptId: "instance-not-yet-in-db",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "다음 코드 실행 직후 DB의 Article 행 개수는? (초기에 테이블이 비어 있으며 필수 필드는 모두 충족)",
      code: "a = Article(title=\"A\", content=\"1\")\nb = Article.objects.create(title=\"B\", content=\"2\")",
      options: [
        "0개",
        "2개",
        "1개",
        "3개",
      ],
      answer: 2,
      explanation: "Article(...)는 메모리에 객체를 만들고 objects.create(...)는 DB에 즉시 저장합니다."
    },
    {
      id: "mock4-016-render-context-return",
      conceptId: "render-context-return",
      difficulty: "medium",
      category: "ORM with View",
      questionType: "multiple-choice",
      prompt: "다음 코드에서 `context`가 맡는 역할은?",
      code: "def index(request):\n    context = {\"articles\": Article.objects.all()}\n    return render(request, \"articles/index.html\", context)",
      options: [
        "DB 테이블을 새로 만드는 설정을 전달한다.",
        "관리자 계정 권한을 검사하는 객체를 전달한다.",
        "클라이언트에 요청할 URL 이름을 전달한다.",
        "템플릿에서 사용할 변수와 값을 전달한다.",
      ],
      answer: 3,
      explanation: "render의 세 번째 인자는 템플릿 렌더링에 사용할 context 데이터입니다."
    },
    {
      id: "mock4-017-redirect-name-and-parameter",
      conceptId: "redirect-name-and-parameter",
      difficulty: "medium",
      category: "ORM with View",
      questionType: "multiple-choice",
      prompt: "게시글 저장 후 생성된 글의 상세 페이지로 이동하려 한다. 적절한 호출은?",
      options: [
        "render(request, article.pk, 'articles:detail')",
        "redirect('articles:detail', article.pk)",
        "redirect('articles:detail')",
        "render('articles:detail', article.pk)",
      ],
      answer: 1,
      explanation: "redirect는 이름 기반 URL과 필요한 동적 인자를 받아 재요청할 위치를 지정합니다."
    },
    {
      id: "mock4-018-modelform-valid-save",
      conceptId: "modelform-valid-save",
      difficulty: "medium",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "다음 View 코드가 게시글을 저장하는 조건으로 가장 정확한 것은?",
      code: "form = ArticleForm(request.POST)\nif form.is_valid():\n    form.save()",
      options: [
        "입력 데이터가 하나라도 있으면 검증 없이 저장한다.",
        "POST 입력값을 바인딩한 Form이 유효할 때 저장한다.",
        "Form이 유효하지 않을 때 오류 처리를 위해 우선 저장한다.",
        "GET으로 페이지를 연 경우에도 Form을 생성하는 즉시 저장한다.",
      ],
      answer: 1,
      explanation: "form.is_valid()를 통과한 뒤 form.save()를 호출해야 정상 저장됩니다."
    },
    {
      id: "mock4-020-widget-html-input-class",
      conceptId: "widget-html-input-class",
      difficulty: "medium",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "사용자 입력 칸에 CSS 클래스를 적용하고 싶다. ModelForm에서 가장 직접적으로 설정할 수 있는 것은?",
      options: [
        "Meta의 model",
        "Widget의 attrs",
        "View의 request.GET",
        "Model의 null",
      ],
      answer: 1,
      explanation: "attrs는 Widget이 렌더링하는 HTML 속성을 지정합니다."
    },
    {
      id: "mock4-021-upload-file-model-form",
      conceptId: "upload-file-model-form",
      difficulty: "medium",
      category: "Static Files & Media",
      questionType: "multiple-choice",
      prompt: "Form이 파일 첨부를 지원할 때 POST 처리 구문으로 알맞은 것은?",
      options: [
        "ArticleForm(request.POST, request.FILES)",
        "ArticleForm(request.POST, MEDIA_ROOT)",
        "ArticleForm(request.FILES, request.GET)",
        "ArticleForm(request.GET, STATIC_URL)",
      ],
      answer: 0,
      explanation: "ModelForm은 일반 입력과 파일 입력을 각각 request.POST, request.FILES로 받습니다."
    },
    {
      id: "mock4-022-template-static-img-tag",
      conceptId: "template-static-img-tag",
      difficulty: "medium",
      category: "Static Files & Media",
      questionType: "multiple-choice",
      prompt: "앱 static 폴더에 `images/logo.png`가 있다. 템플릿에서 사용하는 코드로 옳은 것은?",
      options: [
        "{% load media %}<img src=\"{% static 'images/logo.png' %}\">",
        "{% load static %}<img src=\"{% media 'images/logo.png' %}\">",
        "{% load static %}<img src=\"{% static 'images/logo.png' %}\">",
        "{% load static %}<img src=\"{{ static 'images/logo.png' }}\">",
      ],
      answer: 2,
      explanation: "static 태그 라이브러리를 불러와 경로를 {% static %}으로 생성합니다."
    },
    {
      id: "mock4-023-auth-user-in-request",
      conceptId: "auth-user-in-request",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "로그인한 사용자의 회원정보 수정 View에서 수정 대상을 가져오는 방법으로 적절한 것은?",
      options: [
        "AuthenticationForm().get_user()를 인증 절차 없이 호출한다.",
        "request.POST[\"username\"]을 사용자 모델 클래스로 사용한다.",
        "request.session을 User 모델 인스턴스로 직접 사용한다.",
        "request.user를 수정할 인스턴스로 사용한다.",
      ],
      answer: 3,
      explanation: "인증 미들웨어가 현재 요청의 사용자 객체를 request.user에 연결합니다."
    },
    {
      id: "mock4-024-userchangeform-fields-restriction",
      conceptId: "userchangeform-fields-restriction",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "일반 사용자에게 이메일과 이름만 수정하도록 제공하고 싶다. CustomUserChangeForm에서 필요한 설정은?",
      options: [
        "Meta.fields를 '__all__'로 설정해 전체 필드를 표시한다.",
        "Meta.fields를 ('first_name', 'last_name', 'email')로 제한한다.",
        "Meta.exclude를 ('first_name', 'last_name', 'email')로 설정한다.",
        "Meta.model을 AuthenticationForm으로 지정해 로그인 폼을 사용한다.",
      ],
      answer: 1,
      explanation: "CustomUserChangeForm의 fields로 일반 사용자가 수정할 필드만 선택합니다."
    },
    {
      id: "mock4-025-password-form-first-parameter",
      conceptId: "password-form-first-parameter",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "로그인한 사용자의 비밀번호 변경 POST 데이터를 검증하는 Form 생성 방법으로 적절한 것은?",
      options: [
        "PasswordChangeForm(request.user, request.POST)",
        "PasswordChangeForm(request.POST, instance=request.user)",
        "PasswordChangeForm(request.POST, request.FILES)",
        "PasswordChangeForm(request, request.POST)",
      ],
      answer: 0,
      explanation: "PasswordChangeForm은 사용자 객체를 첫 인자로, POST 데이터를 다음 인자로 받습니다."
    },
    {
      id: "mock4-028-anonymous-user-class",
      conceptId: "anonymous-user-class",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "short-answer",
      prompt: "로그인하지 않은 요청에서 request.user에 들어가는 익명 사용자 객체의 클래스 이름을 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["AnonymousUser"],
      explanation: "로그인하지 않은 경우 request.user는 AnonymousUser 인스턴스입니다."
    },
    {
      id: "mock4-029-authentication-form-get-user",
      conceptId: "authentication-form-get-user",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "short-answer",
      prompt: "AuthenticationForm이 유효성 검사를 통과한 뒤 인증된 사용자를 꺼내는 메서드 이름만 적으시오. (괄호 제외)",
      options: [],
      answer: null,
      acceptedAnswers: ["get_user"],
      explanation: "AuthenticationForm.get_user()는 인증된 사용자 객체를 반환합니다."
    },
    {
      id: "mock4-030-upload-enctype",
      conceptId: "upload-enctype",
      difficulty: "medium",
      category: "Static Files & Media",
      questionType: "short-answer",
      prompt: "파일 업로드를 위한 HTML form의 enctype 값 전체를 정확히 적으시오. (따옴표 제외)",
      options: [],
      answer: null,
      acceptedAnswers: ["multipart/form-data"],
      explanation: "파일 전송에는 multipart/form-data 인코딩이 필요합니다."
    },
    {
      id: "mock4-032-signup-and-login-difference-essay",
      conceptId: "signup-and-login-difference-essay",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "essay",
      prompt: "회원가입 Form의 `save()`만 실행했는데 사용자가 로그인된 상태가 아니다. 회원가입과 로그인 처리가 어떻게 다른지, 가입 직후 로그인까지 하려면 무엇을 추가해야 하는지 30자 이상으로 설명하시오.",
      options: [],
      answer: null,
      modelAnswer: "회원가입 Form의 save는 User 계정을 데이터베이스에 생성하지만 로그인 세션을 만들지는 않는다. 가입 후 로그인까지 진행하려면 저장된 User 객체를 auth_login(request, user)에 전달해야 한다.",
      rubricKeywords: [
        "User (또는 사용자/계정)",
        "저장 (또는 생성/가입)",
        "세션 (또는 로그인)",
        "auth_login (또는 login())",
      ],
      minLength: 30,
      explanation: "User 저장과 세션 연결이 별도임을 설명하고 인증 함수 호출까지 제시해야 합니다. 의미 관계는 수동 확인이 필요합니다."
    }
  ],
  hard: [
    {
      id: "mock4-019-form-instance-views",
      conceptId: "form-instance-views",
      difficulty: "hard",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "수정 화면에서는 기존 제목이 보이지만 제출하면 원본이 그대로 남고 새 글이 만들어진다. 가장 가능성 높은 원인은?",
      options: [
        "POST에서 ModelForm 생성 시 instance를 전달하지 않았다.",
        "GET에서 ModelForm을 만드는 대신 render로 입력 폼을 보였기 때문이다.",
        "POST에서 ModelForm 생성 시 data와 instance를 함께 전달했기 때문이다.",
        "GET에서 ModelForm 생성 시 instance를 전달했기 때문이다.",
      ],
      answer: 0,
      explanation: "GET의 기존 값 표시는 맞지만 POST에서 instance가 빠지면 새 객체를 생성할 수 있습니다."
    },
    {
      id: "mock4-026-password-session-preserve",
      conceptId: "password-session-preserve",
      difficulty: "hard",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "비밀번호를 바꾼 뒤 사용자가 로그인 상태를 유지하게 하려면 저장 직후 무엇을 해야 하는가?",
      options: [
        "auth_logout(request)를 호출한 뒤 화면을 렌더링한다.",
        "AuthenticationForm(request.POST).save()를 호출한다.",
        "update_session_auth_hash(request, user)를 호출한다.",
        "get_user_model()을 호출해 User 클래스를 다시 읽는다.",
      ],
      answer: 2,
      explanation: "비밀번호 변경 후 update_session_auth_hash를 호출하면 현재 세션 인증 상태를 유지할 수 있습니다."
    }
  ],
  extreme: [

  ],
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
