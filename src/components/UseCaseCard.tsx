type UseCase = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export default function UseCaseCard({ item }: { item: UseCase }) {
  return (
    <article className="border rounded-lg p-4 bg-card text-card-foreground">
      <h3 className="font-semibold text-lg">{item.title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
    </article>
  );
}