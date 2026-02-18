"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { HiUser } from "react-icons/hi";
import {
  HiOutlineSparkles,
  HiOutlineLightBulb,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";
import ResponsiveImage from "@/components/shared/ResponsiveImage";

export default function AboutPage() {
  const [aboutData, setAboutData] = useState({
    title: "SAYA.GGH",
    body: "",
    image_url: "",
    image_url_mobile: "",
  });
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [aboutValues, setAboutValues] = useState<
    { title: string; body: string }[]
  >([
    {
      title: "Context First",
      body:
        "We begin with place, climate, and culture to shape architecture that feels inevitable.",
    },
    {
      title: "Quiet Precision",
      body:
        "Details are reduced to what matters most: light, proportion, and material honesty.",
    },
    {
      title: "Inventive Craft",
      body:
        "We prototype ideas fast and refine them until the concept and construction align.",
    },
  ]);
  const [aboutMilestones, setAboutMilestones] = useState<
    { year: string; label: string }[]
  >([
    { year: "2017", label: "Studio founded with a focus on residential design." },
    { year: "2019", label: "First public project completed and featured locally." },
    { year: "2022", label: "Expanded to cross-disciplinary interior collaborations." },
    { year: "2025", label: "Launched design-build partnerships for faster delivery." },
  ]);
  const [aboutCta, setAboutCta] = useState({
    eyebrow: "Start a Project",
    title: "Tell us about your site, budget, and timeline.",
    body: "We respond within 48 hours with a tailored discovery call.",
    button_label: "Start a Project",
    link: "",
  });

  const valueIcons = [HiOutlineGlobeAlt, HiOutlineSparkles, HiOutlineLightBulb];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch About Content
      const { data: about } = await supabase
        .from("page_content")
        .select("*")
        .eq("section", "about_us")
        .maybeSingle();
      if (about) {
        setAboutData({
          title: about.title || "About Us",
          body: about.body || "",
          image_url: about.image_url || "",
          image_url_mobile: about.image_url_mobile || "",
        });
      }

      // Fetch Team
      const { data: teamData } = await supabase
        .from("team")
        .select("*")
        .order("created_at", { ascending: true });
      if (teamData) setTeam(teamData);

      const { data: socials } = await supabase
        .from("page_content")
        .select("body")
        .eq("section", "social_links")
        .maybeSingle();
      if (socials?.body) {
        try {
          const parsed = JSON.parse(socials.body);
          setWhatsappLink(parsed?.whatsapp || "");
        } catch (e) {
          console.error("Error parsing social links:", e);
        }
      }

      const { data: values } = await supabase
        .from("page_content")
        .select("body")
        .eq("section", "about_values")
        .maybeSingle();
      if (values?.body) {
        try {
          const parsed = JSON.parse(values.body);
          if (Array.isArray(parsed)) {
            setAboutValues(
              parsed.map((v: any) => ({
                title: v?.title || "",
                body: v?.body || "",
              })),
            );
          }
        } catch (e) {
          console.error("Error parsing about values:", e);
        }
      }

      const { data: milestones } = await supabase
        .from("page_content")
        .select("body")
        .eq("section", "about_milestones")
        .maybeSingle();
      if (milestones?.body) {
        try {
          const parsed = JSON.parse(milestones.body);
          if (Array.isArray(parsed)) {
            setAboutMilestones(
              parsed.map((m: any) => ({
                year: m?.year || "",
                label: m?.label || "",
              })),
            );
          }
        } catch (e) {
          console.error("Error parsing about milestones:", e);
        }
      }

      const { data: cta } = await supabase
        .from("page_content")
        .select("body")
        .eq("section", "about_cta")
        .maybeSingle();
      if (cta?.body) {
        try {
          const parsed = JSON.parse(cta.body);
          setAboutCta({
            eyebrow: parsed?.eyebrow || "",
            title: parsed?.title || "",
            body: parsed?.body || "",
            button_label: parsed?.button_label || "",
            link: parsed?.link || "",
          });
        } catch (e) {
          console.error("Error parsing about cta:", e);
        }
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  const normalizeUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const whatsappHref = normalizeUrl(whatsappLink);
  const ctaHref = normalizeUrl(aboutCta.link || whatsappLink);

  return (
    <>
      <div className="min-h-screen bg-white pb-32 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          {loading ? (
            <div className="text-center py-20 uppercase tracking-widest font-bold text-gray-400">
              Loading Content...
            </div>
          ) : (
            <>
              {/* Main Content: Image then Text */}
              <div className="space-y-12 mb-24 animate-in fade-in duration-1000">
                {/* Big Main Image */}
                <div className="w-full aspect-[16/7] bg-gray-200 rounded-lg overflow-hidden shadow-sm relative">
                  {aboutData.image_url ? (
                    <ResponsiveImage
                      desktopSrc={aboutData.image_url}
                      mobileSrc={aboutData.image_url_mobile || aboutData.image_url}
                      alt="About Studio"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 uppercase tracking-widest text-sm font-bold">
                      Studio Image Placeholder
                    </div>
                  )}
                </div>

                {/* Description Text */}
                <div className="max-w-4xl mx-auto text-center md:text-left">
                  <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-light whitespace-pre-wrap text-justify">
                    {aboutData.body || "No description provided yet."}
                  </p>
                </div>
              </div>

              {/* VALUES + MILESTONES */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-28">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-10">
                  <h3 className="text-sm font-bold tracking-[0.35em] uppercase text-gray-500 mb-8">
                    Studio Values
                  </h3>
                  <div className="space-y-6">
                    {aboutValues.map((item, idx) => {
                      const Icon = valueIcons[idx % valueIcons.length];
                      return (
                        <div
                          key={`${item.title}-${idx}`}
                          className="flex items-start gap-4"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-black">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed mt-1">
                              {item.body}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10">
                  <h3 className="text-sm font-bold tracking-[0.35em] uppercase text-gray-500 mb-8">
                    Milestones
                  </h3>
                  <div className="space-y-6">
                    {aboutMilestones.map((item, idx) => (
                      <div
                        key={`${item.year}-${idx}`}
                        className="flex items-start gap-6"
                      >
                        <div className="text-xl font-black text-black tracking-tight min-w-[64px]">
                          {item.year}
                        </div>
                        <div className="border-l-2 border-gray-200 pl-6">
                          <p className="text-gray-700 leading-relaxed">
                            {item.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* OUR TEAM Section */}
              <div className="mt-32 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-black uppercase tracking-tighter mb-16 italic decoration-gray-200 underline-offset-8 inline-block">
                  OUR TEAM
                </h2>

                {team.length === 0 ? (
                  <p className="text-gray-400 uppercase text-xs font-bold tracking-widest">
                    No team members added yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {team.map((member, i) => (
                      <div
                        key={member.id}
                        className="group cursor-pointer text-left"
                      >
                        {/* Team Portrait */}
                        <div className="aspect-[4/5] bg-gray-200 rounded-lg overflow-hidden mb-6 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-blue-600/10">
                          {member.image_url ? (
                            <div className="relative w-full h-full">
                              <ResponsiveImage
                                desktopSrc={member.image_url}
                                mobileSrc={
                                  member.image_url_mobile || member.image_url
                                }
                                alt={member.name || "Team member"}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 90vw, 33vw"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <HiUser className="w-24 h-24 text-gray-400 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                          )}
                        </div>
                        {/* Name & Role */}
                        <div className="border-l-2 border-gray-200 group-hover:border-black pl-6 transition-all duration-500">
                          <h3 className="text-xl font-bold text-black uppercase tracking-tighter leading-tight italic">
                            {member.name}
                          </h3>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-2">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-28 mb-10">
                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white px-8 md:px-12 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <p className="text-xs font-bold tracking-[0.35em] uppercase text-gray-500">
                      {aboutCta.eyebrow || "Start a Project"}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-black mt-3">
                      {aboutCta.title ||
                        "Tell us about your site, budget, and timeline."}
                    </h3>
                    <p className="text-gray-600 mt-2 max-w-2xl">
                      {aboutCta.body ||
                        "We respond within 48 hours with a tailored discovery call."}
                    </p>
                  </div>
                  {ctaHref ? (
                    <a
                      href={ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black text-white px-8 py-3 text-xs font-bold tracking-[0.35em] uppercase rounded-sm hover:bg-gray-900 transition-colors"
                    >
                      {aboutCta.button_label || "Start a Project"}
                    </a>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-300 text-white px-8 py-3 text-xs font-bold tracking-[0.35em] uppercase rounded-sm cursor-not-allowed"
                    >
                      {aboutCta.button_label || "Start a Project"}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
