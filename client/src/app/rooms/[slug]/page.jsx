import LearningDetailExperience from "@/components/learning/LearningDetailExperience";
import { fetchLearningDetail } from "@/lib/learningApi";

export default async function Page({ params }) {
  const data = await fetchLearningDetail("rooms", params.slug);
  return <LearningDetailExperience item={data?.item || null} type="rooms" />;
}
