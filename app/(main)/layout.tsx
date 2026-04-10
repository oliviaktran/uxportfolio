import { ScrollCaseStudyToTop } from "@/components/ScrollCaseStudyToTop";
import { SiteGardenFooter } from "@/components/SiteGardenFooter";
import { SiteNav } from "@/components/SiteNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col blueprint-surface">
      <SiteNav />
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <SiteGardenFooter />
        <ScrollCaseStudyToTop />
      </div>
    </div>
  );
}
