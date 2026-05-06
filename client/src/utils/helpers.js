export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function findById(items, id) {
  return items.find((item) => item.id === id);
}

export function findBySlug(items, slug) {
  return items.find((item) => item.slug === slug);
}
