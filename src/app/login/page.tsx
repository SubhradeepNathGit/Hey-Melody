"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import loginUser from "../../../api/auth/loginUser";
import getSupabaseClient from "../../../api/SupabaseClient";
export const dynamic = "force-dynamic";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
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
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setMessage("All fields are required!");
      setLoading(false);
      return;
    }

    const result = await loginUser(email, password);

    if (result?.error) {
      setMessage(result.error);
      setLoading(false);
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
      const { data, error } = await supabase.auth.signInWithOAuth({
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
    <div className="relative min-h-screen w-full overflow-hidden p-4 flex items-center justify-center bg-black">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid #27272a',
          },
        }}
      />

      {/* Animated gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% -10%, rgba(6,182,212,0.15), transparent 60%), radial-gradient(900px 500px at 110% 30%, rgba(6,182,212,0.08), transparent 60%), radial-gradient(700px 400px at 50% 120%, rgba(6,182,212,0.10), transparent 60%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]
                   [background-image:linear-gradient(to_right,rgba(6,182,212,.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,.2)_1px,transparent_1px)]
                   [background-size:64px_64px]"
      />

      {/* Main card */}
      <div
        className="relative w-full max-w-[440px]
                   rounded-3xl border border-zinc-800
                   bg-zinc-950 backdrop-blur-xl
                   shadow-[0_20px_80px_-20px_rgba(6,182,212,.3)]
                   px-8 lg:px-10 py-8"
      >
        {/* Glowing border effect */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-3xl pointer-events-none -z-10 opacity-50"
          style={{
            padding: 1,
            background:
              "linear-gradient(135deg, rgba(6,182,212,0.3), rgba(6,182,212,0.1), rgba(6,182,212,0.3))",
            mask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <header className="mb-6 text-center">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 grid place-items-center shadow-lg shadow-cyan-500/30">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
                Hey Melody
              </span>
            </h1>
            <p className="text-sm text-zinc-400">Log in to get back to the melody universe 🎧</p>
          </header>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {message && (
              <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 font-medium text-sm text-center rounded-xl py-2.5 px-4 backdrop-blur-sm">
                {message}
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full py-3.5 rounded-xl font-medium text-white text-base
                         bg-zinc-900 border border-zinc-800
                         hover:bg-zinc-800 hover:border-zinc-700
                         transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         active:scale-[0.98]
                         flex items-center justify-center gap-3"
            >
              {googleLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-zinc-800"></div>
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Or continue with email</span>
              <div className="flex-1 h-px bg-zinc-800"></div>
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
                className="w-full px-4 py-3 rounded-xl
                           bg-zinc-900 text-white placeholder:text-zinc-500
                           outline-none border border-zinc-800
                           focus:border-cyan-500/50 focus:bg-zinc-900
                           focus:ring-2 focus:ring-cyan-500/20
                           transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || googleLoading}
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
                           rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden
                           focus-within:border-cyan-500/50 focus-within:bg-zinc-900
                           focus-within:ring-2 focus-within:ring-cyan-500/20
                           transition-all duration-300"
              >
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="flex-1 px-4 py-3 bg-transparent text-white placeholder:text-zinc-500 outline-none disabled:opacity-50"
                  disabled={loading || googleLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="px-4 text-xs font-bold bg-zinc-800 hover:bg-zinc-750 text-cyan-400 transition-colors disabled:opacity-50"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  disabled={loading || googleLoading}
                >
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
            </label>

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              className="mt-2 w-full py-3.5 rounded-xl font-bold text-black text-base
                         bg-gradient-to-r from-cyan-500 to-cyan-600
                         hover:from-cyan-400 hover:to-cyan-500
                         shadow-lg shadow-cyan-500/30
                         transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:from-cyan-500 disabled:hover:to-cyan-600
                         active:scale-[0.98]"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Logging in…
                </span>
              ) : (
                "Log In"
              )}
            </button>

            {/* Remember Me & Forgot Password */}
            <div className="mt-1 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 focus:ring-2 focus:ring-cyan-500/20 focus:ring-offset-0"
                  style={{ accentColor: theme.cyan }}
                  disabled={loading || googleLoading}
                />
                <label htmlFor="remember" className="text-zinc-400 cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors underline decoration-transparent hover:decoration-cyan-400"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Footer Link */}
          <div className="text-zinc-400 text-center mt-6 text-sm">
            <span>Don&apos;t have an account? </span>
            <Link
              href="/signup"
              className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors underline decoration-transparent hover:decoration-cyan-400"
            >
              Sign up now
            </Link>
          </div>
        </div>

        {/* Bottom glow effect */}
        <div
          aria-hidden
          className="absolute -z-10 left-1/2 -translate-x-1/2 bottom-[-80px] h-48 w-[80%] rounded-full blur-3xl opacity-40"
          style={{ background: "rgba(6,182,212,0.3)" }}
        />
      </div>
    </div>
  );
}