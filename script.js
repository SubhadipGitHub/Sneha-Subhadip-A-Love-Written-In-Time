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

const memoryCards = Array.from(document.querySelectorAll(".memory-card"));
const itineraryItems = Array.from(document.querySelectorAll(".itinerary-item"));
const lightbox = document.getElementById("memoryLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxVideo = document.getElementById("lightboxVideo");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const itineraryModal = document.getElementById("itineraryModal");
const itineraryClose = document.getElementById("itineraryClose");
const itineraryTag = document.getElementById("itineraryTag");
const itineraryTitle = document.getElementById("itineraryTitle");
const itineraryDate = document.getElementById("itineraryDate");
const itineraryTime = document.getElementById("itineraryTime");
const itineraryGuestTime = document.getElementById("itineraryGuestTime");
const itineraryLocation = document.getElementById("itineraryLocation");
const itineraryUploadLink = document.getElementById("itineraryUploadLink");
const itineraryMapLink = document.getElementById("itineraryMapLink");
const itineraryMap = document.getElementById("itineraryMap");
const itineraryTimeline = document.getElementById("itineraryTimeline");
const itineraryDetails = document.getElementById("itineraryDetails");
const bgMusic = document.getElementById("bgMusic");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const musicStatus = document.getElementById("musicStatus");

function syncModalBodyLock() {
    const hasOpenModal = Boolean(document.querySelector(".lightbox.open"));
    document.body.classList.toggle("modal-open", hasOpenModal);
}

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
    revealElements.forEach((el, index) => {
        const staggerIndex = el.classList.contains("memory-card") ? index % 4 : index % 6;
        el.style.transitionDelay = `${staggerIndex * 70}ms`;
    });

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

function getYouTubeEmbedUrl(url) {
    if (!url) return null;

    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^www\./, "");
        let videoId = "";

        if (host === "youtu.be") {
            videoId = parsed.pathname.slice(1);
        } else if (host === "youtube.com" || host === "m.youtube.com") {
            if (parsed.pathname === "/watch") {
                videoId = parsed.searchParams.get("v") || "";
            } else if (parsed.pathname.startsWith("/shorts/")) {
                videoId = parsed.pathname.split("/")[2] || "";
            } else if (parsed.pathname.startsWith("/embed/")) {
                videoId = parsed.pathname.split("/")[2] || "";
            }
        }

        if (!videoId) return null;
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    } catch (error) {
        return null;
    }
}

function openLightbox({ src, alt, caption, videoEmbed }) {
    if (videoEmbed) {
        lightboxImage.style.display = "none";
        lightboxVideo.style.display = "block";
        lightboxVideo.src = videoEmbed;
    } else {
        lightboxVideo.style.display = "none";
        lightboxVideo.src = "";
        lightboxImage.style.display = "block";
        lightboxImage.src = src;
        lightboxImage.alt = alt || "Full memory image";
    }

    lightboxCaption.textContent = caption;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    syncModalBodyLock();
}

function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxVideo.src = "";
    syncModalBodyLock();
}

function setupMemoryLightbox() {
    memoryCards.forEach((card) => {
        const image = card.querySelector(".memory-media img, img");
        const title = card.querySelector("h3")?.textContent?.trim() || "Memory";
        const description = card.querySelector("p")?.textContent?.trim() || "";
        const caption = description ? `${title}: ${description}` : title;
        const videoUrl = card.dataset.video || "";
        const videoEmbed = getYouTubeEmbedUrl(videoUrl);

        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute(
            "aria-label",
            videoEmbed ? `Open ${title} video memory` : `Open ${title} memory`
        );

        const openCardLightbox = () =>
            openLightbox({
                src: image?.src || "",
                alt: image?.alt || "Full memory image",
                caption,
                videoEmbed
            });

        card.addEventListener("click", openCardLightbox);
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openCardLightbox();
            }
        });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("open")) {
            closeLightbox();
        }
    });
}

function parseLegacyProgramItems(type, value) {
    if (!value) return [];

    return value
        .split(",")
        .map((chunk) => chunk.trim())
        .filter(Boolean)
        .map((chunk) => {
            const [timePart, ...rest] = chunk.split(" - ");
            const title = rest.join(" - ").trim();
            return {
                category: type,
                time: title ? timePart.trim() : "",
                title: title || timePart.trim()
            };
        });
}

function parseProgramItems(item) {
    const rawProgram = item.dataset.program || "";

    if (rawProgram) {
        return rawProgram
            .split(";")
            .map((entry) => entry.trim())
            .filter(Boolean)
            .map((entry) => {
                const [category = "", time = "", title = ""] = entry.split("|").map((part) => part.trim());
                return {
                    category: category.toLowerCase(),
                    time,
                    title: title || "Program item"
                };
            });
    }

    return [
        ...parseLegacyProgramItems("games", item.dataset.games || ""),
        ...parseLegacyProgramItems("food", item.dataset.food || ""),
        ...parseLegacyProgramItems("performances", item.dataset.performances || "")
    ];
}

function renderEventTimeline(items) {
    if (!itineraryTimeline) return;
    itineraryTimeline.innerHTML = "";

    if (!items.length) {
        const emptyRow = document.createElement("li");
        emptyRow.className = "timeline-row";
        emptyRow.innerHTML = `
            <span class="timeline-time">TBA</span>
            <div class="timeline-body">
                <span class="timeline-category performances">Program</span>
                <p class="timeline-title">Detailed schedule will be shared soon.</p>
            </div>
        `;
        itineraryTimeline.appendChild(emptyRow);
        return;
    }

    items.forEach((entry) => {
        const row = document.createElement("li");
        row.className = "timeline-row";

        const time = document.createElement("span");
        time.className = "timeline-time";
        time.textContent = entry.time || "TBA";

        const body = document.createElement("div");
        body.className = "timeline-body";

        const category = document.createElement("span");
        const safeCategory = ["games", "food", "performances"].includes(entry.category)
            ? entry.category
            : "performances";
        category.className = `timeline-category ${safeCategory}`;
        category.textContent = safeCategory;

        const title = document.createElement("p");
        title.className = "timeline-title";
        title.textContent = entry.title || "Program item";

        body.appendChild(category);
        body.appendChild(title);
        row.appendChild(time);
        row.appendChild(body);
        itineraryTimeline.appendChild(row);
    });
}

function openItineraryModal(item) {
    const mapQuery = item.dataset.mapQuery || item.dataset.location || "";
    const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
    const mapOpen = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
    const uploadLink = item.dataset.upload || "#";
    const programItems = parseProgramItems(item);

    itineraryTag.textContent = "Wedding Event";
    itineraryTitle.textContent = item.dataset.event || "Event Details";
    itineraryDate.textContent = item.dataset.date || "To be announced";
    itineraryTime.textContent = item.dataset.time || "To be announced";
    itineraryGuestTime.textContent = item.dataset.guestTime || "Please arrive 45 mins early";
    itineraryLocation.textContent = item.dataset.location || "To be announced";
    itineraryUploadLink.href = uploadLink;
    itineraryMapLink.href = mapOpen;
    itineraryMap.src = mapEmbed;
    renderEventTimeline(programItems);
    itineraryDetails.textContent = item.dataset.details || "";

    itineraryModal.classList.add("open");
    itineraryModal.setAttribute("aria-hidden", "false");
    syncModalBodyLock();
}

function closeItineraryModal() {
    itineraryModal.classList.remove("open");
    itineraryModal.setAttribute("aria-hidden", "true");
    itineraryMap.src = "";
    syncModalBodyLock();
}

function setupWeddingItinerary() {
    if (!itineraryItems.length || !itineraryModal || !itineraryClose) return;

    itineraryItems.forEach((item) => {
        const openDetails = () => openItineraryModal(item);

        item.addEventListener("click", openDetails);
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openDetails();
            }
        });
    });

    itineraryClose.addEventListener("click", closeItineraryModal);

    itineraryModal.addEventListener("click", (event) => {
        if (event.target === itineraryModal) {
            closeItineraryModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && itineraryModal.classList.contains("open")) {
            closeItineraryModal();
        }
    });
}

function updateMusicUi(isPlaying) {
    musicToggleBtn.textContent = isPlaying ? "Pause Music" : "Play Music";
    musicToggleBtn.classList.toggle("playing", isPlaying);
    musicStatus.textContent = isPlaying
        ? "Background music is playing"
        : "Tap to start background music";
}

async function toggleMusic() {
    try {
        if (bgMusic.paused) {
            await bgMusic.play();
            updateMusicUi(true);
        } else {
            bgMusic.pause();
            updateMusicUi(false);
        }
    } catch (error) {
        updateMusicUi(false);
        musicStatus.textContent = "Unable to autoplay. Tap Play Music.";
    }
}

function setupBackgroundMusic() {
    bgMusic.volume = 0.35;
    musicToggleBtn.addEventListener("click", toggleMusic);
    updateMusicUi(false);
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
setupMemoryLightbox();
setupWeddingItinerary();
setupBackgroundMusic();
updateTimers();
setInterval(updateTimers, 1000);
