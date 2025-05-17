import { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80', // Professional meeting
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80',  // Modern office
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80'     // Video call
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLogin ? 'Login attempt with:' : 'Signup attempt with:', { email, password });
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
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ))}
        
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/85 to-navy/80" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 inline-block">
              <div className="flex items-center justify-center space-x-3 mb-12">
                <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-lg flex items-center justify-center">
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-400 to-blue-600"></div>
                </div>
                <h1 className="text-5xl font-kavoon text-white tracking-wide">Sessionly</h1>
              </div>
            </div>

            <h2 className="text-5xl font-bold text-white mb-8 leading-tight tracking-wide">
              Connect With Expert Mentors
              <br />Through Premium Video Sessions
            </h2>
            
            <p className="text-xl text-blue-200 mb-12 leading-relaxed">
              Access top industry experts, schedule personalized consultations,
              <br />and accelerate your professional growth
            </p>

            <div className="grid grid-cols-3 gap-8 mb-16">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-white mb-2">500+</p>
                <p className="text-blue-200">Verified Experts</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-white mb-2">10k+</p>
                <p className="text-blue-200">Sessions Completed</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-white mb-2">98%</p>
                <p className="text-blue-200">Satisfaction Rate</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto">
              <blockquote className="text-xl italic text-white mb-4">
                "Sessionly has transformed how I connect with industry experts. The platform is intuitive and the expertise is exceptional."
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/20"></div>
                <div className="text-left">
                  <p className="text-white font-medium">Sarah Chen</p>
                  <p className="text-blue-200">Software Engineer at Google</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right section - 30% */}
      <div className="w-[30%] bg-white flex flex-col justify-center px-12 shadow-2xl relative z-10">
        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? 'Sign in to continue your journey' 
                : 'Join our community of experts and learners'}
            </p>
          </div>
          
          <button className="w-full flex justify-center items-center px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:border-navy">
            <FcGoogle className="h-6 w-6 mr-3" />
            {isLogin ? 'Continue with Google' : 'Sign up with Google'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-base">
              <span className="px-3 bg-white text-gray-500">
                or continue with email
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy transition-all duration-200"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                  className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy transition-all duration-200"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-end">
                <a href="#" className="text-sm font-medium text-navy hover:text-navy/80 transition-colors duration-200">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-navy hover:bg-navy/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transform hover:-translate-y-0.5"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-medium text-navy hover:text-navy/80 transition-colors duration-200"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Sessionly, Inc.
          </div>
        </div>
      </div>
    </div>
  );
}