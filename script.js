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
const itineraryPage = document.getElementById("itineraryPage");
const itineraryTag = document.getElementById("itineraryTag");
const itineraryTitle = document.getElementById("itineraryTitle");
const itineraryGuests = document.getElementById("itineraryGuests");
const itineraryCover = document.getElementById("itineraryCover");
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
const defaultMusicTracks = ["audio/romantic.mp4"];

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

function parseEventGallery(item) {
    const galleryRaw = item.dataset.gallery || "";
    if (!galleryRaw) return [];

    return galleryRaw
        .split(";")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
            const [src = "", alt = "Wedding event memory"] = entry.split("|").map((part) => part.trim());
            return { src, alt };
        })
        .filter((entry) => Boolean(entry.src));
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

function enrichItineraryCards() {
    itineraryItems.forEach((item) => {
        const guestLabel = item.dataset.guests || "Guests: TBA";
        const cover = item.dataset.cover || parseEventGallery(item)[0]?.src || "";

        const badge = document.createElement("span");
        badge.className = "guest-badge";
        badge.textContent = guestLabel;

        item.appendChild(badge);
        if (cover) {
            const preview = document.createElement("div");
            preview.className = "itinerary-mini-cover";

            const thumb = document.createElement("img");
            thumb.src = cover;
            thumb.alt = `${item.dataset.event || "Wedding event"} cover preview`;
            preview.appendChild(thumb);
            item.appendChild(preview);
        }
    });
}

function openItineraryPage(item) {
    const mapQuery = item.dataset.mapQuery || item.dataset.location || "";
    const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
    const mapOpen = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
    const uploadLink = item.dataset.upload || "#";
    const programItems = parseProgramItems(item);
    const cover = item.dataset.cover || parseEventGallery(item)[0]?.src || "images/engaged.png";

    itineraryTag.textContent = "Wedding Event";
    itineraryTitle.textContent = item.dataset.event || "Event Details";
    itineraryGuests.textContent = item.dataset.guests || "Guests: TBA";
    itineraryCover.src = cover;
    itineraryCover.alt = `${itineraryTitle.textContent} cover image`;
    itineraryDate.textContent = item.dataset.date || "To be announced";
    itineraryTime.textContent = item.dataset.time || "To be announced";
    itineraryGuestTime.textContent = item.dataset.guestTime || "Please arrive 45 mins early";
    itineraryLocation.textContent = item.dataset.location || "To be announced";
    itineraryUploadLink.href = uploadLink;
    itineraryMapLink.href = mapOpen;
    itineraryMap.src = mapEmbed;
    renderEventTimeline(programItems);
    itineraryDetails.textContent = item.dataset.details || "";
}

function setupWeddingItinerary() {
    if (!itineraryItems.length || !itineraryPage) return;

    enrichItineraryCards();

    itineraryItems.forEach((item) => {
        const openDetails = () => {
            itineraryItems.forEach((card) => card.classList.remove("active"));
            item.classList.add("active");
            openItineraryPage(item);

            if (window.innerWidth <= 860) {
                itineraryPage.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        };

        item.addEventListener("click", openDetails);
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openDetails();
            }
        });
    });

    const defaultItem = itineraryItems[0];
    if (defaultItem) {
        defaultItem.classList.add("active");
        openItineraryPage(defaultItem);
    }
}

function updateMusicUi(isPlaying) {
    musicToggleBtn.textContent = isPlaying ? "Pause Music" : "Play Music";
    musicToggleBtn.classList.toggle("playing", isPlaying);
    musicStatus.textContent = isPlaying
        ? "Background music is playing"
        : "Tap to start background music";
}

function resolveMusicPlaylist() {
    const rawTracks = bgMusic.dataset.tracks || "";
    const tracks = rawTracks
        .split(",")
        .map((track) => track.trim())
        .filter(Boolean);

    return tracks.length ? tracks : defaultMusicTracks;
}

function getAudioMimeType(track) {
    const normalized = (track || "").toLowerCase();
    if (normalized.endsWith(".mp3")) return "audio/mpeg";
    if (normalized.endsWith(".ogg")) return "audio/ogg";
    if (normalized.endsWith(".wav")) return "audio/wav";
    return "audio/mp4";
}

function setMusicSource(track) {
    if (!track) return;

    const source = bgMusic.querySelector("source");
    if (source) {
        source.src = track;
        source.type = getAudioMimeType(track);
    }

    bgMusic.src = track;
    bgMusic.load();
}

function setupRandomMusicStart() {
    bgMusic.addEventListener(
        "loadedmetadata",
        () => {
            if (!Number.isFinite(bgMusic.duration) || bgMusic.duration < 12) return;

            // Keep intro/outro variety while avoiding abrupt ending starts.
            const safeStart = bgMusic.duration * 0.08;
            const safeEnd = bgMusic.duration * 0.72;
            bgMusic.currentTime = safeStart + Math.random() * (safeEnd - safeStart);
        },
        { once: true }
    );
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
    const playlist = resolveMusicPlaylist();
    const randomTrack = playlist[Math.floor(Math.random() * playlist.length)];
    setMusicSource(randomTrack);
    setupRandomMusicStart();
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
