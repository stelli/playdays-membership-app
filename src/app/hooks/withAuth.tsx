import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { logout } from "../services/auth";

const withAuth = (WrappedComponent: React.ComponentType) => {
  return function ProtectedComponent(props: any) {
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
        <button onClick={logout}>Logout</button>
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withAuth;
