import type { SpecialMockExamDifficulty, SpecialMockExamQuestion } from "../../../types/specialMockExam.ts";

type SourceQuestion = Omit<SpecialMockExamQuestion, "sourceId" | "hint"> & { hint?: string };

export const QUESTION_BANK: Record<SpecialMockExamDifficulty, SourceQuestion[]> = {
  "easy": [
    {
      "id": "mock6-001-settings-installed-apps-order",
      "conceptId": "django-app-registration-and-structure",
      "difficulty": "easy",
      "category": "Intro & Design Pattern",
      "questionType": "multiple-choice",
      "prompt": "새 Django 프로젝트에서 `python manage.py startapp reviews` 명령을 실행한 직후, 프로젝트가 `reviews` 앱의 모델과 템플릿을 인식하도록 만들기 위해 수행할 작업과 앱 구조에 대한 설명으로 옳은 것은?",
      "code": "# settings.py\nINSTALLED_APPS = [\n    'reviews',\n    'django.contrib.admin',\n    'django.contrib.auth',\n    # ...\n]",
      "options": [
        "startapp 명령을 실행하면 INSTALLED_APPS에 자동 등록되므로 settings.py를 따로 수정할 필요가 없다.",
        "앱을 먼저 생성한 뒤 settings.py의 INSTALLED_APPS 리스트에 'reviews'를 직접 등록해야 한다.",
        "INSTALLED_APPS에 'reviews'를 먼저 적어 두어야만 터미널에서 startapp reviews 명령이 정상 동작한다.",
        "생성된 reviews 앱 폴더 내부에는 앱 전용 경로를 관리하는 urls.py 파일이 기본 파일로 자동 생성된다."
      ],
      "answer": 1,
      "explanation": "Intro & Design Pattern PDF 70~71쪽, 75~76쪽에 따라 `python manage.py startapp`으로 앱을 생성한 뒤 `settings.py`의 `INSTALLED_APPS`에 등록해야 하며, 등록 전 생성이 먼저입니다. 또한 앱 폴더에는 `urls.py`가 기본 생성되지 않아 필요할 때 직접 파일을 만들어 연결합니다.",
      "hint": "앱 생성 명령과 INSTALLED_APPS 등록의 선후 관계, 그리고 startapp 실행 직후 생성되는 기본 파일 목록을 떠올려 보세요."
    },
    {
      "id": "mock6-002-render-function-parameters",
      "conceptId": "django-render-function-signature",
      "difficulty": "easy",
      "category": "Intro & Design Pattern",
      "questionType": "multiple-choice",
      "prompt": "다음 View 함수가 템플릿을 렌더링하여 응답할 때, `render()` 함수의 인자 구성과 반환값에 대한 설명으로 옳은 것은?",
      "code": "# articles/views.py\nfrom django.shortcuts import render\n\ndef index(request):\n    context = {'greeting': '반갑습니다'}\n    return render(request, 'articles/index.html', context)",
      "options": [
        "첫 번째 인자인 request는 생략 가능하며 두 번째 인자인 템플릿 경로 문자열만 넘겨도 정상 동작한다.",
        "두 번째 인자에는 'articles/templates/articles/index.html'처럼 templates 폴더명까지 포함해 적는다.",
        "세 번째 인자 context는 템플릿에서 사용할 변수 이름을 키(key)로 담는 딕셔너리이며 생략할 수 있다.",
        "render() 함수는 브라우저에게 다른 URL로 재요청하라는 302 Redirect 응답 객체를 생성해 반환한다."
      ],
      "answer": 2,
      "explanation": "Intro & Design Pattern PDF 98쪽에 따라 `render(request, template_name, context)`에서 첫 번째 `request`와 두 번째 `template_name`은 필수 인자이고, 세 번째 `context`는 딕셔너리 형태의 선택 인자입니다. 앱의 `templates/`까지는 기본 탐색 경로이므로 그 하위 경로인 `'articles/index.html'`을 적으며, 완성된 `HttpResponse` 객체를 반환합니다.",
      "hint": "render(request, template_name, context=None)의 필수 인자 2개와 선택 인자 1개의 역할을 구분해 보세요."
    },
    {
      "id": "mock6-003-dtl-for-empty-tag",
      "conceptId": "dtl-for-empty-syntax",
      "difficulty": "easy",
      "category": "Template & URLs",
      "questionType": "multiple-choice",
      "prompt": "View가 빈 QuerySet인 articles를 전달했다. 다음 템플릿의 렌더링 결과로 옳은 것은?",
      "code": "<ul>\n  {% for article in articles %}\n    <li>{{ article.title }}</li>\n  {% endfor %}\n  {% if articles|length == 0 %}\n    <li>작성된 게시글이 없습니다.</li>\n  {% endif %}\n</ul>",
      "options": [
        "빈 QuerySet을 반복하면 DoesNotExist 예외가 발생한다.",
        "반복문이 한 번 실행되어 None이라는 제목이 출력된다.",
        "articles|length가 0이면 if 조건이 거짓이 되어 아무 안내도 출력되지 않는다.",
        "반복문 본문은 실행되지 않고 작성된 게시글이 없습니다라는 안내가 출력된다."
      ],
      "answer": 3,
      "explanation": "Template & URLs PDF 20~23쪽의 for·if 예제처럼 빈 목록은 반복문 본문을 실행하지 않습니다. articles|length는 0이므로 if 조건이 참이 되어 안내 문구가 출력됩니다.",
      "hint": "반복문과 if 조건을 각각 평가해 보세요."
    },
    {
      "id": "mock6-004-url-path-arg-vs-query-string",
      "conceptId": "url-path-converter-vs-query-parameters",
      "difficulty": "easy",
      "category": "Template & URLs",
      "questionType": "multiple-choice",
      "prompt": "다음과 같이 URL 패턴과 검색 폼이 작성되어 있다. 사용자가 입력칸에 `django`를 입력해 `/boards/3/search/?keyword=django`로 요청이 전송되었을 때, View 함수 `search`에서 경로의 `3`과 검색어 `'django'`를 꺼내는 방법으로 옳은 것은?",
      "code": "# boards/urls.py\nurlpatterns = [\n    path('boards/<int:category_id>/search/', views.search, name='search'),\n]\n\n# search.html\n<form action=\"/boards/3/search/\" method=\"GET\">\n  <input type=\"text\" id=\"kw-box\" name=\"keyword\">\n  <button type=\"submit\">검색</button>\n</form>",
      "options": [
        "3은 request.GET.get('category_id')로 꺼내고, 'django'는 request.GET.get('kw-box')로 꺼낸다.",
        "3은 View 매개변수 category_id로 받고, 'django'는 request.GET.get('keyword')로 꺼낸다.",
        "3은 View 매개변수 category_id로 받고, 'django'는 request.POST.get('keyword')로 꺼낸다.",
        "3은 request.POST.get('category_id')로 꺼내고, 'django'는 View 매개변수 keyword로 받는다."
      ],
      "answer": 1,
      "explanation": "Template & URLs PDF 38~50쪽, 56쪽, 66~71쪽에 따라 URL 경로의 `<int:category_id>`(Variable Routing)로 전달된 값 `3`은 View 함수의 동명 매개변수 `def search(request, category_id):`로 전달받으며, `?keyword=django`처럼 GET 폼이 만든 쿼리 문자열은 input의 `name` 속성을 키로 하여 `request.GET.get('keyword')`에서 꺼냅니다.",
      "hint": "URL 경로 내부의 <int:category_id>와 물음표(?) 뒤에 붙는 쿼리 문자열이 각각 View의 어디로 전달되는지 비교해 보세요."
    },
    {
      "id": "mock6-005-model-migration-workflow-sqlmigrate",
      "conceptId": "model-migrations-inspection-commands",
      "difficulty": "easy",
      "category": "Model",
      "questionType": "multiple-choice",
      "prompt": "다음 `Article` 모델을 수정한 뒤 마이그레이션을 관리할 때 사용하는 `manage.py` 명령어에 대한 설명으로 옳은 것은?",
      "code": "# articles/models.py\nclass Article(models.Model):\n    title = models.CharField(max_length=20)\n    content = models.TextField()\n    created_at = models.DateTimeField(auto_now_add=True)",
      "options": [
        "python manage.py makemigrations를 실행하면 db.sqlite3에 articles_article 테이블이 즉시 생성된다.",
        "python manage.py showmigrations는 각 마이그레이션 설계도가 실행할 실제 SQL 문을 화면에 출력해 준다.",
        "python manage.py sqlmigrate articles 0001은 해당 마이그레이션 파일이 생성하는 SQL 문을 확인할 때 사용한다.",
        "이미 생성된 모델 클래스에 새 필드를 추가할 때는 makemigrations 없이 migrate만 실행해도 DB에 반영된다."
      ],
      "answer": 2,
      "explanation": "Model PDF 34~46쪽, 64쪽에 따라 `makemigrations`는 변경 이력 파일(설계도)만 생성하고, 실제 DB 반영은 `migrate`가 수행합니다. 마이그레이션 적용 여부는 `showmigrations`로 확인하고, 특정 마이그레이션 파일이 어떤 SQL 문으로 변환되는지는 `sqlmigrate <app_label> <migration_name>`으로 확인합니다.",
      "hint": "makemigrations, migrate, showmigrations, sqlmigrate 네 가지 명령어의 역할을 각각 구분해 보세요."
    },
    {
      "id": "mock6-006-orm-before-save-and-return-types",
      "conceptId": "orm-instance-save-vs-get-filter",
      "difficulty": "easy",
      "category": "ORM",
      "questionType": "multiple-choice",
      "prompt": "현재 DB의 `Article` 테이블에 `pk=1(title='첫 글')`, `pk=2(title='둘째 글')` 두 행이 저장되어 있다. Django Shell에서 아래 코드를 순서대로 실행한 직후의 상태로 옳은 것은?",
      "code": ">>> a = Article(title='셋째 글', content='내용')\n>>> qs = Article.objects.filter(pk=1)\n>>> obj = Article.objects.get(pk=2)",
      "options": [
        "a는 생성 즉시 DB에 반영되므로 a.pk는 None이 아니며 테이블의 전체 행 개수는 3개가 된다.",
        "qs와 obj는 모두 단일 Article 모델 인스턴스이므로 qs.title로 제목을 바로 읽을 수 있다.",
        "Article.objects.filter(pk=99)를 추가로 실행하면 일치하는 행이 없어 DoesNotExist 예외가 발생한다.",
        "a는 아직 save()를 호출하지 않았으므로 a.pk는 None이고 DB의 전체 행 개수는 2개이다."
      ],
      "answer": 3,
      "explanation": "ORM PDF 25~35쪽에 따라 `Article(title='셋째 글', content='내용')`은 파이썬 메모리상에만 인스턴스를 생성한 상태이므로 `a.save()`를 호출하기 전까지 DB에 저장되지 않으며 `a.pk`는 `None`입니다. 또한 `filter(pk=1)`의 결과 `qs`는 원소가 1개여도 `QuerySet`이고, `get(pk=2)`의 결과 `obj`만 단일 모델 인스턴스입니다.",
      "hint": "인스턴스 생성 직후 save() 호출 전의 pk 값과, filter() 및 get()의 반환 자료형 차이를 확인해 보세요."
    },
    {
      "id": "mock6-007-template-extends-tag",
      "conceptId": "dtl-template-inheritance-extends",
      "difficulty": "easy",
      "category": "Template & URLs",
      "questionType": "short-answer",
      "prompt": "다음 자식 템플릿 파일의 최상단 첫 줄에서 부모 템플릿(`'base.html'`)을 상속받기 위해 빈칸 `( A )`에 들어갈 DTL 태그 키워드 한 단어만 작성하시오. (`{% %}` 기호와 `'base.html'`은 제외하고 영문 키워드만 작성)",
      "code": "{% ( A ) 'base.html' %}\n\n{% block content %}\n  <h1>게시글 목록</h1>\n{% endblock content %}",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "extends"
      ],
      "explanation": "Template & URLs PDF 28~31쪽에 따라 자식 템플릿이 부모 템플릿의 스켈레톤 구조를 상속받을 때는 파일의 첫 번째 템플릿 태그로 `{% extends 'base.html' %}` 태그를 작성합니다.",
      "hint": "부모 템플릿을 확장하여 공통 구조를 상속하겠다고 선언하는 태그입니다."
    },
    {
      "id": "mock6-008-orm-create-method",
      "conceptId": "orm-objects-create-shortcut",
      "difficulty": "easy",
      "category": "ORM",
      "questionType": "short-answer",
      "prompt": "다음 코드에서 별도의 `save()` 호출 없이 `Article` 인스턴스 생성과 DB 저장을 한 번에 수행하여 저장된 객체를 반환받으려 한다. `Article.objects.` 뒤의 빈칸 `( A )`에 들어갈 QuerySet API 메서드 이름만 작성하시오. (점(`.`)과 호출 괄호 `()`는 제외하고 메서드명만 작성)",
      "code": "# 인스턴스 생성과 DB 테이블 저장을 동시에 수행\narticle = Article.objects.( A )(title='공지사항', content='필독 안내')",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "create"
      ],
      "explanation": "ORM PDF 29쪽에 따라 `Article.objects.create(title='...', content='...')`는 객체 생성과 데이터베이스 저장(`INSERT`)을 한 번에 처리하고 저장된 인스턴스를 반환하는 단축 메서드입니다.",
      "hint": "save()를 따로 호출하지 않고 모델 매니저(objects)를 통해 생성과 저장을 동시에 수행하는 메서드 이름입니다."
    },
    {
      "id": "mock6-009-imagefield-pillow-dependency",
      "conceptId": "imagefield-pillow-requirement",
      "difficulty": "easy",
      "category": "Static Files & Media",
      "questionType": "multiple-choice",
      "prompt": "`Article` 모델에 `ImageField`를 추가한 뒤 터미널에서 `python manage.py makemigrations`를 실행했더니 아래와 같은 `SystemCheckError`가 발생했다. 이 오류의 원인과 해결 절차로 옳은 것은?",
      "code": "# articles/models.py\nclass Article(models.Model):\n    title = models.CharField(max_length=10)\n    content = models.TextField()\n    image = models.ImageField(upload_to='images/', blank=True)\n\n# 터미널 출력\n# SystemCheckError: System check identified some issues:\n# ERRORS:\n# articles.Article.image: (fields.E210) Cannot use ImageField because Pillow is not installed.",
      "options": [
        "ImageField는 이미지 처리를 위해 Pillow 패키지가 필수이므로 가상 환경에 Pillow를 설치한 뒤 마이그레이션을 진행한다.",
        "settings.py에 MEDIA_ROOT 경로를 설정하지 않아 발생한 오류이므로 경로 상수만 추가하면 마이그레이션이 통과된다.",
        "blank=True 옵션은 ImageField에 사용할 수 없으므로 null=True로 수정한 뒤 makemigrations를 다시 실행한다.",
        "FileField와 달리 ImageField는 SQLite에서 지원하지 않으므로 데이터베이스 엔진을 변경한 뒤 다시 실행해야 한다."
      ],
      "answer": 0,
      "explanation": "Static Files PDF 40~42쪽 및 69~71쪽에 따라 `ImageField`는 파이썬 이미지 처리 라이브러리인 `Pillow`가 설치되어 있어야 사용할 수 있습니다. `pip install pillow`로 설치한 뒤 `makemigrations` → `migrate`를 진행하고 `pip freeze > requirements.txt`로 의존성을 기록합니다.",
      "hint": "오류 메시지 (fields.E210)에서 안내하는 미설치 패키지의 이름과 ImageField의 의존성을 확인해 보세요."
    },
    {
      "id": "mock6-010-http-cookie-headers-and-lifetime",
      "conceptId": "http-set-cookie-and-session-cookie",
      "difficulty": "easy",
      "category": "Authentication System",
      "questionType": "multiple-choice",
      "prompt": "HTTP 환경에서 서버와 브라우저가 쿠키(Cookie)를 주고받는 헤더와 쿠키 수명(Lifetime) 분류에 대한 설명으로 옳은 것은?",
      "options": [
        "서버가 브라우저에게 쿠키 저장을 지시할 때는 HTTP 응답 헤더의 Set-Cookie 필드를 통해 쿠키를 전송한다.",
        "브라우저가 저장된 쿠키를 서버에 다시 보낼 때는 요청 본문(POST Body)에 자동으로 숨겨서 전송한다.",
        "Session cookie는 브라우저를 종료해도 삭제되지 않고 만료일(Expires)까지 영구 보관되는 쿠키이다.",
        "브라우저에서 쿠키를 삭제하면 서버 DB의 django_session 테이블에 있는 해당 세션 행도 즉시 삭제된다."
      ],
      "answer": 0,
      "explanation": "Authentication System 01 PDF 17~21쪽, 65쪽에 따라 서버는 HTTP 응답 헤더의 `Set-Cookie` 필드로 쿠키 저장을 지시하고, 브라우저는 재요청 시 HTTP 요청 헤더의 `Cookie` 필드에 쿠키를 담아 전송합니다. `Session cookie`는 현재 브라우저 세션이 종료될 때 브라우저에서 삭제되며(서버의 세션 데이터가 즉시 지워지는 것은 아님), 만료 기간을 지정해 유지하는 쿠키는 `Persistent cookie`입니다.",
      "hint": "서버 응답 시 쿠키를 심는 헤더 이름(Set-Cookie), 브라우저 재요청 시 헤더 이름(Cookie), 그리고 Session cookie와 Persistent cookie의 차이를 비교해 보세요."
    }
  ],
  "medium": [
    {
      "id": "mock6-011-custom-user-admin-registration",
      "conceptId": "custom-user-admin-site-register",
      "difficulty": "medium",
      "category": "Authentication System",
      "questionType": "multiple-choice",
      "prompt": "`AbstractUser`를 상속받아 `accounts.User` 모델을 정의하고 `AUTH_USER_MODEL = 'accounts.User'` 설정과 첫 마이그레이션을 완료했다. 이후 관리자 페이지(`/admin/`)에 접속했을 때 `Users` 관리 메뉴가 보이지 않는 이유와 해결 코드로 옳은 것은?",
      "code": "# accounts/models.py\nfrom django.contrib.auth.models import AbstractUser\n\nclass User(AbstractUser):\n    pass\n\n# accounts/admin.py\nfrom django.contrib import admin\n# 여기에 추가할 코드를 고르시오.",
      "options": [
        "accounts/views.py에서 @login_required 데코레이터를 호출해야 관리자 페이지에 Custom User 목록이 자동 등록된다.",
        "AbstractUser를 상속받은 모델은 관리자 페이지 등록이 불가하므로 AbstractBaseUser로 부모 클래스를 변경해야 한다.",
        "settings.py의 INSTALLED_APPS에서 'django.contrib.admin'을 맨 아래로 옮긴 뒤 다시 migrate를 실행해야 나타난다.",
        "기본 User 모델이 아니므로 accounts/admin.py에서 admin.site.register(User, UserAdmin)로 직접 등록해야 한다."
      ],
      "answer": 3,
      "explanation": "Authentication System 01 PDF 41쪽, 74쪽에 따라 기본 `auth.User`를 대체한 Custom User 모델(`accounts.User`)은 자동으로 Admin 사이트에 등록되지 않습니다. 따라서 `accounts/admin.py`에서 `from django.contrib.auth.admin import UserAdmin`과 `from .models import User`를 불러와 `admin.site.register(User, UserAdmin)`를 작성해야 관리자 화면에 출력됩니다.",
      "hint": "기본 User 모델을 Custom User 모델로 대체하는 3단계(모델 정의 → AUTH_USER_MODEL 설정 → admin.py 등록) 중 마지막 단계를 떠올려 보세요."
    },
    {
      "id": "mock6-012-venv-git-exclusion-and-freeze",
      "conceptId": "virtualenv-gitignore-and-requirements",
      "difficulty": "medium",
      "category": "Intro & Design Pattern",
      "questionType": "multiple-choice",
      "prompt": "팀원과 Django 프로젝트를 Git으로 협업할 때 가상 환경(`venv/`) 폴더와 `requirements.txt` 파일을 다루는 올바른 방식과 그 이유로 적절한 것은?",
      "code": "# 프로젝트 루트 디렉터리\nmy_pjt/\n  ├── articles/\n  ├── my_pjt/\n  ├── venv/\n  ├── .gitignore\n  ├── manage.py\n  └── requirements.txt",
      "options": [
        "venv/ 폴더를 Git 저장소에 그대로 커밋해야 다른 운영체제를 쓰는 팀원도 별도 설치 없이 실행 파일을 바로 쓸 수 있다.",
        "venv/는 용량이 크고 환경 의존적이므로 .gitignore로 제외하고, 패키지 목록만 requirements.txt로 공유해 설치한다.",
        "requirements.txt는 python manage.py makemigrations 실행 시 자동 갱신되므로 수동으로 기록할 필요가 없다.",
        "가상 환경을 활성화하지 않고 pip install을 실행해도 프로젝트 안에 venv/ 폴더가 있으면 자동으로 그 안에만 설치된다."
      ],
      "answer": 1,
      "explanation": "Intro & Design Pattern PDF 28~46쪽에 따라 `venv/` 폴더는 패키지 실물 파일과 OS별 고유 경로 설정을 담고 있어 Git에 올리지 않고 `.gitignore`에 등록합니다. 대신 `pip freeze > requirements.txt`로 패키지 목록과 버전을 텍스트 파일로 공유하고, 팀원은 각자 가상 환경을 만들어 활성화한 뒤 `pip install -r requirements.txt`로 환경을 재현합니다.",
      "hint": "가상 환경 폴더 자체를 Git에 올리지 않고 텍스트 목록(requirements.txt)만 공유하는 이유를 생각해 보세요."
    },
    {
      "id": "mock6-013-template-extends-and-load-static-order",
      "conceptId": "template-inheritance-with-load-static",
      "difficulty": "medium",
      "category": "Template & URLs",
      "questionType": "multiple-choice",
      "prompt": "부모 템플릿 `base.html`의 상단에 이미 `{% load static %}`이 선언되어 있다. `base.html`을 상속받는 자식 템플릿 `detail.html`에서 정적 이미지 파일(`articles/banner.png`)을 출력하려 할 때 올바른 작성 규칙은?",
      "code": "{# articles/detail.html #}\n(가)\n{% block content %}\n  <img src=\"{% static 'articles/banner.png' %}\" alt=\"banner\">\n{% endblock content %}",
      "options": [
        "부모인 base.html에 {% load static %}이 있으므로 (가)에는 {% extends 'base.html' %}만 적으면 그대로 동작한다.",
        "(가)의 첫째 줄에 {% load static %}을 먼저 선언하고 둘째 줄에 {% extends 'base.html' %}를 적어야 정상 동작한다.",
        "자식에서도 load 해야 하므로 첫 번째 템플릿 태그로 {% extends 'base.html' %}를 쓰고 그 아래에 {% load static %}을 쓴다.",
        "{% static %} 태그는 DTL 기본 내장 태그이므로 부모와 자식 템플릿 어디에서도 {% load static %}을 선언할 필요가 없다."
      ],
      "answer": 2,
      "explanation": "Template & URLs PDF 28~31쪽 및 Static Files PDF 15, 17쪽에 따라 `{% extends %}`를 사용하는 자식 템플릿에서는 반드시 `{% extends %}`가 파일의 첫 번째 템플릿 태그여야 하며, 부모 템플릿에서 `{% load static %}`을 했더라도 태그 라이브러리는 자식 템플릿으로 자동 상속되지 않으므로 `{% extends %}` 아래(또는 블록 내부)에서 `{% load static %}`을 다시 선언해야 합니다.",
      "hint": "Static Files 강의 자료 17쪽의 TIP(extends가 첫 줄이고 load는 그 아래에 쓰며, 부모에서 load 했더라도 자식에서 다시 load 해야 함)을 떠올려 보세요."
    },
    {
      "id": "mock6-014-combined-path-query-post-extraction",
      "conceptId": "request-path-get-post-separation",
      "difficulty": "medium",
      "category": "ORM with View",
      "questionType": "multiple-choice",
      "prompt": "다음 URL 설정과 템플릿 폼을 통해 사용자가 입력칸에 `'멋진 글이네요'`를 입력하고 제출하여 `POST /articles/7/feedback/?from=detail` 요청이 발생했다. View 함수 `feedback`에서 게시글 번호 `7`, 유입 경로 `'detail'`, 작성 내용 `'멋진 글이네요'`를 읽는 코드로 옳은 것은?",
      "code": "# articles/urls.py\napp_name = 'articles'\nurlpatterns = [\n    path('<int:article_pk>/feedback/', views.feedback, name='feedback'),\n]\n\n# detail.html\n<form action=\"{% url 'articles:feedback' article.pk %}?from=detail\" method=\"POST\">\n  {% csrf_token %}\n  <input type=\"text\" name=\"message\">\n  <input type=\"submit\" value=\"등록\">\n</form>",
      "options": [
        "7은 매개변수 article_pk, 'detail'은 request.GET.get('from'), '멋진 글이네요'는 request.POST.get('message')로 읽는다.",
        "7은 request.POST.get('article_pk'), 'detail'은 request.POST.get('from'), '멋진 글이네요'는 request.POST.get('message')로 읽는다.",
        "7은 매개변수 article_pk, 'detail'은 request.POST.get('from'), '멋진 글이네요'는 request.GET.get('message')로 읽는다.",
        "7은 request.GET.get('article_pk'), 'detail'은 request.GET.get('from'), '멋진 글이네요'는 매개변수 message로 읽는다."
      ],
      "answer": 0,
      "explanation": "Template & URLs PDF 50쪽, 56쪽, 66~71쪽 및 ORM with View PDF 34~43쪽에 따라 요청 메서드가 POST이더라도 URL 경로 패턴 `<int:article_pk>`에 매칭된 `7`은 View 함수의 `article_pk` 인자로 전달되고, URL의 `?from=detail` 쿼리 문자열은 `request.GET.get('from')`에 담기며, POST 본문으로 제출된 `<input name=\"message\">` 값은 `request.POST.get('message')`로 읽습니다.",
      "hint": "하나의 POST 요청 안에서도 URL 경로 변수(Variable Routing), URL 쿼리 스트링(?key=value), 폼 본문 데이터(POST body)는 서로 다른 통로로 접근합니다."
    },
    {
      "id": "mock6-015-model-existing-table-add-field-default",
      "conceptId": "model-add-field-to-existing-table",
      "difficulty": "medium",
      "category": "Model",
      "questionType": "multiple-choice",
      "prompt": "이미 레코드가 저장되어 있는 `Article` 모델에 `null=True`나 `default` 옵션을 지정하지 않은 채 새로운 필드 `author = models.CharField(max_length=15)`를 추가하고 `python manage.py makemigrations`를 실행했다. 이때 터미널에 나타나는 프롬프트에 대한 설명으로 옳은 것은?",
      "code": "It is impossible to add a non-nullable field 'author' to article without specifying a default.\nPlease select a fix:\n 1) Provide a one-off default now (will be set on all existing rows with a null value for this column)\n 2) Quit and manually define a default value in models.py.",
      "options": [
        "CharField에 blank=True를 적으면 DB 컬럼이 NULL 허용으로 바뀌어 위 안내 없이 빈 값(NULL)으로 마이그레이션된다.",
        "위 프롬프트에서 1번을 선택해 값을 입력하면 마이그레이션 파일은 생성되지 않고 기존 테이블의 데이터만 전부 삭제된다.",
        "새로 추가한 author 필드는 모델 코드의 맨 위에 작성했더라도 실제 DB 테이블에서는 가장 첫 번째(왼쪽) 컬럼으로 삽입된다.",
        "모델 필드는 기본적으로 NOT NULL 제약이 적용되므로, 기존 행들의 새 컬럼에 채워 넣을 기본값(default)을 묻는 안내이다."
      ],
      "answer": 3,
      "explanation": "Model PDF 37~45쪽에 따라 Django 모델 필드는 별도 설정이 없으면 `NOT NULL`(`null=False`) 제약 조건으로 생성됩니다. 따라서 이미 데이터가 있는 테이블에 새 필드를 추가할 때는 기존 레코드의 해당 컬럼에 넣을 기본값(`default`)이 필요하여 Django가 일회성 기본값을 직접 입력받거나(1번) `models.py`에 설정하도록(2번) 안내합니다. 또한 `blank=True`는 폼 검증 옵션이므로 DB의 `NOT NULL` 제약 조건을 해제하지 못하며, 추가된 컬럼은 테이블의 가장 우측(뒤)에 붙습니다.",
      "hint": "Model 강의 자료의 '추가 Migrations' 챕터에서 기존 레코드가 있을 때 NOT NULL 필드를 추가하면 왜 기본값을 묻는지 확인해 보세요."
    },
    {
      "id": "mock6-016-orm-sqlite-contains-case-behavior",
      "conceptId": "orm-field-lookups-sqlite-case-sensitivity",
      "difficulty": "medium",
      "category": "ORM",
      "questionType": "multiple-choice",
      "prompt": "Django의 기본 데이터베이스인 SQLite(`db.sqlite3`) 환경에서 `Article` 테이블에 아래와 같이 3개의 행만 저장되어 있다. 교재(ORM 51쪽)의 Field lookups 설명을 기준으로 다음 두 쿼리의 실행 결과를 비교한 설명으로 옳은 것은?",
      "code": "# 현재 SQLite DB의 Article 테이블 상태\n# pk=1: title='Django ORM'\n# pk=2: title='django orm'\n# pk=3: title='Python Web'\n\nq1 = Article.objects.filter(title__contains='Django')\nq2 = Article.objects.filter(title__icontains='django')",
      "options": [
        "SQLite에서도 contains는 영문 대소문자를 엄격히 구분하므로 q1은 pk=1만 담고 q2는 pk=1, pk=2를 담은 QuerySet을 반환한다.",
        "실습에서 사용하는 SQLite에서는 contains도 영문 대소문자를 구분하지 않으므로 q1과 q2 모두 pk=1, pk=2를 담은 QuerySet을 반환한다.",
        "q1과 q2는 모두 조건에 일치하는 레코드가 2개씩 존재하므로 실행 즉시 MultipleObjectsReturned 예외가 발생한다.",
        "title__contains처럼 밑줄 두 개(__)를 쓰면 문법 오류가 발생하므로 title_contains처럼 밑줄 한 개(_)로 작성해야 한다."
      ],
      "answer": 1,
      "explanation": "ORM PDF 50~51쪽에 명시된 것처럼, 개념상 `contains`는 대소문자를 구분하고 `icontains`는 대소문자를 구분하지 않는 포함 조건이지만, **우리가 실습에서 사용하는 SQLite에서는 `contains`도 영문 대소문자를 구분하지 않습니다**(DB 종류에 따라 동작이 다를 수 있음). 따라서 SQLite 환경에서는 `q1`과 `q2` 모두 `pk=1('Django ORM')`과 `pk=2('django orm')` 2건을 포함한 `QuerySet`을 반환합니다.",
      "hint": "ORM 강의 자료 51쪽 하단의 SQLite 관련 안내 박스에서 contains가 영문 대소문자를 어떻게 처리한다고 설명했는지 떠올려 보세요."
    },
    {
      "id": "mock6-017-orm-view-create-vs-new-combine",
      "conceptId": "combine-new-and-create-views",
      "difficulty": "medium",
      "category": "ORM with View",
      "questionType": "multiple-choice",
      "prompt": "기존에 분리되어 있던 `new`(입력 화면 제공)와 `create`(DB 저장) 두 View 함수를 아래와 같이 하나의 `create` 함수로 결합했다. `GET /articles/create/` 요청이 들어왔을 때 실행되는 흐름으로 옳은 것은?",
      "code": "def create(request):\n    if request.method == 'POST':           # (ㄱ)\n        form = ArticleForm(request.POST)   # (ㄴ)\n        if form.is_valid():                # (ㄷ)\n            article = form.save()\n            return redirect('articles:detail', article.pk)\n    else:\n        form = ArticleForm()               # (ㄹ)\n    context = {'form': form}\n    return render(request, 'articles/create.html', context)  # (ㅁ)",
      "options": [
        "(ㄱ) 조건이 참이 되어 (ㄴ)과 (ㄷ)을 거친 뒤 빈 게시글을 DB에 저장하고 상세 페이지로 리다이렉트한다.",
        "else 블록의 (ㄹ)이 실행된 뒤 하단에 return 문이 도달하지 않아 None을 반환하고 ValueError가 발생한다.",
        "(ㄱ) 조건이 거짓이므로 else 블록의 (ㄹ)에서 빈 ArticleForm()을 생성한 뒤, (ㅁ)에서 작성 화면을 렌더링한다.",
        "GET 요청에서도 (ㄷ)의 form.is_valid()가 자동 실행되어 필수 입력란 오류 메시지가 화면에 처음부터 표시된다."
      ],
      "answer": 2,
      "explanation": "Form PDF 41~48쪽에 따라 `GET /articles/create/` 요청이 들어오면 `request.method == 'POST'` 조건이 거짓이므로 `else` 블록의 `(ㄹ) form = ArticleForm()`이 실행되어 비어 있는(unbound) 폼 인스턴스가 생성됩니다. 이어서 `if-else` 바깥의 공통 `context`와 `(ㅁ) return render(...)`가 실행되어 사용자에게 글 작성 페이지를 응답합니다.",
      "hint": "if-else 문 바깥에 위치한 context와 return render(...)가 GET 요청과 유효성 검사에 실패한 POST 요청에서 어떻게 공유되는지 살펴보세요."
    },
    {
      "id": "mock6-018-modelform-invalid-post-rerender-reason",
      "conceptId": "modelform-invalid-post-bound-form-context",
      "difficulty": "medium",
      "category": "Form & ModelForm",
      "questionType": "multiple-choice",
      "prompt": "다음 게시글 작성 View 함수에서 POST 요청으로 제출된 입력값이 유효성 검사(`form.is_valid()`)에 실패했을 때, 새로운 `ArticleForm()`을 만들지 않고 검증에 실패한 `form`을 그대로 템플릿에 넘기는 이유로 가장 적절한 것은?",
      "code": "def create(request):\n    if request.method == 'POST':\n        form = ArticleForm(request.POST)\n        if form.is_valid():\n            article = form.save()\n            return redirect('articles:detail', article.pk)\n    else:\n        form = ArticleForm()\n    context = {'form': form}\n    return render(request, 'articles/create.html', context)",
      "options": [
        "새로 비바인딩 ArticleForm() 인스턴스를 생성하면 DB에 저장되어 있던 기존 게시글들이 함께 초기화되기 때문이다.",
        "검증에 실패한 form 객체 안에 사용자의 기존 입력값과 필드별 오류 메시지가 담겨 있어 화면에 함께 표시하기 위해서이다.",
        "POST 요청 처리 중 render() 함수를 호출하면 브라우저 주소창이 자동으로 GET 요청 주소로 리다이렉트되기 때문이다.",
        "is_valid()가 False를 반환하더라도 바인딩된 form을 render()에 넘기면 Django가 자동으로 임시 저장을 수행하기 때문이다."
      ],
      "answer": 1,
      "explanation": "Form PDF 48~52쪽에 따라 `POST` 요청에서 `form = ArticleForm(request.POST)`로 바인딩된 폼이 `form.is_valid()`를 통과하지 못하면, 해당 `form` 인스턴스에는 사용자가 입력했던 데이터와 각 필드별 검증 에러 메시지가 포함됩니다. 이를 그대로 `context`에 담아 `render()`로 응답해야 사용자가 기존 입력값을 유지한 채 에러 원인을 확인하고 수정할 수 있습니다.",
      "hint": "ArticleForm()과 ArticleForm(request.POST) 중 어느 객체가 검증 실패 원인과 기존 입력값을 보유하고 있는지 비교해 보세요."
    },
    {
      "id": "mock6-019-modelform-instance-kwarg",
      "conceptId": "modelform-update-instance-argument",
      "difficulty": "medium",
      "category": "Form & ModelForm",
      "questionType": "short-answer",
      "prompt": "다음 게시글 수정 View에서 새 행을 생성하지 않고 조회한 article을 갱신하려 한다. 빈칸 ( A )에 들어갈 키워드 인자 이름만 작성하시오. (=article과 괄호는 제외)",
      "code": "def update(request, pk):\n    article = Article.objects.get(pk=pk)\n    if request.method == 'POST':\n        form = ArticleForm(request.POST, ( A )=article)\n        if form.is_valid():\n            form.save()\n            return redirect('articles:detail', article.pk)",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "instance"
      ],
      "explanation": "Form PDF 53~60쪽, 58~60쪽, 63쪽에 따라 `ModelForm`으로 기존 객체를 수정할 때는 `ArticleForm(request.POST, instance=article)`과 같이 `instance` 키워드 인자에 수정 대상 모델 인스턴스를 전달해야 `form.save()` 호출 시 새 행 추가가 아닌 기존 행 갱신이 수행됩니다.",
      "hint": "ModelForm에서 기존 모델 객체를 연결하는 키워드 이름입니다."
    },
    {
      "id": "mock6-020-static-search-order-and-dirs",
      "conceptId": "staticfiles-dirs-and-search-order",
      "difficulty": "medium",
      "category": "Static Files & Media",
      "questionType": "multiple-choice",
      "prompt": "`settings.py`에 아래와 같이 정적 파일 설정이 작성되어 있을 때, Django의 정적 파일 탐색 경로와 템플릿 태그 동작에 대한 설명으로 옳은 것은?",
      "code": "# settings.py\nSTATIC_URL = 'static/'\nSTATICFILES_DIRS = [\n    BASE_DIR / 'static',\n]",
      "options": [
        "STATICFILES_DIRS를 설정하면 각 앱 내부의 app_name/static/ 기본 경로는 더 이상 탐색하지 않는다.",
        "템플릿에서 {% static 'static/css/style.css' %}처럼 STATIC_URL 접두사까지 경로 안에 중복해서 적어야 한다.",
        "STATIC_URL은 정적 파일이 저장된 서버 컴퓨터의 물리적 절대 경로를 의미하며 BASE_DIR 객체로 지정해야 한다.",
        "Django는 정적 파일을 찾을 때 STATICFILES_DIRS의 경로를 먼저 탐색하고 그다음 각 앱의 static/ 폴더를 찾는다."
      ],
      "answer": 3,
      "explanation": "Static Files PDF 15~26쪽에 따라 `STATICFILES_DIRS`를 설정하면 Django는 `STATICFILES_DIRS` 목록의 경로를 먼저 탐색한 뒤 각 앱의 `static/` 폴더(기본 경로)를 탐색합니다. 또한 `{% static %}` 태그 안에는 `static/` 이후의 상대 경로만 작성하며, `STATIC_URL`은 물리적 파일 경로가 아니라 브라우저가 접근하는 웹 주소 접두사입니다.",
      "hint": "Static Files 강의 자료 26쪽에서 설명한 정적 파일 탐색 우선순위(STATICFILES_DIRS vs 각 앱의 static/ 폴더)를 확인해 보세요."
    },
    {
      "id": "mock6-021-four-forms-constructor-arguments",
      "conceptId": "django-forms-first-argument-comparison",
      "difficulty": "medium",
      "category": "Authentication System",
      "questionType": "multiple-choice",
      "prompt": "회원가입, 로그인, 회원정보 수정, 비밀번호 변경을 처리하는 각 View의 `POST` 분기에서 폼 인스턴스를 생성하는 코드와 그 부모 클래스의 연결이 모두 옳은 것은?",
      "code": "# ① 회원가입: CustomUserCreationForm\n# ② 로그인: AuthenticationForm\n# ③ 회원정보 수정: CustomUserChangeForm\n# ④ 비밀번호 변경: PasswordChangeForm",
      "options": [
        "① CustomUserCreationForm(request.POST) [ModelForm 계열] / ② AuthenticationForm(request, request.POST) [Form 계열] / ③ CustomUserChangeForm(request.POST, instance=request.user) [ModelForm 계열] / ④ PasswordChangeForm(request.user, request.POST) [SetPasswordForm 계열]",
        "① CustomUserCreationForm(request, request.POST) [Form 계열] / ② AuthenticationForm(request.POST) [ModelForm 계열] / ③ CustomUserChangeForm(request.user, request.POST) [Form 계열] / ④ PasswordChangeForm(request.POST, instance=request.user) [ModelForm 계열]",
        "① CustomUserCreationForm(request.POST) [ModelForm 계열] / ② AuthenticationForm(request.POST, instance=request.user) [ModelForm 계열] / ③ CustomUserChangeForm(request, request.POST) [Form 계열] / ④ PasswordChangeForm(request.user, request.POST) [ModelForm 계열]",
        "① CustomUserCreationForm(request.user, request.POST) [SetPasswordForm 계열] / ② AuthenticationForm(request, request.POST) [Form 계열] / ③ CustomUserChangeForm(request.POST, instance=request.user) [ModelForm 계열] / ④ PasswordChangeForm(request, request.POST) [Form 계열]"
      ],
      "answer": 0,
      "explanation": "Authentication System 03 PDF 62~63쪽에 정리된 표와 같이, `CustomUserCreationForm`과 `CustomUserChangeForm`은 `ModelForm`을 상속받으므로 첫 번째 인자가 `data`(`request.POST`)이고 수정 시 `instance=request.user`를 넘깁니다. 반면 `AuthenticationForm`은 일반 `Form`을 상속받아 첫 번째 인자가 `request`, 두 번째 인자가 `data`이며, `PasswordChangeForm`은 `SetPasswordForm`(`Form` 계열)을 상속받아 첫 번째 인자가 `user`(`request.user`), 두 번째 인자가 `data`(`request.POST`)입니다.",
      "hint": "Auth3 강의 자료 63쪽의 '부모 클래스에 따른 인자 구성' 표(ModelForm vs Form vs SetPasswordForm)에서 각 폼의 첫 번째 인자가 무엇인지 대조해 보세요."
    },
    {
      "id": "mock6-022-image-url-template-expr",
      "conceptId": "media-imagefield-url-attribute",
      "difficulty": "medium",
      "category": "Static Files & Media",
      "questionType": "short-answer",
      "prompt": "`Article` 모델에 `image = models.ImageField(upload_to='images/', blank=True)` 필드가 정의되어 있다. 상세 페이지 템플릿에서 업로드된 이미지가 존재할 때 해당 파일의 웹 접근 주소를 `<img>` 태그의 `src`에 넣기 위해 빈칸 `( A )`에 들어갈 표현을 작성하시오. (`{{ }}`와 따옴표는 제외하고 `객체.필드.속성` 형태로 작성)",
      "code": "{% if article.image %}\n  <img src=\"{{ ( A ) }}\" alt=\"uploaded-image\">\n{% endif %}",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "article.image.url"
      ],
      "explanation": "Static Files PDF 49~50쪽, 68쪽, 70쪽에 따라 `ImageField`나 `FileField`에 연결된 파일 객체에서 웹 접근 경로를 얻을 때는 `.url` 속성을 참조하여 `{{ article.image.url }}` 형태로 작성합니다.",
      "hint": "article 객체의 image 필드 뒤에 어떤 속성을 붙여야 MEDIA_URL이 결합된 웹 주소가 반환되는지 떠올려 보세요."
    }
  ],
  "hard": [
    {
      "id": "mock6-023-multiple-include-same-prefix-order",
      "conceptId": "url-include-matching-order-auth-urls",
      "difficulty": "hard",
      "category": "Template & URLs",
      "questionType": "multiple-choice",
      "prompt": "비밀번호 초기화 기능을 사용하기 위해 프로젝트의 `urls.py`에 아래와 같이 동일한 `'accounts/'` 접두사로 두 개의 `include()`를 배치했다. 사용자가 `GET /accounts/login/`으로 요청했을 때의 동작과 그 원리로 옳은 것은?",
      "code": "# crud/urls.py\nurlpatterns = [\n    path('admin/', admin.site.urls),\n    path('articles/', include('articles.urls')),\n    path('accounts/', include('django.contrib.auth.urls')),  # (1)\n    path('accounts/', include('accounts.urls')),             # (2)\n]",
      "options": [
        "동일한 경로 접두사('accounts/')를 두 번 중복 등록하면 서버 시작 시 URLconf 충돌 에러가 발생하여 실행되지 않는다.",
        "위에서부터 순서대로 탐색하므로 login/처럼 겹치는 경로는 먼저 적은 (1)이 처리하여 (2)의 커스텀 login 뷰는 실행되지 않는다.",
        "나중에 작성된 규칙이 앞선 규칙을 덮어쓰므로 (2)의 accounts.urls에 정의된 커스텀 login 뷰가 항상 우선 실행된다.",
        "(1)의 내장 뷰와 (2)의 커스텀 login 뷰 함수가 순차적으로 둘 다 실행된 뒤 마지막 응답만 브라우저에 전달된다."
      ],
      "answer": 1,
      "explanation": "Authentication System 03 PDF 52쪽의 TIP에 명시된 것처럼, 같은 `'accounts/'` prefix로 여러 번 `include`하면 Django는 위에서부터 순서대로 URL 패턴을 찾습니다. `'login/'`, `'logout/'`처럼 양쪽에 모두 존재하는 경로는 먼저 적은 URLconf가 우선 처리하므로, 우리가 직접 만든 `accounts.urls`가 우선 동작하게 하려면 `path('accounts/', include('accounts.urls'))`를 `django.contrib.auth.urls`보다 위에 배치해야 합니다.",
      "hint": "Auth3 강의 자료 52쪽('같은 accounts에 2개의 include가 사용되어도 괜찮나요?')에서 설명한 URL 탐색 우선순위를 확인해 보세요."
    },
    {
      "id": "mock6-024-orm-delete-pk-reuse-and-unsaved-mutation",
      "conceptId": "orm-pk-no-reuse-and-save-lifecycle",
      "difficulty": "hard",
      "category": "ORM",
      "questionType": "multiple-choice",
      "prompt": "초기 상태에서 `Article` 테이블에 `pk=1(title='A')`, `pk=2(title='B')` 두 행이 저장되어 있다. 아래 코드를 위에서부터 순서대로 실행한 직후, 데이터베이스의 `Article` 테이블에 반영된 상태로 옳은 것은?",
      "code": "target = Article.objects.get(pk=1)\ntarget.delete()\n\npost = Article.objects.create(title='C', content='내용')\npost.title = 'D'",
      "options": [
        "1번 행은 DB에서 삭제되고 새로 추가된 행의 DB 제목은 'D'이다.",
        "target.save()를 호출하지 않았으므로 1번 행은 DB에 그대로 남아 있다.",
        "post.save()를 호출하지 않았으므로 새로 생성된 행은 아직 DB에 없다.",
        "1번 행은 DB에서 삭제되고 새로 추가된 행의 DB 제목은 'C'이다."
      ],
      "answer": 3,
      "explanation": "ORM PDF 29쪽, 37~39쪽에 따라 ① `target.delete()`는 호출 즉시 DB에서 1번 행을 삭제하며, ② `Article.objects.create(title='C', content='내용')`는 생성과 동시에 DB에 저장(`INSERT`)하므로 새 행의 DB 제목은 `'C'`가 됩니다. ③ 이후 `post.title = 'D'`로 메모리상의 인스턴스 변수만 변경하고 `post.save()`를 호출하지 않았으므로 DB에 저장된 새 행의 제목은 여전히 `'C'`입니다.",
      "hint": "1) delete()와 objects.create()가 즉시 DB에 반영되는지, 2) 인스턴스 속성 변경 후 save() 미호출 시 DB 값이 바뀌는지 함께 따져 보세요."
    },
    {
      "id": "mock6-025-update-view-missing-instance-db-effect",
      "conceptId": "modelform-update-without-instance-side-effect",
      "difficulty": "hard",
      "category": "Form & ModelForm",
      "questionType": "multiple-choice",
      "prompt": "현재 DB의 `Article` 테이블에는 `pk=1(title='기존 제목', content='기존 내용')` 게시글이 저장되어 있다. 로그인한 사용자가 아래 `update` View를 통해 `/articles/1/update/` 화면을 연 뒤, 제목을 `'새 제목'`, 내용을 `'새 내용'`으로 고쳐 제출(POST)했을 때 발생하는 결과로 옳은 것은?",
      "code": "@login_required\ndef update(request, pk):\n    article = Article.objects.get(pk=pk)\n    if request.method == 'POST':\n        form = ArticleForm(request.POST)\n        if form.is_valid():\n            saved = form.save()\n            return redirect('articles:detail', saved.pk)\n    else:\n        form = ArticleForm(instance=article)\n    return render(request, 'articles/update.html', {'article': article, 'form': form})",
      "options": [
        "원본은 유지되고 새 행이 추가되며, 새 글의 상세 화면으로 이동한다.",
        "URL 경로의 pk가 자동 연결되어 원본 게시글의 제목과 내용이 수정된다.",
        "GET과 POST의 ArticleForm 인자 수가 달라 검증 시 예외가 발생한다.",
        "@login_required가 작성자 글을 자동 연결하여 원본 게시글이 덮어써진다."
      ],
      "answer": 0,
      "explanation": "Form PDF 53~60쪽 및 ORM PDF 37쪽에 따라 `else`(GET)에서는 `ArticleForm(instance=article)`을 사용했으므로 수정 화면에는 기존 값이 표시됩니다. 그러나 `POST` 분기에서 `ArticleForm(request.POST)`에 `instance=article`을 전달하지 않았으므로 `form.save()`는 새 인스턴스를 생성(`INSERT`)합니다. 따라서 원본 게시글은 그대로 유지되고 새 행이 추가되며, 새로 생성된 글의 상세 화면(`saved.pk`)으로 이동합니다.",
      "hint": "GET 분기에는 instance=article이 있고 POST 분기에는 빠져 있을 때 원본 행과 save() 반환 객체가 어떻게 되는지 확인해 보세요."
    },
    {
      "id": "mock6-026-media-url-serving-and-upload-to-callable",
      "conceptId": "media-static-helper-and-upload-to-function",
      "difficulty": "hard",
      "category": "Static Files & Media",
      "questionType": "multiple-choice",
      "prompt": "개발 환경에서 업로드된 미디어 파일을 제공하기 위한 `urls.py` 설정과 `models.py`의 함수형 `upload_to` 정의가 아래와 같을 때, 이에 대한 설명으로 옳은 것은?",
      "code": "# settings.py\nMEDIA_ROOT = BASE_DIR / 'media'\nMEDIA_URL = 'media/'\n\n# crud/urls.py\nfrom django.conf import settings\nfrom django.conf.urls.static import static\n\nurlpatterns = [\n    path('admin/', admin.site.urls),\n    path('articles/', include('articles.urls')),\n] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)\n\n# articles/models.py\ndef articles_image_path(instance, filename):\n    return f'images/{filename}'\n\nclass Article(models.Model):\n    image = models.ImageField(blank=True, upload_to=articles_image_path)",
      "options": [
        "Django 개발 서버는 MEDIA_ROOT만 설정하면 urls.py 수정 없이도 모든 미디어 파일 URL 요청을 자동으로 찾아 응답한다.",
        "upload_to에 함수를 지정할 때는 upload_to=articles_image_path()처럼 괄호를 붙여 즉시 호출한 반환값을 넘겨야 한다.",
        "articles_image_path 함수는 모델 인스턴스(instance)와 원본 파일명(filename)을 인자로 받아 저장 경로 문자열을 반환한다.",
        "static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)은 첫 인자로 물리 경로를 받고 document_root에 웹 주소를 받는다."
      ],
      "answer": 2,
      "explanation": "Static Files PDF 39쪽, 58쪽, 68~70쪽에 따라 ① Django 개발 서버는 정적 파일과 달리 사용자가 업로드한 미디어 파일을 자동 제공하지 않으므로 `static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)`를 `urlpatterns`에 추가해야 합니다(첫 인자가 웹 주소인 `MEDIA_URL`, `document_root`가 실제 물리 경로인 `MEDIA_ROOT`). ② `upload_to`에 함수를 전달할 때는 호출 괄호 없이 함수 객체(`articles_image_path`)를 넘기며, 이 함수는 `(instance, filename)` 두 인자를 받아 저장 경로 문자열을 반환합니다.",
      "hint": "Static Files 강의 자료 39쪽의 static() 인자 순서와 58쪽의 동적 경로 생성 함수(instance, filename) 시그니처를 함께 확인해 보세요."
    },
    {
      "id": "mock6-027-auth-lifecycle-session-and-user-table-state",
      "conceptId": "auth-signup-login-password-delete-session-flow",
      "difficulty": "hard",
      "category": "Authentication System",
      "questionType": "multiple-choice",
      "prompt": "Django 인증 시스템에서 다음 네 가지 View 처리 코드가 실행된 직후 `accounts_user` 테이블과 `django_session`(및 현재 로그인 상태)에 일어나는 변화를 설명한 것으로 옳은 것은?",
      "code": "# (가) 회원가입 View: user = form.save() 만 실행 (CustomUserCreationForm)\n# (나) 로그인 View: auth_login(request, form.get_user()) 실행 (AuthenticationForm)\n# (다) 비밀번호 변경 View: user = form.save() 직후 update_session_auth_hash(request, user) 실행\n# (라) 회원 탈퇴 View: auth_logout(request) 실행 직후 request.user.delete() 실행",
      "options": [
        "(가)에서 form.save()가 실행되면 accounts_user에 새 행이 추가됨과 동시에 django_session에 세션이 자동 생성되어 로그인된다.",
        "(나)에서 AuthenticationForm은 ModelForm이므로 form.save()로 사용자 레코드를 새로 생성한 뒤 세션을 연결하여 로그인한다.",
        "(다)의 update_session_auth_hash(request, user)는 새 비밀번호 정보로 현재 세션을 갱신하여 로그아웃되는 현상을 막아 준다.",
        "(라)처럼 auth_logout(request)를 먼저 호출한 뒤 request.user.delete()를 실행하면 탈퇴 대상 계정과 세션이 모두 정상 삭제된다."
      ],
      "answer": 2,
      "explanation": "Auth1 PDF 49~54쪽, Auth2 PDF 29~38쪽, 51~53쪽, Auth3 PDF 24~27쪽에 따라 ① (가) `CustomUserCreationForm.save()`는 `User` 레코드만 생성할 뿐 세션을 만들지 않으므로 자동 로그인을 원하면 `auth_login(request, user)`를 추가로 호출해야 합니다. ② (나) `AuthenticationForm`은 일반 `Form`으로 세션을 생성하기 전 인증만 담당하며 `save()`가 없습니다. ③ (다) 비밀번호가 바뀌면 기존 세션의 인증 해시와 불일치하여 로그아웃되는데, `update_session_auth_hash(request, user)`가 현재 세션을 새 인증 정보로 갱신해 로그인을 유지합니다. ④ (라) 로그아웃을 먼저 하면 `request.user`가 `AnonymousUser`로 바뀌므로 반드시 `request.user.delete()` 후 `auth_logout(request)` 순서로 호출해야 합니다.",
      "hint": "회원가입·로그인·비밀번호 변경·회원탈퇴 네 과정에서 User 테이블 변경과 Session 생성·갱신·삭제가 어떻게 분리되어 있는지 비교해 보세요."
    },
    {
      "id": "mock6-028-model-auto-now-vs-auto-now-add-behavior",
      "conceptId": "datetimefield-auto-now-add-vs-auto-now",
      "difficulty": "hard",
      "category": "Model",
      "questionType": "multiple-choice",
      "prompt": "다음과 같이 정의된 `Article` 모델에서 `t1` 시각에 게시글을 최초 생성(`create`)하고, 10분 뒤인 `t2` 시각에 해당 게시글을 조회해 제목을 바꾼 뒤 `article.save()`를 호출했다. 이때 `created_at`과 `updated_at`의 값 변화와 ModelForm 노출 여부에 대한 설명으로 옳은 것은?",
      "code": "class Article(models.Model):\n    title = models.CharField(max_length=20)\n    created_at = models.DateTimeField(auto_now_add=True)\n    updated_at = models.DateTimeField(auto_now=True)",
      "options": [
        "t2에 save()를 호출하면 created_at과 updated_at 두 필드 모두 수정 저장 시각인 t2로 함께 갱신된다.",
        "created_at은 t1으로 유지되고 updated_at만 t2로 갱신되며, 두 필드는 ModelForm에서 입력칸으로 렌더링되지 않는다.",
        "created_at은 t1으로 유지되지만 updated_at은 Article.objects.get()으로 단순 조회만 해도 현재 시각으로 갱신된다.",
        "auto_now_add=True와 auto_now=True가 설정된 필드는 ModelForm에서 사용자가 날짜를 직접 입력해야 검증을 통과한다."
      ],
      "answer": 1,
      "explanation": "Model PDF 28~29쪽 및 Form PDF 32~34쪽에 따라 `auto_now_add=True`는 데이터가 처음 생성될 때만 현재 시각(`t1`)을 저장하고, `auto_now=True`는 모델 인스턴스가 저장(`save()`)될 때마다 현재 시각(`t2`)으로 갱신됩니다(단순 조회 시에는 바뀌지 않음). 또한 두 옵션이 설정된 필드는 `editable=False` 및 `blank=True` 특성을 가지므로 `ModelForm`에서 `fields = '__all__'`을 지정해도 사용자 입력 필드로 출력되지 않습니다.",
      "hint": "auto_now_add와 auto_now가 각각 언제 동작하는지, 그리고 ModelForm에서 fields = '__all__'을 썼을 때 날짜 자동 기록 필드가 화면에 나왔는지 떠올려 보세요."
    },
    {
      "id": "mock6-029-post-delete-and-url-reverse-redirect",
      "conceptId": "orm-with-view-delete-and-redirect",
      "difficulty": "hard",
      "category": "ORM with View",
      "questionType": "multiple-choice",
      "prompt": "다음 게시글 삭제 템플릿과 View 함수에 대한 설명으로 옳은 것은? (단, `articles/urls.py`에는 `app_name = 'articles'`와 `path('', views.index, name='index')`, `path('<int:pk>/delete/', views.delete, name='delete')`가 설정되어 있다.)",
      "code": "{# detail.html #}\n<form action=\"{% url 'articles:delete' article.pk %}\" method=\"POST\">\n  {% csrf_token %}\n  <input type=\"submit\" value=\"DELETE\">\n</form>\n\n# articles/views.py\ndef delete(request, pk):\n    article = Article.objects.get(pk=pk)\n    if request.method == 'POST':\n        article.delete()\n        return redirect('articles:index')\n    return redirect('articles:detail', article.pk)",
      "options": [
        "삭제 요청은 데이터를 조회만 하므로 form의 method를 GET으로 바꾸고 {% csrf_token %}을 제거하는 것이 권장된다.",
        "article.delete()는 클래스 메서드이므로 Article.delete(pk=pk) 형태로만 호출할 수 있으며 인스턴스에서는 호출할 수 없다.",
        "POST로 삭제된 뒤 redirect('articles:index')가 실행되면 브라우저는 /articles/로 다시 GET 요청을 보내 목록을 받는다.",
        "redirect('articles:index')는 index.html 템플릿 파일을 직접 찾아 렌더링하므로 articles 앱의 index 뷰는 실행되지 않는다."
      ],
      "answer": 2,
      "explanation": "ORM with View PDF 56~57쪽에 따라 데이터 삭제는 DB 상태를 변경하는 작업이므로 반드시 `POST` 요청과 `{% csrf_token %}`을 사용합니다. 인스턴스 메서드인 `article.delete()`로 레코드를 삭제한 뒤 `redirect('articles:index')`를 반환하면, 브라우저는 해당 URL(`/articles/`)로 새로운 `GET` 요청을 보내고 `views.index`가 실행되어 삭제가 반영된 목록을 출력합니다.",
      "hint": "redirect()가 템플릿을 직접 렌더링하는 함수인지, 아니면 브라우저에게 해당 URL로 새 GET 요청을 보내게 하는 응답인지 구분해 보세요."
    },
    {
      "id": "mock6-030-password-change-form-args",
      "conceptId": "password-change-form-user-argument",
      "difficulty": "hard",
      "category": "Authentication System",
      "questionType": "short-answer",
      "prompt": "다음 비밀번호 변경 View 함수의 POST 분기에서 `PasswordChangeForm`의 첫 번째 위치 인자 빈칸 `( A )`에 들어갈 현재 로그인한 사용자 객체 참조 표현을 작성하시오. (`request.` 접두사를 포함하여 작성하고, 키워드 인자 이름이 아닌 객체 참조식만 작성)",
      "code": "@login_required\ndef password(request):\n    if request.method == 'POST':\n        form = PasswordChangeForm(( A ), request.POST)\n        if form.is_valid():\n            user = form.save()\n            update_session_auth_hash(request, user)\n            return redirect('articles:index')",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "request.user"
      ],
      "explanation": "Authentication System 03 PDF 21, 24, 62~63쪽에 따라 `PasswordChangeForm`은 부모 클래스인 `SetPasswordForm`의 생성자 시그니처(`user, data=None, ...`)를 따르므로 첫 번째 위치 인자로 비밀번호를 변경할 대상 사용자 객체인 `request.user`를 전달해야 합니다. (두 번째 인자가 위치 인자인 `request.POST`이므로 첫 번째 인자에 `user=request.user`처럼 키워드 인자를 쓰면 파이썬 문법 오류가 발생합니다.)",
      "hint": "현재 요청(request)에서 로그인한 사용자 인스턴스를 가리키는 속성을 떠올려 보세요."
    },
    {
      "id": "mock6-031-custom-user-change-form-security",
      "conceptId": "userchangeform-fields-restriction-and-template-check",
      "difficulty": "hard",
      "category": "Form & ModelForm",
      "questionType": "multiple-choice",
      "prompt": "회원정보 수정 기능을 구현할 때 아래와 같이 `CustomUserChangeForm`의 `Meta.fields`를 제한하고 View 함수에 `@login_required`를 적용했다. 이 구현이 필요한 보안·동작상의 이유로 가장 적절한 것은?",
      "code": "# accounts/forms.py\nclass CustomUserChangeForm(UserChangeForm):\n    class Meta(UserChangeForm.Meta):\n        model = get_user_model()\n        fields = ('first_name', 'last_name', 'email')\n\n# accounts/views.py\n@login_required\ndef update(request):\n    if request.method == 'POST':\n        form = CustomUserChangeForm(request.POST, instance=request.user)\n        # ...",
      "options": [
        "기본 UserChangeForm은 관리자 권한 필드까지 노출하므로 일반 회원용 폼에서는 Meta.fields로 수정 가능 필드만 제한해야 한다.",
        "CustomUserChangeForm에서 fields를 지정하지 않더라도 HTML에서 CSS로 입력칸을 숨기면 권한 필드 변조를 서버에서 막을 수 있다.",
        "@login_required 데코레이터를 붙이면 instance=request.user를 생략해도 CustomUserChangeForm이 로그인 사용자를 자동 수정한다.",
        "get_user_model()은 현재 로그인한 사용자의 인스턴스를 반환하므로 Meta.model에 지정하면 본인 계정만 수정할 수 있게 된다."
      ],
      "answer": 0,
      "explanation": "Authentication System 03 PDF 9~16쪽에 따라 기본 `UserChangeForm`은 관리자용 모델을 기반으로 하여 `is_staff`, `is_superuser`, 권한 그룹 등 일반 사용자가 접근·수정해서는 안 되는 모든 필드를 노출합니다. 따라서 HTML에서 숨기는 것에 그치지 않고 `CustomUserChangeForm`의 `Meta.fields`에 `('first_name', 'last_name', 'email')`처럼 허용할 필드만 지정해야 합니다.",
      "hint": "Auth3 강의 자료 14~15쪽('UserChangeForm 사용 시 문제점')에서 일반 사용자에게 노출되면 안 되는 필드를 어떻게 제한했는지 확인해 보세요."
    },
    {
      "id": "mock6-032-media-image-update-missing-files-essay",
      "conceptId": "media-image-update-request-files-essay",
      "difficulty": "hard",
      "category": "Static Files & Media",
      "questionType": "essay",
      "prompt": "새 게시글 작성(`create`) 시에는 이미지 업로드가 정상 동작하는데, 기존 이미지가 있는 게시글을 아래 코드로 수정(`update`)하여 새 제목과 새 이미지 파일을 함께 제출하면 **제목만 바뀌고 기존 이미지는 바뀌지 않는 문제**가 발생한다. 제시된 코드를 바탕으로 ① 이 현상이 발생하는 정확한 원인과 ② 이를 해결하기 위해 수정해야 할 코드를 모두 포함하여 30자 이상으로 서술하시오.",
      "code": "<!-- articles/update.html -->\n<form action=\"{% url 'articles:update' article.pk %}\" method=\"POST\" enctype=\"multipart/form-data\">\n  {% csrf_token %}\n  {{ form }}\n  <input type=\"submit\" value=\"수정\">\n</form>\n\n# articles/views.py\ndef update(request, pk):\n    article = Article.objects.get(pk=pk)\n    if request.method == 'POST':\n        form = ArticleForm(request.POST, instance=article)\n        if form.is_valid():\n            form.save()\n            return redirect('articles:detail', article.pk)\n    else:\n        form = ArticleForm(instance=article)\n    return render(request, 'articles/update.html', {'article': article, 'form': form})",
      "options": [],
      "answer": null,
      "modelAnswer": "update.html에는 enctype=\"multipart/form-data\"가 설정되어 있으나, update View 함수의 POST 분기에서 ArticleForm(request.POST, instance=article)로 텍스트 데이터만 바인딩하고 업로드된 파일 데이터가 담긴 request.FILES를 누락했기 때문에 제목만 바뀌고 이미지는 변경되지 않는다. 이를 해결하려면 form = ArticleForm(request.POST, request.FILES, instance=article)처럼 POST 데이터·업로드 파일·기존 인스턴스를 함께 바인딩해야 한다.",
      "rubricKeywords": [
        "파일 (또는 이미지/ImageField/request.FILES)",
        "누락 (또는 생략/빠져/전달하지 않/전달되지 않/넘기지 않/받지 못/바인딩하지 않/바인딩되지 않/없어/안 넘겨/빠뜨려)",
        "request.POST (또는 data=request.POST)",
        "request.FILES (또는 files=request.FILES)",
        "instance=article (또는 instance = article)"
      ],
      "minLength": 30,
      "explanation": "Static Files PDF 51~53쪽 및 65쪽에 따라 수정 템플릿(`update.html`)에 `enctype=\"multipart/form-data\"`가 있더라도, `update` View 함수의 `POST` 분기에서 업로드된 파일 데이터(`request.FILES`)를 폼에 전달하지 않으면 기존 이미지가 그대로 유지되고 텍스트 필드(`request.POST`)만 수정됩니다. 따라서 `ArticleForm(request.POST, request.FILES, instance=article)` 또는 `ArticleForm(data=request.POST, files=request.FILES, instance=article)`처럼 POST 데이터·파일·기존 인스턴스를 함께 바인딩해야 합니다. (답안 전체 30자 이상, 부분점수 없음, 정답·오답 혼용 시 오답 처리)",
      "hint": "원인은 수정 폼이 업로드 파일을 전달받지 못했다는 점, 해결은 ArticleForm에 POST 데이터·파일(request.FILES)·기존 인스턴스(instance=article)를 함께 바인딩하는 코드로 서술해 보세요."
    }
  ],
  "extreme": []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
