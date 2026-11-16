alter table public.javascript_study_attempts
  drop constraint javascript_study_attempts_category_check,
  add constraint javascript_study_attempts_category_check check (category in ('basics','functions','objects','dom','events','set1','set2','set3','set4','set5','set6'));
