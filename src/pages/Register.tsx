// ============================================================
// src/pages/Register.tsx — Register Page (Backend Integrated)
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "react-hot-toast";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 8) {
      return setError("Password must be at least 8 characters long");
    }

    setIsSubmitting(true);

    try {
      // The backend auth register might not take phone yet, but we'll send it if supported
      // For now we send name, email, password as per our AuthContext signature
      await register(name, email, password);
      // On success, redirect to dashboard
      toast.success("Account created successfully!");
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string; message?: string } } };
      setError(
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        "Failed to create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 py-12 relative">
       <Link to="/" className="absolute top-6 left-6 p-2 bg-white rounded-full text-brand-black hover:bg-gray-100 transition-colors shadow-sm hidden sm:flex">
         <ArrowLeft className="size-5" />
       </Link>
       <div className="max-w-xl w-full bg-white rounded-4xl p-8 md:p-12 shadow-xl border border-gray-100 mt-12 sm:mt-0">
          <div className="flex items-center gap-3 mb-8 justify-center">
             <div className="size-10 bg-brand-black rounded-xl flex items-center justify-center">
               <span className="text-brand-yellow font-black text-xl leading-none">S</span>
             </div>
             <span className="font-bold text-2xl tracking-tight text-brand-black">Lendly</span>
          </div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight text-center">Join the neighborhood</h2>
          <p className="text-gray-500 font-medium text-center mb-8">Create an account to start sharing today.</p>
          
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                  <label htmlFor="register-name" className="block text-sm font-bold text-brand-black mb-2">Full Name</label>
                  <input 
                    id="register-name"
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" 
                  />
               </div>
               <div>
                  <label htmlFor="register-phone" className="block text-sm font-bold text-brand-black mb-2">Phone Number</label>
                  <input 
                    id="register-phone"
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" 
                  />
               </div>
             </div>
             <div>
                <label htmlFor="register-email" className="block text-sm font-bold text-brand-black mb-2">Email Address</label>
                <input 
                  id="register-email"
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" 
                />
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                  <label htmlFor="register-password" className="block text-sm font-bold text-brand-black mb-2">Password</label>
                  <div className="relative">
                     <input 
                       id="register-password"
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
               <div>
                  <label htmlFor="register-confirm-password" className="block text-sm font-bold text-brand-black mb-2">Confirm Password</label>
                  <input 
                    id="register-confirm-password"
                    type={showPassword ? "text" : "password"} 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" 
                  />
               </div>
             </div>
             
             <button 
               type="submit" 
               disabled={isSubmitting}
               className="w-full bg-brand-black text-white rounded-full py-4 font-bold text-lg hover:bg-brand-yellow hover:text-brand-black hover:shadow-lg hover:shadow-brand-yellow/20 transition-all flex items-center justify-center gap-2 group mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {isSubmitting ? "Creating Account..." : "Create Account"}
                {!isSubmitting && <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />}
             </button>
          </form>
          <div className="mt-8 text-center font-medium text-sm text-gray-500">
             Already have an account? <Link to="/login" className="text-brand-black font-bold hover:text-brand-yellow transition-colors underline underline-offset-4">Sign In</Link>
          </div>
       </div>
    </div>
  );
}
