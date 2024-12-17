drop policy "Users can delete their own task contents" on "public"."task_contents";

drop policy "Users can insert their own task contents" on "public"."task_contents";

drop policy "Users can update their own task contents" on "public"."task_contents";

drop policy "Users can view their own task contents" on "public"."task_contents";

drop policy "Users can delete their own tasks" on "public"."tasks";

drop policy "Users can insert their own tasks" on "public"."tasks";

drop policy "Users can update their own tasks" on "public"."tasks";

drop policy "Users can view their own tasks" on "public"."tasks";

revoke delete on table "public"."task_contents" from "anon";

revoke insert on table "public"."task_contents" from "anon";

revoke references on table "public"."task_contents" from "anon";

revoke select on table "public"."task_contents" from "anon";

revoke trigger on table "public"."task_contents" from "anon";

revoke truncate on table "public"."task_contents" from "anon";

revoke update on table "public"."task_contents" from "anon";

revoke delete on table "public"."task_contents" from "authenticated";

revoke insert on table "public"."task_contents" from "authenticated";

revoke references on table "public"."task_contents" from "authenticated";

revoke select on table "public"."task_contents" from "authenticated";

revoke trigger on table "public"."task_contents" from "authenticated";

revoke truncate on table "public"."task_contents" from "authenticated";

revoke update on table "public"."task_contents" from "authenticated";

revoke delete on table "public"."task_contents" from "service_role";

revoke insert on table "public"."task_contents" from "service_role";

revoke references on table "public"."task_contents" from "service_role";

revoke select on table "public"."task_contents" from "service_role";

revoke trigger on table "public"."task_contents" from "service_role";

revoke truncate on table "public"."task_contents" from "service_role";

revoke update on table "public"."task_contents" from "service_role";

alter table "public"."task_contents" drop constraint "task_contents_user_id_fkey";

alter table "public"."tasks" drop constraint "tasks_content_id_fkey";

alter table "public"."task_contents" drop constraint "task_contents_pkey";

drop index if exists "public"."idx_task_contents_user_id";

drop index if exists "public"."idx_tasks_content_id";

drop index if exists "public"."task_contents_pkey";

drop table "public"."task_contents";

alter table "public"."tasks" drop column "content_id";


