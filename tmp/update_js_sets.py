from pathlib import Path

def change(path, old, new):
    p = Path(path)
    s = p.read_text(encoding="utf-8")
    if old not in s:
        raise Exception(f"Missing text in {path}: {old[:100]}")
    p.write_text(s.replace(old, new), encoding="utf-8")

bank = "src/data/questionBanks/javascriptQuestionBank.ts"
change(bank, 'import type { JavascriptCategory, JavascriptQuestion } from "../../types/javascriptStudy";', '''import type { JavascriptCategory, JavascriptQuestion } from "../../types/javascriptStudy";
import { ROUND9_JS_EASY_SET1_QUESTIONS } from "./javascriptEasySet1";
import { ROUND9_JS_EASY_SET2_QUESTIONS } from "./javascriptEasySet2";
import { ROUND9_JS_EASY_SET3_QUESTIONS } from "./javascriptEasySet3";''')
p = Path(bank)
s = p.read_text(encoding="utf-8")
a = s.index(' set1: { label:')
b = s.index('\n};', a)
s = s[:a] + ''' set1: { label: "JavaScript 1회차", shortLabel: "1회차", color: "#059669", description: "쉬운 버전 · 객관식 21문제 · 주관식 4문제" },
 set2: { label: "JavaScript 2회차", shortLabel: "2회차", color: "#059669", description: "쉬운 버전 · 객관식 21문제 · 주관식 4문제" },
 set3: { label: "JavaScript 3회차", shortLabel: "3회차", color: "#059669", description: "쉬운 버전 · 객관식 21문제 · 주관식 4문제" },
 set4: { label: "JavaScript 4회차", shortLabel: "4회차", color: "#d97706", description: "어려운 버전 · 객관식 25문제" },
 set5: { label: "JavaScript 5회차", shortLabel: "5회차", color: "#ea580c", description: "어려운 버전 · 객관식 21문제 · 주관식 4문제" },
 set6: { label: "JavaScript 6회차", shortLabel: "6회차", color: "#c2410c", description: "어려운 버전 · 객관식 21문제 · 주관식 4문제" },''' + s[b:]
s = s.replace('([set1, set2, set3] as const)', '([ROUND9_JS_EASY_SET1_QUESTIONS, ROUND9_JS_EASY_SET2_QUESTIONS, ROUND9_JS_EASY_SET3_QUESTIONS, set1, set2, set3] as const)')
s = s.replace('(["set1", "set2", "set3"] as const)', '(["set1", "set2", "set3", "set4", "set5", "set6"] as const)')
p.write_text(s, encoding="utf-8")
change("src/types/javascriptStudy.ts", '| "set3";', '| "set3"\n  | "set4"\n  | "set5"\n  | "set6";')
for f in ["src/views/study/JavascriptStudyView.tsx", "src/views/study/JavascriptQuizView.tsx"]:
    change(f, '  "set3",\n];', '  "set3",\n  "set4",\n  "set5",\n  "set6",\n];')
view = "src/views/study/JavascriptStudyView.tsx"
change(view, '  set3: "3회차",', '  set3: "3회차",\n  set4: "4회차",\n  set5: "5회차",\n  set6: "6회차",')
change(view, '  set3: <Grid3X3 className="h-5 w-5" />,', '  set3: <Grid3X3 className="h-5 w-5" />,\n  set4: <Braces className="h-5 w-5" />,\n  set5: <CloudCog className="h-5 w-5" />,\n  set6: <Grid3X3 className="h-5 w-5" />,')
change(view, "전달받은 JavaScript 문제를 회차별로 선택해 풀 수 있습니다.", "1~3회차는 쉬운 버전, 4~6회차는 어려운 버전입니다. 회차를 선택해 풀어보세요.")
change("src/views/study/StudyHubView.tsx", "1·2·3회차 JavaScript 문제를 풀어보세요.", "1~3회차는 쉬운 문제, 4~6회차는 어려운 문제입니다.")
for f in ["src/hooks/useJavascriptStudyProgress.ts", "src/services/javascriptStudyProgressService.ts"]:
    change(f, "js-study-v2-", "js-study-v3-")
change("src/services/storage/javascriptStudyProgressStorage.ts", 'const STORAGE_VERSION = "v2";', 'const STORAGE_VERSION = "v3";')
change("supabase/migrations/20261116015752_javascript_study_three_sets.sql", "'set1','set2','set3'", "'set1','set2','set3','set4','set5','set6'")
change("src/config/studyReviewTracks.ts", 'set: "set1" | "set2" | "set3"', 'set: "set1" | "set2" | "set3" | "set4" | "set5" | "set6"')
config = Path("src/config/studyReviewTracks.ts")
s = config.read_text(encoding="utf-8")
idx = s.index('  {\n    id: "python",')
entries = ''.join('  {\n    id: "javascript-set{0}", label: "JavaScript {0}회차", description: "어려운 버전 · 25문제",\n    href: "/study/javascript/quiz?mode=wrong&categories=set{0}", tone: "amber", source: "javascript", set: "set{0}",\n  },\n'.format(i) for i in range(4, 7))
s = s[:idx] + entries + s[idx:]
config.write_text(s, encoding="utf-8")
change("tests/javascriptStudy.test.ts", "JAVASCRIPT_QUESTION_BANK.length, 75", "JAVASCRIPT_QUESTION_BANK.length, 150")
change("tests/javascriptStudy.test.ts", "q => q.id)).size, 75", "q => q.id)).size, 150")
change("tests/javascriptStudy.test.ts", '["set1", "set2", "set3"]', '["set1", "set2", "set3", "set4", "set5", "set6"]')
change("tests/javascriptStudy.test.ts", 'q.questionType === "short-answer").length, 8', 'q.questionType === "short-answer").length, 20')
