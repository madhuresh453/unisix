import LearningListingPage from "@/components/learning/LearningListingPage";
import { fetchLearningList } from "@/lib/learningApi";

export const metadata = { title: "workshops | UNI6CTF" };

export default async function Page() {
  const data = await fetchLearningList("workshops");
  return <LearningListingPage title="Workshops" items={data?.items || []} type="workshops" />;
}
