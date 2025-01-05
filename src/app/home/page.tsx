"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Image
        alt="Playdays Logo"
        src="/playdays-logo-short.svg"
        className="mx-auto h-20 w-auto"
        width={48}
        height={48}
      />
      <h1 className="text-2xl mt-10 font-bold mb-8">Selamat Datang !</h1>
      <div className="flex flex-col space-y-4">
        <button
          className="px-6 py-2 bg-playdays-purple text-white rounded-lg"
          onClick={() => router.push("/members/search")}
        >
          Pencarian Member
        </button>
        <button
          className="px-6 py-2 bg-playdays-purple text-white rounded-lg"
          onClick={() => router.push("/members/register")}
        >
          Pendaftaran Member Baru
        </button>
        {/* <button
          className="px-6 py-2 bg-playdays-purple text-white rounded-lg"
          onClick={() => router.push("/forgot-password")}
        >
          Forgot Password
        </button> */}
      </div>
    </div>
  );
}
