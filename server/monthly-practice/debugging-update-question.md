## 6. 실제 시험처럼 풀어보는 예시 2 — 수정했는데 새 글이 생성됨

증상: 게시글 수정 버튼을 누른 뒤 저장하면 기존 글이 그대로 있고 새 글이 추가됩니다.
[오류 코드]

~~~python
if request.method == 'POST':
    form = ArticleForm(request.POST)
    if form.is_valid():
        form.save()


~~~

[수정 코드]

~~~python
if request.method == 'POST':
    form = ArticleForm(request.POST, instance=article)
    if form.is_valid():
        form.save()
~~~

핵심: ModelForm에서 기존 객체를 instance로 전달해야 수정(Update)으로 처리됩니다. GET에서만 instance를 넣고 POST에서 빼먹는 실수를 주의하세요.
