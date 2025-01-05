import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { logout } from "../services/auth";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ProtectedComponent: React.FC<P> = (props) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push("/login");
      }
    }, [user, router]);

    if (!user) {
      return <p>Loading Auth HOC...</p>;
    }

    return (
      <>
        <div className="flex justify-end">
          <button className="m-2" onClick={() => router.push("/home")}>
            Ke Halaman Utama
          </button>
        </div>
        <WrappedComponent {...props} />
      </>
    );
  };

  return ProtectedComponent;
};

export default withAuth;
