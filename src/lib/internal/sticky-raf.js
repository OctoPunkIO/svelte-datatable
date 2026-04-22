export function scheduleStickyUpdate(fn) {
  if (typeof requestAnimationFrame === "undefined") {
    fn();
    return () => {};
  }
  const id = requestAnimationFrame(fn);
  return () => cancelAnimationFrame(id);
}
