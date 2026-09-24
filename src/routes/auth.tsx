import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/tool-workspace";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AI Workplace Assistant" },
      { name: "description", content: "Sign in to save your AI chatbot conversation." },
      { property: "og:title", content: "Sign in — AI Workplace Assistant" },
      { property: "og:description", content: "Sign in to save your AI chatbot conversation." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/chat" });
  }, [user, navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/chat" } });
    setBusy(false);
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    if (mode === "up" && !res.data.session) toast.success("Check your email to confirm your account.");
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) {
      toast.error(r.error.message || "Google sign-in failed.");
      return;
    }
    if (r.redirected) return;
    toast.success("Signed in with Google.");
    window.location.assign("/chat");
  }

  return (
    <div className="mx-auto max-w-sm py-8">
      <div className="panel animate-rise p-6">
        <p className="eyebrow">Account</p>
        <h1 className="mt-1 text-2xl font-bold">{mode === "in" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to keep your chatbot conversation saved.</p>
        <Button variant="outline" className="mt-5 w-full" onClick={google}>
          Continue with Google
        </Button>
        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password" htmlFor="pw">
            <Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Button type="submit" className="w-full" disabled={busy}>
            {mode === "in" ? "Sign in" : "Sign up"}
          </Button>
        </form>
        <button
          type="button"
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
        >
          {mode === "in" ? "No account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
