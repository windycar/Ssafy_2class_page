alter table public.special_mock_exam_attempts
  drop constraint if exists special_mock_exam_attempts_mock_round_check;

alter table public.special_mock_exam_attempts
  add constraint special_mock_exam_attempts_mock_round_check
  check (
    (assessment_round in (2, 3) and mock_round between 1 and 5)
    or (assessment_round = 5 and mock_round between 1 and 6)
  );
