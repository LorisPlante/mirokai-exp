import { PlanView } from "@/components/Plan/PlanView";

export default async function PlanPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/plan-modules`, {
    cache: "no-store",
  });
  const data = await res.json();

  return <PlanView modules={data.modules ?? []} />;
}

