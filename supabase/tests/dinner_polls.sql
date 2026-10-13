-- Run as postgres. Every fixture and change rolls back, including auth/member fixtures.
begin;
create function pg_temp.assert_ok(condition boolean, label text) returns void language plpgsql as $$
begin if not coalesce(condition, false) then raise exception 'ASSERT FAILED: %', label; end if; end;
$$;
create function pg_temp.expect_error(statement text, pattern text) returns void language plpgsql as $$
begin
  begin execute statement;
  exception when others then
    if sqlerrm ~ pattern then return; end if;
    raise exception 'Unexpected error: %', sqlerrm;
  end;
  raise exception 'Expected rejection: %', statement;
end;
$$;

insert into auth.users (id) values
 ('d1000000-0000-4000-8000-000000000001'), ('d1000000-0000-4000-8000-000000000002'),
 ('d1000000-0000-4000-8000-000000000003'), ('d1000000-0000-4000-8000-000000000004');
insert into public.members (id, name, username, login_id, class_name, role, is_active, auth_user_id) values
 (-91001, '회식 테스트 관리자', '@dinner_test_admin', 'dinner_test_admin', '테스트', 'admin', true, 'd1000000-0000-4000-8000-000000000001'),
 (-91002, '회식 테스트 회원', '@dinner_test_member', 'dinner_test_member', '테스트', 'member', true, 'd1000000-0000-4000-8000-000000000002'),
 (-91003, '회식 테스트 다른 회원', '@dinner_test_other', 'dinner_test_other', '테스트', 'member', true, 'd1000000-0000-4000-8000-000000000003'),
 (-91004, '회식 테스트 비활성', '@dinner_test_inactive', 'dinner_test_inactive', '테스트', 'member', false, 'd1000000-0000-4000-8000-000000000004');

set local role authenticated;
select set_config('request.jwt.claim.sub', 'd1000000-0000-4000-8000-000000000001', true);
insert into public.dinner_polls (id, title, mode, location, event_time, date_start, date_end, created_by)
values ('d2000000-0000-4000-8000-000000000001', '테스트 날짜 조율', 'availability', '장소 미정', '18:30', current_date+10, current_date+12, 'd1000000-0000-4000-8000-000000000001');
insert into public.dinner_polls (id, title, mode, location, event_time, event_date, created_by)
values ('d2000000-0000-4000-8000-000000000002', '테스트 확정 회식', 'attendance', '테스트 장소', '18:30', current_date+10, 'd1000000-0000-4000-8000-000000000001');

select set_config('request.jwt.claim.sub', 'd1000000-0000-4000-8000-000000000002', true);
select pg_temp.assert_ok((select count(*) = 2 from public.dinner_polls where id::text like 'd200%'), 'member reads polls');
select pg_temp.expect_error($q$insert into public.dinner_polls (title, mode, location, event_date, event_time, created_by) values ('거절', 'attendance', '장소', current_date+10, '18:30', 'd1000000-0000-4000-8000-000000000002')$q$, '관리자|row-level');
with changed as (update public.dinner_polls set title = '위조 수정' where id='d2000000-0000-4000-8000-000000000001' returning *) select pg_temp.assert_ok((select count(*)=0 from changed), 'member cannot edit poll');

insert into public.dinner_responses (poll_id, member_id, user_id, participant_name, status, available_dates)
values ('d2000000-0000-4000-8000-000000000001', -91002, 'd1000000-0000-4000-8000-000000000002', '위조 이름', 'attending', array[current_date+10, current_date+11, current_date+10]);
select pg_temp.assert_ok((select participant_name='회식 테스트 회원' and cardinality(available_dates)=2 from public.dinner_responses where poll_id='d2000000-0000-4000-8000-000000000001' and member_id=-91002), 'canonical name and unique dates');
insert into public.dinner_responses (poll_id, member_id, user_id, participant_name, status, available_dates, arrival_time, note)
values ('d2000000-0000-4000-8000-000000000001', -91002, 'd1000000-0000-4000-8000-000000000002', '위조', 'late', array[current_date+11], '19:00', ' 수정 ')
on conflict (poll_id, member_id) do update set status=excluded.status, available_dates=excluded.available_dates, arrival_time=excluded.arrival_time, note=excluded.note;
select pg_temp.assert_ok((select count(*)=1 from public.dinner_responses where poll_id='d2000000-0000-4000-8000-000000000001' and status='late' and note='수정'), 'upsert replaces own response');
select pg_temp.expect_error($q$update public.dinner_responses set available_dates=array[current_date+13] where member_id=-91002$q$, '범위');
select pg_temp.expect_error($q$update public.dinner_responses set arrival_time='18:00' where member_id=-91002$q$, '시작 이후');
select pg_temp.expect_error($q$update public.dinner_responses set available_dates='{}' where member_id=-91002$q$, '날짜');
select pg_temp.expect_error($q$insert into public.dinner_responses (poll_id, member_id, user_id, participant_name, status) values ('d2000000-0000-4000-8000-000000000002', -91003, 'd1000000-0000-4000-8000-000000000002', '위조', 'absent')$q$, '본인|row-level');

select set_config('request.jwt.claim.sub', 'd1000000-0000-4000-8000-000000000003', true);
with changed as (update public.dinner_responses set status='absent', available_dates='{}', arrival_time=null where member_id=-91002 returning *) select pg_temp.assert_ok((select count(*)=0 from changed), 'other cannot update response');
with removed as (delete from public.dinner_responses where member_id=-91002 returning *) select pg_temp.assert_ok((select count(*)=0 from removed), 'other cannot delete response');

select set_config('request.jwt.claim.sub', 'd1000000-0000-4000-8000-000000000002', true);
update public.dinner_responses set status='absent', available_dates='{}', arrival_time=null where member_id=-91002;
with removed as (delete from public.dinner_responses where member_id=-91002 returning *) select pg_temp.assert_ok((select count(*)=1 from removed), 'own withdrawal');
insert into public.dinner_responses (poll_id, member_id, user_id, participant_name, status)
values ('d2000000-0000-4000-8000-000000000002', -91002, 'd1000000-0000-4000-8000-000000000002', '회원', 'attending');

select set_config('request.jwt.claim.sub', 'd1000000-0000-4000-8000-000000000001', true);
select pg_temp.expect_error($q$update public.dinner_polls set event_date=current_date+11 where id='d2000000-0000-4000-8000-000000000002'$q$, '일정');
update public.dinner_polls set is_closed=true where id='d2000000-0000-4000-8000-000000000002';
select set_config('request.jwt.claim.sub', 'd1000000-0000-4000-8000-000000000002', true);
select pg_temp.expect_error($q$update public.dinner_responses set status='absent' where member_id=-91002$q$, '마감');
select pg_temp.expect_error($q$delete from public.dinner_responses where member_id=-91002$q$, '마감');
select pg_temp.expect_error($q$insert into public.dinner_responses (poll_id,member_id,user_id,participant_name,status) values ('d2000000-0000-4000-8000-000000000002',-91002,'d1000000-0000-4000-8000-000000000002','회원','absent') on conflict (poll_id,member_id) do update set status=excluded.status$q$, '마감');

select set_config('request.jwt.claim.sub', 'd1000000-0000-4000-8000-000000000001', true);
update public.dinner_polls set is_closed=false where id='d2000000-0000-4000-8000-000000000002';
update public.dinner_polls set deadline=now()-interval '1 second' where id='d2000000-0000-4000-8000-000000000002';
select set_config('request.jwt.claim.sub', 'd1000000-0000-4000-8000-000000000002', true);
select pg_temp.expect_error($q$update public.dinner_responses set status='absent' where member_id=-91002$q$, '마감');

select set_config('request.jwt.claim.sub', 'd1000000-0000-4000-8000-000000000004', true);
select pg_temp.assert_ok((select count(*)=0 from public.dinner_polls), 'inactive cannot read polls');
select pg_temp.assert_ok((select count(*)=0 from public.dinner_responses), 'inactive cannot read responses');
select pg_temp.expect_error($q$insert into public.dinner_responses (poll_id,member_id,user_id,participant_name,status) values ('d2000000-0000-4000-8000-000000000001',-91004,'d1000000-0000-4000-8000-000000000004','비활성','absent')$q$, '마감|본인|row-level');

set local role anon;
select pg_temp.expect_error('select * from public.dinner_polls', 'permission denied');
select pg_temp.expect_error('select * from public.dinner_responses', 'permission denied');
select pg_temp.expect_error($q$insert into public.dinner_responses (poll_id,member_id,user_id,participant_name,status) values ('d2000000-0000-4000-8000-000000000001',-91002,'d1000000-0000-4000-8000-000000000002','회원','absent')$q$, 'permission denied');
select 'dinner poll database assertions passed' as result;
rollback;
