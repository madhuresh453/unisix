import { Award } from "lucide-react";
import { achievements } from "@/utils/constants";
import { Card } from "@/components/ui/Card";

export function AchievementGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {achievements.map((achievement) => (
        <Card key={achievement.title} glow>
          <Award className="h-7 w-7 text-cyber-red" />
          <h3 className="mt-5 text-xl font-black uppercase">{achievement.title}</h3>
          <p className="mt-3 text-sm leading-6 text-cyber-muted">{achievement.body}</p>
        </Card>
      ))}
    </div>
  );
}
