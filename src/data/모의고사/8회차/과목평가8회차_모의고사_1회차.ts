
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
      id: "mock1-001-venv-dependency-management",
      conceptId: "django-venv-requirements",
      difficulty: "easy",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "Django 프로젝트에서 가상 환경(venv)과 의존성 목록을 관리하는 방법으로 옳은 것은?",
      options: [
        "프로젝트의 venv 폴더 전체를 원격 Git 저장소에 직접 커밋하여 팀원들과 공유한다.",
        "한 번 생성한 가상 환경은 컴퓨터의 모든 Python 프로젝트에 자동으로 기본 적용된다.",
        "현재 가상 환경의 패키지 목록을 requirements.txt로 저장하여 동일한 환경을 재현한다.",
        "pip freeze 명령어를 실행하면 텍스트 파일에 적힌 패키지들이 가상 환경에 자동 설치된다."
      ],
      answer: 2,
      explanation: "가상 환경 폴더(venv) 자체는 Git에 공유하지 않으며, pip freeze > requirements.txt로 패키지 목록을 기록한 뒤 다른 환경에서 pip install -r requirements.txt로 설치하여 환경을 재현합니다.",
      hint: "가상 환경 폴더 자체를 공유하는 대신 패키지 버전 목록 파일을 활용하는 방식을 떠올려 보세요."
    },
    {
      id: "mock1-002-mvc-mtv-pattern-mapping",
      conceptId: "django-mtv-design-pattern",
      difficulty: "easy",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "일반적인 MVC 디자인 패턴과 Django의 MTV 패턴 구성 요소를 서로 대응시킬 때 연결이 올바른 것은?",
      options: [
        "MVC의 View는 MTV의 View에 대응하고, Controller는 Template에 대응한다.",
        "MVC의 View는 MTV의 Template에 대응하고, Controller는 View에 대응한다.",
        "MVC의 Model은 MTV의 View에 대응하고, View는 Controller에 대응한다.",
        "MVC의 Controller는 MTV의 Model에 대응하고, View는 Template에 대응한다."
      ],
      answer: 1,
      explanation: "화면 표현을 담당하는 MVC의 View는 Django의 Template에 대응하며, 요청을 받아 로직을 제어하는 MVC의 Controller는 Django의 View에 대응합니다.",
      hint: "화면을 보여주는 역할과 요청 흐름을 제어하는 역할이 Django에서 어떤 이름으로 불리는지 비교해 보세요."
    },
    {
      id: "mock1-003-dtl-syntax-components",
      conceptId: "dtl-variable-filter-tag-comment",
      difficulty: "easy",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "Django Template Language(DTL)의 기본 문법 표기와 역할 연결로 옳은 것은?",
      options: [
        "{% title|length %} 표기를 사용하여 변수 값에 길이 변환 필터를 적용한다.",
        "{{ if user.is_authenticated }} 표기를 사용하여 조건 분기 로직을 제어한다.",
        "{% comment %} 한 줄 주석 {% endcomment %} 표기만 유일하게 주석으로 인정된다.",
        "{{ article.title }} 표기를 사용하여 context로 전달된 객체의 속성값을 출력한다."
      ],
      answer: 3,
      explanation: "DTL에서 변수 출력과 필터는 {{ variable|filter }} 중괄호 두 겹을 사용하고, 조건·반복 태그는 {% tag %}를 사용합니다. 한 줄 주석은 {# 주석 #} 표기도 지원합니다.",
      hint: "변수 출력용 중괄호 표기와 제어 태그용 퍼센트 표기를 구분해 보세요."
    },
    {
      id: "mock1-004-html-form-query-string",
      conceptId: "html-form-input-name-request-get",
      difficulty: "easy",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "GET 방식의 HTML form에서 사용자가 입력한 검색어를 서버의 View 함수에서 꺼낼 때 기준이 되는 HTML 속성과 조회 표현은?",
      code: "<form action=\"/articles/search/\" method=\"GET\">\n  <input type=\"text\" id=\"search-box\" name=\"keyword\" class=\"form-input\">\n  <button type=\"submit\">검색</button>\n</form>",
      options: [
        "input 태그의 name 속성을 기준으로 request.GET.get('keyword')로 조회한다.",
        "input 태그의 id 속성을 기준으로 request.GET.get('search-box')로 조회한다.",
        "input 태그의 class 속성을 기준으로 request.POST.get('form-input')로 조회한다.",
        "form 태그의 action 속성을 기준으로 request.POST.get('keyword')로 조회한다."
      ],
      answer: 0,
      explanation: "브라우저가 form 데이터를 제출할 때는 input 요소의 name 속성값이 키가 되며, GET 방식의 쿼리 문자열 데이터는 View에서 request.GET.get('keyword')로 조회합니다.",
      hint: "쿼리 문자열(?key=value)의 key가 HTML input의 어떤 속성에서 만들어지는지 확인해 보세요."
    },
    {
      id: "mock1-005-model-field-options-null-blank",
      conceptId: "model-null-blank-auto-now",
      difficulty: "easy",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "Django 모델 필드에 지정하는 옵션인 null, blank, auto_now_add, auto_now의 동작 설명으로 옳은 것은?",
      options: [
        "null=True는 폼 유효성 검사 단계에서 빈 입력값을 허용하도록 지정하는 옵션이다.",
        "blank=True는 폼 유효성 검사 단계에서 사용자가 빈 값을 제출해도 통과시키는 옵션이다.",
        "auto_now_add=True는 인스턴스가 save()로 수정될 때마다 현재 시각으로 값을 갱신한다.",
        "auto_now=True는 데이터가 최초 생성될 때만 시각을 기록하고 이후 수정 시에는 유지한다."
      ],
      answer: 1,
      explanation: "null은 데이터베이스 컬럼의 NULL 허용 여부이고, blank는 Form 유효성 검사 시 빈 값 허용 여부입니다. 최초 생성 시각 고정은 auto_now_add, 저장 시마다 갱신은 auto_now입니다.",
      hint: "DB 저장 제약 조건(null)과 입력 폼 검증 조건(blank)의 역할 차이를 떠올려 보세요."
    },
    {
      id: "mock1-006-makemigrations-command",
      conceptId: "django-makemigrations-command",
      difficulty: "easy",
      category: "Model",
      questionType: "short-answer",
      prompt: "models.py에 작성하거나 수정한 모델 변경 사항을 바탕으로 새로운 마이그레이션 파일(변경 이력 파일)을 생성할 때 `python manage.py` 뒤에 입력하는 명령어 한 단어를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["makemigrations"],
      explanation: "모델의 변경 내역을 감지하여 migrations 폴더 안에 변경 이력 설계도 파일을 생성하는 명령어는 makemigrations이며, 이를 실제 DB 테이블에 반영하는 명령어는 migrate입니다.",
      hint: "마이그레이션 파일을 새로 만든다(make)는 의미의 복수형 명령어 한 단어입니다."
    },
    {
      id: "mock1-007-csrf-token-template-tag",
      conceptId: "django-csrf-token-tag",
      difficulty: "easy",
      category: "ORM with View",
      questionType: "short-answer",
      prompt: "POST 방식의 HTML `<form>` 내부에서 사이트 간 요청 위조(CSRF) 공격을 방어하기 위해 숨겨진 토큰 입력 요소를 생성하는 DTL 태그의 핵심 키워드를 작성하시오. (`{% %}` 기호는 제외하고 키워드만 작성)",
      options: [],
      answer: null,
      acceptedAnswers: ["csrf_token"],
      explanation: "POST 요청 시 위조된 요청이 아님을 검증하기 위해 form 내부에 {% csrf_token %} 태그를 작성하며, 누락 시 기본적으로 403 Forbidden 응답이 반환됩니다.",
      hint: "csrf와 token 두 단어를 밑줄(_)로 연결한 키워드만 작성하세요."
    },
    {
      id: "mock1-008-modelform-fields-all",
      conceptId: "modelform-meta-fields-all",
      difficulty: "easy",
      category: "Form & ModelForm",
      questionType: "short-answer",
      prompt: "ModelForm의 내부 `Meta` 클래스에서 연결된 모델의 사용 가능한 모든 필드를 Form에 포함할 때 `fields` 속성에 지정하는 특수 문자열 표기를 작성하시오. (따옴표는 제외하고 밑줄을 포함하여 작성)",
      options: [],
      answer: null,
      acceptedAnswers: ["__all__"],
      explanation: "ModelForm의 Meta 클래스에서 전체 필드를 포함할 때는 fields = '__all__'로 작성하며, 양쪽에 밑줄 두 개씩(__)을 붙여야 합니다.",
      hint: "따옴표 없이 all의 앞뒤에 밑줄 두 개씩이 붙는 던더(dunder) 형태만 작성하세요."
    },
    {
      id: "mock1-009-static-media-settings",
      conceptId: "static-vs-media-settings",
      difficulty: "easy",
      category: "Static Files & Media",
      questionType: "multiple-choice",
      prompt: "Django의 정적 파일(Static)과 미디어 파일(Media) 관련 설정 상수에 대한 설명으로 옳은 것은?",
      options: [
        "STATIC_URL은 앱 내부 static 폴더 외에 추가로 탐색할 로컬 파일시스템 경로 목록이다.",
        "STATICFILES_DIRS는 브라우저에서 정적 파일을 요청할 때 사용하는 웹 URL 접두사이다.",
        "MEDIA_URL은 사용자가 업로드한 파일이 서버 디스크에 실제로 저장되는 폴더 경로이다.",
        "MEDIA_ROOT는 사용자가 업로드한 파일이 실제로 저장되는 파일시스템의 기준 경로이다."
      ],
      answer: 3,
      explanation: "STATIC_URL과 MEDIA_URL은 웹에서 접근하는 URL 접두사이고, STATICFILES_DIRS는 정적 파일 추가 탐색 경로 목록, MEDIA_ROOT는 업로드 파일이 실제 저장되는 로컬 디렉터리 경로입니다.",
      hint: "웹 주소 접두사(_URL)와 실제 파일 저장소 경로(_ROOT, _DIRS)를 구분해 보세요."
    },
    {
      id: "mock1-010-cookie-session-storage",
      conceptId: "django-sessionid-cookie-table",
      difficulty: "easy",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "Django의 기본 세션 기반 로그인 방식에서 `sessionid`와 `django_session`이 저장되는 위치와 역할로 옳은 것은?",
      options: [
        "sessionid는 브라우저 쿠키에 저장되는 식별값이고, django_session은 서버 DB의 세션 테이블이다.",
        "sessionid에는 사용자 인증 정보가 담겨 서버에 저장되고, django_session은 브라우저가 유지하는 세션 식별 쿠키이다.",
        "sessionid 쿠키에는 로그인 사용자의 세션 데이터가 저장되고, django_session에는 쿠키의 만료 시각만 기록된다.",
        "sessionid는 서버가 발급하지만 요청마다 새로 생성되며, django_session은 현재 요청에서만 데이터를 보관한다."
      ],
      answer: 0,
      explanation: "인증에 성공하면 서버는 django_session 테이블에 세션 데이터를 저장하고, 그 세션을 식별하는 키를 sessionid라는 이름의 쿠키로 브라우저에 전달합니다.",
      hint: "브라우저가 들고 다니는 쿠키 이름과 서버 DB 테이블 이름을 짝지어 보세요."
    },
    {
      id: "mock1-011-custom-user-abstractuser",
      conceptId: "custom-user-model-setup",
      difficulty: "easy",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "Django 프로젝트에서 기본 User 모델을 대체하여 Custom User 모델을 설정할 때의 규칙으로 옳은 것은?",
      options: [
        "Custom User 모델 정의와 AUTH_USER_MODEL 등록은 첫 migrate를 완료한 이후에 수행해야 한다.",
        "AbstractBaseUser를 상속받으면 별도 필드 작성 없이도 기본 User와 동일한 모든 필드가 제공된다.",
        "AbstractUser를 상속받아 User 모델을 정의하고 settings.py에 AUTH_USER_MODEL을 지정한다.",
        "settings.py의 AUTH_USER_MODEL 값으로는 모델 클래스 객체를 직접 import하여 할당해야 한다."
      ],
      answer: 2,
      explanation: "기본 User의 필드와 기능을 유지하며 확장할 때는 AbstractUser를 상속받고, 첫 migrate 실행 전에 settings.py에 AUTH_USER_MODEL = 'accounts.User'처럼 문자열로 지정해야 합니다.",
      hint: "기본 User 구조를 그대로 갖춘 추상 클래스 이름과 설정 시점을 확인해 보세요."
    },
    {
      id: "mock1-012-is-authenticated-login-required",
      conceptId: "auth-is-authenticated-decorator",
      difficulty: "easy",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "Django에서 사용자 인증 여부를 확인하는 `is_authenticated`와 접근을 제한하는 `@login_required`의 특징으로 옳은 것은?",
      options: [
        "is_authenticated는 메서드이므로 Python View 코드에서 반드시 호출 괄호를 붙여 사용해야 한다.",
        "비로그인 요청의 request.user는 AnonymousUser 인스턴스이며 is_authenticated 값은 False이다.",
        "템플릿에서 user.is_authenticated를 사용할 때는 상단에 {% load auth %}를 선언해야 한다.",
        "@login_required 데코레이터를 붙이면 로그인 여부와 함께 게시글 작성자 본인 여부도 자동 검증된다."
      ],
      answer: 1,
      explanation: "is_authenticated는 메서드가 아닌 읽기 전용 속성이며 일반 User는 True, AnonymousUser는 False를 반환합니다. auth context processor가 기본 제공되므로 별도 load 태그 없이 사용하며, @login_required는 로그인 여부만 확인할 뿐 작성자 권한까지 검증하지는 않습니다.",
      hint: "비로그인 사용자의 객체 타입과 읽기 전용 속성의 특징을 떠올려 보세요."
    }
  ],

  medium: [
    {
      id: "mock1-013-urls-path-render-arguments",
      conceptId: "django-path-and-render-flow",
      difficulty: "medium",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "다음 `urls.py`와 `views.py` 코드를 작성할 때 발생하는 동작 및 인자 규칙에 대한 설명으로 옳은 것은?",
      code: "# urls.py\nurlpatterns = [\n    path('articles/', views.index, name='index'),\n]\n\n# views.py\ndef index(request):\n    context = {'greeting': '반갑습니다'}\n    return render(request, 'articles/index.html', context)",
      options: [
        "path()의 두 번째 인자로는 함수 참조 대신 views.index()처럼 호출 결과를 전달해야 한다.",
        "render() 함수의 첫 번째 필수 인자는 템플릿 경로 문자열이고 두 번째 인자는 request이다.",
        "템플릿 파일에서는 context 딕셔너리 전체를 {{ context.greeting }} 형태로만 접근해야 한다.",
        "render()는 request와 템플릿 경로, context를 결합하여 HttpResponse 객체를 반환한다."
      ],
      answer: 3,
      explanation: "path()에는 views.index처럼 호출하지 않은 함수 자체를 전달하며, render(request, template_name, context)는 템플릿과 데이터를 결합해 응답 객체를 반환합니다. 템플릿에서는 딕셔너리의 키인 {{ greeting }}으로 바로 접근합니다.",
      hint: "render() 함수의 인자 순서(request, template_name, context)와 반환 역할을 확인해 보세요."
    },
    {
      id: "mock1-014-template-inheritance-dirs",
      conceptId: "template-extends-block-dirs",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "공통 레이아웃인 `base.html`을 프로젝트 최상위 `templates/` 폴더에 두고 상속받아 사용할 때 필요한 설정과 태그 규칙으로 옳은 것은?",
      options: [
        "TEMPLATES 설정의 DIRS에 경로를 추가하고 자식 템플릿 첫 줄에 {% extends 'base.html' %}를 작성한다.",
        "STATICFILES_DIRS 설정에 경로를 추가하고 자식 템플릿 끝에 {% extends 'base.html' %}를 작성한다.",
        "자식 템플릿에서 부모 영역을 재정의할 때는 {% block %} 태그 없이 일반 HTML 태그만 작성하면 치환된다.",
        "APP_DIRS 옵션을 False로 변경해야만 프로젝트 최상위 DIRS 경로에 있는 base.html 파일을 탐색할 수 있다."
      ],
      answer: 0,
      explanation: "앱 내부 templates/ 외의 경로는 TEMPLATES 설정의 DIRS 목록(예: [BASE_DIR / 'templates'])에 등록하며, 자식 템플릿의 가장 첫 번째 템플릿 태그로 {% extends %}를 선언하고 {% block %}으로 영역을 덮어씁니다.",
      hint: "추가 템플릿 탐색 경로 설정(DIRS)과 extends 태그의 선언 위치를 생각해 보세요."
    },
    {
      id: "mock1-015-url-include-variable-routing",
      conceptId: "url-namespace-variable-routing",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "다음과 같이 프로젝트와 앱의 URL이 설정되어 있을 때, 상세 페이지 연결과 View 함수 정의로 옳은 것은?",
      code: "# project/urls.py\nurlpatterns = [\n    path('articles/', include('articles.urls')),\n]\n\n# articles/urls.py\napp_name = 'articles'\nurlpatterns = [\n    path('<int:article_pk>/', views.detail, name='detail'),\n]",
      options: [
        "detail View 함수는 def detail(request, pk):처럼 인자 이름을 마음대로 다르게 선언해도 동작한다.",
        "템플릿에서 상세 경로를 생성할 때는 {% url 'articles/detail' article.pk %}처럼 슬래시로 연결한다.",
        "템플릿의 {% url 'articles:detail' 3 %} 태그는 '/articles/3/' 경로 문자열로 변환되어 출력된다.",
        "include()를 사용하면 앞부분 경로는 무시되므로 브라우저의 최종 요청 주소는 '/3/' 형태로 매칭된다."
      ],
      answer: 2,
      explanation: "include()는 앞선 'articles/' 경로와 앱의 '<int:article_pk>/'를 결합하여 '/articles/3/'을 매칭합니다. URL 변수명이 article_pk이므로 View 인자명도 article_pk여야 하며, url 태그는 'app_name:name'처럼 콜론(:)을 사용합니다.",
      hint: "app_name과 name을 결합하는 기호(:)와 include()의 경로 결합 방식을 확인해 보세요."
    },
    {
      id: "mock1-016-orm-get-filter-return-types",
      conceptId: "orm-queryset-vs-instance",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "`Article` 테이블에 `pk=1`인 게시글 1개만 저장되어 있을 때, 다음 QuerySet API 호출 결과에 대한 설명으로 옳은 것은?",
      options: [
        "Article.objects.filter(pk=1)은 조건을 만족하는 행이 1개이므로 단일 Article 인스턴스를 반환한다.",
        "Article.objects.filter(pk=99)는 조건에 맞는 데이터가 없어도 예외 없이 빈 QuerySet을 반환한다.",
        "Article.objects.get(pk=99)는 조건에 맞는 데이터가 없을 때 None을 반환하며 예외를 발생시키지 않는다.",
        "Article.objects.all()은 Python 기본 내장 리스트(list) 타입과 완전히 동일한 객체를 반환한다."
      ],
      answer: 1,
      explanation: "filter()는 조회 결과 개수가 0개, 1개, 여러 개이든 항상 QuerySet 객체를 반환합니다. 반면 get()은 단일 모델 인스턴스를 반환하며 결과가 0개면 DoesNotExist, 2개 이상이면 MultipleObjectsReturned 예외를 발생시킵니다.",
      hint: "조회 결과가 0개일 때 filter()와 get()이 각각 무엇을 반환하거나 발생시키는지 비교해 보세요."
    },
    {
      id: "mock1-017-orm-field-lookups",
      conceptId: "orm-field-lookups-syntax",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "Django ORM에서 조건 조회를 수행하는 Field lookups 표현과 그 의미가 올바르게 짝지어진 것은?",
      options: [
        "Article.objects.filter(pk__gt=3)은 기본 키(pk)가 3을 초과하는 게시글들을 조회한다.",
        "Article.objects.filter(title_contains='Django')처럼 필드명과 조건을 밑줄 하나로 연결한다.",
        "Article.objects.filter(pk__lte=5)는 기본 키(pk)가 5보다 큰(초과인) 게시글들을 조회한다.",
        "Article.objects.filter(title__startswith='A')는 제목이 'A'로 끝나는 게시글들을 조회한다."
      ],
      answer: 0,
      explanation: "Field lookup은 필드명과 조건 사이에 밑줄 두 개(__)를 사용합니다. __gt는 초과(greater than), __gte는 이상, __lt는 미만, __lte는 이하, __startswith는 시작 문자열 조건입니다.",
      hint: "필드명과 조건 사이의 밑줄 개수(__)와 gt(greater than)의 의미를 확인해 보세요."
    },
    {
      id: "mock1-018-render-vs-redirect-behavior",
      conceptId: "view-render-vs-redirect",
      difficulty: "medium",
      category: "ORM with View",
      questionType: "multiple-choice",
      prompt: "게시글을 생성하거나 삭제하는 POST 요청을 처리한 직후 `render()` 대신 `redirect()`를 반환하는 이유로 가장 적절한 것은?",
      options: [
        "POST 처리 후 응답 URL만 변경하고 추가 화면 요청은 생략하므로 화면 전환 속도가 빨라지기 때문이다.",
        "POST 처리 후 요청 데이터를 초기화하여 브라우저의 방문 기록에서 POST 요청을 자동 삭제하기 때문이다.",
        "POST 처리 후 서버 내부에서 대상 View를 직접 실행하여 한 번의 요청으로 결과 화면을 반환하기 때문이다.",
        "클라이언트가 지정된 URL로 다시 GET 요청을 보내게 하여 새로고침 시 POST 중복 제출을 줄이기 때문이다."
      ],
      answer: 3,
      explanation: "상태를 변경하는 POST 요청 처리 후 redirect()를 반환하면 브라우저가 대상 URL로 새로운 GET 요청을 보내므로, 결과 화면에서 새로고침을 해도 동일한 POST 요청이 반복 전송되는 문제를 방지할 수 있습니다.",
      hint: "POST 저장 직후 브라우저를 새로고침했을 때 발생할 수 있는 중복 요청 문제를 떠올려 보세요."
    },
    {
      id: "mock1-019-form-vs-modelform-difference",
      conceptId: "django-form-vs-modelform",
      difficulty: "medium",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "Django의 `forms.Form`과 `forms.ModelForm`을 비교한 설명으로 옳은 것은?",
      options: [
        "forms.Form은 입력값 유효성 검사 메서드인 is_valid()를 제공하지 않아 수동으로 조건문을 작성해야 한다.",
        "forms.ModelForm은 로그인처럼 DB 모델에 직접 저장하지 않는 입력을 받을 때만 전용으로 사용한다.",
        "forms.ModelForm은 모델 정의를 바탕으로 필드를 구성하며 검증 통과 후 save()로 객체를 저장할 수 있다.",
        "Widget은 서버 측 데이터 타입과 DB 제약 조건을 결정하며 화면의 HTML 입력 요소 형태에는 관여하지 않는다."
      ],
      answer: 2,
      explanation: "Form과 ModelForm 모두 is_valid() 유효성 검사를 제공하지만, ModelForm은 연결된 Model을 기반으로 필드를 자동 생성하고 save() 메서드로 DB 저장까지 수행합니다. Widget은 HTML 입력 요소의 표현 방식을 담당합니다.",
      hint: "모델과의 자동 연동 여부 및 save() 메서드 기본 제공 여부를 비교해 보세요."
    },
    {
      id: "mock1-020-image-upload-form-requirements",
      conceptId: "media-upload-multipart-files",
      difficulty: "medium",
      category: "Static Files & Media",
      questionType: "multiple-choice",
      prompt: "사용자가 업로드한 이미지를 `ImageField`로 저장하고 템플릿에 출력할 때 필요한 구현 내용으로 옳은 것은?",
      options: [
        "업로드된 이미지의 원본 바이너리 데이터 자체가 SQLite 데이터베이스 테이블 컬럼 내부에 직접 저장된다.",
        "파일 업로드는 GET 방식의 form에서도 enctype 속성만 추가하면 request.POST를 통해 자동 수신된다.",
        "form에 enctype=\"multipart/form-data\"를 지정하고 View에서 request.FILES를 전달한다.",
        "템플릿에서 이미지를 표시할 때는 파일 유무와 관계없이 {{ article.image }}만 src에 넣으면 출력된다."
      ],
      answer: 2,
      explanation: "파일 업로드 시 HTML form에는 method=\"POST\"와 enctype=\"multipart/form-data\"가 필수이며, View에서는 ArticleForm(request.POST, request.FILES)로 파일 데이터를 전달합니다. DB에는 파일 경로 문자열이 저장되고 템플릿에서는 article.image.url로 접근합니다.",
      hint: "파일 전송을 위한 form 인코딩 속성과 View에서 업로드 파일을 꺼내는 요청 속성을 확인해 보세요."
    },
    {
      id: "mock1-021-get-user-model-function",
      conceptId: "auth-get-user-model",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "short-answer",
      prompt: "User 클래스를 직접 참조하는 대신 현재 프로젝트의 `settings.py`(`AUTH_USER_MODEL`)에 활성화된 User 모델 클래스를 반환하는 Django 내장 함수 이름을 작성하시오. (호출 괄호는 제외하고 함수명만 작성)",
      options: [],
      answer: null,
      acceptedAnswers: ["get_user_model"],
      explanation: "django.contrib.auth의 get_user_model() 함수는 현재 프로젝트에서 활성화된 User 모델 클래스를 반환하므로 Custom UserCreationForm이나 CustomUserChangeForm의 Meta.model 지정에 사용합니다.",
      hint: "괄호()를 제외하고 활성화된 user model을 가져온다(get)는 의미의 스네이크 케이스 함수명만 작성하세요."
    },
    {
      id: "mock1-022-auth-forms-first-argument",
      conceptId: "django-auth-forms-arguments",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "POST 요청을 처리하는 View에서 Django의 내장 Form 및 ModelForm에 데이터를 바인딩하는 코드로 옳은 것은?",
      options: [
        "로그인 인증 폼은 ModelForm이므로 AuthenticationForm(request.POST, instance=request.user)로 작성한다.",
        "비밀번호 변경 폼은 대상 사용자를 첫 인자로 받으므로 PasswordChangeForm(request.user, request.POST)로 작성한다.",
        "회원정보 수정 폼은 일반 Form이므로 CustomUserChangeForm(request, request.POST, user)로 작성한다.",
        "회원가입 폼은 요청 객체를 첫 인자로 받으므로 CustomUserCreationForm(request, request.POST)로 작성한다."
      ],
      answer: 1,
      explanation: "로그인용 AuthenticationForm(request, request.POST)은 첫 인자가 request이고, 비밀번호 변경용 PasswordChangeForm(request.user, request.POST)은 첫 인자가 user 객체입니다. 반면 회원가입(CustomUserCreationForm)과 회원정보 수정(CustomUserChangeForm)은 ModelForm 계열이므로 첫 인자로 데이터(request.POST)를 받고 수정 시에는 instance=request.user를 전달합니다.",
      hint: "각 Form의 첫 번째 위치 인자가 입력 데이터(data), 요청(request), 사용자(user) 중 무엇인지 비교해 보세요."
    },
    {
      id: "mock1-023-user-change-form-fields",
      conceptId: "custom-user-change-form",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "일반 사용자의 회원정보 수정 기능을 구현할 때 기본 `UserChangeForm`을 그대로 쓰지 않고 `CustomUserChangeForm`을 정의하는 주된 이유는?",
      options: [
        "기본 UserChangeForm은 비밀번호 변경 기능만 제공하고 이메일이나 이름 필드를 포함하지 않기 때문이다.",
        "기본 UserChangeForm은 save() 메서드를 지원하지 않아 수정 내용을 DB에 반영할 수 없기 때문이다.",
        "일반 사용자가 자신의 정보를 수정할 때는 instance=request.user 인자를 전달할 수 없기 때문이다.",
        "기본 UserChangeForm에는 관리자 권한 등 일반 사용자가 수정하면 안 되는 필드까지 노출되기 때문이다."
      ],
      answer: 3,
      explanation: "기본 UserChangeForm은 관리자용 필드(권한, 활성화 여부 등)까지 모두 포함하므로, 일반 회원용 수정 폼에서는 CustomUserChangeForm을 정의하고 Meta.fields에 일반 사용자가 수정할 수 있는 필드(예: first_name, last_name, email)만 명시해 제한합니다.",
      hint: "기본 UserChangeForm을 화면에 그대로 출력했을 때 일반 회원에게 보이면 안 되는 항목이 무엇인지 떠올려 보세요."
    },
    {
      id: "mock1-024-http-cookie-session-essay",
      conceptId: "http-stateless-cookie-session",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "essay",
      prompt: "HTTP 프로토콜의 비연결성(Connectionless)·무상태성(Stateless) 한계를 보완하여 로그인 상태를 유지할 때, ① 세션 데이터의 저장 위치, ② 브라우저가 쿠키에 보관하는 값, ③ 이후 요청 시의 전달 및 인증 확인 과정을 모두 포함하여 30자 이상으로 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "사용자가 로그인에 성공하면 서버는 세션 데이터를 서버(DB)에 저장하고, 이를 식별하는 세션 ID를 쿠키에 담아 브라우저에 보관하게 한다. 이후 브라우저는 매 요청마다 세션 ID 쿠키를 서버로 전송하고 서버가 이를 확인하여 로그인 상태를 유지한다.",
      // 기존 채점기의 (또는 A/B) 대체 표현 파서를 활용합니다.
      // 의미가 뒤바뀐 답안은 수동 검수해야 합니다.
      rubricKeywords: [
        "세션 (또는 session)",
        "서버 (또는 DB/데이터베이스)",
        "쿠키 (또는 cookie)",
        "ID (또는 식별자/키)",
        "전송 (또는 보내/보낸/보내는/전달/요청)"
      ],
      minLength: 30,
      explanation: "[수동 검수 병행 권장] 단순 키워드 나열이 아니라 ① 서버에 세션 데이터 저장, ② 브라우저 쿠키에 세션 ID 보관, ③ 매 요청 시 브라우저가 세션 ID 쿠키를 서버로 전송하여 인증 상태를 확인한다는 3단계 관계가 정확히 서술되어야 정답으로 인정합니다.",
      hint: "1) 세션 데이터의 서버 저장, 2) 브라우저의 세션 ID 쿠키 보관, 3) 요청 시 세션 ID 전송이라는 세 가지 핵심 관계를 순서대로 연결해 서술해 보세요."
    }
  ],

  hard: [
    {
      id: "mock1-025-orm-instance-save-lifecycle",
      conceptId: "orm-instance-creation-and-save",
      difficulty: "hard",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "비어 있는 `Article` 테이블을 대상으로 다음 코드를 순서대로 실행했을 때, 각 단계의 상태 변화로 옳은 것은? (단, 필수 필드는 `title`과 `content`뿐이며 마이그레이션은 완료된 상태이다.)",
      code: "article1 = Article(title='첫 글', content='내용1')\narticle2 = Article.objects.create(title='둘째 글', content='내용2')\ncount_before = Article.objects.all().count()\narticle1.save()\ncount_after = Article.objects.all().count()",
      options: [
        "article1 생성 시점에 즉시 DB에 행이 추가되므로 count_before와 count_after는 모두 2이다.",
        "article1은 save() 호출 전까지 DB에 반영되지 않으므로 count_before는 1이고 count_after는 2이다.",
        "create() 메서드는 인스턴스만 만들고 저장하지 않으므로 count_before는 0이고 count_after는 1이다.",
        "article1.save()를 호출하면 기존 article2 행이 덮어써지므로 count_before와 count_after는 모두 1이다."
      ],
      answer: 1,
      explanation: "Article(...)로 Python 인스턴스를 생성한 것만으로는 DB에 기록되지 않으며 save()를 호출해야 저장됩니다. 반면 Article.objects.create(...)는 인스턴스 생성과 DB 저장을 동시에 수행하므로 count_before는 1, article1.save() 이후 count_after는 2가 됩니다.",
      hint: "단순 인스턴스 생성자인 Article(...)과 Manager 메서드인 create(...)의 DB 반영 시점을 비교해 보세요."
    },
    {
      id: "mock1-026-modelform-update-missing-instance",
      conceptId: "modelform-update-instance-binding",
      difficulty: "hard",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "기존 게시글을 수정하는 `update` View 함수를 아래 코드와 같이 작성했을 때 발생하는 문제점으로 옳은 것은?",
      code: "def update(request, pk):\n    article = Article.objects.get(pk=pk)\n    if request.method == 'POST':\n        form = ArticleForm(request.POST)\n        if form.is_valid():\n            article = form.save()\n            return redirect('articles:detail', article.pk)\n    else:\n        form = ArticleForm(instance=article)\n    return render(request, 'articles/update.html', {'form': form, 'article': article})",
      options: [
        "POST 분기에서 instance=article을 전달하지 않아 기존 글이 수정되는 대신 새 게시글이 생성된다.",
        "GET 분기에서 instance=article을 전달했기 때문에 수정 화면 진입 시 빈 입력칸만 렌더링된다.",
        "form.is_valid() 검증에 실패했을 때 조건문 밖의 render가 실행되지 않아 TypeError가 발생한다.",
        "form.save()는 저장된 객체를 반환하지 않으므로 redirect에서 article.pk를 참조할 수 없다."
      ],
      answer: 0,
      explanation: "ModelForm에서 기존 객체를 수정하려면 POST 요청 시에도 ArticleForm(request.POST, instance=article)처럼 수정 대상 인스턴스를 함께 전달해야 합니다. instance를 생략하면 save() 호출 시 기존 행을 갱신하지 않고 새로운 행을 INSERT합니다.",
      hint: "POST 분기의 ArticleForm(request.POST)에 어떤 키워드 인자가 빠졌는지 확인해 보세요."
    },
    {
      id: "mock1-027-media-empty-image-url-error",
      conceptId: "media-imagefield-url-check",
      difficulty: "hard",
      category: "Static Files & Media",
      questionType: "multiple-choice",
      prompt: "다음 모델과 상세 페이지 템플릿이 있을 때, 이미지를 첨부하지 않고 작성한 게시글의 상세 페이지에 접속하면 오류가 발생하는 원인과 해결 방법으로 옳은 것은?",
      code: "# models.py\nclass Article(models.Model):\n    title = models.CharField(max_length=20)\n    image = models.ImageField(upload_to='images/', blank=True)\n\n# detail.html\n<h2>{{ article.title }}</h2>\n<img src=\"{{ article.image.url }}\" alt=\"게시글 이미지\">",
      options: [
        "ImageField에 blank=True만 지정하고 null=False 기본값을 두었기 때문에 DB 조회 시점에 오류가 발생한다.",
        "detail.html 상단에 {% load static %} 태그를 선언하지 않아 article.image.url을 해석하지 못한다.",
        "연결된 파일이 없는 상태에서 .url 속성에 접근했기 때문이며 {% if article.image %} 조건문으로 감싸 해결한다.",
        "upload_to 경로 끝에 슬래시(/)가 포함되어 파일 경로가 중복 생성되므로 슬래시를 제거해야 해결된다."
      ],
      answer: 2,
      explanation: "blank=True로 이미지를 첨부하지 않은 게시글은 article.image에 연결된 파일이 없으므로 템플릿에서 바로 article.image.url을 참조하면 ValueError가 발생합니다. 따라서 {% if article.image %}로 파일 존재 여부를 먼저 확인한 뒤 출력해야 합니다.",
      hint: "이미지가 없는 게시글 객체에서 .url 속성을 호출할 때 발생하는 상황을 생각해 보세요."
    },
    {
      id: "mock1-028-login-view-authenticationform-bug",
      conceptId: "auth-login-view-implementation",
      difficulty: "hard",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "다음 로그인 View 함수 코드에서 정상적인 로그인이 이루어지지 않는 원인을 모두 바르게 고친 것은?",
      code: "from django.shortcuts import render, redirect\nfrom django.contrib.auth import login as auth_login\nfrom django.contrib.auth.forms import AuthenticationForm\n\ndef login(request):\n    if request.method == 'POST':\n        form = AuthenticationForm(request.POST)\n        if form.is_valid():\n            user = form.save()\n            auth_login(request, user)\n            return redirect('articles:index')\n    else:\n        form = AuthenticationForm()\n    return render(request, 'accounts/login.html', {'form': form})",
      options: [
        "AuthenticationForm(request.POST, instance=request.user)로 수정하고 auth_login(user)만 호출한다.",
        "AuthenticationForm은 그대로 두고 form.save() 대신 request.user를 auth_login에 직접 전달한다.",
        "GET 분기의 AuthenticationForm()에도 request.POST를 전달하고 form.save() 결과를 세션에 넣는다.",
        "AuthenticationForm(request, request.POST)로 수정하고 form.save() 대신 form.get_user()를 쓴다."
      ],
      answer: 3,
      explanation: "AuthenticationForm은 ModelForm이 아닌 일반 Form이므로 첫 번째 인자로 request, 두 번째 인자로 request.POST를 전달해야 하며, save() 메서드가 없으므로 검증 통과 후에는 form.get_user()로 인증된 User 객체를 얻어 auth_login(request, form.get_user())를 호출해야 합니다.",
      hint: "AuthenticationForm의 생성자 인자 순서와 인증 완료된 사용자 객체를 반환하는 메서드를 확인해 보세요."
    },
    {
      id: "mock1-029-user-delete-logout-order",
      conceptId: "user-withdrawal-logout-sequence",
      difficulty: "hard",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "로그인한 사용자의 회원 탈퇴 View 함수를 아래와 같이 작성했을 때 발생하는 현상과 올바른 수정 방법으로 옳은 것은?",
      code: "from django.shortcuts import redirect\nfrom django.contrib.auth import logout as auth_logout\nfrom django.contrib.auth.decorators import login_required\n\n@login_required\ndef delete(request):\n    auth_logout(request)\n    request.user.delete()\n    return redirect('articles:index')",
      options: [
        "auth_logout 호출 시 request.user가 AnonymousUser로 바뀌므로 계정 삭제 후 로그아웃한다.",
        "auth_logout()은 세션만 정리하고 request.user 객체는 그대로 유지하므로 현재 코드에서도 계정을 삭제할 수 있다.",
        "request.user.delete()를 먼저 호출하면 User 정보가 없어져 이후 auth_logout()에서 오류가 발생하므로 현재 순서가 옳다.",
        "auth_logout() 전에 request.user.is_authenticated를 검사하면 로그아웃 이후에도 request.user.delete()를 정상 호출할 수 있다."
      ],
      answer: 0,
      explanation: "auth_logout(request)을 먼저 실행하면 현재 세션이 정리되면서 request.user가 AnonymousUser 객체로 변경되어 실제 탈퇴할 사용자 계정을 삭제할 수 없게 됩니다. 따라서 반드시 request.user.delete()로 계정을 먼저 삭제한 뒤 auth_logout(request)으로 세션을 정리해야 합니다.",
      hint: "로그아웃 함수가 실행되는 순간 request.user 객체가 무엇으로 바뀌는지 생각해 보세요."
    },
    {
      id: "mock1-030-update-session-auth-hash",
      conceptId: "password-change-session-hash",
      difficulty: "hard",
      category: "Authentication System",
      questionType: "short-answer",
      prompt: "다음 비밀번호 변경 View 코드의 빈칸 `( A )`에 들어갈 Django 내장 함수 이름을 작성하시오. 이 함수는 비밀번호 변경으로 인해 기존 세션의 인증 정보가 달라졌을 때 현재 요청의 세션을 갱신하여 로그인 상태를 유지해 준다. (호출 괄호는 제외하고 함수명만 작성)",
      code: "from django.contrib.auth import ( A )\nfrom django.contrib.auth.forms import PasswordChangeForm\n\ndef change_password(request):\n    if request.method == 'POST':\n        form = PasswordChangeForm(request.user, request.POST)\n        if form.is_valid():\n            user = form.save()\n            ( A )(request, user)\n            return redirect('articles:index')",
      options: [],
      answer: null,
      acceptedAnswers: ["update_session_auth_hash"],
      explanation: "비밀번호가 변경되면 기존 세션의 인증 해시값과 새 비밀번호의 인증 정보가 일치하지 않아 로그인이 풀리게 됩니다. update_session_auth_hash(request, user)를 호출하면 변경된 User 정보로 현재 세션을 갱신하여 로그인 상태를 유지합니다.",
      hint: "괄호()를 제외하고 세션 인증 해시(session auth hash)를 갱신(update)한다는 의미의 함수명만 작성하세요."
    },
    {
      id: "mock1-031-url-naming-pattern-mc",
      conceptId: "django-url-namespace-reverse",
      difficulty: "hard",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "서로 다른 두 Django 앱에서 모두 `name='detail'`을 사용한다. 각 앱의 `app_name`과 이름 기반 URL 참조를 설정했을 때의 효과로 옳은 것은?",
      options: [
        "앱 이름 공간으로 같은 URL 이름은 구분하지만 경로가 변경되면 모든 템플릿 링크를 직접 교체해야 한다.",
        "앱 이름 공간으로 같은 URL 이름을 구분하며 경로가 변경돼도 이름 기반 URL 참조는 유지할 수 있다.",
        "앱 이름 공간은 View에서 reverse()를 호출할 때만 적용되므로 템플릿의 {% url %} 태그에는 사용할 수 없다.",
        "이름 기반 URL 참조를 사용하면 경로에 필요한 동적 인자도 자동 지정되므로 {% url %}에 인자를 넘길 필요가 없다."
      ],
      answer: 1,
      explanation: "app_name은 같은 name을 사용하는 앱별 URL을 'articles:detail', 'comments:detail'처럼 구분합니다. {% url %}이나 reverse()에서 이름으로 참조하면 urls.py의 경로 패턴이 바뀌어도 이름과 인자 형식이 유지되는 한 사용처의 경로 문자열을 일일이 수정할 필요가 없습니다.",
      hint: "동일한 URL 이름의 구분 방식과 URL 패턴 수정이 템플릿 링크에 미치는 영향을 함께 생각해 보세요."
    },
    {
      id: "mock1-032-template-view-access-control-mc",
      conceptId: "template-view-access-control",
      difficulty: "hard",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "회원정보 수정 버튼을 로그인한 사용자에게만 보여 주었다. 같은 URL로 비회원이 직접 요청했을 때의 접근 제어에 대한 설명으로 옳은 것은?",
      options: [
        "템플릿에 조건문을 작성했으므로 비회원이 URL로 요청해도 자동으로 막힌다.",
        "View에서도 로그인 여부를 검사해야 비회원의 직접 접근을 제한할 수 있다.",
        "View에서 요청 메서드가 POST인지 확인하면 로그인 검사는 생략할 수 있다.",
        "URLconf에 이름 공간을 설정하면 View의 로그인 검사를 생략할 수 있다."
      ],
      answer: 1,
      explanation: "템플릿의 조건문은 링크 표시만 결정합니다. 직접 URL을 요청할 수 있으므로 View에서도 인증 여부를 검사해야 합니다. 인증 여부와 작성자 권한 검사는 별개입니다."
    }
  ],

  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
