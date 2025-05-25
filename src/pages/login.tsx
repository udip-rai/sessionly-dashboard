import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const backgroundImages = [
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80", // Professional meeting
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80", // Modern office
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80", // Video call
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      setError("Sign up is not available in the demo. Please use login.");
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/admin-dashboard");
      } else {
        setError("Invalid credentials. Use admin@gmail.com/admin for demo.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left section - 70% */}
      <div className="w-[70%] relative overflow-hidden">
        {/* Background Slideshow */}
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/85 to-navy/80" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-16">
          <div className="max-w-2xl mx-auto text-center w-full">
            <div className="mb-12">
              <div className="flex items-center justify-center gap-3">
                <div className="w-96 h-12 rounded-lg flex items-center justify-center">
                  <img
                    src="/src/assets/images/sessionly-logo.png"
                    alt="Sessionly"
                    className="w-96 object-contain"
                  />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
              Connect With Expert Mentors Through
              <br />
              Premium Video Sessions
            </h2>

            <p className="text-lg text-blue-200 mb-10">
              Access top industry experts, schedule personalized consultations,
              <br />
              and accelerate your professional growth
            </p>

            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5">
                <p className="text-2xl font-bold text-white mb-1">500+</p>
                <p className="text-sm text-blue-200">Verified Experts</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5">
                <p className="text-2xl font-bold text-white mb-1">10k+</p>
                <p className="text-sm text-blue-200">Sessions Completed</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5">
                <p className="text-2xl font-bold text-white mb-1">98%</p>
                <p className="text-sm text-blue-200">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right section - 30% */}
      <div className="w-[30%] bg-white flex flex-col justify-center px-8 shadow-2xl relative z-10">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-bold text-gray-900">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-gray-600">
              {isLogin
                ? "Sign in to continue your journey"
                : "Join our community of experts and learners"}
            </p>
          </div>

          <button className="w-full flex justify-center items-center px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:border-navy">
            <FcGoogle className="h-5 w-5 mr-3" />
            {isLogin ? "Continue with Google" : "Sign up with Google"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-gray-500">
                or continue with email
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-2.5 text-xs text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy transition-all duration-200"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy transition-all duration-200"
                  placeholder={
                    isLogin ? "Enter your password" : "Create a password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <FiEye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-end">
                <a
                  href="#"
                  className="text-xs font-medium text-navy hover:text-navy/80"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-navy hover:bg-navy/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="text-center">
            <span className="text-xs text-gray-600">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-xs font-medium text-navy hover:text-navy/80 transition-colors duration-200"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>

          <div className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Sessionly, Inc.
          </div>
        </div>
      </div>
    </div>
  );
}
