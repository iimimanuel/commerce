import { ContentData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function Footer() {

  const {
    data: logo,
    isLoading: isLoadingLogo,
    error: logoError,
  } = useQuery<ContentData>({
    queryKey: ["logo"],
    queryFn: async () => {
      const res = await fetch("/api/misc/logo");
      if (!res.ok) throw new Error("Error fetching logo");
      return res.json();
    },
  });

  return (
    <footer className="bottom-0 border-t border-neutral py-8">
      <div className="container mx-auto px-4 text-center">
        © {new Date().getFullYear()} {logo?.description}. All rights reserved.
      </div>
    </footer>
  );
}
