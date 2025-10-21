import Nav from "@/components/Nav";

export default async function LocaleSiteLayout(
  props: { children: React.ReactNode; params: Promise<{ locale: string }> }
) {
  const { children, params } = await props;
  const { locale } = await params;
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-border/50 px-6 py-4 backdrop-blur">
        <Nav locale={locale} />
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/50 px-6 py-6 text-sm text-muted-foreground">
        <div className="max-w-6xl mx-auto">© {new Date().getFullYear()} ZenviCode</div>
      </footer>
    </div>
  );
}
