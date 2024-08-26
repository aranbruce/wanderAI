import RefineNavigation from "@/components/refine-navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <RefineNavigation />
      {children}
    </div>
  );
}
