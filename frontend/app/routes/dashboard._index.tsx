import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { TrendingUp, ShoppingCart, Droplet, DollarSign, Edit } from "lucide-react";
import { getOilPrice, getOilStock, getMe, updateOilPrice, updateOilStock } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Skeleton from 'react-loading-skeleton';

export function meta() {
  return [{ title: "Dashboard Overview - UCOB" }];
}

export default function DashboardOverview() {
  const [buyPrice, setBuyPrice] = useState<number | null>(null);
  const [sellPrice, setSellPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin form states
  const [newBuyPrice, setNewBuyPrice] = useState("");
  const [newSellPrice, setNewSellPrice] = useState("");
  const [stockDelta, setStockDelta] = useState("");
  
  const [isUpdatingBuyPrice, setIsUpdatingBuyPrice] = useState(false);
  const [isUpdatingSellPrice, setIsUpdatingSellPrice] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  const fetchData = async () => {
    try {
      const [buyRes, sellRes, stockRes, userRes] = await Promise.allSettled([
        getOilPrice("Buy"),
        getOilPrice("Sell"),
        getOilStock(),
        getMe(),
      ]);
      if (buyRes.status === "fulfilled") setBuyPrice(buyRes.value.data.price_per_liter);
      if (sellRes.status === "fulfilled") setSellPrice(sellRes.value.data.price_per_liter);
      if (stockRes.status === "fulfilled") setStock(stockRes.value.data.delta);
      if (userRes.status === "fulfilled" && userRes.value.data.role === "Admin") {
        setIsAdmin(true);
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateBuyPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuyPrice) return;
    setIsUpdatingBuyPrice(true);
    try {
      await updateOilPrice(Number(newBuyPrice), "Buy");
      await fetchData();
      setNewBuyPrice("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingBuyPrice(false);
    }
  };

  const handleUpdateSellPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSellPrice) return;
    setIsUpdatingSellPrice(true);
    try {
      await updateOilPrice(Number(newSellPrice), "Sell");
      await fetchData();
      setNewSellPrice("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingSellPrice(false);
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockDelta) return;
    setIsUpdatingStock(true);
    try {
      await updateOilStock(Number(stockDelta));
      await fetchData();
      setStockDelta("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStock(false);
    }
  };

  const formatPrice = (price: number | null) =>
    price !== null ? `Rp ${price.toLocaleString("id-ID")}` : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500">Welcome back! Here is what's happening today.</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton width={100} />
                  <Skeleton circle width={16} height={16} />
                </CardHeader>
                <CardContent>
                  <Skeleton height={32} width={120} className="mb-2" />
                  <Skeleton width={160} />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <Skeleton width={120} height={24} />
              </CardHeader>
              <CardContent className="flex gap-4 sm:flex-row">
                <div className="flex-1">
                  <Skeleton height={128} style={{ borderRadius: '0.5rem' }} />
                </div>
                <div className="flex-1">
                  <Skeleton height={128} style={{ borderRadius: '0.5rem' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Buying Price</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(buyPrice)}
                  <span className="text-sm font-normal text-gray-500">/L</span>
                </div>
                <p className="text-xs text-gray-500">Price we pay you (your earnings)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Selling Price</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(sellPrice)}
                  <span className="text-sm font-normal text-gray-500">/L</span>
                </div>
                <p className="text-xs text-gray-500">Price for you to purchase from us</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Stock</CardTitle>
                <Droplet className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stock !== null ? `${stock} L` : "—"}
                </div>
                <p className="text-xs text-gray-500">Current UCOB oil stock</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="/dashboard/sell"
                  className="flex-1 flex items-center justify-center rounded-lg border-2 border-dashed border-primary-300 p-6 text-center hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <TrendingUp className="mb-2 h-8 w-8 text-primary-500" />
                    <span className="font-semibold text-primary-700">Sell Used Oil</span>
                  </div>
                </a>
                <a
                  href="/dashboard/buy"
                  className="flex-1 flex items-center justify-center rounded-lg border-2 border-dashed border-secondary-300 p-6 text-center hover:bg-secondary-50 hover:text-secondary-600 transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <ShoppingCart className="mb-2 h-8 w-8 text-secondary-500" />
                    <span className="font-semibold text-secondary-700">Buy Recycled Oil</span>
                  </div>
                </a>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
