"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Allow access to login page without auth
  const isLoginPage = pathname === "/matyi/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push("/matyi/login");
    }
  }, [user, loading, isLoginPage, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <Loader2 className="h-8 w-8 animate-spin text-[#C89A63]" />
      </div>
    );
  }

  // Login page doesn't need auth
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Not authenticated
  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Authenticated but not admin
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white p-4">
        <Shield className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Hozzáférés megtagadva</h1>
        <p className="text-neutral-400 mb-6 text-center">
          A bejelentkezett email cím ({user.email}) nem rendelkezik admin
          jogosultsággal.
        </p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => signOut()}
            className="border-neutral-700 text-white hover:bg-neutral-800"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Kijelentkezés
          </Button>
          <Link href="/">
            <Button className="bg-[#C89A63] text-black hover:bg-[#b8864f]">
              Vissza a főoldalra
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Authenticated and authorized
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Admin header bar */}
      <div className="fixed top-0 right-0 z-50 p-2">
        <div className="flex items-center gap-3 rounded-lg bg-neutral-900/90 backdrop-blur px-3 py-2 text-sm">
          <span className="text-neutral-400">{user.email}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="text-neutral-400 hover:text-white hover:bg-neutral-800 h-7 px-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
