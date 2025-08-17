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

export function initThemeToggle(toggleBtn) {
  if (!toggleBtn) return;
  
  // Set initial theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  
  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}
