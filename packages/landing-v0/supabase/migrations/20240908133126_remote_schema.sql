alter table "public"."task_contents" drop column "email_type";

alter table "public"."task_contents" disable row level security;

alter table "public"."task_links" disable row level security;


