import { Header } from "@/components/public/layout/Header";
import { Footer } from "@/components/public/layout/Footer";
import { StickyMobileCta } from "@/components/public/layout/StickyMobileCta";
import { LazyPopupLeadForm } from "@/components/public/layout/LazyPopupLeadForm";
import { getSiteSettings } from "@/lib/data/settings";
import { buildLocalBusinessSchema, buildWebsiteSchema } from "@/lib/schema/local-business";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const siteUrl = settings?.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://adubuildla.com";

  const localBusinessSchema = settings ? buildLocalBusinessSchema(settings) : null;
  const websiteSchema = buildWebsiteSchema(siteUrl, settings?.siteName ?? "ADU Build LA");

  return (
    <>
      {/* JSON-LD structured data */}
      {localBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <StickyMobileCta phone={settings?.businessPhone ?? null} />
        <LazyPopupLeadForm />
      </div>
    </>
  );
}
