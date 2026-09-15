
-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  education_level text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- CAREERS
CREATE TABLE public.careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL,
  summary text NOT NULL,
  demand_score int NOT NULL DEFAULT 70,
  growth_label text NOT NULL DEFAULT 'Growing',
  salary_range text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.careers TO anon;
GRANT SELECT ON public.careers TO authenticated;
GRANT ALL ON public.careers TO service_role;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Careers are public" ON public.careers FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.career_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  skill_category text NOT NULL DEFAULT 'Technical',
  importance int NOT NULL DEFAULT 3,
  required_level int NOT NULL DEFAULT 3,
  resource_label text,
  resource_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (career_id, skill_name)
);
GRANT SELECT ON public.career_skills TO anon;
GRANT SELECT ON public.career_skills TO authenticated;
GRANT ALL ON public.career_skills TO service_role;
ALTER TABLE public.career_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Career skills are public" ON public.career_skills FOR SELECT TO anon, authenticated USING (true);

-- ANALYSES
CREATE TABLE public.analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  career_id uuid NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
  readiness_score int NOT NULL DEFAULT 0,
  matched_count int NOT NULL DEFAULT 0,
  gap_count int NOT NULL DEFAULT 0,
  extra_skills text[] NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analyses TO authenticated;
GRANT ALL ON public.analyses TO service_role;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own analyses" ON public.analyses FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX analyses_user_idx ON public.analyses (user_id, created_at DESC);

CREATE TABLE public.analysis_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  skill_category text NOT NULL DEFAULT 'Technical',
  required_level int NOT NULL DEFAULT 3,
  user_level int NOT NULL DEFAULT 0,
  importance int NOT NULL DEFAULT 3,
  resource_label text,
  resource_url text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analysis_skills TO authenticated;
GRANT ALL ON public.analysis_skills TO service_role;
ALTER TABLE public.analysis_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own analysis skills" ON public.analysis_skills FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX analysis_skills_analysis_idx ON public.analysis_skills (analysis_id);

-- SEED CAREERS
INSERT INTO public.careers (slug, title, category, summary, demand_score, growth_label, salary_range) VALUES
('software-engineer','Software Engineer','Engineering','Design, build and maintain production software systems across web, mobile and backend platforms.',94,'Very high demand','$55k – $130k'),
('data-scientist','Data Scientist','Data & AI','Turn raw data into models, forecasts and decisions using statistics and machine learning.',91,'Very high demand','$60k – $145k'),
('data-analyst','Data Analyst','Data & AI','Clean, explore and visualise business data to answer operational and strategic questions.',86,'High demand','$40k – $90k'),
('cybersecurity-analyst','Cybersecurity Analyst','Security','Defend systems and data by monitoring threats, hardening infrastructure and responding to incidents.',89,'Very high demand','$55k – $125k'),
('cloud-devops-engineer','Cloud / DevOps Engineer','Infrastructure','Automate delivery pipelines and run reliable, scalable cloud infrastructure.',90,'Very high demand','$65k – $140k'),
('ui-ux-designer','UI/UX Designer','Design','Research users and craft interfaces that are usable, accessible and beautiful.',80,'Growing','$38k – $95k'),
('product-manager','Product Manager','Business','Own product direction: discovery, prioritisation, delivery and outcomes.',83,'Growing','$60k – $135k'),
('digital-marketer','Digital Marketing Specialist','Business','Grow audiences and revenue through search, content, paid media and analytics.',76,'Growing','$32k – $85k');

INSERT INTO public.career_skills (career_id, skill_name, skill_category, importance, required_level, resource_label, resource_url)
SELECT c.id, v.skill_name, v.skill_category, v.importance, v.required_level, v.resource_label, v.resource_url
FROM (VALUES
-- Software Engineer
('software-engineer','Programming Fundamentals','Technical',5,4,'CS50 Introduction to Computer Science','https://cs50.harvard.edu/x/'),
('software-engineer','JavaScript / TypeScript','Technical',5,4,'The Modern JavaScript Tutorial','https://javascript.info/'),
('software-engineer','Data Structures & Algorithms','Technical',5,4,'MIT OCW Algorithms','https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/'),
('software-engineer','Git & Version Control','Tools',4,4,'Pro Git Book','https://git-scm.com/book/en/v2'),
('software-engineer','Databases & SQL','Technical',4,3,'SQLBolt Interactive Lessons','https://sqlbolt.com/'),
('software-engineer','APIs & System Design','Technical',4,3,'System Design Primer','https://github.com/donnemartin/system-design-primer'),
('software-engineer','Testing & Debugging','Technical',4,3,'Testing JavaScript','https://testingjavascript.com/'),
('software-engineer','Cloud Deployment','Technical',3,3,'AWS Cloud Practitioner Essentials','https://aws.amazon.com/training/'),
('software-engineer','Problem Solving','Soft',5,4,'LeetCode Practice','https://leetcode.com/'),
('software-engineer','Team Communication','Soft',4,3,'Software Engineering Communication','https://www.coursera.org/'),
-- Data Scientist
('data-scientist','Python for Data','Technical',5,4,'Python Data Science Handbook','https://jakevdp.github.io/PythonDataScienceHandbook/'),
('data-scientist','Statistics & Probability','Technical',5,4,'Khan Academy Statistics','https://www.khanacademy.org/math/statistics-probability'),
('data-scientist','Machine Learning','Technical',5,4,'Andrew Ng Machine Learning','https://www.coursera.org/specializations/machine-learning-introduction'),
('data-scientist','SQL & Data Wrangling','Technical',5,4,'Mode SQL Tutorial','https://mode.com/sql-tutorial/'),
('data-scientist','Data Visualisation','Technical',4,3,'Storytelling with Data','https://www.storytellingwithdata.com/'),
('data-scientist','Deep Learning','Technical',3,3,'fast.ai Practical Deep Learning','https://course.fast.ai/'),
('data-scientist','Experiment Design / A-B Testing','Technical',4,3,'Google A/B Testing Course','https://www.udacity.com/course/ab-testing--ud257'),
('data-scientist','MLOps & Model Deployment','Technical',3,2,'Made With ML','https://madewithml.com/'),
('data-scientist','Business Acumen','Soft',4,3,'Data Science for Business','https://www.oreilly.com/'),
('data-scientist','Communicating Insights','Soft',5,4,'Effective Data Storytelling','https://www.coursera.org/'),
-- Data Analyst
('data-analyst','Advanced Excel / Sheets','Tools',4,4,'Excel Skills for Business','https://www.coursera.org/specializations/excel'),
('data-analyst','SQL Querying','Technical',5,4,'SQLBolt','https://sqlbolt.com/'),
('data-analyst','Power BI / Tableau','Tools',5,4,'Tableau Free Training','https://www.tableau.com/learn/training'),
('data-analyst','Python or R Basics','Technical',4,3,'Pandas Getting Started','https://pandas.pydata.org/docs/getting_started/'),
('data-analyst','Descriptive Statistics','Technical',5,4,'Khan Academy Statistics','https://www.khanacademy.org/math/statistics-probability'),
('data-analyst','Data Cleaning','Technical',5,4,'Kaggle Data Cleaning','https://www.kaggle.com/learn/data-cleaning'),
('data-analyst','Dashboard Design','Design',4,3,'Information Dashboard Design','https://www.perceptualedge.com/'),
('data-analyst','Domain Knowledge','Soft',3,3,'Industry Case Studies','https://www.kaggle.com/datasets'),
('data-analyst','Reporting & Presentation','Soft',5,4,'Presenting Data Effectively','https://www.coursera.org/'),
('data-analyst','Attention to Detail','Soft',4,4,'Analytical Thinking','https://www.coursera.org/'),
-- Cybersecurity Analyst
('cybersecurity-analyst','Networking Fundamentals','Technical',5,4,'Cisco Networking Basics','https://skillsforall.com/'),
('cybersecurity-analyst','Linux Administration','Technical',5,4,'Linux Journey','https://linuxjourney.com/'),
('cybersecurity-analyst','Security Frameworks (NIST/ISO)','Knowledge',4,3,'NIST Cybersecurity Framework','https://www.nist.gov/cyberframework'),
('cybersecurity-analyst','Threat Detection & SIEM','Technical',5,4,'Splunk Free Training','https://www.splunk.com/en_us/training.html'),
('cybersecurity-analyst','Incident Response','Technical',5,4,'SANS Incident Handling','https://www.sans.org/'),
('cybersecurity-analyst','Cryptography Basics','Technical',4,3,'Cryptography I','https://www.coursera.org/learn/crypto'),
('cybersecurity-analyst','Penetration Testing','Technical',3,3,'TryHackMe Learning Paths','https://tryhackme.com/'),
('cybersecurity-analyst','Scripting (Python/Bash)','Technical',4,3,'Automate the Boring Stuff','https://automatetheboringstuff.com/'),
('cybersecurity-analyst','Risk Assessment','Knowledge',4,3,'Risk Management Framework','https://www.nist.gov/'),
('cybersecurity-analyst','Security Reporting','Soft',4,3,'Technical Writing Course','https://developers.google.com/tech-writing'),
-- Cloud / DevOps
('cloud-devops-engineer','Linux & Shell','Technical',5,4,'Linux Journey','https://linuxjourney.com/'),
('cloud-devops-engineer','Cloud Platform (AWS/Azure/GCP)','Technical',5,4,'AWS Skill Builder','https://skillbuilder.aws/'),
('cloud-devops-engineer','Docker & Containers','Tools',5,4,'Docker Getting Started','https://docs.docker.com/get-started/'),
('cloud-devops-engineer','Kubernetes','Tools',4,3,'Kubernetes Basics','https://kubernetes.io/docs/tutorials/kubernetes-basics/'),
('cloud-devops-engineer','CI/CD Pipelines','Technical',5,4,'GitHub Actions Docs','https://docs.github.com/actions'),
('cloud-devops-engineer','Infrastructure as Code','Technical',5,4,'Terraform Tutorials','https://developer.hashicorp.com/terraform/tutorials'),
('cloud-devops-engineer','Monitoring & Observability','Technical',4,3,'Prometheus Docs','https://prometheus.io/docs/introduction/overview/'),
('cloud-devops-engineer','Networking & Security','Technical',4,3,'Cloud Networking Basics','https://skillsforall.com/'),
('cloud-devops-engineer','Scripting & Automation','Technical',4,4,'Automate the Boring Stuff','https://automatetheboringstuff.com/'),
('cloud-devops-engineer','Incident Ownership','Soft',4,3,'Google SRE Book','https://sre.google/books/'),
-- UI/UX
('ui-ux-designer','User Research','Design',5,4,'IDEO Design Kit','https://www.designkit.org/'),
('ui-ux-designer','Wireframing & Prototyping','Design',5,4,'Figma Learn','https://help.figma.com/hc/en-us/categories/360002051613'),
('ui-ux-designer','Figma','Tools',5,4,'Figma Learn','https://help.figma.com/'),
('ui-ux-designer','Visual & Typographic Design','Design',4,4,'Practical Typography','https://practicaltypography.com/'),
('ui-ux-designer','Design Systems','Design',4,3,'Design Systems Handbook','https://www.designbetter.co/design-systems-handbook'),
('ui-ux-designer','Accessibility (WCAG)','Design',4,3,'WebAIM Introduction','https://webaim.org/intro/'),
('ui-ux-designer','Usability Testing','Design',4,3,'Nielsen Norman Group','https://www.nngroup.com/articles/'),
('ui-ux-designer','Interaction & Motion','Design',3,3,'Motion Design Principles','https://material.io/design/motion'),
('ui-ux-designer','HTML/CSS Literacy','Technical',3,2,'MDN Web Docs','https://developer.mozilla.org/'),
('ui-ux-designer','Stakeholder Communication','Soft',4,3,'Articulating Design Decisions','https://www.oreilly.com/'),
-- Product Manager
('product-manager','Product Discovery','Business',5,4,'Continuous Discovery Habits','https://www.producttalk.org/'),
('product-manager','Roadmapping & Prioritisation','Business',5,4,'Prioritisation Frameworks','https://www.productplan.com/learn/'),
('product-manager','User Story Writing','Business',4,4,'User Story Mapping','https://www.jpattonassociates.com/story-mapping/'),
('product-manager','Data & Metrics','Technical',5,4,'Lean Analytics','https://leananalyticsbook.com/'),
('product-manager','Market & Competitor Research','Business',4,3,'Competitive Analysis Guide','https://www.productplan.com/learn/'),
('product-manager','Agile / Scrum','Process',4,4,'Scrum Guide','https://scrumguides.org/'),
('product-manager','Basic Technical Literacy','Technical',3,3,'Tech for Product Managers','https://www.coursera.org/'),
('product-manager','Stakeholder Management','Soft',5,4,'Influence Without Authority','https://www.coursera.org/'),
('product-manager','Communication & Storytelling','Soft',5,4,'Storytelling for Leaders','https://www.coursera.org/'),
('product-manager','Customer Interviewing','Soft',4,4,'The Mom Test','https://www.momtestbook.com/'),
-- Digital Marketer
('digital-marketer','SEO','Technical',5,4,'Google SEO Starter Guide','https://developers.google.com/search/docs/fundamentals/seo-starter-guide'),
('digital-marketer','Content Strategy','Business',5,4,'HubSpot Content Marketing','https://academy.hubspot.com/'),
('digital-marketer','Paid Ads (Google/Meta)','Technical',4,3,'Google Ads Skillshop','https://skillshop.withgoogle.com/'),
('digital-marketer','Analytics (GA4)','Technical',5,4,'Google Analytics Academy','https://analytics.google.com/analytics/academy/'),
('digital-marketer','Email Marketing','Technical',4,3,'Mailchimp Marketing Library','https://mailchimp.com/resources/'),
('digital-marketer','Social Media Management','Business',4,3,'Meta Blueprint','https://www.facebook.com/business/learn'),
('digital-marketer','Copywriting','Soft',5,4,'Copywriting Course','https://copyblogger.com/'),
('digital-marketer','Conversion Optimisation','Technical',4,3,'CXL Institute Resources','https://cxl.com/blog/'),
('digital-marketer','Brand Positioning','Business',3,3,'Positioning Fundamentals','https://www.coursera.org/'),
('digital-marketer','Data-Driven Decisions','Soft',4,3,'Marketing Analytics','https://www.coursera.org/')
) AS v(career_slug, skill_name, skill_category, importance, required_level, resource_label, resource_url)
JOIN public.careers c ON c.slug = v.career_slug;
