export function scrollElementIntoView(
  target: Element | null | undefined,
  block: ScrollLogicalPosition = "start",
) {
  if (!target) return false;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block,
  });
  return true;
}
