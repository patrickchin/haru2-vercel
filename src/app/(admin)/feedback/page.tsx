import { DefaultLayout } from "@/components/page-layouts";
import { Card, CardContent } from "@/components/ui/card";
import { getFeedback } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session?.user?.role !== "admin") notFound();

  const feedbacks = await getFeedback();

  return (
    <DefaultLayout>
      <div className="flex items-center">
        <h1 className="grow text-2xl font-semibold">Feedback Comments</h1>
      </div>

      <ol className="min-w-96 flex flex-col gap-4">
        {feedbacks?.map((feedback, i) => {
          return (
            <li key={i}>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>Email: {feedback.email}</div>
                  <div>Date: {feedback.createdAt.toLocaleString()}</div>
                  <div>{feedback.message}</div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ol>
    </DefaultLayout>
  );
}
