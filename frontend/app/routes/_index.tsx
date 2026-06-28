import { Link } from "react-router";
import { Button } from "../components/ui/Button";

export function meta() {
  return [
    { title: "UCOB - Jual Beli Minyak Jelantah" },
    { name: "description", content: "Ubah minyak jelantah Anda menjadi cuan dan kebaikan bersama UCOB." },
  ];
}

export default function Index() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-32 border-b border-gray-100 flex items-center justify-center min-h-[600px] overflow-hidden">
        {/* Full Width Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/hero.webp" alt="UCOB Hero" className="w-full h-full object-cover" />
          {/* Dim and blur overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]"></div>
        </div>

        {/* Content Overlapping the Background */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mx-auto max-w-3xl text-white">
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl text-white drop-shadow-md">
              Ubah Minyak Jelantah Anda Menjadi <span className="text-primary-400">Cuan & Kebaikan</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 drop-shadow">
              Jangan buang minyak sisa penggorengan Anda! Bergabunglah dengan platform revolusioner kami untuk menyulap limbah dapur menjadi penghasilan tambahan, atau dapatkan pasokan minyak daur ulang berkualitas untuk bisnis Anda. Mudah, praktis, dan menguntungkan!
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Mengapa UCOB Adalah Pilihan Tepat?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-3xl">
                🌱
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">Selamatkan Bumi</h3>
              <p className="text-gray-600 leading-relaxed">
                Jadilah pahlawan lingkungan! Dengan menyetorkan minyak jelantah kepada kami, Anda secara aktif mencegah pencemaran air dan tanah yang mengancam ekosistem.
              </p>
            </div>
            
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-100 text-3xl">
                💰
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">Untung Berlipat</h3>
              <p className="text-gray-600 leading-relaxed">
                Siapa sangka limbah bisa jadi uang? Kami menawarkan harga beli yang sangat kompetitif. Cairkan dana Anda secara instan ke dompet digital tanpa potongan!
              </p>
            </div>
            
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-3xl">
                🚚
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">Jemput di Tempat</h3>
              <p className="text-gray-600 leading-relaxed">
                Rebahan aja, kurir kami yang bekerja! Cukup isi alamat penjemputan, santai di rumah, dan biarkan armada kurir cepat kami mengambil minyak jelantah Anda.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
