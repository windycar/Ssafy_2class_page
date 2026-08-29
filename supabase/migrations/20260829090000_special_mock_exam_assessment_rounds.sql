alter table public.special_mock_exam_attempts
  drop constraint if exists special_mock_exam_attempts_assessment_round_check;

alter table public.special_mock_exam_attempts
  add constraint special_mock_exam_attempts_assessment_round_check
  check (assessment_round in (2, 3));
