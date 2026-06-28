import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { getMe, getAddress, saveAddress } from "../lib/api";

export function meta() {
  return [{ title: "Profile - UCOB" }];
}

interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

interface AddressData {
  id: number;
  district: string;
  village: string;
  details: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, addressRes] = await Promise.allSettled([getMe(), getAddress()]);
        if (userRes.status === "fulfilled") setUser(userRes.value.data);
        if (addressRes.status === "fulfilled") setAddress(addressRes.value.data);
      } catch {
        // silently ignore
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const district = formData.get("district") as string;
    const village = formData.get("village") as string;
    const details = formData.get("details") as string;

    try {
      const res = await saveAddress(district, village, details, !!address);
      setAddress(res.data);
      setMessage("Address saved successfully!");
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || "Failed to save address.");
    } finally {
      setSaving(false);
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Your Profile</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>View your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Username</p>
              <p className="text-base text-gray-900 font-medium">{user?.username ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email Address</p>
              <p className="text-base text-gray-900">{user?.email ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Account Role</p>
              <p className="text-base text-gray-900">{user?.role ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-base text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <form onSubmit={handleSaveAddress}>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Update your pickup and delivery address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {message && (
                <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                  {message}
                </div>
              )}
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                  {error}
                </div>
              )}
              <Input
                label="District (Kecamatan)"
                name="district"
                placeholder="Gondokusuman"
                defaultValue={address?.district ?? ""}
              />
              <Input
                label="Village (Kelurahan)"
                name="village"
                placeholder="Baciro"
                defaultValue={address?.village ?? ""}
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Detailed Address</label>
                <textarea
                  name="details"
                  className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Jl. Melati No. 5, RT 02/RW 03"
                  defaultValue={address?.details ?? ""}
                ></textarea>
              </div>
              <Button type="submit" className="w-full" isLoading={saving}>
                Save Address
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
