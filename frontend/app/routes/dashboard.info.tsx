import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Info, ShoppingCart, TrendingUp, CreditCard, Truck } from 'lucide-react';

export function meta() {
  return [{ title: 'Informasi Transaksi - UCOB' }];
}

export default function DashboardInfo() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Pusat Informasi Transaksi</h1>
        <p className="mt-2 text-base text-gray-500">Panduan lengkap mengenai tata cara penjualan, pembelian, dan layanan antar-jemput UCOB.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Panduan Pembelian */}
        <Card className="border-t-4 border-t-secondary-500 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-secondary-100 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-secondary-600" />
              </div>
              <CardTitle className="text-xl">Cara Membeli Minyak</CardTitle>
            </div>
            <CardDescription>Langkah-langkah membeli minyak murni dari UCOB</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <ol className="list-decimal list-inside space-y-3">
              <li>
                Pilih menu <strong>Buy Oil</strong> di navigasi samping.
              </li>
              <li>Masukkan jumlah volume (dalam Liter) minyak yang ingin dibeli.</li>
              <li>Pastikan alamat pengiriman Anda sudah benar dan lengkap.</li>
              <li>
                Pilih metode pembayaran: <strong>Cash on Delivery (COD)</strong> atau <strong>QRIS</strong>.
              </li>
              <li>
                Klik tombol <strong>Buat Pesanan</strong>.
              </li>
              <li>Jika menggunakan QRIS, *scan* kode yang muncul untuk menyelesaikan pembayaran. Jika COD, siapkan uang tunai saat kurir tiba.</li>
            </ol>
            <div className="bg-amber-50 p-3 rounded-md mt-4 border border-amber-100 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">Kurir UCOB akan segera memproses pesanan Anda dan mengantarkannya langsung ke lokasi rumah Anda secara gratis ongkir untuk jarak tertentu.</p>
            </div>
          </CardContent>
        </Card>

        {/* Panduan Penjualan */}
        <Card className="border-t-4 border-t-primary-500 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary-100 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle className="text-xl">Cara Menjual Minyak</CardTitle>
            </div>
            <CardDescription>Panduan menukarkan minyak jelantah Anda menjadi uang</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <ol className="list-decimal list-inside space-y-3">
              <li>Kumpulkan minyak jelantah sisa penggorengan di wadah tertutup.</li>
              <li>
                Pilih menu <strong>Sell Oil</strong> di navigasi samping.
              </li>
              <li>
                Pilih metode transaksi: <strong>Drop-off</strong> (Bawa sendiri ke UCOB) atau <strong>Pick-up</strong> (Kurir akan menjemput).
              </li>
              <li>Masukkan estimasi volume minyak jelantah yang Anda miliki.</li>
              <li>Konfirmasi pesanan. Kurir kami akan datang menjemput (jika Pick-up) atau silakan datang ke titik UCOB.</li>
              <li>Admin UCOB akan memverifikasi kualitas/volume minyak Anda dan uang tunai akan langsung dibayarkan di tempat!</li>
            </ol>
            <div className="bg-emerald-50 p-3 rounded-md mt-4 border border-emerald-100 flex items-start gap-2">
              <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-800">Minyak jelantah Anda akan kami daur ulang secara bertanggung jawab untuk menjaga kelestarian lingkungan.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-12 mb-6">Informasi Tambahan</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gray-50 border-transparent">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-base">Metode Pembayaran</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              UCOB mendukung pembayaran instan tanpa hambatan melalui QRIS (e-Wallet seperti GoPay, OVO, Dana) yang diproses langsung oleh sistem Pakasir. Kami juga menyediakan opsi pembayaran tunai di tempat (Cash on Delivery).
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-transparent">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-base">Layanan Kurir</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Layanan kurir UCOB beroperasi mulai pukul 08:00 hingga 17:00 setiap harinya. Pastikan alamat lengkap (beserta rincian patokan jalan) sudah terisi di menu Profil Anda agar kurir dapat menemukan lokasi dengan cepat.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
