"use client";
import { PlanEditor } from "@/components/Plan/PlanEditor";
import { PlanModulePosition } from "@/components/Plan/PlanView";
import { useEffect, useState } from "react";

export default function AdminPlanPage() {
    const [modules, setModules] = useState<PlanModulePosition[]>([]);

    useEffect(() => {
        const loadModules = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/admin/plan-modules`,
                { cache: "no-store" }
            );
            if (!res.ok) {
              console.error(await res.text());
              setModules([]);
              return;
            }
            const data = await res.json().catch(() => ({}));
            setModules(Array.isArray(data.modules) ? data.modules : []);
        }
        loadModules();
    }, []);

  return <PlanEditor initialModules={modules} />;
}

