export function mapCtfToCard(event) {
  if (!event) return null;
  const startsAt = event.startsAt;
  const endsAt = event.endsAt;
  const participantsCount = Array.isArray(event.participants) ? event.participants.length : Number(event.participants || 0);
  const teamsCount = Array.isArray(event.teams) ? event.teams.length : Number(event.teams || 0);
  const durationHours = startsAt && endsAt
    ? Math.max(1, Math.round((new Date(endsAt).getTime() - new Date(startsAt).getTime()) / (1000 * 60 * 60)))
    : null;

  return {
    ...event,
    id: event._id || event.id,
    slug: event.slug,
    name: event.name,
    title: event.name,
    status: String(event.status || "draft").toLowerCase(),
    difficulty: event.difficulty || "Mixed",
    description: event.description || "",
    longDescription: event.longDescription || event.description || "",
    startsAt,
    endsAt,
    duration: event.duration || (durationHours ? `${durationHours} Hours` : "TBD"),
    teams: event.teamsLabel || (teamsCount ? `${teamsCount} Teams` : "0 Teams"),
    players: event.playersLabel || (participantsCount ? `${participantsCount} Players` : "0 Players"),
    participants: participantsCount,
    image: event.image || "/images/ctfpage.jpg",
    banner: event.banner || event.image || "/images/ctfpage.jpg",
    prizePool: event.prizePool || event.prize || "TBA",
    prize: event.prize || "TBA",
    format: event.format || "Jeopardy",
    location: event.location || "Online",
    registrationOpen: event.registrationOpen !== false,
    categories: Array.isArray(event.categories) ? event.categories : [],
    tags: Array.isArray(event.tags) ? event.tags : [],
    winners: Array.isArray(event.winners) ? event.winners : []
  };
}
