import { $, $$ } from "./dom.js";

export function initShare() {

    const toggle = $("#shareToggle");
    const panel  = $("#sharePanel");

    if (!toggle || !panel) return;

    // ------- ОТКРЫТИЕ ПАНЕЛИ -------
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();      // ❗ запрещаем всплытие наверх
        panel.classList.toggle("active");
    });

    // ------- КЛИК ВНУТРИ ПАНЕЛИ -------
    panel.addEventListener("click", (e) => {
        e.stopPropagation();      // ❗ панель не должна закрываться
    });

    // ------- ЗАКРЫТИЕ ВНЕ ПАНЕЛИ -------
    document.addEventListener("click", () => {
        panel.classList.remove("active");
    });

    // ------- ДАННЫЕ ДЛЯ ШАРИНГА -------
    const SHARE = {
        title: document.querySelector("meta[property='og:title']")?.content || document.title,
        desc:  document.querySelector("meta[name='description']")?.content || "",
        url:   document.querySelector("link[rel='canonical']")?.href || window.location.href
    };

    const links = {
        vk:      `https://vk.com/share.php?url=${SHARE.url}`,
        telegram:`https://t.me/share/url?url=${SHARE.url}&text=${SHARE.title}`,
        whatsapp:`https://wa.me/?text=${SHARE.title} ${SHARE.url}`,
        facebook:`https://www.facebook.com/sharer/sharer.php?u=${SHARE.url}`,
        twitter: `https://twitter.com/intent/tweet?url=${SHARE.url}&text=${SHARE.title}`,
        email:   `mailto:?subject=${SHARE.title}&body=${SHARE.url}`
    };

    // ------- ОБРАБОТЧИКИ КНОПОК -------
    panel.querySelectorAll("[data-share]").forEach(el => {
        el.addEventListener("click", (e) => {
            e.stopPropagation();  // ❗ критично — иначе document закроет панель
            const type = el.dataset.share;

            if (links[type]) {
                window.open(links[type], "_blank", "width=600,height=500");
            }
        });
    });
}
