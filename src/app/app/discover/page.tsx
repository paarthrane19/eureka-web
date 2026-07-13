"use client";

import { RightSidebarContent } from "@/components/app/RightSidebar";

// Mobile-only "Discover" tab holding the sections that live in the desktop
// right sidebar (daily discovery, follow questions, study circles). On desktop
// the sidebar already shows these, so this route is reached from the mobile bar.
export default function DiscoverPage() {
  return (
    <div>
      <header className="sticky top-0 z-30 bg-bg/80 hairline-b px-4 py-5 backdrop-blur-md md:px-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Discover
        </h1>
      </header>
      <div className="flex flex-col gap-8 px-4 py-6 md:px-6">
        <RightSidebarContent />
      </div>
    </div>
  );
}
