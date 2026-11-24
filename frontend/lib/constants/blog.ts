export interface Post { slug: string; title: string; excerpt: string; body: string[] }
// Static journal content. Swap for a CMS when the backend gains a blog endpoint.
export const POSTS: Post[] = [
  { slug: "small-room-study-setup", title: "Setting up a study corner in a small room", excerpt: "A few layout ideas for making one wall do the work of a whole study.",
    body: ["Start with the wall, not the desk. Pick the quietest wall with a nearby socket and light source, then measure the depth you can spare when the desk is open.", "A foldable desk lets you reclaim that depth the moment you’re done. Pair it with wall shelves so nothing lives on the floor.", "Keep one surface clear for your main task and let everything else fold, roll or hang."] },
  { slug: "choosing-a-kids-table", title: "How to choose a kids’ table that grows with them", excerpt: "What to look for in height, surface and stability.",
    body: ["Look for a surface large enough for drawing and homework, with rounded edges and a stable base.", "Foldable designs are easy to tidy away after playtime, which also keeps living areas flexible."] },
  { slug: "foldable-vs-fixed-desks", title: "Foldable vs fixed desks: which is right for you?", excerpt: "A quick framework for deciding.",
    body: ["If your room doubles as a bedroom or living area, foldable and wheeled desks give you flexibility.", "If you work at a desk for long hours with multiple monitors, a fixed desk with generous space is usually the better fit.", "Many people end up with one of each: a fixed main desk and a foldable table for guests or study sessions."] },
];
