"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  ChevronDown,
  ChevronUp,
  Clock3,
  Github,
  Globe2,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  MessagesSquare,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageShell } from "@/components/ui/PageShell";

const faqItems = [
  {
    question: "How can I participate in UNI6CTF events?",
    answer:
      "Register for an upcoming event using the form above or join our community channels to receive event announcements and onboarding details.",
  },
  {
    question: "Is participation free?",
    answer:
      "Most UNI6CTF events are free to join. Some premium tournaments may require registration fees for special prizes and infrastructure support.",
  },
  {
    question: "How can I sponsor or partner with UNI6CTF?",
    answer:
      "Reach out directly via our email or Discord. We welcome sponsors, partners, and collaborators for community events and challenge development.",
  },
  {
    question: "Where can I find the CTF writeups?",
    answer:
      "Writeups are available in the writeups section of the site and shared through our community channels after each event.",
  },
  {
    question: "How can I join the UNI6CTF team?",
    answer:
      "If you want to join the team, send us a message describing your skills, experience, and the role you want to support.",
  },
  {
    question: "Do you provide certificates for CTFs?",
    answer:
      "We provide certificates for selected events, winners, and active contributors depending on the competition format.",
  },
];

export default function ContactPage() {
  const [openIndex, setOpenIndex] = useState(null);
const formRef = useRef(null);

const sendEmail = async (e) => {
  e.preventDefault();

  try {
  await emailjs.sendForm(
    "service_5u814gl",
    "template_48tmxyn",
    formRef.current,
    "LEZn4r-c_uTIkgSty"
  );

  alert("✅ Thank you! Your message has been sent successfully.");

  formRef.current.reset();
} catch (error) {
  console.error(error);

  alert("❌ Failed to send message. Please try again.");
}
};

  return (
    <PageShell className="grid gap-14 pb-16">
      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#080808]/95 p-6 shadow-[0_45px_140px_rgba(255,0,60,0.16)] sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,69,0.18),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(255,0,60,0.12),transparent_26%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,0,60,0.06),transparent_25%,rgba(255,0,60,0.08))]" />
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.28em] text-white/50">
              <span>Home</span>
              <span className="text-cyber-red">&gt;</span>
              <span>Contact Us</span>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#ff1f45]/20 bg-[#100205]/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff1f45] shadow-[0_0_24px_rgba(255,0,69,0.15)]">
              CONTACT
            </div>
            <h1 className="mt-8 max-w-3xl font-teko text-[4.2rem] uppercase leading-[0.95] tracking-[-0.05em] text-white sm:text-[4.8rem] lg:text-[5.8rem]">
              LET&apos;S CONNECT
              <span className="block text-[#ff1f45]">WITH UNI6CTF</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
              Have a question, suggestion, or want to collaborate with us?
              We&apos;d love to hear from you. Reach out to us!
            </p>
            <div className="mt-8 h-1 w-28 rounded-full bg-[#ff1f45] shadow-[0_0_28px_rgba(255,0,69,0.35)]" />
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0b0b0d]/95 p-6 shadow-[0_35px_95px_rgba(255,0,60,0.14)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,31,69,0.16),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(255,0,60,0.12),transparent_20%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55),rgba(0,0,0,0.9))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.08),transparent_14%),radial-gradient(circle_at_80%_80%,rgba(255,0,69,0.08),transparent_18%)]" />
            <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-[#080808] sm:h-[450px]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,0,60,0.14),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.05),transparent_12%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_15%,rgba(255,0,69,0.2),transparent_18%),radial-gradient(circle_at_20%_80%,rgba(255,0,60,0.12),transparent_22%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,0,5,0.75),rgba(5,0,5,0.9))]" />
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

              <div className="relative mx-auto mt-8 h-full w-full max-w-[420px] px-6">
                <div className="absolute right-6 top-6 flex flex-col items-end gap-4">
                  <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#090909]/85 px-4 py-3 text-white shadow-[0_0_24px_rgba(255,0,69,0.18)] transition duration-300 hover:border-[#ff1f45]/40 hover:bg-[#13050a]/95">
                    <Mail className="h-5 w-5 text-[#ff1f45]" />
                    <span className="sr-only">Email</span>
                  </div>
                  <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#090909]/85 px-4 py-3 text-white shadow-[0_0_24px_rgba(255,0,69,0.18)] transition duration-300 hover:border-[#ff1f45]/40 hover:bg-[#13050a]/95">
                    <MapPin className="h-5 w-5 text-[#ff1f45]" />
                    <span className="sr-only">Location</span>
                  </div>
                  <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#090909]/85 px-4 py-3 text-white shadow-[0_0_24px_rgba(255,0,69,0.18)] transition duration-300 hover:border-[#ff1f45]/40 hover:bg-[#13050a]/95">
                    <MessageSquare className="h-5 w-5 text-[#ff1f45]" />
                    <span className="sr-only">Chat</span>
                  </div>
                </div>

                <div className="absolute left-6 bottom-10 right-6 rounded-[32px] border border-white/10 bg-[#12050a]/90 p-6 shadow-[0_20px_80px_rgba(255,0,60,0.2)]">
                  <div className="grid gap-4">
                    <div className="rounded-3xl border border-[#ff1f45]/10 bg-[#14050a]/90 p-4">
                      <div className="flex items-center justify-between gap-4 text-white/80">
                        <p className="text-sm uppercase tracking-[0.22em] text-white/60">
                          SECURITY NODE
                        </p>
                        <span className="text-xs uppercase tracking-[0.22em] text-[#ff1f45]">
                          ACTIVE
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm uppercase tracking-[0.2em] text-white/70">
                        <span>TRACE</span>
                        <span>LATENCY</span>
                        <span>SHIELD</span>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d0f]/95 p-5">
                      <div className="h-2 w-full rounded-full bg-[#ff1f45]/10" />
                      <div className="mt-4 h-48 rounded-[28px] bg-gradient-to-br from-[#1f000a] via-[#2b050f] to-[#060506] shadow-[0_20px_80px_rgba(255,0,60,0.16)]" />
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-24 rounded-b-[32px] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.9))]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#080808]/95 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.18)]">
          <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-[#ff1f45]/40 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              <div className="mt-1 h-16 w-1 rounded-full bg-[#ff1f45]" />
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#ff1f45]">
                  SEND US A MESSAGE
                </p>
                <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
                  Send us a message
                </h2>
              </div>
            </div>

            <form
  ref={formRef}
  onSubmit={sendEmail}
  className="mt-10 grid gap-5"
>
  <Input
    placeholder="Name"
    type="text"
    name="user_name"
    required
  />

  <Input
    placeholder="Email"
    type="email"
    name="user_email"
    required
  />

  <select
    name="subject"
    required
    className="focus-ring min-h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition hover:border-white/20 focus:border-cyber-red/70 focus:bg-black/50 focus:shadow-glow"
  >
    <option value="">Select Subject</option>
    <option>General inquiry</option>
    <option>Host a CTF</option>
    <option>Sponsor UNI6CTF</option>
    <option>Submit challenge</option>
  </select>

  <textarea
    name="message"
    required
    className="focus-ring min-h-36 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-cyber-red/70 focus:bg-black/50 focus:shadow-glow leading-6"
    placeholder="Your Message"
  />

  <div className="rounded-[28px] border border-white/10 bg-[#090909]/85 p-5 shadow-[0_20px_70px_rgba(255,0,60,0.08)]">
    <label className="flex items-center gap-4">
      <span className="grid h-5 w-5 place-items-center rounded-sm border border-white/20 bg-[#000]/80 text-white/80 shadow-[0_0_18px_rgba(255,0,69,0.16)]">
        <input
          type="checkbox"
          required
          className="h-3 w-3 accent-[#ff1f45]"
        />
      </span>

      <span className="text-sm uppercase tracking-[0.16em] text-white/80">
        I&apos;m not a robot
      </span>
    </label>

    <p className="mt-4 text-sm text-white/60">
      This demo area is styled like reCAPTCHA for design only.
    </p>
  </div>

  <Button
    type="submit"
    className="mt-3 rounded-[28px] bg-[#ff1f45] px-8 py-4 text-base font-semibold uppercase tracking-[0.18em] shadow-[0_0_32px_rgba(255,0,69,0.35)] transition duration-300 hover:scale-[1.01] hover:bg-[#ff003c] hover:shadow-[0_0_40px_rgba(255,0,69,0.55)]"
  >
    <Send className="h-4 w-4" />
    Send Message
  </Button>
</form>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#080808]/95 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.18)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,31,69,0.12),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(255,0,60,0.08),transparent_25%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8))]" />
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.32em] text-[#ff1f45]">
              CONTACT INFORMATION
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
              Contact information
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
              Reach out through any of these secure channels. We respond quickly
              and keep the community engaged.
            </p>

            <div className="mt-10 space-y-4">
  {[
    {
      icon: Mail,
      label: "Email Us",
      value: "organizers@uni6ctf.online",
      href: "mailto:organizers@uni6ctf.online",
    },
    {
      icon: MessagesSquare,
      label: "Discord Server",
      value: "Join UNI6CTF Discord",
      href: "https://discord.gg/mYWEeGufY",
    },
    {
      icon: Globe2,
      label: "WhatsApp",
      value: "+91 6239015723",
      href: "https://wa.me/916239015723",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "India",
      href: "https://www.google.com/maps/place/Kang+Mai+Rd,+Punjab+144210/@31.66121,75.814731,17z/data=!3m1!4b1!4m6!3m5!1s0x391b041ae9f1f1af:0x628f82d111f58c84!8m2!3d31.6612055!4d75.8173059!16s%2Fg%2F1wtbs8ns?authuser=0&entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D",
    },
    {
      icon: Clock3,
      label: "Response Time",
      value: "We usually respond within 24 hours",
      href: null,
    },
  ].map((item) => {
    const Icon = item.icon;

    const cardContent = (
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 min-w-[48px] items-center justify-center rounded-2xl bg-[#1d0407]/90 text-[#ff1f45] shadow-[0_0_22px_rgba(255,0,69,0.18)]">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.24em] text-white/50">
            {item.label}
          </p>

          <p className="mt-2 break-all text-sm font-semibold text-white transition duration-300 group-hover:text-[#ff4d6d]">
            {item.value}
          </p>
        </div>
      </div>
    );

    if (item.href) {
      return (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-[28px] border border-white/10 bg-[#090909]/85 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:border-[#ff1f45]/40 hover:bg-[#0d0d0f]/95 hover:shadow-[0_22px_70px_rgba(255,0,69,0.18)]"
        >
          {cardContent}
        </a>
      );
    }

    return (
      <div
        key={item.label}
        className="rounded-[28px] border border-white/10 bg-[#090909]/85 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
      >
        {cardContent}
      </div>
    );
  })}
</div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-[#080808]/95 p-8 shadow-[0_35px_100px_rgba(0,0,0,0.18)]">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#ff1f45]">
              CONNECT WITH US
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
              Follow us for the latest updates and announcements.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              Stay connected with UNI6CTF across every social channel and never
              miss a community alert or challenge drop.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[
              { icon: Twitter, label: "Twitter" },
              { icon: Github, label: "GitHub" },
              { icon: Youtube, label: "YouTube" },
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Instagram, label: "Instagram" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href="#"
                  className="group flex items-center justify-center rounded-[28px] border border-white/10 bg-[#0c0c0f]/85 p-5 text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#ff1f45]/30 hover:bg-[#12050d]/95 hover:shadow-[0_22px_70px_rgba(255,0,69,0.18)]"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#14040a]/90 text-[#ff1f45] shadow-[0_0_24px_rgba(255,0,69,0.18)] transition duration-300 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm uppercase tracking-[0.18em] text-white/80">
                      {item.label}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-white/10 bg-[#080808]/95 p-8 shadow-[0_35px_100px_rgba(0,0,0,0.18)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#ff1f45]">
                FREQUENTLY ASKED QUESTIONS
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
                Frequently asked questions
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-4">
            {faqItems.map((item, index) => {
              const open = openIndex === index;
              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-[28px] border border-white/10 bg-[#090909]/95 transition duration-300 hover:border-[#ff1f45]/30"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-white transition"
                  >
                    <span className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                      {item.question}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#121212]/90 text-[#ff1f45] transition duration-300">
                      {open ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-80" : "max-h-0"}`}
                  >
                    <p className="px-6 pb-6 text-sm leading-7 text-white/70">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#080808]/95 p-8 shadow-[0_35px_100px_rgba(0,0,0,0.18)]">
          <div className="absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,rgba(255,0,69,0.15),transparent)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#ff1f45]">
                NEED A QUICK START?
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
                Launch your cyber collaboration faster.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
                Use our secure message form to connect with the team, request
                sponsorship details, or share your challenge concepts.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[28px] border border-white/10 bg-[#090909]/90 p-6 shadow-[0_20px_60px_rgba(255,0,69,0.12)]">
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">
                  Support speed
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  24–48 hour reply
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-[#090909]/90 p-6 shadow-[0_20px_60px_rgba(255,0,69,0.12)]">
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">
                  Trusted network
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  Secure community channels
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-[#080808]/95 p-10 shadow-[0_45px_140px_rgba(255,0,60,0.14)]">
  <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
    <div>
      <p className="text-xs uppercase tracking-[0.32em] text-[#ff1f45]">
        READY TO TALK?
      </p>

      <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.04em] text-white sm:text-5xl">
        Let&apos;s build the next cyber event together.
      </h2>

      <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">
        Contact the UNI6CTF team for collaborations, sponsorships, or
        tailored cybersecurity experiences.
      </p>
    </div>

    <div className="flex flex-wrap gap-4">
      {/* Start Conversation Button */}
      <a
        href="https://wa.me/916239015723"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="rounded-[28px] bg-[#ff1f45] px-8 py-4 text-base font-semibold uppercase tracking-[0.18em] shadow-[0_0_36px_rgba(255,0,69,0.35)] transition duration-300 hover:scale-[1.02] hover:bg-[#ff003c] hover:shadow-[0_0_48px_rgba(255,0,69,0.55)]">
          <Send className="h-4 w-4" />
          <span>Start Conversation</span>
        </Button>
      </a>

      {/* Join Community Button */}
      <a
        href="https://chat.whatsapp.com/GyGwHsJdKHNCb6Bo5VHSgi"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          variant="secondary"
          className="rounded-[28px] px-8 py-4 text-base font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:border-[#ff1f45]/50 hover:bg-[#12050d]/95 hover:text-[#ff4d6d]"
        >
          Join Community
        </Button>
      </a>
    </div>
  </div>
</section>
    </PageShell>
  );
}
