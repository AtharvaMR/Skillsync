import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { CareerChatbot } from "@/components/dashboard/career-chatbot";

export const dynamic = "force-dynamic";

export default async function CareerAssistantPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Career Assistant</h1>
        <p className="text-sm text-slate-600 mt-1">
          Get fast, practical guidance on closing skill gaps, preparing practical evidence, and exploring opportunities.
        </p>
      </div>
      <CareerChatbot />
    </div>
  );
}
