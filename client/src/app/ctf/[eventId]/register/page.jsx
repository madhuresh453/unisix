"use client";

import Link from "next/link";
import { useState } from "react";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  Mail,
  MapPin,
  Shield,
  Users,
  User,
  Zap
} from "lucide-react";
import { events } from "@/utils/constants";

export default function RegisterPage({ params }) {
  const { eventId } = params;
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    notFound();
  }

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    teamName: "",
    country: "",
    discordUsername: "",
    experienceLevel: "",
    teamSize: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const isPast = event.status === "past";
  const isLive = event.status === "live";
  const isUpcoming = event.status === "upcoming";

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.teamName.trim()) newErrors.teamName = "Team name is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.discordUsername.trim()) newErrors.discordUsername = "Discord username is required";
    if (!formData.experienceLevel) newErrors.experienceLevel = "Experience level is required";
    if (!formData.teamSize) newErrors.teamSize = "Team size is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isPast) {
      return; // Don't allow registration for past events
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPast) {
    return (
      <main className="bg-[#050505] text-white min-h-screen">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-20">
          <div className="text-center">
            <Shield className="mx-auto h-16 w-16 text-white/50" />
            <h1 className="mt-6 font-teko text-6xl uppercase tracking-[0.01em] text-white/70">
              Registration Closed
            </h1>
            <p className="mt-4 text-lg text-white/60">
              This event has already ended. Registration is no longer available.
            </p>
            <Link
              href={`/ctf/${event.id}`}
              className="mt-8 inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-[#ff1f45]/70 hover:bg-[#18090d]"
            >
              <ArrowLeft className="h-4 w-4" /> View Event Details
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="bg-[#050505] text-white min-h-screen">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-20">
          <div className="text-center">
            <Check className="mx-auto h-16 w-16 text-[#6dff91]" />
            <h1 className="mt-6 font-teko text-6xl uppercase tracking-[0.01em] text-white">
              Registration Successful
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Welcome to {event.name}! Check your email for confirmation details.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href={`/ctf/${event.id}`}
                className="inline-flex items-center gap-2 rounded-md bg-[#ff1f45] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,0,60,0.45)] transition-all duration-300 hover:bg-[#ff003c]"
              >
                View Event Details
              </Link>
              <Link
                href="/ctf"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-[#ff1f45]/70 hover:bg-[#18090d]"
              >
                Back to CTF
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#050505] text-white">
      {/* Header */}
      <section className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-8">
          <Link
            href={`/ctf/${event.id}`}
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back to {event.name}
          </Link>
          <h1 className="mt-4 font-teko text-4xl uppercase tracking-[0.01em] text-white">
            {isLive ? "Join CTF Now" : "Pre Register"}
          </h1>
          <p className="mt-2 text-white/70">Complete your registration to participate in {event.name}</p>
        </div>
      </section>

      {/* Registration Form */}
      <section className="mx-auto w-full max-w-[800px] px-6 py-14">
        <div className="rounded-2xl border border-white/10 bg-[#080808] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.12em] text-white/70 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border bg-black/50 py-3 pl-10 pr-3 text-white placeholder-white/30 transition-all focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-white/20 focus:border-[#ff1f45] focus:ring-[#ff1f45]"
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.12em] text-white/70 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border bg-black/50 py-3 pl-10 pr-3 text-white placeholder-white/30 transition-all focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-white/20 focus:border-[#ff1f45] focus:ring-[#ff1f45]"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            {/* Team Name */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.12em] text-white/70 mb-2">
                Team Name
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border bg-black/50 py-3 pl-10 pr-3 text-white placeholder-white/30 transition-all focus:outline-none focus:ring-2 ${
                    errors.teamName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-white/20 focus:border-[#ff1f45] focus:ring-[#ff1f45]"
                  }`}
                  placeholder="Enter your team name"
                />
              </div>
              {errors.teamName && <p className="mt-1 text-sm text-red-400">{errors.teamName}</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.12em] text-white/70 mb-2">
                Country
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border bg-black/50 py-3 pl-10 pr-3 text-white placeholder-white/30 transition-all focus:outline-none focus:ring-2 ${
                    errors.country
                      ? "border-red-500 focus:ring-red-500"
                      : "border-white/20 focus:border-[#ff1f45] focus:ring-[#ff1f45]"
                  }`}
                  placeholder="Enter your country"
                />
              </div>
              {errors.country && <p className="mt-1 text-sm text-red-400">{errors.country}</p>}
            </div>

            {/* Discord Username */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.12em] text-white/70 mb-2">
                Discord Username
              </label>
              <input
                type="text"
                name="discordUsername"
                value={formData.discordUsername}
                onChange={handleInputChange}
                className={`w-full rounded-md border bg-black/50 py-3 px-3 text-white placeholder-white/30 transition-all focus:outline-none focus:ring-2 ${
                  errors.discordUsername
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/20 focus:border-[#ff1f45] focus:ring-[#ff1f45]"
                }`}
                placeholder="username#1234"
              />
              {errors.discordUsername && <p className="mt-1 text-sm text-red-400">{errors.discordUsername}</p>}
            </div>

            {/* Experience Level & Team Size */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold uppercase tracking-[0.12em] text-white/70 mb-2">
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border bg-black/50 py-3 px-3 text-white transition-all focus:outline-none focus:ring-2 ${
                    errors.experienceLevel
                      ? "border-red-500 focus:ring-red-500"
                      : "border-white/20 focus:border-[#ff1f45] focus:ring-[#ff1f45]"
                  }`}
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                {errors.experienceLevel && <p className="mt-1 text-sm text-red-400">{errors.experienceLevel}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold uppercase tracking-[0.12em] text-white/70 mb-2">
                  Team Size
                </label>
                <select
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border bg-black/50 py-3 px-3 text-white transition-all focus:outline-none focus:ring-2 ${
                    errors.teamSize
                      ? "border-red-500 focus:ring-red-500"
                      : "border-white/20 focus:border-[#ff1f45] focus:ring-[#ff1f45]"
                  }`}
                >
                  <option value="">Select size</option>
                  <option value="1">1 (Solo)</option>
                  <option value="2">2 Members</option>
                  <option value="3">3 Members</option>
                  <option value="4">4 Members</option>
                </select>
                {errors.teamSize && <p className="mt-1 text-sm text-red-400">{errors.teamSize}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.12em] text-white/70 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full rounded-md border bg-black/50 py-3 px-3 text-white placeholder-white/30 transition-all focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/20 focus:border-[#ff1f45] focus:ring-[#ff1f45]"
                }`}
                placeholder="Create a password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.12em] text-white/70 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full rounded-md border bg-black/50 py-3 px-3 text-white placeholder-white/30 transition-all focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/20 focus:border-[#ff1f45] focus:ring-[#ff1f45]"
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-black/50 text-[#ff1f45] focus:ring-[#ff1f45]"
              />
              <label className="text-sm text-white/70">
                I agree to the{" "}
                <Link href="/terms" className="text-[#ff1f45] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#ff1f45] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.termsAccepted && <p className="mt-1 text-sm text-red-400">{errors.termsAccepted}</p>}

            {/* Submit Error */}
            {errors.submit && <p className="text-sm text-red-400">{errors.submit}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#ff1f45] py-4 text-lg font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,0,60,0.45)] transition-all duration-300 hover:bg-[#ff003c] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  Registering...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5" />
                  {isLive ? "Join CTF Now" : "Pre Register"}
                </span>
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}