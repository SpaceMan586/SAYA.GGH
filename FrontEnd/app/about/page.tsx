"use client";

import LandingBottomBar from "../components/LandingBottomBar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { HiUser } from "react-icons/hi";

export default function AboutPage() {
  const [aboutData, setAboutData] = useState({ 
    title: "SAYA.GGH", 
    body: "",
    image_url: "" 
  });
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch About Content
      const { data: about } = await supabase.from('page_content').select('*').eq('section', 'about_us').maybeSingle();
      if (about) {
        setAboutData({
          title: about.title || "About Us",
          body: about.body || "",
          image_url: about.image_url || ""
        });
      }

      // Fetch Team
      const { data: teamData } = await supabase.from('team').select('*').order('created_at', { ascending: true });
      if (teamData) setTeam(teamData);
      
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <main className="min-h-screen bg-white dark:bg-gray-900 dark:text-white pt-32 pb-32 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          
          {loading ? (
            <div className="text-center py-20 uppercase tracking-widest font-bold text-gray-400">Loading Content...</div>
          ) : (
            <>
              {/* Main Content: Image then Text */}
              <div className="space-y-12 mb-24 animate-in fade-in duration-1000">
                {/* Big Main Image */}
                <div className="w-full aspect-[16/7] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                  {aboutData.image_url ? (
                    <img src={aboutData.image_url} alt="About Studio" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 uppercase tracking-widest text-sm font-bold">
                      Studio Image Placeholder
                    </div>
                  )}
                </div>

                {/* Description Text */}
                <div className="max-w-4xl mx-auto text-center md:text-left">
                  <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed font-light whitespace-pre-wrap text-justify">
                    {aboutData.body || "No description provided yet."}
                  </p>
                </div>
              </div>

              {/* OUR TEAM Section */}
              <div className="mt-32 text-center">
                <h2 className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter mb-16 italic decoration-gray-200 underline-offset-8 inline-block">
                  OUR TEAM
                </h2>

                {team.length === 0 ? (
                  <p className="text-gray-400 uppercase text-xs font-bold tracking-widest">No team members added yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {team.map((member, i) => (
                      <div key={member.id} className="group cursor-pointer text-left">
                        {/* Team Portrait */}
                        <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden mb-6 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-blue-600/10">
                          {member.image_url ? (
                            <img src={member.image_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <HiUser className="w-24 h-24 text-gray-400 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                          )}
                        </div>
                        {/* Name & Role */}
                        <div className="border-l-2 border-gray-200 group-hover:border-blue-600 pl-6 transition-all duration-500">
                          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight italic">
                            {member.name}
                          </h3>
                          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mt-2">
                            {member.role}
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
      </main>
      <LandingBottomBar />
    </>
  );
}