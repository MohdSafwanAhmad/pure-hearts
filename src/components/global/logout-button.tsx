"use client";

import { createBrowserSupabaseClient } from "@/src/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Button
      onClick={handleLogout}
      size={"lg"}
      className="bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full"
    >
      Logout
    </Button>
  );
}
