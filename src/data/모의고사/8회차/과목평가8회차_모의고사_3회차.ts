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
      id: "mock3-001-requirements-install",
      conceptId: "requirements-install",
      difficulty: "easy",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "팀원이 전달한 requirements.txt를 현재 활성화된 가상 환경에 설치하는 명령은?",
      options: [
        "pip freeze > requirements.txt",
        "pip install -r requirements.txt",
        "python manage.py install requirements.txt",
        "pip install requirements.txt",
      ],
      answer: 1,
      explanation: "requirements.txt의 패키지 목록 설치에는 `pip install -r`을 사용합니다."
    },
    {
      id: "mock3-004-template-dtl-comment",
      conceptId: "template-dtl-comment",
      difficulty: "easy",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "템플릿 파일에서 한 줄을 DTL 주석으로 처리할 때 사용할 수 있는 문법은?",
      options: [
        "{# 화면에 나오지 않는 설명 #}",
        "<!-- {% 화면에 나오지 않는 설명 %} -->",
        "{% # 화면에 나오지 않는 설명 %}",
        "{{# 화면에 나오지 않는 설명 }}",
      ],
      answer: 0,
      explanation: "Django Template Language는 `{# ... #}` 주석 문법을 지원합니다."
    },
    {
      id: "mock3-009-model-default-value",
      conceptId: "model-default-value",
      difficulty: "easy",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "새 Article 객체를 생성할 때 별도 값을 넘기지 않으면 `status=\"draft\"`로 저장하고 싶다. 필드 옵션은?",
      options: [
        "auto_now=\"draft\"",
        "null=\"draft\"",
        "blank=\"draft\"",
        "default=\"draft\"",
      ],
      answer: 3,
      explanation: "default 옵션은 명시적 값이 없을 때 사용되는 기본값을 지정합니다."
    },
    {
      id: "mock3-010-model-auto-primary-key",
      conceptId: "model-auto-primary-key",
      difficulty: "easy",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "Article 모델에서 기본 키 필드를 따로 선언하지 않았다. 일반적인 Django 동작으로 맞는 것은?",
      options: [
        "별도 기본 키가 없으므로 최초 저장 시 오류가 발생한다.",
        "기본 키로 사용할 id 필드가 자동으로 만들어진다.",
        "제목 필드가 있으면 title을 기본 키로 자동 지정한다.",
        "created_at 필드가 있으면 해당 값을 기본 키로 사용한다.",
      ],
      answer: 1,
      explanation: "기본 키를 명시하지 않으면 Django가 자동 기본 키 필드를 추가합니다."
    },
    {
      id: "mock3-015-orm-objects-create",
      conceptId: "orm-objects-create",
      difficulty: "easy",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "새 글을 DB에 저장하면서 생성한 인스턴스를 `article` 변수로 받으려 한다. 적절한 코드는?",
      options: [
        "article = Article.objects.filter(title=\"공지\", content=\"내용\")",
        "article = Article.objects.create(title=\"공지\", content=\"내용\")",
        "article = Article(title=\"공지\", content=\"내용\")",
        "article = Article.objects.get(title=\"공지\", content=\"내용\")",
      ],
      answer: 1,
      explanation: "objects.create는 객체 생성과 DB 저장을 함께 처리합니다."
    },
    {
      id: "mock3-016-orm-delete-instance",
      conceptId: "orm-delete-instance",
      difficulty: "easy",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "pk=3인 게시글을 조회한 뒤 해당 레코드를 삭제하려 한다. 마지막 줄에 들어갈 표현은?",
      code: "article = Article.objects.get(pk=3)\n# 여기에 삭제 코드 작성",
      options: [
        "article.remove()",
        "article.clear()",
        "article.drop()",
        "article.delete()",
      ],
      answer: 3,
      explanation: "Django 모델 인스턴스는 delete()로 해당 DB 레코드를 삭제합니다."
    },
    {
      id: "mock3-020-form-unbound-bound",
      conceptId: "form-unbound-bound",
      difficulty: "easy",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "ArticleForm()과 ArticleForm(request.POST)에 관한 설명으로 적절한 것은?",
      options: [
        "앞의 것은 ModelForm이고 뒤의 것은 일반 Form으로 자동 변환된다.",
        "앞의 것은 GET 전용 Form이고 뒤의 것은 DB 저장을 완료한 Form이다.",
        "앞의 것은 validation 오류를 담고 뒤의 것은 validation을 건너뛴다.",
        "앞의 것은 미바인딩 Form이고 뒤의 것은 요청 데이터를 바인딩한 Form이다.",
      ],
      answer: 3,
      explanation: "Form에 요청 데이터를 전달하면 데이터가 바인딩되며 검증에 사용할 수 있습니다."
    },
    {
      id: "mock3-026-anonymous-is-authenticated",
      conceptId: "anonymous-is-authenticated",
      difficulty: "easy",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "로그인하지 않은 사용자의 `request.user.is_authenticated` 값은?",
      options: [
        "False",
        "True",
        "속성에 접근하면 AttributeError 발생",
        "None",
      ],
      answer: 0,
      explanation: "AnonymousUser의 is_authenticated 속성은 False입니다."
    },
    {
      id: "mock3-027-auto-now-add-name",
      conceptId: "auto-now-add-name",
      difficulty: "easy",
      category: "Model",
      questionType: "short-answer",
      prompt: "Django DateTimeField에서 객체를 처음 생성할 때 시각을 자동 기록하는 옵션명을 정확히 쓰시오. (값 True는 쓰지 않음)",
      options: [],
      answer: null,
      acceptedAnswers: ["auto_now_add"],
      explanation: "생성 시각은 auto_now_add=True로 설정합니다."
    },
    {
      id: "mock3-029-url-app-name",
      conceptId: "url-app-name",
      difficulty: "easy",
      category: "Template & URLs",
      questionType: "short-answer",
      prompt: "앱의 urls.py에서 URL 이름 공간을 설정할 때 왼쪽에 쓰는 변수명을 정확히 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["app_name"],
      explanation: "app_name으로 URL 이름 공간을 지정합니다."
    }
  ],
  medium: [
    {
      id: "mock3-002-project-app-boundary",
      conceptId: "project-app-boundary",
      difficulty: "medium",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "여러 기능을 앱으로 나누어 개발하는 Django 프로젝트 구성에 대한 설명으로 적절한 것은?",
      options: [
        "프로젝트마다 URLconf가 여러 개 필요하지만 앱에는 URLconf를 둘 수 없다.",
        "앱은 프로젝트 바깥에서만 생성할 수 있으며 프로젝트 설정을 공유하지 않는다.",
        "앱 하나에만 settings.py가 있으며 프로젝트는 앱 이름을 나열한 파일이다.",
        "하나의 프로젝트에 여러 앱을 두고 앱별로 URL과 View를 나눌 수 있다.",
      ],
      answer: 3,
      explanation: "프로젝트는 공통 설정을 가지며, 앱은 기능 단위로 분리해 구성할 수 있습니다."
    },
    {
      id: "mock3-003-view-response-return",
      conceptId: "view-response-return",
      difficulty: "medium",
      category: "Intro & Design Pattern",
      questionType: "multiple-choice",
      prompt: "Django View 함수가 요청을 처리한 뒤 `return render(...)`를 작성하는 이유는?",
      options: [
        "Model 인스턴스를 DB에 저장하는 쿼리를 자동 실행하기 위해서다.",
        "템플릿 파일을 View 함수가 실행되기 전에 자동 생성하기 위해서다.",
        "처리 결과를 담은 HTTP 응답 객체를 클라이언트에 반환하기 위해서다.",
        "URL 패턴을 다시 등록하여 다음 요청의 경로를 수정하기 위해서다.",
      ],
      answer: 2,
      explanation: "View는 최종적으로 HttpResponse 등 응답 객체를 반환해야 합니다."
    },
    {
      id: "mock3-005-namespace-reverse-view",
      conceptId: "namespace-reverse-view",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "`app_name=\"articles\"`, `name=\"detail\"`인 경로에 pk를 전달해 View에서 이동하려 한다. 올바른 호출은?",
      options: [
        "redirect('articles', 'detail', article.pk)",
        "redirect('articles:detail', article.pk)",
        "redirect('articles:detail')",
        "redirect('articles/detail', article.pk)",
      ],
      answer: 1,
      explanation: "이름 공간과 URL 이름은 `:`으로 연결하며 동적 경로 인자를 함께 전달합니다."
    },
    {
      id: "mock3-006-route-vs-query",
      conceptId: "route-vs-query",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "`path(\"search/<int:category_pk>/\", ...)`로 URL을 만들고 `/search/4/?sort=latest`로 요청했다. 값에 접근하는 방법은?",
      options: [
        "category_pk는 View 인자, sort는 request.GET에서 조회한다.",
        "category_pk는 request.GET에서, sort는 View 인자로 조회한다.",
        "category_pk와 sort 모두 View의 위치 인자로 전달받는다.",
        "category_pk와 sort 모두 request.POST에서 조회한다.",
      ],
      answer: 0,
      explanation: "경로 변수는 View 매개변수로 전달되고 쿼리 문자열은 request.GET에 저장됩니다."
    },
    {
      id: "mock3-007-template-dirs-setting",
      conceptId: "template-dirs-setting",
      difficulty: "medium",
      category: "Template & URLs",
      questionType: "multiple-choice",
      prompt: "프로젝트 루트의 `templates/base.html`을 모든 앱에서 사용하려 한다. 확인해야 할 Django 설정은?",
      options: [
        "STATICFILES_DIRS에 BASE_DIR / 'templates'가 포함되어 있는지 확인한다.",
        "MEDIA_ROOT를 BASE_DIR / 'templates'로 설정했는지 확인한다.",
        "TEMPLATES의 DIRS에 BASE_DIR / 'templates'가 포함되어 있는지 확인한다.",
        "INSTALLED_APPS에 BASE_DIR / 'templates'를 문자열로 넣었는지 확인한다.",
      ],
      answer: 2,
      explanation: "프로젝트 공용 템플릿 탐색 경로는 TEMPLATES 설정의 DIRS에서 지정합니다."
    },
    {
      id: "mock3-008-blank-null-form-db",
      conceptId: "blank-null-form-db",
      difficulty: "medium",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "모델 필드가 `email = models.EmailField(blank=True)`로 선언되어 있다. 올바른 설명은?",
      options: [
        "blank=True를 쓰면 모델 필드는 마이그레이션 대상에서 자동 제외된다.",
        "Form 단계에서는 반드시 값을 입력해야 하지만 DB에는 NULL을 허용한다.",
        "Form 단계에서 빈 입력을 허용하며 DB의 null 허용 여부는 별도 옵션이다.",
        "DB 컬럼에 NULL을 허용하므로 빈 문자열과 NULL이 항상 같은 값이다.",
      ],
      answer: 2,
      explanation: "blank는 Form 유효성 검사, null은 데이터베이스 컬럼의 NULL 허용 여부를 지정합니다."
    },
    {
      id: "mock3-011-migration-apply-order",
      conceptId: "migration-apply-order",
      difficulty: "medium",
      category: "Model",
      questionType: "multiple-choice",
      prompt: "모델의 필드를 수정한 뒤 변경 내용을 DB에 반영할 때 올바른 순서는?",
      options: [
        "makemigrations 실행 후 migrate를 실행한다.",
        "runserver 실행 후 showmigrations를 실행한다.",
        "createsuperuser 실행 후 makemigrations를 실행한다.",
        "migrate 실행 후 makemigrations를 실행한다.",
      ],
      answer: 0,
      explanation: "모델 변경을 기록한 migration 파일을 만든 뒤 DB에 적용합니다."
    },
    {
      id: "mock3-012-get-exception-multiple",
      conceptId: "get-exception-multiple",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "`Article.objects.get(title=\"공지\")`가 같은 제목의 글 2개를 찾았다. Django에서 일어나는 결과는?",
      options: [
        "제목이 중복된 글은 자동으로 하나로 병합된다.",
        "두 Article 인스턴스를 담은 QuerySet을 반환한다.",
        "첫 번째 Article 인스턴스만 반환한다.",
        "MultipleObjectsReturned 예외가 발생한다.",
      ],
      answer: 3,
      explanation: "get()은 결과가 정확히 하나일 때만 객체를 반환합니다."
    },
    {
      id: "mock3-013-orm-filter-empty-result",
      conceptId: "orm-filter-empty-result",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "조회 조건에 맞는 Article이 없을 때 예외 없이 반복 처리할 수 있는 코드는?",
      options: [
        "for article in Article.objects.create(title=\"없음\"): ...",
        "for article in Article.objects.filter(title=\"없음\"): ...",
        "for article in Article.objects.delete(title=\"없음\"): ...",
        "for article in Article.objects.get(title=\"없음\"): ...",
      ],
      answer: 1,
      explanation: "filter()는 일치하는 결과가 없으면 빈 QuerySet을 반환합니다."
    },
    {
      id: "mock3-014-orm-gte-condition",
      conceptId: "orm-gte-condition",
      difficulty: "medium",
      category: "ORM",
      questionType: "multiple-choice",
      prompt: "좋아요 수가 10 이상인 글을 조회하는 ORM 표현으로 알맞은 것은?",
      options: [
        "Article.objects.filter(likes__gt=10)",
        "Article.objects.filter(likes__gte=10)",
        "Article.objects.filter(likes__lte=10)",
        "Article.objects.filter(likes__lt=10)",
      ],
      answer: 1,
      explanation: "__gte는 이상, __gt는 초과, __lte는 이하, __lt는 미만입니다."
    },
    {
      id: "mock3-017-http-post-form-data",
      conceptId: "http-post-form-data",
      difficulty: "medium",
      category: "ORM with View",
      questionType: "multiple-choice",
      prompt: "다음 폼을 제출했을 때 View에서 `memo` 값을 조회하는 코드는?",
      code: "<form method=\"post\">\n  {% csrf_token %}\n  <input name=\"memo\" value=\"안녕하세요\">\n</form>",
      options: [
        "request.FILES.get('memo')",
        "request.GET.get('memo')",
        "request.POST.get('memo')",
        "request.session.get('memo')",
      ],
      answer: 2,
      explanation: "일반 HTML form이 POST로 보낸 데이터는 request.POST에서 조회합니다."
    },
    {
      id: "mock3-018-http-request-method-gate",
      conceptId: "http-request-method-gate",
      difficulty: "medium",
      category: "ORM with View",
      questionType: "multiple-choice",
      prompt: "한 View 함수에서 GET은 입력 화면을 보여주고 POST는 저장하도록 작성했다. 요청 분기에 적합한 조건은?",
      options: [
        "if request.method == 'POST':",
        "if request.POST == 'POST':",
        "if request.GET == 'POST':",
        "if request.method == request.POST:",
      ],
      answer: 0,
      explanation: "HTTP 요청 메서드는 request.method 문자열로 확인합니다."
    },
    {
      id: "mock3-019-csrf-middleware-reject",
      conceptId: "csrf-middleware-reject",
      difficulty: "medium",
      category: "ORM with View",
      questionType: "multiple-choice",
      prompt: "기본 CSRF 보호가 켜진 Django에서 POST form의 토큰을 누락했다. 일반적으로 예상되는 응답은?",
      options: [
        "서버가 비어 있는 토큰을 자동 발급하여 요청을 승인한다.",
        "CSRF 검증 실패로 403 Forbidden을 반환한다.",
        "요청이 GET으로 바뀌고 서버가 입력 폼만 표시한다.",
        "Form의 입력값 검증을 건너뛰고 DB 저장을 계속한다.",
      ],
      answer: 1,
      explanation: "기본 CSRF 미들웨어는 유효한 토큰이 없는 위험 메서드 요청을 거부합니다."
    },
    {
      id: "mock3-021-is-valid-cleaned-flow",
      conceptId: "is-valid-cleaned-flow",
      difficulty: "medium",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "바인딩된 ModelForm에 대해 `is_valid()`가 True를 반환했다. 다음 처리로 적절한 것은?",
      options: [
        "입력 데이터를 다시 request.GET에 복사한 뒤 저장한다.",
        "오류 메시지를 출력한 뒤 아무 값 없이 동일한 Form을 다시 만든다.",
        "필요한 저장 처리를 수행하고 완료된 화면으로 이동한다.",
        "이미 DB에 저장됐으므로 save 호출 없이 화면으로 이동한다.",
      ],
      answer: 2,
      explanation: "is_valid()는 검증 단계이고 DB 저장은 save 등 별도 단계입니다."
    },
    {
      id: "mock3-022-widget-attrs-scope",
      conceptId: "widget-attrs-scope",
      difficulty: "medium",
      category: "Form & ModelForm",
      questionType: "multiple-choice",
      prompt: "ModelForm에서 입력칸에 `class=\"form-control\"`을 지정하려 한다. 바꿔야 할 대상은?",
      options: [
        "필드의 Widget 속성이다.",
        "모델의 Meta.db_table 값이다.",
        "Model의 max_length 속성이다.",
        "View의 request.method 값이다.",
      ],
      answer: 0,
      explanation: "Widget은 입력 요소의 HTML 표현을 조절하고 Model Field는 데이터 구조를 정의합니다."
    },
    {
      id: "mock3-023-staticfiles-dirs-project",
      conceptId: "staticfiles-dirs-project",
      difficulty: "medium",
      category: "Static Files & Media",
      questionType: "multiple-choice",
      prompt: "앱의 static 폴더가 아닌 프로젝트 공용 `assets/` 폴더도 정적 파일 탐색 대상으로 추가하려 한다. 사용하는 설정은?",
      options: [
        "STATIC_URL에 경로를 등록한다.",
        "MEDIA_ROOT에 경로를 등록한다.",
        "MEDIA_URL에 경로를 등록한다.",
        "STATICFILES_DIRS에 경로를 등록한다.",
      ],
      answer: 3,
      explanation: "STATICFILES_DIRS는 앱별 static 경로 외에 추가 탐색 경로를 등록합니다."
    },
    {
      id: "mock3-024-imagefield-upload-to",
      conceptId: "imagefield-upload-to",
      difficulty: "medium",
      category: "Static Files & Media",
      questionType: "multiple-choice",
      prompt: "`image = models.ImageField(upload_to=\"posts/\")`로 정의한 필드의 역할로 알맞은 것은?",
      options: [
        "정적 파일 탐색 목록을 posts/ 폴더로만 제한해 이미지를 찾는다.",
        "템플릿에서 posts/ 이름의 URL로만 모든 파일을 조회하도록 설정한다.",
        "미디어 저장소 아래에 posts/ 경로를 사용해 업로드 파일을 보관한다.",
        "이미지를 SQLite 테이블 안의 posts 컬럼에 바이너리로 저장한다.",
      ],
      answer: 2,
      explanation: "upload_to는 MEDIA_ROOT를 기준으로 파일의 하위 저장 경로를 정합니다."
    },
    {
      id: "mock3-025-logout-session",
      conceptId: "logout-session",
      difficulty: "medium",
      category: "Authentication System",
      questionType: "multiple-choice",
      prompt: "`auth_logout(request)`가 처리하는 내용으로 적절한 것은?",
      options: [
        "현재 요청의 로그인 세션을 정리하되 User 계정 자체는 삭제하지 않는다.",
        "비밀번호를 초기화한 뒤 새 세션 식별자를 생성한다.",
        "로그인 세션과 함께 현재 User 계정도 데이터베이스에서 삭제한다.",
        "세션은 유지하고 브라우저 화면의 로그인 버튼만 숨긴다.",
      ],
      answer: 0,
      explanation: "로그아웃은 인증 세션을 종료하는 작업이며 회원 탈퇴와 구분됩니다."
    },
    {
      id: "mock3-028-orm-get-method",
      conceptId: "orm-get-method",
      difficulty: "medium",
      category: "ORM",
      questionType: "short-answer",
      prompt: "조건에 맞는 단일 모델 인스턴스를 조회하고 결과가 0개 또는 여러 개일 때 예외를 발생시키는 QuerySet API 메서드명만 쓰시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["get"],
      explanation: "get()은 정확히 한 건을 기대하는 조회 메서드입니다."
    },
    {
      id: "mock3-030-static-url-variable",
      conceptId: "static-url-variable",
      difficulty: "medium",
      category: "Static Files & Media",
      questionType: "short-answer",
      prompt: "웹 페이지에서 정적 파일에 접근할 때 쓰는 URL 접두사 설정 상수명을 정확히 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["STATIC_URL"],
      explanation: "STATIC_URL은 정적 파일의 URL 접두사 설정입니다."
    },
    {
      id: "mock3-031-model-form-class",
      conceptId: "model-form-class",
      difficulty: "medium",
      category: "Form & ModelForm",
      questionType: "short-answer",
      prompt: "모델 필드를 바탕으로 입력 필드를 자동 생성하는 Django 폼의 부모 클래스명을 정확히 적으시오. (forms. 접두사 제외)",
      options: [],
      answer: null,
      acceptedAnswers: ["ModelForm"],
      explanation: "forms.ModelForm은 모델 정의와 연결된 Form입니다."
    },
    {
      id: "mock3-032-modelform-instance-update-essay",
      conceptId: "modelform-instance-update-essay",
      difficulty: "medium",
      category: "Form & ModelForm",
      questionType: "essay",
      prompt: "이미 존재하는 게시글을 ModelForm으로 수정할 때 GET과 POST에서 각각 `instance=article`을 전달하는 이유를 30자 이상으로 설명하시오.",
      options: [],
      answer: null,
      modelAnswer: "GET에서는 수정할 게시글의 기존 값을 Form 입력칸에 채우기 위해 instance를 전달한다. POST에서는 검증된 데이터를 새 글로 추가하지 않고 같은 게시글에 반영하도록 instance를 전달한다.",
      rubricKeywords: [
        "GET",
        "기존 (또는 원래/수정할)",
        "POST",
        "instance",
        "수정 (또는 갱신/업데이트)",
      ],
      minLength: 30,
      explanation: "GET에서 기존 값 표시, POST에서 기존 인스턴스 갱신이라는 두 역할을 설명해야 합니다. 자동 채점은 의미 검수를 대체할 수 없습니다."
    }
  ],
  hard: [

  ],
  extreme: [

  ],
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
