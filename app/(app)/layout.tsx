import { requireProfilo } from "@/lib/auth";
import { Sidebar } from "@/components/shell/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profilo = await requireProfilo();

  return (
    <div className="flex min-h-[100dvh] flex-col lg:flex-row">
      <Sidebar profilo={profilo} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
