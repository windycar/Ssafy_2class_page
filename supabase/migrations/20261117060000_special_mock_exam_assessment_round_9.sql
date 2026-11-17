alter table public.special_mock_exam_attempts
  drop constraint if exists special_mock_exam_attempts_assessment_round_check,
  drop constraint if exists special_mock_exam_attempts_mock_round_check,
  add constraint special_mock_exam_attempts_assessment_round_check
    check (assessment_round in (2, 3, 5, 8, 9)),
  add constraint special_mock_exam_attempts_mock_round_check
    check (
      (assessment_round in (2, 3) and mock_round between 1 and 5)
      or (assessment_round = 5 and mock_round between 1 and 6)
      or (assessment_round = 8 and mock_round between 1 and 8)
      or (assessment_round = 9 and mock_round between 1 and 5)
    );
