// app/(site)/[locale]/layout.tsx  (o el path donde tengas este layout)
import Nav from "@/components/Nav";

export default async function LocaleSiteLayout(
  props: { children: React.ReactNode; params: Promise<{ locale: string }> }
) {
  const { children, params } = await props;
  const { locale } = await params;

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header fijo */}
      <header
        className="
          fixed top-0 inset-x-0 z-50
          border-b border-border/50 px-6 py-4
          bg-background/60 supports-[backdrop-filter]:bg-background/40
          backdrop-blur
        "
      >
        <Nav locale={locale} />
      </header>

      {/* Compensación por el header fijo (≈64px) */}
      <main className="flex-1 pt-16">{children}</main>
    </div>
  );
}
