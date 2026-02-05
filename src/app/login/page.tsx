"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import loginUser from "../../../api/auth/loginUser";
import getSupabaseClient from "../../../api/SupabaseClient";
export const dynamic = "force-dynamic";
import Logo from "../../components/Logo";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const theme = useMemo(() => ({ cyan: "#06b6d4" }), []);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/");
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setMessage("All fields are required!");
      return;
    }

    setSubmitting(true);

    const result = await loginUser(email, password);

    if (result?.error) {
      setMessage(result.error);
      setSubmitting(false);
      return;
    }

    toast.success("Login Successful. Welcome to HeyMelody!");
    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setMessage("");

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setMessage(error.message);
        setGoogleLoading(false);
        return;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong with Google login.";
      setMessage(msg);
      setGoogleLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-black">
      {/* Grid pattern overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(6,182,212,.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,.12) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Main card */}
      <div className="relative w-full max-w-[440px] px-4">
        <div
          className="relative rounded-2xl
                     bg-gradient-to-b from-zinc-950/98 to-black/98 backdrop-blur-xl
                     px-8 py-7"
        >
          <div className="relative z-10">
            {/* Header */}
            <header className="mb-5 text-center">
              <div className="inline-flex items-center justify-center mb-2.5">
                <div className="h-11 w-11 rounded-x grid place-items-center">
                                 <Logo />
                               </div>
              </div>

              <h1 className="text-3xl font-extrabold mb-1.5">
                <span className="text-white">Hey </span>
                <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                  Melody
                </span>
              </h1>


              <p className="text-sm text-zinc-400 font-medium">
                Create account to start streaming your vibe 🎧
              </p>
            </header>


            {/* Form */}
            <div className="flex flex-col gap-3.5">
              {message && (
                <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 font-medium text-sm text-center rounded-xl py-2.5 px-4 backdrop-blur-sm">
                  {message}
                </div>
              )}

              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading || submitting}
                className="w-full py-2.5 rounded-xl font-semibold text-white text-sm
                         bg-zinc-900/80 border border-zinc-700/60
                         hover:bg-zinc-800/80 hover:border-zinc-600/80
                         transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         active:scale-[0.98]
                         flex items-center justify-center gap-3
                         shadow-md shadow-black/20"
              >
                {googleLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center gap-3 py-0.5">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent"></div>
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider px-2">
                  Or continue with email
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent"></div>
              </div>

              {/* Email Field */}
              <label className="group">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Email Address
                </span>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl text-sm
                           bg-zinc-900/40 text-white placeholder:text-zinc-500
                           outline-none border border-zinc-800/60
                           focus:border-cyan-500/50 focus:bg-zinc-900/60
                           focus:ring-2 focus:ring-cyan-500/15
                           transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting || googleLoading}
                  autoComplete="email"
                  inputMode="email"
                  required
                />
              </label>

              {/* Password Field */}
              <label className="group">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Password
                </span>
                <div
                  className="w-full flex items-stretch
                           rounded-xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden
                           focus-within:border-cyan-500/50 focus-within:bg-zinc-900/60
                           focus-within:ring-2 focus-within:ring-cyan-500/15
                           transition-all duration-200"
                >
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    className="flex-1 px-4 py-2.5 bg-transparent text-white text-sm placeholder:text-zinc-500 outline-none disabled:opacity-50"
                    disabled={submitting || googleLoading}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="px-4 text-xs font-bold bg-zinc-800/60 hover:bg-zinc-700/80 text-cyan-400 transition-colors disabled:opacity-50"
                    aria-label={showPw ? "Hide password" : "Show password"}
                    disabled={submitting || googleLoading}
                  >
                    {showPw ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </label>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs mt-0.5">
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-zinc-700/60 bg-zinc-900/40 focus:ring-2 focus:ring-cyan-500/15 focus:ring-offset-0 cursor-pointer"
                    style={{ accentColor: theme.cyan }}
                    disabled={submitting || googleLoading}
                  />
                  <label htmlFor="remember" className="text-zinc-400 cursor-pointer select-none">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors decoration-transparent hover:decoration-cyan-400"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleLogin}
                disabled={submitting || googleLoading}
                className="mt-1.5 w-full py-2.5 rounded-xl font-bold text-white/90 text-md
                         bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500
                         hover:from-cyan-400 hover:via-cyan-300 hover:to-cyan-400
                         shadow-[0_0_20px_rgba(6,182,212,0.35),0_4px_12px_rgba(0,0,0,0.3)]
                         hover:shadow-[0_0_28px_rgba(6,182,212,0.5),0_4px_16px_rgba(0,0,0,0.4)]
                         transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:from-cyan-500 disabled:hover:to-cyan-500
                         active:scale-[0.98]"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Logging in…
                  </span>
                ) : (
                  "Log In"
                )}
              </button>
            </div>

            {/* Footer Link */}
            <div className="text-zinc-400 text-center mt-4 text-sm">
              <span>Don&apos;t have an account? </span>
              <Link
                href="/signup"
                className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors hover:decoration-cyan-400 "
              >
                Sign up now
              </Link>
            </div>
          </div>

          {/* Bottom glow effect */}
          <div
            aria-hidden="true"
            className="absolute -z-10 left-1/2 -translate-x-1/2 bottom-[-50px] h-28 w-[70%] rounded-full blur-3xl opacity-20"
            style={{ background: "rgba(6,182,212,0.4)" }}
          />
        </div>
      </div>
    </div>
  );
}