export function getTheme() {
  return localStorage.getItem('theme') || 'light';
}
export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
export function initThemeToggle(button) {
  const current = getTheme();
  setTheme(current);
  button.textContent = current === 'dark' ? '☀️' : '🌙';
  button.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    button.textContent = next === 'dark' ? '☀️' : '��';
  });
}

