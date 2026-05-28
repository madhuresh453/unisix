import LearningDetailExperience from "@/components/learning/LearningDetailExperience";
import { fetchLearningDetail } from "@/lib/learningApi";

export default async function Page({ params }) {
  const data = await fetchLearningDetail("workshops", params.slug);
  return <LearningDetailExperience item={data?.item || null} type="workshops" />;
}
