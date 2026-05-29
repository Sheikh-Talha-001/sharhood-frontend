// ============================================================
// src/pages/Login.tsx — Login Page (Backend Integrated)
// ============================================================

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "react-hot-toast";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to where the user was trying to go, or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      toast.success("Welcome back!");
      // Navigate based on role
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string; message?: string } } };
      setError(
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        "Failed to log in. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative">
       <Link to="/" className="absolute top-6 left-6 p-2 bg-white rounded-full text-brand-black hover:bg-gray-100 transition-colors shadow-sm">
         <ArrowLeft className="size-5" />
       </Link>
       <div className="max-w-md w-full bg-white rounded-4xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-10 justify-center">
             <div className="size-10 bg-brand-black rounded-xl flex items-center justify-center">
               <span className="text-brand-yellow font-black text-xl leading-none">S</span>
             </div>
             <span className="font-bold text-2xl tracking-tight text-brand-black">Lendly</span>
          </div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight text-center">Welcome back</h2>
          <p className="text-gray-500 font-medium text-center mb-8">Sign in to your account to continue</p>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-200">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
             <div>
                <label className="block text-sm font-bold text-brand-black mb-2">Email Address</label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" 
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-brand-black mb-2">Password</label>
                <div className="relative">
                   <input 
                     type={showPassword ? "text" : "password"}
                     required
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••" 
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" 
                   />
                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                   </button>
                </div>
             </div>
             <div className="flex items-center justify-between text-sm font-bold">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                   <input type="checkbox" className="size-4 rounded text-brand-black focus:ring-brand-yellow border-gray-300" />
                   Remember me
                </label>
                <a href="#" className="text-brand-black hover:text-brand-yellow transition-colors">Forgot password?</a>
             </div>
             <button 
               type="submit" 
               disabled={isSubmitting}
               className="w-full bg-brand-black text-white rounded-full py-4 font-bold text-lg hover:bg-brand-yellow hover:text-brand-black hover:shadow-lg hover:shadow-brand-yellow/20 transition-all flex items-center justify-center gap-2 group mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {isSubmitting ? "Signing in..." : "Sign In"}
                {!isSubmitting && <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />}
             </button>
          </form>

          <div className="mt-8 text-center font-medium text-sm text-gray-500">
             Don't have an account? <Link to="/register" className="text-brand-black font-bold hover:text-brand-yellow transition-colors underline underline-offset-4">Register here</Link>
          </div>
       </div>
    </div>
  );
}
