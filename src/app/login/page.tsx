"use client";
import { FormEvent, useState } from "react";
import { login } from "../services/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/members/search");
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Your Company"
            src="/playdays-logo-short.svg"
            className="mx-auto h-14 w-auto"
          />
          <h3 className="text-center text-xl/9 font-bold tracking-tight text-gray-900">
            Halaman Masuk
          </h3>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Alamat Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 ${
                    error ? "outline-red-500" : "outline-gray-300"
                  } placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-bg-playdays-purple sm:text-sm/6`}
                />
              </div>
            </div>

            <div className="mt-2">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Kata Sandi
              </label>

              <div className="mt-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 ${
                    error ? "outline-red-500" : "outline-gray-300"
                  } placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-bg-playdays-purple sm:text-sm/6`}
                />
              </div>
            </div>

            {error && (
              <div className="mt-2 text-red-600 text-xs/4">
                Email atau kata sandi salah. Harap periksa dan coba lagi.
              </div>
            )}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center mt-6 rounded-md bg-playdays-purple px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-playdays-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-playdays-purple"
              >
                Masuk
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
