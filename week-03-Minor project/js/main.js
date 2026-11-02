import { initMovieApp } from "./movies.js";
import { initWeatherApp } from "./weather.js";

// Initialize the Weather App
initWeatherApp();

// Initialize the Movie Search App
initMovieApp();

// Highlight navigation links when sections are visible
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".topbar nav a");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            }
        });
    },
    {
        threshold: 0.35
    }
);

sections.forEach((section) => {
    observer.observe(section);
});