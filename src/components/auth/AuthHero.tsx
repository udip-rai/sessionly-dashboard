import { useState, useEffect } from "react";

export default function AuthHero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <div className="h-screen relative overflow-hidden">
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
        <div className="max-w-3xl mx-auto text-center w-full">
          <div className="mb-12">
            <div className="flex items-center justify-center mb-20 relative">
              <div className="relative w-96 h-20 transform hover:scale-105 transition-transform duration-300">
                {/* Skewed background elements with improved colors and effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-600/30 backdrop-blur-sm transform -skew-x-12 -translate-x-4 rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-white/40 to-white/20 backdrop-blur-sm transform skew-x-12 translate-x-4 rounded-lg"></div>
                {/* Main logo container with enhanced glass effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-md rounded-lg shadow-xl border border-white/20">
                  <img
                    src="/src/assets/images/sessionly-logo.png"
                    alt="Sessionly"
                    className="w-full h-full object-cover p-3"
                  />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Connect With Expert Mentors Through
            <br />
            Premium Video Sessions
          </h2>

          <p className="text-xl text-blue-200 mb-10">
            Access top industry experts, schedule personalized consultations,
            <br />
            and accelerate your professional growth
          </p>

          <div className="grid grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <p className="text-3xl font-bold text-white mb-2">500+</p>
              <p className="text-sm text-blue-200">Verified Experts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <p className="text-3xl font-bold text-white mb-2">10k+</p>
              <p className="text-sm text-blue-200">Sessions Completed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <p className="text-3xl font-bold text-white mb-2">98%</p>
              <p className="text-sm text-blue-200">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
