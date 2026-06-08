import { notFound } from "next/navigation";
import { STEP_IDS, getStep } from "@/lib/steps";
import { StepView } from "@/components/StepView";

// 7ステップを静的生成する。
export function generateStaticParams() {
  return STEP_IDS.map((stepId) => ({ stepId }));
}

// 各ステップの出し分け。不正な stepId は 404。
export default async function StepPage({
  params,
}: {
  params: Promise<{ stepId: string }>;
}) {
  const { stepId } = await params;
  const step = getStep(stepId);
  if (!step) notFound();
  return <StepView step={step} />;
}
