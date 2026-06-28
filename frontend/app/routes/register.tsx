import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { register } from "../lib/api";

export function meta() {
  return [{ title: "Register - UCOB" }];
}

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await register(username, email, password);
      navigate("/login");
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-bg-base px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold tracking-tight text-primary-600">
            UC<span className="text-secondary-500">OB</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Create an account
          </h2>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Join UCOB</CardTitle>
              <CardDescription>Start trading your used cooking oil today.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                  {error}
                </div>
              )}
              <Input
                label="Username"
                type="text"
                name="username"
                required
                placeholder="johndoe"
              />
              <Input
                label="Email address"
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                type="password"
                name="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
              />
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
                placeholder="••••••••"
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Register
              </Button>
              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
