"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FaTrash, FaPlus, FaRobot, FaLightbulb } from "react-icons/fa";

export default function TrainingTab() {
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKnowledge, setNewKnowledge] = useState({ topic: "", content: "" });

  // Fetch Knowledge
  const fetchKnowledge = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ai_knowledge")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setKnowledgeList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  // Add Knowledge
  const handleAdd = async () => {
    if (!newKnowledge.topic || !newKnowledge.content)
      return alert("Mohon isi topik dan konten.");

    const { error } = await supabase
      .from("ai_knowledge")
      .insert([newKnowledge]);

    if (error) {
      alert("Gagal menyimpan: " + error.message);
      console.error(error);
    } else {
      setNewKnowledge({ topic: "", content: "" });
      fetchKnowledge();
    }
  };

  // Delete Knowledge
  const handleDelete = async (id: number) => {
    if (!confirm("Hapus pengetahuan ini?")) return;
    await supabase.from("ai_knowledge").delete().eq("id", id);
    fetchKnowledge();
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            AI Training Center
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Ajari AI Anda fakta-fakta tentang studio, harga, atau proyek
            spesifik.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <FaRobot /> {knowledgeList.length} Fakta Tersimpan
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INPUT FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FaPlus className="text-green-500" /> Tambah Pengetahuan
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Topik / Judul
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Harga Desain, Lokasi, Visi Misi"
                  className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
                  value={newKnowledge.topic}
                  onChange={(e) =>
                    setNewKnowledge({ ...newKnowledge, topic: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Isi Pengetahuan (Fakta)
                </label>
                <textarea
                  rows={6}
                  placeholder="Contoh: Harga desain kami mulai dari Rp 150.000/m2. Kami mengutamakan gaya tropis modern..."
                  className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
                  value={newKnowledge.content}
                  onChange={(e) =>
                    setNewKnowledge({
                      ...newKnowledge,
                      content: e.target.value,
                    })
                  }
                />
              </div>

              <button
                onClick={handleAdd}
                className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-all active:scale-95"
              >
                Simpan ke Memori AI
              </button>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <p className="text-gray-400 text-center py-10">Memuat memori...</p>
          ) : knowledgeList.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <FaLightbulb className="mx-auto text-4xl text-gray-300 mb-2" />
              <p className="text-gray-500 font-medium">
                Belum ada pengetahuan.
              </p>
              <p className="text-xs text-gray-400">
                Mulailah dengan menambahkan info dasar studio.
              </p>
            </div>
          ) : (
            knowledgeList.map((item) => (
              <div
                key={item.id}
                className="group bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-all flex justify-between items-start gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                      {item.topic}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                  title="Hapus Pengetahuan"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
