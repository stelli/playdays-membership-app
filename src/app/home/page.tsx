"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout } from "../services/auth";
import { useAuth } from "../hooks/AuthProvider";

function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

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

      {!user ? (
        <div className="flex flex-col space-y-4">
          <button
            className="px-6 py-2 bg-playdays-purple text-white rounded-lg"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>
      ) : (
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
          <button
            className="px-6 py-2 bg-playdays-purple text-white rounded-lg"
            onClick={() => router.push("/register")}
          >
            Pendaftaran Admin Baru
          </button>
          <button className="px-6 py-2 bg-playdays-purple text-white rounded-lg">
            Ganti Kata Sandi
          </button>
          <button
            className="px-6 py-2 bg-red-600 text-white rounded-lg"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
