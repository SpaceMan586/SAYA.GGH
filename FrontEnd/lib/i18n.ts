export type Language = "en" | "id";

export const DEFAULT_LANGUAGE: Language = "en";
export const LANGUAGE_STORAGE_KEY = "saya_ggh_language";

export const isLanguage = (value: unknown): value is Language =>
  value === "en" || value === "id";

export type TranslationKey =
  | "nav.home"
  | "nav.about"
  | "nav.project"
  | "nav.news"
  | "nav.menu"
  | "nav.close"
  | "nav.toggleMenu"
  | "bottom.chatUs"
  | "bottom.adminLogin"
  | "home.slideshowUnavailable"
  | "home.slidesPrepared"
  | "home.slidesPreparedBody"
  | "home.browseProjects"
  | "home.somethingWrong"
  | "home.couldNotLoad"
  | "home.couldNotLoadBody"
  | "home.retry"
  | "project.selectedWorks"
  | "project.residentialWorks"
  | "project.publicWorks"
  | "project.allDetails"
  | "project.selected"
  | "project.residential"
  | "project.public"
  | "project.details"
  | "project.all"
  | "project.type"
  | "project.eyebrow"
  | "project.intro"
  | "project.undisclosed"
  | "project.loading"
  | "project.notFoundCategory"
  | "project.loadingDetail"
  | "project.notFound"
  | "project.gallery"
  | "project.status"
  | "project.location"
  | "project.year"
  | "project.category"
  | "project.noNarrative"
  | "project.noImages"
  | "about.defaultTitle"
  | "about.loading"
  | "about.imageAlt"
  | "about.imagePlaceholder"
  | "about.noDescription"
  | "about.values"
  | "about.milestones"
  | "about.team"
  | "about.noTeam"
  | "about.ctaEyebrow"
  | "about.ctaTitle"
  | "about.ctaBody"
  | "about.ctaButton"
  | "about.valueContextTitle"
  | "about.valueContextBody"
  | "about.valuePrecisionTitle"
  | "about.valuePrecisionBody"
  | "about.valueCraftTitle"
  | "about.valueCraftBody"
  | "about.milestone2017"
  | "about.milestone2019"
  | "about.milestone2022"
  | "about.milestone2025"
  | "news.title"
  | "news.subtitle"
  | "news.empty"
  | "news.dateUnavailable"
  | "news.noImage"
  | "news.imageAlt"
  | "news.articleNotFound"
  | "news.backToNews"
  | "news.backToJournal"
  | "news.gallery"
  | "chat.intro"
  | "chat.closed"
  | "chat.error"
  | "chat.aiAssistant"
  | "chat.adminSupport"
  | "chat.online"
  | "chat.placeholder"
  | "chat.tooMany"
  | "chat.invalidSession"
  | "chat.sessionNotFound"
  | "chat.saveFailed"
  | "chat.defaultReply"
  | "chat.systemError";

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    "nav.home": "HOME",
    "nav.about": "ABOUT",
    "nav.project": "PROJECT",
    "nav.news": "NEWS",
    "nav.menu": "MENU",
    "nav.close": "CLOSE",
    "nav.toggleMenu": "Toggle menu",
    "bottom.chatUs": "CHAT US",
    "bottom.adminLogin": "Admin Login",
    "home.slideshowUnavailable": "Slideshow unavailable",
    "home.slidesPrepared": "Homepage slides are being prepared",
    "home.slidesPreparedBody":
      "The homepage slideshow isn't configured yet. Check back soon or browse our projects directly.",
    "home.browseProjects": "Browse Projects",
    "home.somethingWrong": "Something went wrong",
    "home.couldNotLoad": "We couldn't load the slideshow",
    "home.couldNotLoadBody":
      "Please refresh the page. If the issue persists, browse projects directly.",
    "home.retry": "Retry",
    "project.selectedWorks": "Selected Works",
    "project.residentialWorks": "Residential Works",
    "project.publicWorks": "Public Works",
    "project.allDetails": "All Details",
    "project.selected": "Selected",
    "project.residential": "Residential",
    "project.public": "Public",
    "project.details": "Details",
    "project.all": "All",
    "project.type": "Type",
    "project.eyebrow": "Architecture & Interior Design",
    "project.intro":
      "Browse our studio work by category or dive into details for a closer look at materials, light, and craft.",
    "project.undisclosed": "Undisclosed",
    "project.loading": "Loading projects...",
    "project.notFoundCategory": "No projects found for this category.",
    "project.loadingDetail": "Loading project details...",
    "project.notFound": "Project not found.",
    "project.gallery": "Gallery",
    "project.status": "Status",
    "project.location": "Location",
    "project.year": "Year",
    "project.category": "Category",
    "project.noNarrative": "No narrative available for this selected work.",
    "project.noImages": "NO IMAGES AVAILABLE",
    "about.defaultTitle": "About Us",
    "about.loading": "Loading Content...",
    "about.imageAlt": "About Studio",
    "about.imagePlaceholder": "Studio Image Placeholder",
    "about.noDescription": "No description provided yet.",
    "about.values": "Studio Values",
    "about.milestones": "Milestones",
    "about.team": "OUR TEAM",
    "about.noTeam": "No team members added yet.",
    "about.ctaEyebrow": "Start a Project",
    "about.ctaTitle": "Tell us about your site, budget, and timeline.",
    "about.ctaBody": "We respond within 48 hours with a tailored discovery call.",
    "about.ctaButton": "Start a Project",
    "about.valueContextTitle": "Context First",
    "about.valueContextBody":
      "We begin with place, climate, and culture to shape architecture that feels inevitable.",
    "about.valuePrecisionTitle": "Quiet Precision",
    "about.valuePrecisionBody":
      "Details are reduced to what matters most: light, proportion, and material honesty.",
    "about.valueCraftTitle": "Inventive Craft",
    "about.valueCraftBody":
      "We prototype ideas fast and refine them until the concept and construction align.",
    "about.milestone2017": "Studio founded with a focus on residential design.",
    "about.milestone2019": "First public project completed and featured locally.",
    "about.milestone2022":
      "Expanded to cross-disciplinary interior collaborations.",
    "about.milestone2025":
      "Launched design-build partnerships for faster delivery.",
    "news.title": "Journal & Updates",
    "news.subtitle": "Insights from our studio",
    "news.empty": "No updates published yet.",
    "news.dateUnavailable": "Date not available",
    "news.noImage": "No Image",
    "news.imageAlt": "News image",
    "news.articleNotFound": "Article Not Found",
    "news.backToNews": "Back to News",
    "news.backToJournal": "Back to Journal",
    "news.gallery": "Gallery",
    "chat.intro": "Hello! Welcome to SAYA.GGH. How can I help you?",
    "chat.closed":
      "--- This chat session has been ended by admin. Thank you for contacting SAYA.GGH. ---",
    "chat.error":
      "There was a problem processing your message. Please try again shortly.",
    "chat.aiAssistant": "AI Assistant",
    "chat.adminSupport": "Admin Support",
    "chat.online": "Online",
    "chat.placeholder": "Write a message...",
    "chat.tooMany": "Too many requests. Please try again shortly.",
    "chat.invalidSession": "Invalid chat session. Please restart the chat.",
    "chat.sessionNotFound": "Chat session not found. Please restart the chat.",
    "chat.saveFailed": "Failed to save your message. Please try again.",
    "chat.defaultReply":
      "Sorry, I haven't been trained on that yet. Please ask about our location, pricing, or services, or contact us via WhatsApp for details.",
    "chat.systemError": "A system error occurred.",
  },
  id: {
    "nav.home": "BERANDA",
    "nav.about": "TENTANG",
    "nav.project": "PROYEK",
    "nav.news": "BERITA",
    "nav.menu": "MENU",
    "nav.close": "TUTUP",
    "nav.toggleMenu": "Buka/tutup menu",
    "bottom.chatUs": "CHAT KAMI",
    "bottom.adminLogin": "Login Admin",
    "home.slideshowUnavailable": "Slideshow belum tersedia",
    "home.slidesPrepared": "Slide beranda sedang disiapkan",
    "home.slidesPreparedBody":
      "Slideshow beranda belum dikonfigurasi. Silakan kembali lagi nanti atau lihat proyek kami.",
    "home.browseProjects": "Lihat Proyek",
    "home.somethingWrong": "Terjadi kesalahan",
    "home.couldNotLoad": "Slideshow tidak dapat dimuat",
    "home.couldNotLoadBody":
      "Silakan refresh halaman. Jika masih bermasalah, lihat proyek kami secara langsung.",
    "home.retry": "Coba Lagi",
    "project.selectedWorks": "Karya Pilihan",
    "project.residentialWorks": "Karya Residensial",
    "project.publicWorks": "Karya Publik",
    "project.allDetails": "Semua Detail",
    "project.selected": "Pilihan",
    "project.residential": "Residensial",
    "project.public": "Publik",
    "project.details": "Detail",
    "project.all": "Semua",
    "project.type": "Tipe",
    "project.eyebrow": "Arsitektur & Desain Interior",
    "project.intro":
      "Jelajahi karya studio berdasarkan kategori atau lihat detail material, cahaya, dan pengerjaan lebih dekat.",
    "project.undisclosed": "Tidak disebutkan",
    "project.loading": "Memuat proyek...",
    "project.notFoundCategory": "Tidak ada proyek untuk kategori ini.",
    "project.loadingDetail": "Memuat detail proyek...",
    "project.notFound": "Proyek tidak ditemukan.",
    "project.gallery": "Galeri",
    "project.status": "Status",
    "project.location": "Lokasi",
    "project.year": "Tahun",
    "project.category": "Kategori",
    "project.noNarrative": "Narasi untuk karya ini belum tersedia.",
    "project.noImages": "BELUM ADA GAMBAR",
    "about.defaultTitle": "Tentang Kami",
    "about.loading": "Memuat Konten...",
    "about.imageAlt": "Tentang Studio",
    "about.imagePlaceholder": "Placeholder Gambar Studio",
    "about.noDescription": "Deskripsi belum tersedia.",
    "about.values": "Nilai Studio",
    "about.milestones": "Perjalanan",
    "about.team": "TIM KAMI",
    "about.noTeam": "Anggota tim belum ditambahkan.",
    "about.ctaEyebrow": "Mulai Proyek",
    "about.ctaTitle": "Ceritakan lokasi, anggaran, dan timeline Anda.",
    "about.ctaBody":
      "Kami merespons dalam 48 jam dengan sesi discovery yang disesuaikan.",
    "about.ctaButton": "Mulai Proyek",
    "about.valueContextTitle": "Konteks Lebih Dulu",
    "about.valueContextBody":
      "Kami memulai dari tempat, iklim, dan budaya untuk membentuk arsitektur yang terasa tepat.",
    "about.valuePrecisionTitle": "Presisi yang Tenang",
    "about.valuePrecisionBody":
      "Detail kami reduksi ke hal yang paling penting: cahaya, proporsi, dan kejujuran material.",
    "about.valueCraftTitle": "Kriya yang Inventif",
    "about.valueCraftBody":
      "Kami memprototipe ide dengan cepat lalu menyempurnakannya hingga konsep dan konstruksi selaras.",
    "about.milestone2017":
      "Studio didirikan dengan fokus pada desain hunian.",
    "about.milestone2019":
      "Proyek publik pertama selesai dan mendapat sorotan lokal.",
    "about.milestone2022":
      "Berkembang ke kolaborasi interior lintas disiplin.",
    "about.milestone2025":
      "Meluncurkan kemitraan design-build untuk proses yang lebih cepat.",
    "news.title": "Jurnal & Kabar",
    "news.subtitle": "Catatan dari studio kami",
    "news.empty": "Belum ada kabar yang dipublikasikan.",
    "news.dateUnavailable": "Tanggal belum tersedia",
    "news.noImage": "Tanpa Gambar",
    "news.imageAlt": "Gambar berita",
    "news.articleNotFound": "Artikel Tidak Ditemukan",
    "news.backToNews": "Kembali ke Berita",
    "news.backToJournal": "Kembali ke Jurnal",
    "news.gallery": "Galeri",
    "chat.intro": "Halo! Selamat datang di SAYA.GGH. Ada yang bisa saya bantu?",
    "chat.closed":
      "--- Sesi chat telah diakhiri oleh admin. Terima kasih telah menghubungi SAYA.GGH. ---",
    "chat.error":
      "Terjadi kendala saat memproses pesan. Coba lagi dalam beberapa saat.",
    "chat.aiAssistant": "Asisten AI",
    "chat.adminSupport": "Bantuan Admin",
    "chat.online": "Online",
    "chat.placeholder": "Tulis pesan...",
    "chat.tooMany": "Terlalu banyak permintaan. Coba lagi sebentar.",
    "chat.invalidSession": "Sesi chat tidak valid. Silakan mulai ulang chat.",
    "chat.sessionNotFound":
      "Sesi chat tidak ditemukan. Silakan mulai ulang chat.",
    "chat.saveFailed": "Gagal menyimpan pesan. Coba lagi.",
    "chat.defaultReply":
      "Maaf, saya belum diajari tentang hal itu. Silakan tanya tentang Lokasi, Harga, atau Layanan kami, atau hubungi via WhatsApp untuk detailnya.",
    "chat.systemError": "Terjadi kesalahan sistem.",
  },
};

export const getTranslation = (language: Language, key: TranslationKey) =>
  translations[language][key];

export const localizeContent = (
  value: unknown,
  language: Language,
  fallbackLanguage: Language = DEFAULT_LANGUAGE,
): string => {
  if (value == null) return "";

  if (typeof value === "object" && !Array.isArray(value)) {
    const record = value as Partial<Record<Language, unknown>>;
    const localized = record[language] ?? record[fallbackLanguage];
    return typeof localized === "string" ? localized : "";
  }

  if (typeof value !== "string") return String(value);

  const trimmed = value.trim();
  if (!trimmed.startsWith("{")) return value;

  try {
    const parsed = JSON.parse(trimmed) as Partial<Record<Language, unknown>>;
    const localized = parsed[language] ?? parsed[fallbackLanguage];
    return typeof localized === "string" ? localized : value;
  } catch {
    return value;
  }
};
