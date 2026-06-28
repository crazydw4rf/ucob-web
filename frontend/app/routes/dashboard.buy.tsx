import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { getOilPrice, getAddress, createTransaction, getPaymentUrl, getOilStock, getTransactionPayment } from '../lib/api';
import QRCode from 'react-qr-code';

export function meta() {
  return [{ title: 'Buy Oil - UCOB' }];
}

export default function BuyOil() {
  const navigate = useNavigate();
  const [volume, setVolume] = useState<string>('10');
  const [pricePerLiter, setPricePerLiter] = useState<number>(0);
  const [stock, setStock] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success Modal State
  const [transactionSuccess, setTransactionSuccess] = useState<{
    volume: number;
    total: number;
    address: string;
    paymentMethod: string;
    payUrl: string | null;
  } | null>(null);

  // Address defaults
  const [defaultDistrict, setDefaultDistrict] = useState('');
  const [defaultVillage, setDefaultVillage] = useState('');
  const [defaultDetails, setDefaultDetails] = useState('');

  const total = Number(volume || 0) * pricePerLiter;

  useEffect(() => {
    async function fetchData() {
      try {
        const [priceRes, addressRes, stockRes] = await Promise.allSettled([getOilPrice('Sell'), getAddress(), getOilStock()]);
        if (priceRes.status === 'fulfilled') setPricePerLiter(priceRes.value.data.price_per_liter);
        if (stockRes.status === 'fulfilled') setStock(stockRes.value.data.delta);
        if (addressRes.status === 'fulfilled') {
          const addr = addressRes.value.data;
          setDefaultDistrict(addr.district ?? '');
          setDefaultVillage(addr.village ?? '');
          setDefaultDetails(addr.details ?? '');
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const oilVolume = Number(volume);

    // Validate stock to prevent backend 500 Internal Server Error
    if (stock !== null && oilVolume > stock) {
      setError(`Stok tidak mencukupi. Sisa stok saat ini hanya ${stock} Liter.`);
      setSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    try {
      const res = await createTransaction({
        oil_volume: Number(formData.get('oil_volume')),
        transaction_type: 'Purchase',
        payment_method: formData.get('payment_method') as 'Qris' | 'Cod',
        address_district: formData.get('address_district') as string,
        address_village: formData.get('address_village') as string,
        address_details: formData.get('address_details') as string,
        sale_image_url: null,
      });

      const trx = res.data;
      const paymentMethod = formData.get('payment_method') as string;
      const amount = trx.oil_volume * trx.price_per_liter;

      let payUrl = null;
      if (paymentMethod === 'Qris') {
        const paymentRes = await getTransactionPayment(trx.id);
        const paymentData = paymentRes.data;
        payUrl = getPaymentUrl(paymentData.amount, paymentData.order_id);
      }

      setTransactionSuccess({
        volume: trx.oil_volume,
        total: amount,
        address: `${formData.get('address_details')}, Kel. ${formData.get('address_village')}, Kec. ${formData.get('address_district')}`,
        paymentMethod: paymentMethod === 'Qris' ? 'QRIS Transfer' : 'Cash on Delivery (COD)',
        payUrl
      });
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to create transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Beli Minyak bekas dari Kami</h1>
        <p className="text-sm text-gray-500">Beli minyak bekas dari kami untuk kebutuhan industri anda.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Form Pembelian</CardTitle>
            <CardDescription>Current selling price: Rp {pricePerLiter.toLocaleString('id-ID')}/L</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}

            <div className="space-y-4 border-b border-gray-100 pb-6">
              <h3 className="text-sm font-semibold text-gray-900">Detail Pembelian</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Volume (Liters)" type="number" min="0.1" step="0.1" name="oil_volume" value={volume} onChange={(e) => setVolume(e.target.value)} required />
                <Select
                  label="Payment Method"
                  name="payment_method"
                  options={[
                    { label: 'QRIS Transfer', value: 'Qris' },
                    { label: 'Cash on Delivery (COD)', value: 'Cod' },
                  ]}
                />
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total Harga</span>
                  <span className="text-lg font-bold text-primary-700">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Alamat Pengantaran</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="District (Kecamatan)" name="address_district" required defaultValue={defaultDistrict} />
                <Input label="Village (Kelurahan)" name="address_village" required defaultValue={defaultVillage} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Detail Alamat Pengantaran</label>
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
              Konfirmasi Pembelian
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* SUCCESS MODAL / POP-UP */}
      {transactionSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <Card className={`w-full ${transactionSuccess.payUrl ? 'max-w-2xl' : 'max-w-md'} shadow-2xl animate-in fade-in zoom-in duration-200 my-auto`}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle>Pesanan Berhasil Dibuat!</CardTitle>
              <CardDescription>Rincian pembelian minyak Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Volume</span>
                  <span className="font-medium text-gray-900">{transactionSuccess.volume} Liter</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Total Pembayaran</span>
                  <span className="font-bold text-primary-700">Rp {transactionSuccess.total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex flex-col mt-4 pt-4 border-t border-gray-200">
                  <span className="text-gray-500 mb-1">Alamat Pengiriman:</span>
                  <span className="font-medium text-gray-900 leading-snug">{transactionSuccess.address}</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Metode Pembayaran: {transactionSuccess.paymentMethod}</h4>
                {transactionSuccess.payUrl ? (
                  <div className="w-full flex justify-center bg-white rounded-xl overflow-hidden border border-gray-200 shadow-inner mt-4 h-[500px]">
                    <iframe
                      src={transactionSuccess.payUrl}
                      title="Selesaikan Pembayaran"
                      className="w-full h-full border-0"
                      allow="payment"
                    />
                  </div>
                ) : (
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100">
                    <p className="text-sm">Silakan siapkan uang tunai sebesar <strong>Rp {transactionSuccess.total.toLocaleString('id-ID')}</strong> untuk diberikan saat kurir kami tiba di lokasi Anda.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/dashboard/transactions')}>
                Selesai & Lihat Transaksi
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
