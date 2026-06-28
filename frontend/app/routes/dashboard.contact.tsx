import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { getMe } from "../lib/api";

export function meta() {
  return [{ title: "Contact Support - UCOB" }];
}

export default function ContactSupport() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    getMe().then(res => {
      setUserEmail(res.data.email);
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "admin@ucob.com", // This gets overridden in the backend by GMAIL_USER
          eventType: "contact_support",
          userEmail: userEmail,
          subject: subject,
          details: message,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengirim pesan.");
      }

      setSuccess(true);
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Hubungi Customer Service</h1>
        <p className="text-sm text-gray-500">Kirimkan pertanyaan, keluhan, atau saran Anda kepada tim kami.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Kirim Pesan</CardTitle>
            <CardDescription>Kami akan membalas pesan Anda ke email yang terdaftar ({userEmail || 'Memuat...'}).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                Pesan Anda berhasil dikirim! Tim kami akan segera menghubungi Anda.
              </div>
            )}
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <div>
              <Input
                label="Subjek"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Contoh: Kendala Penjemputan Minyak"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Pesan</label>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Tuliskan pesan Anda di sini..."
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" isLoading={loading} disabled={!userEmail}>
              Kirim Pesan
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
