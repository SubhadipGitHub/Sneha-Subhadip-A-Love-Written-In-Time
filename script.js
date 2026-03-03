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
const letterCard = document.querySelector(".letter-card");
const letterStatusBadge = document.getElementById("letterStatusBadge");
const letterLockState = document.getElementById("letterLockState");
const letterFunError = document.getElementById("letterFunError");

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
const itineraryGuestsLink = document.getElementById("itineraryGuestsLink");
const itineraryCover = document.getElementById("itineraryCover");
const itineraryDate = document.getElementById("itineraryDate");
const itineraryTime = document.getElementById("itineraryTime");
const itineraryGuestTime = document.getElementById("itineraryGuestTime");
const itineraryLocation = document.getElementById("itineraryLocation");
const itineraryRsvpLink = document.getElementById("itineraryRsvpLink");
const itineraryUploadLink = document.getElementById("itineraryUploadLink");
const itineraryMapInlineLink = document.getElementById("itineraryMapInlineLink");
const itineraryMap = document.getElementById("itineraryMap");
const itineraryTimeline = document.getElementById("itineraryTimeline");
const itineraryDetails = document.getElementById("itineraryDetails");
const activityModal = document.getElementById("activityModal");
const activityModalClose = document.getElementById("activityModalClose");
const activityModalTitle = document.getElementById("activityModalTitle");
const activityModalCategoryIcon = document.getElementById("activityModalCategoryIcon");
const activityModalImage = document.getElementById("activityModalImage");
const activityModalTime = document.getElementById("activityModalTime");
const activityModalStatus = document.getElementById("activityModalStatus");
const activityModalDetail = document.getElementById("activityModalDetail");
const bgMusic = document.getElementById("bgMusic");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const musicStatus = document.getElementById("musicStatus");
const defaultMusicTracks = ["audio/romantic.mp4"];
let activeItineraryItem = null;

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
        secretMessage.textContent = "Sneha, from Kunafa to forever, I choose you today, tomorrow, and always. <3";
        secretMessage.classList.remove("error");
        secretMessage.classList.add("success");
        if (letterCard) {
            letterCard.classList.add("is-unlocked");
            letterCard.classList.remove("is-error");
        }
        if (letterStatusBadge) {
            letterStatusBadge.textContent = "Unlocked";
        }
        if (letterFunError) {
            letterFunError.textContent = "Unlocked. Your secret memories are now visible.";
        }
        if (letterLockState) {
            letterLockState.setAttribute("aria-hidden", "true");
        }
        return;
    }

    secretMessage.textContent = "Nope. That word is shy today. Try again with your forever word.";
    secretMessage.classList.remove("success");
    secretMessage.classList.add("error");
    if (letterCard) {
        letterCard.classList.remove("is-unlocked");
        letterCard.classList.remove("is-error");
        void letterCard.offsetWidth;
        letterCard.classList.add("is-error");
    }
    if (letterStatusBadge) {
        letterStatusBadge.textContent = "Try Again";
    }
    if (letterFunError) {
        letterFunError.textContent = "Oops. Cute lock says: almost there. Try the forever-love word.";
    }
    if (letterLockState) {
        letterLockState.setAttribute("aria-hidden", "false");
    }
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
        if (event.key === "Escape" && activityModal?.classList.contains("open")) {
            closeActivityModal();
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
                const [category = "", time = "", title = "", ...rest] = entry
                    .split("|")
                    .map((part) => part.trim());
                return {
                    category: category.toLowerCase(),
                    time,
                    title: title || "Program item",
                    detail: rest.join(" | ")
                };
            });
    }

    return [
        ...parseLegacyProgramItems("games", item.dataset.games || ""),
        ...parseLegacyProgramItems("food", item.dataset.food || ""),
        ...parseLegacyProgramItems("performances", item.dataset.performances || "")
    ];
}

function parseScheduleDateTime(dateLabel, timeLabel) {
    if (!dateLabel || !timeLabel || timeLabel.toLowerCase() === "tba") return null;
    const parsed = new Date(`${dateLabel} ${timeLabel}`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function extractComparableTime(timeLabel) {
    if (!timeLabel) return "11:59 PM";
    const match = timeLabel.match(/(\d{1,2}:\d{2}\s*[AP]M)/i);
    return match ? match[1].toUpperCase() : timeLabel;
}

function getTimelineStatus(dateLabel, timeLabel, category) {
    const scheduledAt = parseScheduleDateTime(dateLabel, timeLabel);
    if (!scheduledAt) {
        return { label: "Open", className: "open", isDone: false };
    }

    const isDone = Date.now() >= scheduledAt.getTime();
    const doneLabel = category === "food" ? "Closed" : "Done";
    return {
        label: isDone ? doneLabel : "Open",
        className: isDone ? "done" : "open",
        isDone
    };
}

function buildActivityDetail(entry, meta) {
    const eventName = meta?.event || "the event";
    const location = meta?.location || "the venue";
    const category = entry.category || "program";
    const lowerTitle = (entry.title || "").toLowerCase();

    const categoryNotes = {
        games: "Expect audience participation, quick instructions from hosts, and group-friendly rounds.",
        food: "Counters will open for this slot with fresh service and short queue windows.",
        performances: "Stage lights, audio checks, and sequence coordination will run during this segment."
    };

    const titleHints = [
        { key: "quiz", note: "Teams will be formed quickly and points will be counted live by the emcee." },
        { key: "medley", note: "Back-to-back songs are queued, so performers should stay ready near the stage wings." },
        { key: "battle", note: "This round is high-energy with quick transitions between family groups." },
        { key: "entry", note: "Please be seated before this starts so the entry path remains clear." },
        { key: "buffet", note: "Food stations will run in parallel; elders and children can be served first." },
        { key: "draw", note: "Keep your invite token handy for the draw announcement and prize pickup." }
    ];
    const matchedHint = titleHints.find((hint) => lowerTitle.includes(hint.key))?.note;

    return entry.detail
        ? entry.detail
        : `${entry.title} is scheduled during ${eventName} at ${location}. ${categoryNotes[category] || categoryNotes.performances} ${matchedHint || "Please arrive 10 minutes early for smooth transitions."}`;
}

function getActivityVisuals(category) {
    const visualMap = {
        games: {
            icon: "G",
            image: "images/bike.png",
            alt: "Games activity image"
        },
        food: {
            icon: "F",
            image: "images/Kunafa.png",
            alt: "Food activity image"
        },
        performances: {
            icon: "P",
            image: "images/fance.png",
            alt: "Performance activity image"
        }
    };
    return visualMap[category] || visualMap.performances;
}

function openActivityModal(entry, meta, status) {
    if (!activityModal) return;
    const visuals = getActivityVisuals(entry.category);

    activityModalTitle.textContent = entry.title || "Program Item";
    if (activityModalCategoryIcon) {
        activityModalCategoryIcon.textContent = visuals.icon;
        activityModalCategoryIcon.className = `activity-category-icon ${entry.category || "performances"}`;
    }
    if (activityModalImage) {
        activityModalImage.src = visuals.image;
        activityModalImage.alt = visuals.alt;
    }
    activityModalTime.textContent = `Time: ${entry.time || "TBA"} | Date: ${meta?.date || "TBA"}`;
    activityModalStatus.textContent = `Status: ${status.label}`;
    activityModalStatus.className = `activity-modal-status ${status.className}`;
    activityModalDetail.textContent = buildActivityDetail(entry, meta);
    activityModal.classList.add("open");
    activityModal.setAttribute("aria-hidden", "false");
    syncModalBodyLock();
}

function closeActivityModal() {
    if (!activityModal) return;
    activityModal.classList.remove("open");
    activityModal.setAttribute("aria-hidden", "true");
    syncModalBodyLock();
}

function setupActivityModal() {
    if (!activityModal || !activityModalClose) return;

    activityModalClose.addEventListener("click", closeActivityModal);
    activityModal.addEventListener("click", (event) => {
        if (event.target === activityModal) {
            closeActivityModal();
        }
    });
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

function renderEventTimeline(items, meta) {
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
        row.setAttribute("role", "button");
        row.setAttribute("tabindex", "0");

        const time = document.createElement("span");
        time.className = "timeline-time";
        time.textContent = entry.time || "TBA";

        const body = document.createElement("div");
        body.className = "timeline-body";

        const category = document.createElement("span");
        const safeCategory = ["games", "food", "performances"].includes(entry.category)
            ? entry.category
            : "performances";
        row.classList.add(`timeline-row-${safeCategory}`);
        category.className = `timeline-category ${safeCategory}`;
        category.textContent = safeCategory;

        const title = document.createElement("p");
        title.className = "timeline-title";
        title.textContent = entry.title || "Program item";

        const status = getTimelineStatus(meta?.date, entry.time, safeCategory);
        const modalEntry = { ...entry, category: safeCategory };
        const statusBadge = document.createElement("span");
        statusBadge.className = `timeline-state ${status.className}`;
        statusBadge.textContent = status.label;

        if (status.isDone) {
            row.classList.add("is-done");
        }

        body.appendChild(category);
        body.appendChild(title);
        body.appendChild(statusBadge);
        row.appendChild(time);
        row.appendChild(body);
        row.addEventListener("click", () => openActivityModal(modalEntry, meta, status));
        row.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openActivityModal(modalEntry, meta, status);
            }
        });
        itineraryTimeline.appendChild(row);
    });
}

function buildGuestBadgeText(item) {
    const total = item.dataset.total;
    const attending = item.dataset.attending;
    if (total || attending) {
        return `Total: ${total || "TBA"} | Attending: ${attending || "TBA"}`;
    }
    return item.dataset.guests || "Guests: TBA";
}

function enrichItineraryCards() {
    itineraryItems.forEach((item) => {
        const cover = item.dataset.cover || parseEventGallery(item)[0]?.src || "";
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
    closeActivityModal();
    activeItineraryItem = item;
    const mapQuery = item.dataset.mapQuery || item.dataset.location || "";
    const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
    const mapOpen = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
    const rsvpLink = item.dataset.rsvp || "#";
    const guestListLink = item.dataset.guestList || "#";
    const uploadLink = item.dataset.upload || "#";
    const programItems = parseProgramItems(item);
    const cover = item.dataset.cover || parseEventGallery(item)[0]?.src || "images/engaged.png";

    itineraryTag.textContent = "Wedding Event";
    itineraryTitle.textContent = item.dataset.event || "Event Details";
    itineraryGuestsLink.textContent = buildGuestBadgeText(item);
    itineraryGuestsLink.href = guestListLink;
    itineraryCover.src = cover;
    itineraryCover.alt = `${itineraryTitle.textContent} cover image`;
    itineraryDate.textContent = item.dataset.date || "To be announced";
    itineraryTime.textContent = item.dataset.time || "To be announced";
    itineraryGuestTime.textContent = item.dataset.guestTime || "Please arrive 45 mins early";
    itineraryLocation.textContent = item.dataset.location || "To be announced";
    itineraryRsvpLink.href = rsvpLink;
    itineraryUploadLink.href = uploadLink;
    itineraryMapInlineLink.href = mapOpen;
    itineraryMap.src = mapEmbed;
    renderEventTimeline(programItems, {
        event: item.dataset.event || "Wedding Event",
        date: item.dataset.date || "",
        location: item.dataset.location || ""
    });
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

    setInterval(() => {
        if (!activeItineraryItem) return;
        renderEventTimeline(parseProgramItems(activeItineraryItem), {
            event: activeItineraryItem.dataset.event || "Wedding Event",
            date: activeItineraryItem.dataset.date || "",
            location: activeItineraryItem.dataset.location || ""
        });
    }, 60000);
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
setupActivityModal();
setupWeddingItinerary();
setupBackgroundMusic();
updateTimers();
setInterval(updateTimers, 1000);
