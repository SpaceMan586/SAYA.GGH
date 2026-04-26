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
import { useLanguage } from "@/components/shared/LanguageProvider";
import { localizeContent } from "@/lib/i18n";

export default function AboutPage() {
  const { language, t } = useLanguage();
  const [aboutData, setAboutData] = useState({
    title: "SAYA.GGH",
    body: "",
    image_url: "",
    image_url_mobile: "",
  });
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aboutValues, setAboutValues] = useState<
    { title: string; body: string }[]
  >([]);
  const [aboutMilestones, setAboutMilestones] = useState<
    { year: string; label: string }[]
  >([]);

  const valueIcons = [HiOutlineGlobeAlt, HiOutlineSparkles, HiOutlineLightBulb];
  const fallbackValues = [
    {
      title: t("about.valueContextTitle"),
      body: t("about.valueContextBody"),
    },
    {
      title: t("about.valuePrecisionTitle"),
      body: t("about.valuePrecisionBody"),
    },
    {
      title: t("about.valueCraftTitle"),
      body: t("about.valueCraftBody"),
    },
  ];
  const fallbackMilestones = [
    { year: "2017", label: t("about.milestone2017") },
    { year: "2019", label: t("about.milestone2019") },
    { year: "2022", label: t("about.milestone2022") },
    { year: "2025", label: t("about.milestone2025") },
  ];
  const displayValues = aboutValues.length > 0 ? aboutValues : fallbackValues;
  const displayMilestones =
    aboutMilestones.length > 0 ? aboutMilestones : fallbackMilestones;

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
          title: about.title || "",
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

      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white pb-32 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          {loading ? (
            <div className="text-center py-20 uppercase tracking-widest font-bold text-gray-400">
              {t("about.loading")}
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
                      alt={t("about.imageAlt")}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 uppercase tracking-widest text-sm font-bold">
                      {t("about.imagePlaceholder")}
                    </div>
                  )}
                </div>

                {/* Description Text */}
                <div className="max-w-4xl mx-auto text-center md:text-left">
                  <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-light whitespace-pre-wrap text-justify">
                    {localizeContent(aboutData.body, language) ||
                      t("about.noDescription")}
                  </p>
                </div>
              </div>

              {/* VALUES + MILESTONES */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-28">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-10">
                  <h3 className="text-sm font-bold tracking-[0.35em] uppercase text-gray-500 mb-8">
                    {t("about.values")}
                  </h3>
                  <div className="space-y-6">
                    {displayValues.map((item, idx) => {
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
                              {localizeContent(item.title, language)}
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed mt-1">
                              {localizeContent(item.body, language)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10">
                  <h3 className="text-sm font-bold tracking-[0.35em] uppercase text-gray-500 mb-8">
                    {t("about.milestones")}
                  </h3>
                  <div className="space-y-6">
                    {displayMilestones.map((item, idx) => (
                      <div
                        key={`${item.year}-${idx}`}
                        className="flex items-start gap-6"
                      >
                        <div className="text-xl font-black text-black tracking-tight min-w-[64px]">
                          {item.year}
                        </div>
                        <div className="border-l-2 border-gray-200 pl-6">
                          <p className="text-gray-700 leading-relaxed">
                            {localizeContent(item.label, language)}
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
                  {t("about.team")}
                </h2>

                {team.length === 0 ? (
                  <p className="text-gray-400 uppercase text-xs font-bold tracking-widest">
                    {t("about.noTeam")}
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
                            {localizeContent(member.name, language)}
                          </h3>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-2">
                            {localizeContent(member.role, language)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
