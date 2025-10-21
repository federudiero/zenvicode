import UseCaseCard from "@/components/UseCaseCard";
import useCases from "@/content/use_cases.json";

export default function UseCasesPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {(Array.isArray(useCases.items) ? useCases.items : []).map((uc) => (
        <UseCaseCard key={uc.id} item={uc} />
      ))}
    </section>
  );
}