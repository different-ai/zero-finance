drop policy "Users can delete their own tasks" on "public"."tasks";

drop policy "Users can insert their own tasks" on "public"."tasks";

drop policy "Users can update their own tasks" on "public"."tasks";

drop policy "Users can view their own tasks" on "public"."tasks";

create table "public"."task_contents" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "content" text not null,
    "email_type" integer,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."task_contents" enable row level security;

alter table "public"."tasks" add column "content_id" uuid;

CREATE INDEX idx_task_contents_user_id ON public.task_contents USING btree (user_id);

CREATE INDEX idx_tasks_content_id ON public.tasks USING btree (content_id);

CREATE UNIQUE INDEX task_contents_pkey ON public.task_contents USING btree (id);

alter table "public"."task_contents" add constraint "task_contents_pkey" PRIMARY KEY using index "task_contents_pkey";

alter table "public"."task_contents" add constraint "task_contents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."task_contents" validate constraint "task_contents_user_id_fkey";

alter table "public"."tasks" add constraint "tasks_content_id_fkey" FOREIGN KEY (content_id) REFERENCES task_contents(id) not valid;

alter table "public"."tasks" validate constraint "tasks_content_id_fkey";

grant delete on table "public"."task_contents" to "anon";

grant insert on table "public"."task_contents" to "anon";

grant references on table "public"."task_contents" to "anon";

grant select on table "public"."task_contents" to "anon";

grant trigger on table "public"."task_contents" to "anon";

grant truncate on table "public"."task_contents" to "anon";

grant update on table "public"."task_contents" to "anon";

grant delete on table "public"."task_contents" to "authenticated";

grant insert on table "public"."task_contents" to "authenticated";

grant references on table "public"."task_contents" to "authenticated";

grant select on table "public"."task_contents" to "authenticated";

grant trigger on table "public"."task_contents" to "authenticated";

grant truncate on table "public"."task_contents" to "authenticated";

grant update on table "public"."task_contents" to "authenticated";

grant delete on table "public"."task_contents" to "service_role";

grant insert on table "public"."task_contents" to "service_role";

grant references on table "public"."task_contents" to "service_role";

grant select on table "public"."task_contents" to "service_role";

grant trigger on table "public"."task_contents" to "service_role";

grant truncate on table "public"."task_contents" to "service_role";

grant update on table "public"."task_contents" to "service_role";

create policy "Users can delete their own task contents"
on "public"."task_contents"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own task contents"
on "public"."task_contents"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own task contents"
on "public"."task_contents"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own task contents"
on "public"."task_contents"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can delete their own tasks"
on "public"."tasks"
as permissive
for delete
to public
using (((auth.uid() = user_id) AND ((content_id IS NULL) OR (auth.uid() = ( SELECT task_contents.user_id
   FROM task_contents
  WHERE (task_contents.id = tasks.content_id))))));


create policy "Users can insert their own tasks"
on "public"."tasks"
as permissive
for insert
to public
with check (((auth.uid() = user_id) AND ((content_id IS NULL) OR (auth.uid() = ( SELECT task_contents.user_id
   FROM task_contents
  WHERE (task_contents.id = tasks.content_id))))));


create policy "Users can update their own tasks"
on "public"."tasks"
as permissive
for update
to public
using (((auth.uid() = user_id) AND ((content_id IS NULL) OR (auth.uid() = ( SELECT task_contents.user_id
   FROM task_contents
  WHERE (task_contents.id = tasks.content_id))))));


create policy "Users can view their own tasks"
on "public"."tasks"
as permissive
for select
to public
using (((auth.uid() = user_id) OR (auth.uid() = ( SELECT task_contents.user_id
   FROM task_contents
  WHERE (task_contents.id = tasks.content_id)))));



