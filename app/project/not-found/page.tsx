import { CenteredLayout } from "@/components/page-layouts";

export default async function Page() {
  return (
    <CenteredLayout>
      <section className="grow flex flex-col text-foreground">
        <h2>Project Not Found</h2>
      </section>
    </CenteredLayout>
  );
}
