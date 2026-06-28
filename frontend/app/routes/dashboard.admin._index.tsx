import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Droplet, DollarSign, Edit } from "lucide-react";
import { getOilPrice, getOilStock, updateOilPrice, updateOilStock } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function meta() {
  return [{ title: "Admin Settings - UCOB" }];
}

export default function AdminSettings() {
  const [buyPrice, setBuyPrice] = useState<number | null>(null);
  const [sellPrice, setSellPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
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
      const [buyRes, sellRes, stockRes] = await Promise.allSettled([
        getOilPrice("Buy"),
        getOilPrice("Sell"),
        getOilStock(),
      ]);
      if (buyRes.status === "fulfilled") setBuyPrice(buyRes.value.data.price_per_liter);
      if (sellRes.status === "fulfilled") setSellPrice(sellRes.value.data.price_per_liter);
      if (stockRes.status === "fulfilled") setStock(stockRes.value.data.delta);
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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500">Manage platform settings, pricing, and overall stock.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Buying Price</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(buyPrice)}
                  <span className="text-sm font-normal text-gray-500">/L</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Selling Price</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(sellPrice)}
                  <span className="text-sm font-normal text-gray-500">/L</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Total Stock</CardTitle>
                <Droplet className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stock !== null ? `${stock} L` : "—"}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold tracking-tight text-gray-900 mb-4 flex items-center">
              <Edit className="w-5 h-5 mr-2" />
              System Controls
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm">Update Buying Price</CardTitle>
                  <CardDescription>Set new price for buying oil from users</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateBuyPrice} className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="e.g. 5000"
                      value={newBuyPrice}
                      onChange={(e) => setNewBuyPrice(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button type="submit" size="sm" isLoading={isUpdatingBuyPrice}>
                      Save
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm">Update Selling Price</CardTitle>
                  <CardDescription>Set new price for selling oil to users</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateSellPrice} className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="e.g. 12000"
                      value={newSellPrice}
                      onChange={(e) => setNewSellPrice(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button type="submit" size="sm" isLoading={isUpdatingSellPrice}>
                      Save
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm">Adjust Oil Stock</CardTitle>
                  <CardDescription>Add (+) or subtract (-) available stock</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateStock} className="flex gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 10 or -5"
                      value={stockDelta}
                      onChange={(e) => setStockDelta(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button type="submit" size="sm" isLoading={isUpdatingStock}>
                      Apply
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
