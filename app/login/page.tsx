"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChefHat, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
          className="bg-white rounded-4xl p-8 md:p-10 shadow-luxury border border-forest-100/60"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.2 }}
              className="w-16 h-16 bg-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow"
            >
              <ChefHat className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="font-display text-3xl font-semibold text-forest-950">Admin Access</h1>
            <p className="text-forest-500 text-sm mt-1">Sign in to manage your food journal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-premium pl-11" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-premium pl-11 pr-11" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
