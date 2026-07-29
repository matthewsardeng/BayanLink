-- ENUMS
CREATE TYPE public.app_role AS ENUM ('resident','official','admin');
CREATE TYPE public.post_category AS ENUM ('community_update','suggestion','question','discussion','public_concern','announcement','event');
CREATE TYPE public.content_status AS ENUM ('visible','hidden','removed');
CREATE TYPE public.suggestion_status AS ENUM ('submitted','under_review','acknowledged','in_progress','implemented','declined');
CREATE TYPE public.issue_status AS ENUM ('submitted','under_review','verified','assigned','in_progress','completed','closed');
CREATE TYPE public.request_status AS ENUM ('submitted','under_review','processing','ready_for_claim','completed','rejected');
CREATE TYPE public.announcement_kind AS ENUM ('announcement','advisory','update','event','service_interruption');
CREATE TYPE public.report_status AS ENUM ('open','reviewed','actioned','dismissed');

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Resident',
  area TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('official','admin'))
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid()));

-- new user bootstrap
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name',''), split_part(NEW.email,'@',1), 'Resident'))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'resident') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- POSTS
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category public.post_category NOT NULL DEFAULT 'community_update',
  content TEXT NOT NULL,
  image_url TEXT,
  location_label TEXT,
  is_official BOOLEAN NOT NULL DEFAULT false,
  status public.content_status NOT NULL DEFAULT 'visible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER posts_touch BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "visible posts readable" ON public.posts FOR SELECT USING (status = 'visible' OR author_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "residents create posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND (is_official = false OR public.is_staff(auth.uid())));
CREATE POLICY "authors update posts" ON public.posts FOR UPDATE TO authenticated USING (author_id = auth.uid() OR public.is_staff(auth.uid())) WITH CHECK (author_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "authors delete posts" ON public.posts FOR DELETE TO authenticated USING (author_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE TABLE public.post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'support',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
GRANT SELECT ON public.post_reactions TO anon;
GRANT SELECT, INSERT, DELETE ON public.post_reactions TO authenticated;
GRANT ALL ON public.post_reactions TO service_role;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reactions readable" ON public.post_reactions FOR SELECT USING (true);
CREATE POLICY "own reaction insert" ON public.post_reactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own reaction delete" ON public.post_reactions FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_official BOOLEAN NOT NULL DEFAULT false,
  status public.content_status NOT NULL DEFAULT 'visible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "visible comments readable" ON public.comments FOR SELECT USING (status = 'visible' OR author_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "residents comment" ON public.comments FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND (is_official = false OR public.is_staff(auth.uid())));
CREATE POLICY "authors update comments" ON public.comments FOR UPDATE TO authenticated USING (author_id = auth.uid() OR public.is_staff(auth.uid())) WITH CHECK (author_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "authors delete comments" ON public.comments FOR DELETE TO authenticated USING (author_id = auth.uid() OR public.is_staff(auth.uid()));

-- SUGGESTIONS
CREATE TABLE public.suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'community',
  location_label TEXT,
  status public.suggestion_status NOT NULL DEFAULT 'submitted',
  content_status public.content_status NOT NULL DEFAULT 'visible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.suggestions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggestions TO authenticated;
GRANT ALL ON public.suggestions TO service_role;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER suggestions_touch BEFORE UPDATE ON public.suggestions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "visible suggestions readable" ON public.suggestions FOR SELECT USING (content_status = 'visible' OR author_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "residents create suggestions" ON public.suggestions FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "authors update suggestions" ON public.suggestions FOR UPDATE TO authenticated USING (author_id = auth.uid() OR public.is_staff(auth.uid())) WITH CHECK (author_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "authors delete suggestions" ON public.suggestions FOR DELETE TO authenticated USING (author_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE TABLE public.suggestion_supports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id UUID NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (suggestion_id, user_id)
);
GRANT SELECT ON public.suggestion_supports TO anon;
GRANT SELECT, INSERT, DELETE ON public.suggestion_supports TO authenticated;
GRANT ALL ON public.suggestion_supports TO service_role;
ALTER TABLE public.suggestion_supports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "supports readable" ON public.suggestion_supports FOR SELECT USING (true);
CREATE POLICY "own support insert" ON public.suggestion_supports FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own support delete" ON public.suggestion_supports FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.suggestion_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id UUID NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_official BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.suggestion_responses TO anon;
GRANT SELECT, INSERT, DELETE ON public.suggestion_responses TO authenticated;
GRANT ALL ON public.suggestion_responses TO service_role;
ALTER TABLE public.suggestion_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "responses readable" ON public.suggestion_responses FOR SELECT USING (true);
CREATE POLICY "responses insert" ON public.suggestion_responses FOR INSERT TO authenticated WITH CHECK (responder_id = auth.uid() AND (is_official = false OR public.is_staff(auth.uid())));
CREATE POLICY "responses delete" ON public.suggestion_responses FOR DELETE TO authenticated USING (responder_id = auth.uid() OR public.is_staff(auth.uid()));

-- ISSUES
CREATE SEQUENCE public.issue_ref_seq START 1;
CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reference_no TEXT NOT NULL UNIQUE DEFAULT ('BLB-ISS-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.issue_ref_seq')::text, 5, '0')),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  location_label TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  photo_url TEXT,
  status public.issue_status NOT NULL DEFAULT 'submitted',
  content_status public.content_status NOT NULL DEFAULT 'visible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.issues TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.issues TO authenticated;
GRANT ALL ON public.issues TO service_role;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER issues_touch BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "visible issues readable" ON public.issues FOR SELECT USING (content_status = 'visible' OR reporter_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "residents report issues" ON public.issues FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "issue update" ON public.issues FOR UPDATE TO authenticated USING (reporter_id = auth.uid() OR public.is_staff(auth.uid())) WITH CHECK (reporter_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "issue delete" ON public.issues FOR DELETE TO authenticated USING (reporter_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE TABLE public.issue_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.issue_status NOT NULL,
  note TEXT,
  is_official BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.issue_updates TO anon;
GRANT SELECT, INSERT ON public.issue_updates TO authenticated;
GRANT ALL ON public.issue_updates TO service_role;
ALTER TABLE public.issue_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "issue updates readable" ON public.issue_updates FOR SELECT USING (true);
CREATE POLICY "issue updates insert" ON public.issue_updates FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND (is_official = false OR public.is_staff(auth.uid())));

CREATE OR REPLACE FUNCTION public.log_issue_created()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.issue_updates (issue_id, author_id, status, note, is_official)
  VALUES (NEW.id, NEW.reporter_id, NEW.status, 'Report submitted by resident.', false);
  RETURN NEW;
END; $$;
CREATE TRIGGER issues_log_created AFTER INSERT ON public.issues FOR EACH ROW EXECUTE FUNCTION public.log_issue_created();

CREATE TABLE public.issue_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verdict TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (issue_id, user_id)
);
GRANT SELECT ON public.issue_confirmations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.issue_confirmations TO authenticated;
GRANT ALL ON public.issue_confirmations TO service_role;
ALTER TABLE public.issue_confirmations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "confirmations readable" ON public.issue_confirmations FOR SELECT USING (true);
CREATE POLICY "own confirmation write" ON public.issue_confirmations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own confirmation update" ON public.issue_confirmations FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own confirmation delete" ON public.issue_confirmations FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.issue_resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verdict TEXT NOT NULL,
  note TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (issue_id, user_id)
);
GRANT SELECT ON public.issue_resolutions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.issue_resolutions TO authenticated;
GRANT ALL ON public.issue_resolutions TO service_role;
ALTER TABLE public.issue_resolutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resolutions readable" ON public.issue_resolutions FOR SELECT USING (true);
CREATE POLICY "own resolution insert" ON public.issue_resolutions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own resolution update" ON public.issue_resolutions FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- SERVICES
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  fee_info TEXT,
  processing_info TEXT,
  where_to_apply TEXT,
  where_to_claim TEXT,
  contact_info TEXT,
  online_request_enabled BOOLEAN NOT NULL DEFAULT true,
  source_note TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER services_touch BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "active services readable" ON public.services FOR SELECT USING (is_active OR public.is_staff(auth.uid()));
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
CREATE POLICY "staff manage services" ON public.services FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE SEQUENCE public.request_ref_seq START 1;
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  reference_no TEXT NOT NULL UNIQUE DEFAULT ('BLB-REQ-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.request_ref_seq')::text, 5, '0')),
  purpose TEXT NOT NULL,
  details TEXT,
  contact_number TEXT,
  status public.request_status NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.service_requests TO authenticated;
GRANT ALL ON public.service_requests TO service_role;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER requests_touch BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "own requests readable" ON public.service_requests FOR SELECT TO authenticated USING (requester_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "own request insert" ON public.service_requests FOR INSERT TO authenticated WITH CHECK (requester_id = auth.uid());
CREATE POLICY "request update" ON public.service_requests FOR UPDATE TO authenticated USING (requester_id = auth.uid() OR public.is_staff(auth.uid())) WITH CHECK (requester_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE TABLE public.service_request_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.request_status NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.service_request_updates TO authenticated;
GRANT ALL ON public.service_request_updates TO service_role;
ALTER TABLE public.service_request_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "request updates readable" ON public.service_request_updates FOR SELECT TO authenticated USING (
  public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.service_requests r WHERE r.id = request_id AND r.requester_id = auth.uid())
);
CREATE POLICY "staff insert request updates" ON public.service_request_updates FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND author_id = auth.uid());

CREATE OR REPLACE FUNCTION public.log_request_created()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.service_request_updates (request_id, author_id, status, note)
  VALUES (NEW.id, NEW.requester_id, NEW.status, 'Request submitted.');
  RETURN NEW;
END; $$;
CREATE TRIGGER requests_log_created AFTER INSERT ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.log_request_created();

-- ANNOUNCEMENTS
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  kind public.announcement_kind NOT NULL DEFAULT 'announcement',
  source_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER announcements_touch BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "published announcements readable" ON public.announcements FOR SELECT USING (is_published OR public.is_staff(auth.uid()));
CREATE POLICY "staff manage announcements" ON public.announcements FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- FOLLOWS
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, entity_type, entity_id)
);
GRANT SELECT, INSERT, DELETE ON public.follows TO authenticated;
GRANT ALL ON public.follows TO service_role;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own follows readable" ON public.follows FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own follow insert" ON public.follows FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own follow delete" ON public.follows FOR DELETE TO authenticated USING (user_id = auth.uid());

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notifications readable" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own notifications update" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.notify(_user UUID, _kind TEXT, _title TEXT, _body TEXT, _link TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _user IS NULL THEN RETURN; END IF;
  INSERT INTO public.notifications (user_id, kind, title, body, link) VALUES (_user, _kind, _title, _body, _link);
END; $$;

CREATE OR REPLACE FUNCTION public.on_comment_notify()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner UUID;
BEGIN
  SELECT author_id INTO owner FROM public.posts WHERE id = NEW.post_id;
  IF owner IS NOT NULL AND owner <> NEW.author_id THEN
    PERFORM public.notify(owner, 'comment', 'New comment on your post', left(NEW.content, 120), '/community/' || NEW.post_id::text);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER comments_notify AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.on_comment_notify();

CREATE OR REPLACE FUNCTION public.on_issue_status_notify()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM public.notify(NEW.reporter_id, 'issue_status', 'Issue status updated', NEW.reference_no || ' is now ' || NEW.status::text, '/issues/' || NEW.id::text);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER issues_notify AFTER UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION public.on_issue_status_notify();

CREATE OR REPLACE FUNCTION public.on_request_status_notify()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM public.notify(NEW.requester_id, 'request_status', 'Service request updated', NEW.reference_no || ' is now ' || NEW.status::text, '/dashboard');
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER requests_notify AFTER UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.on_request_status_notify();

CREATE OR REPLACE FUNCTION public.on_suggestion_response_notify()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner UUID;
BEGIN
  SELECT author_id INTO owner FROM public.suggestions WHERE id = NEW.suggestion_id;
  IF owner IS NOT NULL AND owner <> NEW.responder_id THEN
    PERFORM public.notify(owner, 'suggestion_response',
      CASE WHEN NEW.is_official THEN 'Official response to your suggestion' ELSE 'New reply to your suggestion' END,
      left(NEW.content, 120), '/community/suggestions/' || NEW.suggestion_id::text);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER suggestion_responses_notify AFTER INSERT ON public.suggestion_responses FOR EACH ROW EXECUTE FUNCTION public.on_suggestion_response_notify();

-- MODERATION
CREATE TABLE public.content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status public.report_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.content_reports TO authenticated;
GRANT ALL ON public.content_reports TO service_role;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read reports" ON public.content_reports FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR reporter_id = auth.uid());
CREATE POLICY "residents file reports" ON public.content_reports FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "staff update reports" ON public.content_reports FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE INDEX idx_posts_created ON public.posts (created_at DESC);
CREATE INDEX idx_issues_created ON public.issues (created_at DESC);
CREATE INDEX idx_suggestions_created ON public.suggestions (created_at DESC);
CREATE INDEX idx_notifications_user ON public.notifications (user_id, created_at DESC);