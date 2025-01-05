"use client";

import AuthProvider from "./hooks/AuthProvider";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
