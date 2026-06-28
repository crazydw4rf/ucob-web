import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { Input } from "../components/ui/Input";
import Skeleton from 'react-loading-skeleton';
import { Select } from '../components/ui/Select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { UploadCloud } from 'lucide-react';
import { getOilPrice, getAddress, createTransaction, getUploadUrl, STORAGE_URL, getMe } from '../lib/api';

export function meta() {
  return [{ title: 'Sell Oil - UCOB' }];
}

export default function SellOil() {
  const navigate = useNavigate();
  const [volume, setVolume] = useState<string>('5');
  const [pricePerLiter, setPricePerLiter] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Success Modal State
  const [transactionSuccess, setTransactionSuccess] = useState<{
    volume: number;
    total: number;
    address: string;
    paymentMethod: string;
    saleImageUrl: string | null;
  } | null>(null);

  // Address defaults
  const [defaultDetails, setDefaultDetails] = useState('');
  const [districts, setDistricts] = useState<{code: string, name: string}[]>([]);
  const [villages, setVillages] = useState<{code: string, name: string}[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedVillage, setSelectedVillage] = useState<string>("");

  const total = Number(volume || 0) * pricePerLiter;

  useEffect(() => {
    async function fetchData() {
      try {
        const [priceRes, addressRes] = await Promise.allSettled([getOilPrice('Buy'), getAddress()]);
        if (priceRes.status === 'fulfilled') setPricePerLiter(priceRes.value.data.price_per_liter);
        if (addressRes.status === 'fulfilled') {
          const addr = addressRes.value.data;
          setDefaultDetails(addr.details ?? '');
          setSelectedDistrict(addr.district ?? '');
          setSelectedVillage(addr.village ?? '');
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    fetch('/api/wilayah?type=districts')
      .then(res => res.json())
      .then(res => setDistricts(res.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const districtObj = districts.find(d => d.name === selectedDistrict);
    if (districtObj) {
      fetch(`/api/wilayah?type=villages&code=${districtObj.code}`)
        .then(res => res.json())
        .then(res => setVillages(res.data || []))
        .catch(console.error);
    } else {
      setVillages([]);
    }
  }, [selectedDistrict, districts]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    let saleImageUrl: string | null = null;

    try {
      // Upload image if provided
      if (imageFile) {
        const uploadRes = await getUploadUrl(imageFile.type);
        const { upload_url, public_url_path } = uploadRes.data;

        // Upload the file to the presigned URL
        await fetch(upload_url, {
          method: 'PUT',
          headers: { 'Content-Type': imageFile.type },
          body: imageFile,
        });

        saleImageUrl = `${STORAGE_URL}${public_url_path}`;
      }

      const res = await createTransaction({
        oil_volume: Number(formData.get('oil_volume')),
        transaction_type: 'Sale',
        payment_method: formData.get('payment_method') as 'Qris' | 'Cod',
        address_district: formData.get('address_district') as string,
        address_village: formData.get('address_village') as string,
        address_details: formData.get('address_details') as string,
        sale_image_url: saleImageUrl,
      });

      getMe().then(meRes => {
        fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: meRes.data.email,
            eventType: 'created',
            transactionId: res.data.id,
            details: `Jual Minyak Bekas: ${formData.get('oil_volume')} Liter`
          })
        }).catch(console.error);
      }).catch(console.error);

      setTransactionSuccess({
        volume: Number(formData.get('oil_volume')),
        total: Number(formData.get('oil_volume')) * pricePerLiter,
        address: `${formData.get('address_details')}, Kel. ${formData.get('address_village')}, Kec. ${formData.get('address_district')}`,
        paymentMethod: formData.get('payment_method') === 'Qris' ? 'QRIS Transfer' : 'Cash on Delivery (COD)',
        saleImageUrl: saleImageUrl
      });
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to create transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Skeleton height={32} width={250} />
          <Skeleton width={380} />
        </div>
        <Card>
          <CardHeader>
            <Skeleton height={24} width={160} className="mb-2" />
            <Skeleton width={250} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 border-b border-gray-100 pb-6">
              <Skeleton width={120} height={20} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton height={40} />
                <Skeleton height={40} />
              </div>
              <Skeleton height={56} style={{ borderRadius: '0.5rem' }} />
            </div>
            <div className="space-y-4">
              <Skeleton width={120} height={20} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton height={40} />
                <Skeleton height={40} />
              </div>
              <Skeleton height={96} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Jual Minyak Bekas Anda</h1>
        <p className="text-sm text-gray-500">Jual minyak bekas anda dan dapatkan cuan dari sini.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Form Penjualan</CardTitle>
            <CardDescription>Harga Minyak Bekas saat ini : Rp {pricePerLiter.toLocaleString('id-ID')}/L</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}

            <div className="space-y-4 border-b border-gray-100 pb-6">
              <h3 className="text-sm font-semibold text-gray-900">Detail penjualan</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Volume (Liters)" type="number" min="0.1" step="0.1" name="oil_volume" value={volume} onChange={(e) => setVolume(e.target.value)} required />
                <Select
                  label="Payment Method"
                  name="payment_method"
                  options={[
                    { label: 'Cash on Delivery (COD)', value: 'Cod' },
                    { label: 'QRIS Transfer (Unavailable)', value: 'Qris', disabled: true },
                  ]}
                />
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Jumlah total pendapatan : </span>
                  <span className="text-lg font-bold text-secondary-600">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-b border-gray-100 pb-6">
              <h3 className="text-sm font-semibold text-gray-900">Bukti Foto Minyak bekas (Dalam botol atau jerigen)</h3>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                {imagePreview ? (
                  <div className="w-full relative rounded-md overflow-hidden flex justify-center">
                    <img src={imagePreview} alt="Preview" className="max-h-48 object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload an image of the oil</p>
                    <p className="text-xs text-gray-400 mb-4">PNG, JPG up to 5MB</p>
                    <div className="relative">
                      <Button type="button" variant="outline" size="sm">
                        Select File
                      </Button>
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Alamat Penjemputan (Terbatas pada wilayah Purwokerto)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="District (Kecamatan)"
                  name="address_district"
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedVillage("");
                  }}
                  required
                  options={[
                    { label: "Select District...", value: "", disabled: true },
                    ...districts.map(d => ({ label: d.name, value: d.name }))
                  ]}
                />
                <Select
                  label="Village (Kelurahan)"
                  name="address_village"
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  disabled={!selectedDistrict || villages.length === 0}
                  required
                  options={[
                    { label: "Select Village...", value: "", disabled: true },
                    ...villages.map(v => ({ label: v.name, value: v.name }))
                  ]}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Detail alamat</label>
                <textarea
                  name="address_details"
                  className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                  defaultValue={defaultDetails}
                ></textarea>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full sm:w-auto ml-auto" isLoading={submitting}>
              Submit Pengajuan
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* SUCCESS MODAL / POP-UP */}
      {transactionSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-fade-in" onClick={() => setTransactionSuccess(null)}>
          <Card className="w-full max-w-md shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="text-center border-b border-gray-100 pb-4">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100">
                <svg className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle>Pengajuan Penjualan Berhasil!</CardTitle>
              <CardDescription>Tim kami akan segera memprosesnya</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="rounded-lg bg-gray-50 p-4 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Volume Minyak</span>
                  <span className="font-medium text-gray-900">{transactionSuccess.volume} Liter</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Total Pendapatan</span>
                  <span className="font-bold text-secondary-700 text-base">Rp {transactionSuccess.total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex flex-col mt-4 pt-4 border-t border-gray-200">
                  <span className="text-gray-500 mb-1">Alamat Penjemputan:</span>
                  <span className="font-medium text-gray-900 leading-snug">{transactionSuccess.address}</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Metode Pembayaran: {transactionSuccess.paymentMethod}</h4>
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100">
                  <p className="text-sm">Tim kurir kami akan segera meluncur ke lokasi Anda untuk menjemput minyak dan menyerahkan uang tunai sebesar <strong>Rp {transactionSuccess.total.toLocaleString('id-ID')}</strong>.</p>
                </div>
              </div>

              {transactionSuccess.saleImageUrl && (
                <div className="mt-4 text-center">
                  <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block mb-2">Bukti Foto Minyak</span>
                  <img src={transactionSuccess.saleImageUrl} alt="Bukti Penjualan" className="max-h-32 mx-auto object-cover rounded-md border border-gray-200" />
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2">
              <Button className="w-full bg-secondary-600 hover:bg-secondary-700" onClick={() => navigate('/dashboard/transactions')}>
                Selesai & Lihat Transaksi
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
