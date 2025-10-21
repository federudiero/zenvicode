import { redirect } from "next/navigation";

export default function PricingRedirect({ params }: { params: { locale: string } }) {
  // Redirect /[locale]/pricing to /[locale]/contact as requested
  redirect(`/${params.locale}/contact`);
  return null;
}