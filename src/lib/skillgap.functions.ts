import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listCareers = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("careers")
    .select("id, slug, title, category, summary, demand_score, growth_label, salary_range")
    .order("demand_score", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getCareerBundle = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data: input }) => {
    const sb = publicClient();
    const { data: career, error } = await sb
      .from("careers")
      .select("id, slug, title, category, summary, demand_score, growth_label, salary_range")
      .eq("slug", input.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!career) return null;
    const { data: skills, error: sErr } = await sb
      .from("career_skills")
      .select(
        "id, skill_name, skill_category, importance, required_level, resource_label, resource_url",
      )
      .eq("career_id", career.id)
      .order("importance", { ascending: false });
    if (sErr) throw new Error(sErr.message);
    return { career, skills: skills ?? [] };
  });

const SaveInput = z.object({
  careerId: z.string().uuid(),
  notes: z.string().trim().max(600).optional(),
  extraSkills: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  skills: z
    .array(
      z.object({
        skill_name: z.string().min(1).max(120),
        skill_category: z.string().min(1).max(60),
        required_level: z.number().int().min(0).max(5),
        user_level: z.number().int().min(0).max(5),
        importance: z.number().int().min(1).max(5),
        resource_label: z.string().max(160).nullable().optional(),
        resource_url: z.string().max(400).nullable().optional(),
      }),
    )
    .min(1)
    .max(60),
});

export const saveAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SaveInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const weighted = data.skills.reduce(
      (acc, s) => {
        const need = Math.max(s.required_level, 1);
        acc.max += need * s.importance;
        acc.got += Math.min(s.user_level, need) * s.importance;
        return acc;
      },
      { max: 0, got: 0 },
    );
    const readiness = weighted.max === 0 ? 0 : Math.round((weighted.got / weighted.max) * 100);
    const matched = data.skills.filter((s) => s.user_level >= s.required_level).length;
    const gaps = data.skills.length - matched;

    const { data: analysis, error } = await supabase
      .from("analyses")
      .insert({
        user_id: userId,
        career_id: data.careerId,
        readiness_score: readiness,
        matched_count: matched,
        gap_count: gaps,
        extra_skills: data.extraSkills,
        notes: data.notes ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const { error: rowsErr } = await supabase.from("analysis_skills").insert(
      data.skills.map((s) => ({
        analysis_id: analysis.id,
        user_id: userId,
        skill_name: s.skill_name,
        skill_category: s.skill_category,
        required_level: s.required_level,
        user_level: s.user_level,
        importance: s.importance,
        resource_label: s.resource_label ?? null,
        resource_url: s.resource_url ?? null,
      })),
    );
    if (rowsErr) throw new Error(rowsErr.message);

    return { id: analysis.id as string };
  });

export const listAnalyses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("analyses")
      .select(
        "id, readiness_score, matched_count, gap_count, created_at, careers(title, category, slug)",
      )
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getAnalysis = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data: input, context }) => {
    const { supabase } = context;
    const { data: analysis, error } = await supabase
      .from("analyses")
      .select(
        "id, readiness_score, matched_count, gap_count, extra_skills, notes, created_at, careers(title, category, slug, summary, salary_range, demand_score)",
      )
      .eq("id", input.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!analysis) return null;
    const { data: skills, error: sErr } = await supabase
      .from("analysis_skills")
      .select(
        "id, skill_name, skill_category, required_level, user_level, importance, resource_label, resource_url",
      )
      .eq("analysis_id", input.id);
    if (sErr) throw new Error(sErr.message);
    return { analysis, skills: skills ?? [] };
  });

export const deleteAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("analyses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
