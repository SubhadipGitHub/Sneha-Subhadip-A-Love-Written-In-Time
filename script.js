const relationshipStartDate = new Date("2025-03-01T00:00:00").getTime();
const weddingDate = new Date("2026-12-11T00:00:00").getTime();

const togetherTimer = document.getElementById("togetherTimer");
const countdownStatus = document.getElementById("countdownStatus");

const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMinutes = document.getElementById("cdMinutes");
const cdSeconds = document.getElementById("cdSeconds");

const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));

const unlockBtn = document.getElementById("unlockBtn");
const secretInput = document.getElementById("secretInput");
const secretMessage = document.getElementById("secretMessage");

function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
}

function updateTimers() {
    const now = Date.now();

    const togetherMs = Math.max(now - relationshipStartDate, 0);
    const together = formatDuration(togetherMs);
    togetherTimer.textContent = `${together.days} Days ${together.hours} Hours ${together.minutes} Minutes ${together.seconds} Seconds`;

    const weddingDiff = weddingDate - now;
    const absDiff = Math.abs(weddingDiff);
    const countdown = formatDuration(absDiff);

    cdDays.textContent = countdown.days;
    cdHours.textContent = countdown.hours;
    cdMinutes.textContent = countdown.minutes;
    cdSeconds.textContent = countdown.seconds;

    if (weddingDiff >= 0) {
        countdownStatus.textContent = "Counting down to your wedding day.";
    } else {
        countdownStatus.textContent = `Married for ${countdown.days} days and counting.`;
    }
}

function activateTab(tabId) {
    tabButtons.forEach((button) => {
        const isActive = button.dataset.tab === tabId;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    tabPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === tabId);
    });
}

function bindTabs() {
    tabButtons.forEach((button) => {
        button.addEventListener("click", () => activateTab(button.dataset.tab));
    });
}

function unlockLoveLetter() {
    const passcode = secretInput.value.trim().toLowerCase();

    if (passcode === "forever") {
        secretMessage.textContent = "Sneha, from Kunafa to forever, I choose you today, tomorrow, and always. ❤️";
        secretMessage.style.color = "#fff0d2";
        return;
    }

    secretMessage.textContent = "That secret word is not right yet.";
    secretMessage.style.color = "#ffd5df";
}

function setupRevealAnimations() {
    const revealElements = Array.from(document.querySelectorAll(".reveal"));

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((el) => el.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealElements.forEach((el) => observer.observe(el));
}

unlockBtn.addEventListener("click", unlockLoveLetter);
secretInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        unlockLoveLetter();
    }
});

bindTabs();
activateTab("home");
setupRevealAnimations();
updateTimers();
setInterval(updateTimers, 1000);
