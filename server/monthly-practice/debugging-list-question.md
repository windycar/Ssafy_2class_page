## 5. 실제 시험처럼 풀어보는 예시 1 — 글 목록이 보이지 않음

증상: DB에 게시글이 있는데 목록 페이지에 아무 글도 출력되지 않습니다. 아래 코드를 최소 수정하세요.
[views.py]

~~~python
def index(request):
    articles = Article.objects.all()
    context = {'article': articles}
    return render(request, 'articles/index.html', context)


~~~

[index.html]

~~~html
{% for article in articles %}
  <p>{{ article.title }}</p>
{% endfor %}
~~~

정답: views.py에서 context = {'articles': articles}로 수정합니다. 뷰가 전달하는 context 키와 템플릿이 참조하는 변수명이 같아야 합니다. 오류 메시지가 없어도 출력이 비어 있다면 데이터 → context → 템플릿 순서로 점검하세요.
