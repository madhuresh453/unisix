import { PageShell } from "@/components/ui/PageShell";
import { SponsorsHero } from "@/components/sponsors/SponsorsHero";
import { SponsorStats } from "@/components/sponsors/SponsorStats";
import { SponsorTierCard } from "@/components/sponsors/SponsorTierCard";
import { PartnersSection } from "@/components/sponsors/PartnersSection";
import { BecomeSponsorCTA } from "@/components/sponsors/BecomeSponsorCTA";
import { PartnerBenefits } from "@/components/sponsors/PartnerBenefits";
import { SponsorTestimonials } from "@/components/sponsors/SponsorTestimonials";


const sponsorTiers = [
  {
    title: "Platinum Sponsors",
    detail: "Core enterprise sponsors powering our events.",
    tag: "Platinum",
    accent: {
      border: "border-yellow-400/15",
      text: "text-white",
      tag: "bg-yellow-500/10 text-[#facc15]"
    },
    logos: [
      { name: "THUNDER CIPHER", initials: "TC", subtitle: "Cyber security", bg: "bg-white/5 text-[#facc15]" },
      { name: "SmartED Innovation", initials: "S", subtitle: "Institution", bg: "bg-white/5 text-white" },
      
      
    ]
  },
  {
    title: "Gold Sponsors",
    detail: "Strategic technology partners contributing to the platform.",
    tag: "Gold",
    accent: {
      border: "border-cyber-red/20",
      text: "text-[#facc15]",
      tag: "bg-[#facc15]/10 text-[#facc15]"
    },
    logos: [
      { name: "UNISIX", initials: "U6", subtitle: "Security", bg: "bg-white/5 text-white" },
      { name: "SUS CC", initials: "SUS", subtitle: "Financial Support", bg: "bg-white/5 text-white" },
    ]
  },
  {
    title: "Silver Sponsors",
    detail: "Supporting sponsors from the cybersecurity ecosystem.",
    tag: "Silver",
    accent: {
      border: "border-white/10",
      text: "text-slate-300",
      tag: "bg-white/10 text-slate-300"
    },
    logos: [
      { name: "CYBER HUNTER WARRIOR", initials: "CHW", subtitle: "Cyber security  ", bg: "bg-white/5 text-white" },
      { name: "CYBER LEELAWAT", initials: "CL", subtitle: "Institution Partner", bg: "bg-white/5 text-white" },
      
    ]
  }
];

export default function SponsorsPage() {
  return (
    <PageShell className="grid gap-16 pb-20">
      <SponsorsHero />
      <SponsorStats />

      <section className="grid gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyber-red">OUR SPONSORS</p>
              <span className="block h-0.5 w-16 rounded-full bg-cyber-red" />
            </div>
            <p className="mt-3 max-w-2xl text-base leading-7 text-cyber-muted">A tiered partner roster of top security brands, cloud leaders, and technology innovators.</p>
          </div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyber-red">Showcasing our ecosystem</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {sponsorTiers.map((tier) => (
            <SponsorTierCard key={tier.title} {...tier} />
          ))}
        </div>
      </section>

      <PartnersSection />
      <BecomeSponsorCTA />
      <PartnerBenefits />
      <SponsorTestimonials />
      
    </PageShell>
  );
}
