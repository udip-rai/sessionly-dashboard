import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Breadcrumb } from "./Breadcrumb";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-auto main-scroll p-8 md:p-6 xl:p-8 bg-gradient-to-br from-white/50 to-gray-50/50 backdrop-blur-sm md:ml-0">
          <div className="max-w-7xl mx-auto space-y-6">
            <Breadcrumb />
            <div className="space-y-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
