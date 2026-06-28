export function meta() {
  return [{ title: "Tentang UCOB - Masa Depan Hijau" }];
}

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900">Tentang UCOB</h1>
        <p className="mb-8 text-lg text-gray-600 leading-relaxed">
          UCOB (<span className="italic font-medium">Used Cooking Oil Bank</span>) adalah platform inovatif yang berdedikasi penuh untuk memerangi pencemaran lingkungan dengan memfasilitasi proses tata niaga minyak jelantah dari hulu ke hilir.
        </p>
        <div className="rounded-3xl bg-primary-50 p-8 md:p-10 text-left shadow-sm border border-primary-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary-600 text-white p-2 rounded-lg text-xl">🚀</div>
            <h2 className="text-3xl font-extrabold text-primary-900 tracking-tight">Misi Besar Kami</h2>
          </div>
          <p className="mb-5 text-primary-800 leading-relaxed text-lg">
            Kami hadir untuk menciptakan sebuah ekosistem sirkular berkelanjutan di mana <strong>limbah mematikan bertransformasi menjadi nilai ekonomi tinggi</strong>. Dengan menjembatani rumah tangga, pelaku bisnis kuliner, dan pabrik daur ulang, kami menjamin setiap tetes minyak jelantah Anda disalurkan dan diolah secara aman menjadi energi terbarukan (<em>biodiesel</em>) ramah lingkungan.
          </p>
          <p className="text-primary-800 leading-relaxed text-lg font-medium">
            Mari bergandengan tangan dan jadilah agen perubahan bersama kami untuk membangun masa depan bumi yang jauh lebih hijau, bersih, dan sejahtera! 🌱
          </p>
        </div>
      </div>
    </div>
  );
}
