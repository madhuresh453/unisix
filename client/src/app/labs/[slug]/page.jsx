import LearningDetailExperience from "@/components/learning/LearningDetailExperience";
import { fetchLearningDetail } from "@/lib/learningApi";

export default async function Page({ params }) {
  const { slug } = await params;

  const data = await fetchLearningDetail(
    "labs",
    slug
  );

  return (
    <LearningDetailExperience
      item={data?.item || null}
      type="labs"
    />
  );
}