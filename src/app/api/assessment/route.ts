import { NextResponse } from "next/server";
import { AssessmentRequestSchema } from "@/lib/ai/schemas";
import { scoreAssessment } from "@/lib/constants";

export async function POST(request: Request) {
  const parsed = AssessmentRequestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid assessment request." }, { status: 400 });
  return NextResponse.json(scoreAssessment(parsed.data.answers));
}
