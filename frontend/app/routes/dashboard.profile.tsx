import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { getMe, getAddress, saveAddress } from "../lib/api";
import { Select } from "../components/ui/Select";
import Skeleton from 'react-loading-skeleton';

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

  const [districts, setDistricts] = useState<{code: string, name: string}[]>([]);
  const [villages, setVillages] = useState<{code: string, name: string}[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedVillage, setSelectedVillage] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, addressRes] = await Promise.allSettled([getMe(), getAddress()]);
        if (userRes.status === "fulfilled") setUser(userRes.value.data);
        if (addressRes.status === "fulfilled") {
          setAddress(addressRes.value.data);
          setSelectedDistrict(addressRes.value.data.district);
          setSelectedVillage(addressRes.value.data.village);
        }
      } catch {
        // silently ignore
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

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const details = formData.get("details") as string;

    try {
      const res = await saveAddress(selectedDistrict, selectedVillage, details, !!address);
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
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <Skeleton width={200} height={32} className="mb-8" />
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton width={180} height={24} className="mb-2" />
              <Skeleton width={220} height={16} />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i}>
                  <Skeleton width={100} height={16} className="mb-1" />
                  <Skeleton width={150} height={20} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton width={180} height={24} className="mb-2" />
              <Skeleton width={250} height={16} />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i}>
                  <Skeleton width={120} height={16} className="mb-1" />
                  <Skeleton height={40} />
                </div>
              ))}
              <Skeleton height={40} />
            </CardContent>
          </Card>
        </div>
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
              <Select
                label="District (Kecamatan)"
                name="district"
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedVillage("");
                }}
                options={[
                  { label: "Select District...", value: "", disabled: true },
                  ...districts.map(d => ({ label: d.name, value: d.name }))
                ]}
              />
              <Select
                label="Village (Kelurahan)"
                name="village"
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                disabled={!selectedDistrict || villages.length === 0}
                options={[
                  { label: "Select Village...", value: "", disabled: true },
                  ...villages.map(v => ({ label: v.name, value: v.name }))
                ]}
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
