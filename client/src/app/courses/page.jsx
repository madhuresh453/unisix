import LearningListingPage from "@/components/learning/LearningListingPage";
import { fetchLearningList } from "@/lib/learningApi";

export const metadata = { title: "courses | UNI6CTF" };

export default async function Page() {
  const data = await fetchLearningList("courses");
  return <LearningListingPage title="Courses" items={data?.items || []} type="courses" />;
}
