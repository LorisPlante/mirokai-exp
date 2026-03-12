import { PlanView } from "@/components/Plan/PlanView";

export default async function PlanPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/plan-modules`, {
    cache: "no-store",
  });
  const data = await res.json();

  return <PlanView modules={data.modules ?? []} />;
}

