// Pushes theme colors onto :root as CSS custom properties so every
// `bg-accent` / `text-primary` / etc. Tailwind class re-colors instantly —
// no rebuild needed. Used by both the public site (PortfolioContext) and
// the admin panel (AdminLayout, live preview in ProfilePage) so the two
// always show the same colors the admin has saved.
export const applyTheme = (theme) => {
  if (!theme) return;
  const root = document.documentElement;
  if (theme.primary) root.style.setProperty('--color-primary', theme.primary);
  if (theme.accent) root.style.setProperty('--color-accent', theme.accent);
};
