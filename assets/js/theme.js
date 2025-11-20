export function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');

    // если темы нет — подхватываем OS
    if (!localStorage.theme) {
        localStorage.theme =
            window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
    }

    const apply = () => {
        const theme = localStorage.theme;

        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);

        btn.textContent = theme === "dark" ? "Светлая тема" : "Тёмная тема";
    };

    btn.addEventListener('click', () => {
        localStorage.theme = localStorage.theme === "dark" ? "light" : "dark";
        apply();
    });

    apply();
}