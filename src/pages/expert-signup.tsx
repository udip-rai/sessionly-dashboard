import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLink, FiLinkedin } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";
import AuthHero from "../components/auth/AuthHero";

export default function ExpertSignup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    bio: "",
    linkedinUrl: "",
    websiteUrl: "",
    expertiseAreas: [] as string[],
    hourlyRate: "",
    profileImage: null as File | null,
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const expertiseOptions = [
    {
      category: "Programming",
      skills: [
        "Web Development",
        "Mobile Development",
        "Backend Development",
        "Frontend Development",
        "Full Stack Development",
      ],
    },
    {
      category: "Data Science",
      skills: [
        "Machine Learning",
        "Data Analysis",
        "Data Visualization",
        "Big Data",
        "Statistical Analysis",
      ],
    },
    {
      category: "Design",
      skills: [
        "UI/UX Design",
        "Graphic Design",
        "Product Design",
        "Visual Design",
        "Interaction Design",
      ],
    },
    {
      category: "Business",
      skills: [
        "Digital Marketing",
        "Project Management",
        "Business Strategy",
        "Entrepreneurship",
        "Product Management",
      ],
    },
  ];

  const handleExpertiseChange = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.includes(skill)
        ? prev.expertiseAreas.filter((s) => s !== skill)
        : [...prev.expertiseAreas, skill],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) return "Username is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.password) return "Password is required";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";
    if (formData.expertiseAreas.length === 0)
      return "Please select at least one area of expertise";
    if (!formData.hourlyRate) return "Please set your hourly rate";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { confirmPassword, ...signupData } = formData;
      const success = await signup({
        ...signupData,
        userType: "expert" as const,
        profileImage: signupData.profileImage || undefined,
      });

      if (success) {
        navigate("/expert-dashboard");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Form Section - Left */}
      <div className="w-[35%] bg-white flex flex-col shadow-2xl relative z-10 max-h-screen overflow-auto">
        {/* Fixed Header */}
        <div className="px-8 md:px-10 pt-8 sticky top-0 bg-white z-10 pb-6 border-b border-gray-50">
          <div className="w-full max-w-sm mx-auto space-y-1.5 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Expert Account
            </h2>
            <p className="text-sm text-gray-600">
              Join our community of mentors
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 px-8 md:px-10 py-8">
          <div className="w-full max-w-sm mx-auto space-y-6">
            <button className="w-full flex justify-center items-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:border-navy">
              <FcGoogle className="h-5 w-5 mr-3" />
              Continue with Google
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-xs text-gray-500">
                  or continue with email
                </span>
              </div>
            </div>
            <form className="space-y-6 pr-2" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}
              {/* Profile Image */}
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Profile Image
                </label>
                <div className="mt-2 flex items-center space-x-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="h-14 w-14 rounded-full object-cover border-2 border-navy"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiUser className="h-7 w-7 text-gray-400" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-navy file:text-white hover:file:bg-navy/90"
                  />
                </div>
              </div>
              {/* Required Fields */}
              <div className="space-y-4">
                {/* Username field */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <div className="mt-1 relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10 block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                    />
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1 relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                    />
                  </div>
                </div>

                {/* Password fields */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                    />
                  </div>
                </div>
              </div>
              {/* Expert Details */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Expert Details
                </h3>

                {/* Expertise Areas */}
                <div className="space-y-4">
                  <label className="block text-xs font-medium text-gray-700">
                    Areas of Expertise
                  </label>
                  <div className="space-y-3">
                    {expertiseOptions.map((category) => (
                      <div key={category.category}>
                        <h4 className="text-xs font-medium text-gray-600 mb-2">
                          {category.category}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {category.skills.map((skill) => (
                            <label
                              key={skill}
                              className={`relative flex items-center p-2 rounded-lg cursor-pointer text-xs ${
                                formData.expertiseAreas.includes(skill)
                                  ? "bg-navy text-white"
                                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={formData.expertiseAreas.includes(
                                  skill,
                                )}
                                onChange={() => handleExpertiseChange(skill)}
                              />
                              <span>{skill}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hourly Rate */}
                <div className="mt-4">
                  <label
                    htmlFor="hourlyRate"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Hourly Rate ($)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="hourlyRate"
                      id="hourlyRate"
                      min="0"
                      step="0.01"
                      required
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      className="pl-7 block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Optional Details */}
                <details className="mt-4 group">
                  <summary className="text-xs font-medium text-gray-700 cursor-pointer hover:text-navy">
                    Additional Information (Optional)
                  </summary>
                  <div className="mt-4 space-y-4">
                    {/* Phone field */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Phone
                      </label>
                      <div className="mt-1 relative rounded-lg">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10 block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                        />
                      </div>
                    </div>

                    {/* Bio field */}
                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Professional Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        required
                        value={formData.bio}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                        placeholder="Tell us about your expertise and experience..."
                      />
                    </div>

                    {/* Social Links */}
                    <div>
                      <label
                        htmlFor="linkedinUrl"
                        className="block text-xs font-medium text-gray-700"
                      >
                        LinkedIn Profile
                      </label>
                      <div className="mt-1 relative rounded-lg">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLinkedin className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="linkedinUrl"
                          name="linkedinUrl"
                          type="url"
                          required
                          value={formData.linkedinUrl}
                          onChange={handleChange}
                          className="pl-10 block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="websiteUrl"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Personal Website
                      </label>
                      <div className="mt-1 relative rounded-lg">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLink className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="websiteUrl"
                          name="websiteUrl"
                          type="url"
                          value={formData.websiteUrl}
                          onChange={handleChange}
                          className="pl-10 block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                          placeholder="https://your-website.com"
                        />
                      </div>
                    </div>
                  </div>
                </details>
              </div>{" "}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-navy hover:bg-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Creating Account..."
                    : "Create Expert Account"}
                </button>
              </div>
            </form>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-navy hover:text-navy/80"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Right */}
      <div className="w-[65%] h-screen">
        <AuthHero />
      </div>
    </div>
  );
}
