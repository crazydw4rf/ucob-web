import { useState, useEffect } from "react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { ShoppingCart, TrendingUp } from "lucide-react";
import { getTransactions, getTransactionDetails, getTransactionPayment, getPaymentUrl } from "../lib/api";

export function meta() {
  return [{ title: "Transactions - UCOB" }];
}

interface Transaction {
  id: number;
  oil_volume: number;
  price_per_liter: number;
  payment_method: string;
  status: string;
  transaction_type: string;
  created_at: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 1000;
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState<"Newest" | "Oldest">("Newest");
  const [typeFilter, setTypeFilter] = useState("All");

  // Modal State
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [trxDetails, setTrxDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [payUrl, setPayUrl] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);

  const fetchPage = async (p: number) => {
    setLoading(true);
    try {
      const res = await getTransactions(p, pageSize);
      const data: Transaction[] = res.data ?? [];
      setTransactions(data);
      setHasMore(data.length === pageSize);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(page);
  }, [page]);

  const handleRowClick = async (trx: Transaction) => {
    setSelectedTrx(trx);
    setPayUrl(null);
    setDetailsLoading(true);
    try {
      const res = await getTransactionDetails(trx.id);
      setTrxDetails(res.data);
    } catch {
      setTrxDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!selectedTrx) return;
    setPayLoading(true);
    try {
      const paymentRes = await getTransactionPayment(selectedTrx.id);
      const paymentData = paymentRes.data;
      const url = getPaymentUrl(paymentData.amount, paymentData.order_id);
      setPayUrl(url);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data pembayaran.");
    } finally {
      setPayLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Done":
      case "Delivered":
        return <Badge variant="success">{status}</Badge>;
      case "Pending":
      case "Processing":
      case "Unpaid":
        return <Badge variant="warning">{status}</Badge>;
      case "Rejected":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const processedTransactions = [...transactions]
    .filter((trx) => typeFilter === "All" || trx.transaction_type === typeFilter)
    .sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortOrder === "Newest" ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Transaction History</h1>
          <p className="text-sm text-gray-500">View all your past purchases and sales.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            className="block w-full sm:w-40 rounded-md border-gray-300 py-2 pl-3 pr-8 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">Semua Tipe</option>
            <option value="Sale">Jual</option>
            <option value="Purchase">Beli</option>
          </select>
          <select
            className="block w-full sm:w-32 rounded-md border-gray-300 py-2 pl-3 pr-8 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "Newest" | "Oldest")}
          >
            <option value="Newest">Terbaru</option>
            <option value="Oldest">Terlama</option>
          </select>
        </div>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
        ) : processedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <ShoppingCart className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No transactions found</p>
            <p className="text-sm">Try changing your filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-4">ID</th>
                    <th scope="col" className="px-6 py-4">Tipe</th>
                    <th scope="col" className="px-6 py-4">Volume</th>
                    <th scope="col" className="px-6 py-4">Amount</th>
                    <th scope="col" className="px-6 py-4">Payment</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {processedTransactions.map((trx) => (
                    <tr 
                      key={trx.id} 
                      className="bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(trx)}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        TRX-{trx.id.toString().padStart(4, "0")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {trx.transaction_type === "Sale" ? (
                            <TrendingUp className="h-4 w-4 text-primary-500" />
                          ) : (
                            <ShoppingCart className="h-4 w-4 text-secondary-500" />
                          )}
                          <span
                            className={
                              trx.transaction_type === "Sale"
                                ? "text-primary-700 font-medium"
                                : "text-secondary-700 font-medium"
                            }
                          >
                            {trx.transaction_type === "Sale" ? "Jual" : "Beli"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{Math.abs(trx.oil_volume)} L</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        Rp {(Math.abs(trx.oil_volume) * trx.price_per_liter).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4">{trx.payment_method}</td>
                      <td className="px-6 py-4">{getStatusBadge(trx.status)}</td>
                      <td className="px-6 py-4">
                        {new Date(trx.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {/* Transaction Details Modal */}
      {selectedTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <Card className={`w-full ${payUrl ? 'max-w-2xl' : 'max-w-lg'} shadow-2xl animate-in fade-in zoom-in duration-200 my-auto`}>
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Transaction Details</CardTitle>
                  <div className="text-sm text-gray-500 mt-1">
                    TRX-{selectedTrx.id.toString().padStart(4, "0")} • {new Date(selectedTrx.created_at).toLocaleString('id-ID')}
                  </div>
                </div>
                {getStatusBadge(selectedTrx.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {payUrl ? (
                <div className="w-full flex justify-center bg-white rounded-xl overflow-hidden border border-gray-200 shadow-inner mt-4 h-[500px]">
                  <iframe
                    src={payUrl}
                    title="Selesaikan Pembayaran"
                    className="w-full h-full border-0"
                    allow="payment"
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block mb-1">Tipe</span>
                  <div className="flex items-center gap-2 font-medium text-gray-900">
                    {selectedTrx.transaction_type === "Sale" ? (
                      <TrendingUp className="h-4 w-4 text-primary-500" />
                    ) : (
                      <ShoppingCart className="h-4 w-4 text-secondary-500" />
                    )}
                    {selectedTrx.transaction_type === "Sale" ? "Jual" : "Beli"}
                  </div>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block mb-1">Payment Method</span>
                  <span className="font-medium text-gray-900">{selectedTrx.payment_method === 'Qris' ? 'QRIS Transfer' : 'Cash on Delivery'}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block mb-1">Volume</span>
                  <span className="font-medium text-gray-900">{Math.abs(selectedTrx.oil_volume)} Liters</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block mb-1">Total Amount</span>
                  <span className="font-bold text-primary-700 text-lg">Rp {(Math.abs(selectedTrx.oil_volume) * selectedTrx.price_per_liter).toLocaleString("id-ID")}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Delivery Address</h4>
                {detailsLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : trxDetails ? (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {trxDetails.address_details}<br/>
                    Kelurahan {trxDetails.address_village}, Kecamatan {trxDetails.address_district}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">Address details unavailable.</p>
                )}
              </div>

              {selectedTrx.transaction_type === "Sale" && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Sale Proof Image</h4>
                  {detailsLoading ? (
                    <div className="animate-pulse h-32 bg-gray-200 rounded-lg w-full"></div>
                  ) : trxDetails?.sale_image_url ? (
                    <img src={trxDetails.sale_image_url} alt="Sale Proof" className="rounded-lg max-h-48 w-full object-cover border border-gray-200" />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-500 border border-gray-100">
                      No image uploaded
                    </div>
                  )}
                </div>
              )}

              {!payUrl && selectedTrx.transaction_type === "Purchase" && selectedTrx.payment_method === "Qris" && (selectedTrx.status === "Unpaid" || selectedTrx.status === "Pending") && (
                <div className="pt-4 border-t border-gray-100">
                  <Button onClick={handlePayNow} isLoading={payLoading} className="w-full">
                    Bayar Sekarang
                  </Button>
                </div>
              )}
                </>
              )}
            </CardContent>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <Button onClick={() => { setSelectedTrx(null); setTrxDetails(null); setPayUrl(null); }}>
                Tutup
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
