import { initDropZone } from './ui.js';
import { initThemeToggle } from './theme.js';
import { generateFavicons, downloadZipBlob} from './generator.js';
import {initCookies} from "./cookies.js";
import {initShare} from "./share.js";

document.addEventListener('DOMContentLoaded', () => {
    initDropZone();
    initThemeToggle();
    document.getElementById('generate-btn').addEventListener('click', generateFavicons);
    document.getElementById('download-zip').addEventListener('click', downloadZipBlob);

    // SHARE
    const toggle = document.getElementById("shareToggle");
    const panel = document.getElementById("sharePanel");

    toggle.addEventListener("click", () => {
        panel.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!toggle.contains(e.target) && !panel.contains(e.target)) {
            panel.classList.remove("active");
        }
    });
    initCookies();
    initShare();
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

});

// document.getElementById('file-input').addEventListener("change", () => {
//     ym(XXXXXX, 'reachGoal', 'upload_image');
//     gtag('event', 'upload_image');
// });
//
// document.getElementById('generate-btn').addEventListener("click", () => {
//     ym(XXXXXX, 'reachGoal', 'generate_favicons');
//     gtag('event', 'generate_favicons');
// });
//
// document.getElementById('download-zip').addEventListener("click", () => {
//     ym(XXXXXX, 'reachGoal', 'download_zip');
//     gtag('event', 'download_zip');
// });