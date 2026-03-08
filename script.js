const relationshipStartDate = new Date("2025-03-01T18:00:00").getTime();
const weddingDate = new Date("2026-12-11T21:00:00").getTime();

const togetherTimer = document.getElementById("togetherTimer");
const countdownStatus = document.getElementById("countdownStatus");

const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMinutes = document.getElementById("cdMinutes");
const cdSeconds = document.getElementById("cdSeconds");

const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
// Single source of truth for tab visibility.
// Set any tab to false to hide it.
const tabVisibilityConfig = Object.freeze({
    home: true,
    countdown: true,
    memories: true,
    letter: false
});

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
const openWishesBtn = document.getElementById("openWishesBtn");
const weddingWishesPanel = document.getElementById("weddingWishesPanel");
const wishesForm = document.getElementById("wishesForm");
const wishName = document.getElementById("wishName");
const wishText = document.getElementById("wishText");
const wishFormStatus = document.getElementById("wishFormStatus");
const wishBubbleField = document.getElementById("wishBubbleField");
const openWishFormModalBtn = document.getElementById("openWishFormModalBtn");
const wishPageUrlLink = document.getElementById("wishPageUrl");
const wishQrImage = document.getElementById("wishQrImage");
const wishFormModal = document.getElementById("wishFormModal");
const wishFormModalClose = document.getElementById("wishFormModalClose");
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
const defaultMusicTracks = ["audio/romantic.mp4", "audio/romantic_1.mp3"];
const wishesStorageKey = "wedding_wishes_v1";
let activeItineraryItem = null;
let wishesData = [];
let wishesRefreshTimer = null;
let popAudioCtx = null;
let panelSectionRaf = null;
let wishCycleDeck = [];
let wishCycleCursor = 0;

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

function isTabVisible(tabId) {
    return tabVisibilityConfig[tabId] !== false;
}

function applyTabVisibilityConfig() {
    tabButtons.forEach((button) => {
        const tabId = button.dataset.tab;
        const visible = isTabVisible(tabId);
        button.hidden = !visible;
        if (!visible) {
            button.classList.remove("active");
            button.setAttribute("aria-selected", "false");
        }
    });

    tabPanels.forEach((panel) => {
        const visible = isTabVisible(panel.id);
        panel.hidden = !visible;
        if (!visible) {
            panel.classList.remove("active");
        }
    });
}

function getVisibleTabIds() {
    return tabButtons
        .filter((button) => !button.hidden)
        .map((button) => button.dataset.tab)
        .filter((tabId) => tabPanels.some((panel) => panel.id === tabId && !panel.hidden));
}

function resolveAvailableTab(tabId) {
    const visibleTabIds = getVisibleTabIds();
    if (!visibleTabIds.length) return null;
    if (tabId && visibleTabIds.includes(tabId)) return tabId;
    return visibleTabIds[0];
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
    const resolvedTabId = resolveAvailableTab(tabId);
    if (!resolvedTabId) return;

    tabButtons.forEach((button) => {
        const isActive = !button.hidden && button.dataset.tab === resolvedTabId;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    tabPanels.forEach((panel) => {
        const isActive = !panel.hidden && panel.id === resolvedTabId;
        panel.classList.toggle("active", isActive);
        if (isActive) {
            updatePanelViewportHeight(panel);
            updatePanelSectionState(panel);
        }
    });
}

function bindTabs() {
    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.hidden) return;
            activateTab(button.dataset.tab);
        });
    });
}

function getTabSections(panel) {
    if (!panel) return [];
    return Array.from(panel.children).filter((child) => child.nodeType === 1);
}

function updatePanelViewportHeight(panel) {
    if (!panel || !panel.classList.contains("multi-sections")) return;
    const panelTop = panel.getBoundingClientRect().top;
    const safeHeight = Math.max(window.innerHeight - panelTop - 14, 320);
    panel.style.setProperty("--panel-view-height", `${Math.round(safeHeight)}px`);
}

function updatePanelSectionState(panel) {
    if (!panel || !panel.classList.contains("multi-sections")) return;
    const sections = getTabSections(panel).filter((section) => section.classList.contains("tab-scroll-section"));
    const visibleSections = sections.filter((section) => window.getComputedStyle(section).display !== "none");
    if (!visibleSections.length) return;

    const panelCenter = panel.scrollTop + panel.clientHeight / 2;
    let closest = visibleSections[0];
    let closestDistance = Number.POSITIVE_INFINITY;

    visibleSections.forEach((section) => {
        const sectionCenter = section.offsetTop + section.offsetHeight / 2;
        const distance = Math.abs(sectionCenter - panelCenter);
        if (distance < closestDistance) {
            closestDistance = distance;
            closest = section;
        }
    });

    visibleSections.forEach((section) => {
        section.classList.toggle("section-in-view", section === closest);
    });
}

function queuePanelSectionState(panel) {
    if (panelSectionRaf) {
        cancelAnimationFrame(panelSectionRaf);
    }
    panelSectionRaf = requestAnimationFrame(() => {
        panelSectionRaf = null;
        updatePanelSectionState(panel);
    });
}

function setupTabSectionScrollExperience() {
    tabPanels.forEach((panel) => {
        if (panel.hidden) return;
        const sections = getTabSections(panel);
        if (sections.length < 2) return;

        panel.classList.add("multi-sections");
        sections.forEach((section) => {
            section.classList.add("tab-scroll-section");
        });

        panel.addEventListener("scroll", () => queuePanelSectionState(panel), { passive: true });
        updatePanelViewportHeight(panel);
        updatePanelSectionState(panel);
    });

    window.addEventListener("resize", () => {
        tabPanels.forEach((panel) => {
            if (panel.hidden) return;
            updatePanelViewportHeight(panel);
            queuePanelSectionState(panel);
        });
    });
}

function activateInitialTab(preferredTabId) {
    const initialTabId = resolveAvailableTab(preferredTabId);
    if (!initialTabId) {
        console.warn("No visible tabs are enabled. Set at least one tab to visible.");
        return;
    }
    activateTab(initialTabId);
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
        if (event.key === "Escape" && wishFormModal?.classList.contains("open")) {
            closeWishFormModal();
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

function openWishFormModal() {
    if (!wishFormModal) return;
    wishFormModal.classList.add("open");
    wishFormModal.setAttribute("aria-hidden", "false");
    syncModalBodyLock();
    setTimeout(() => wishName?.focus(), 0);
}

function closeWishFormModal() {
    if (!wishFormModal) return;
    wishFormModal.classList.remove("open");
    wishFormModal.setAttribute("aria-hidden", "true");
    syncModalBodyLock();
}

function setupWishFormModal() {
    if (!openWishFormModalBtn || !wishFormModal || !wishFormModalClose) return;

    openWishFormModalBtn.addEventListener("click", openWishFormModal);
    wishFormModalClose.addEventListener("click", closeWishFormModal);
    wishFormModal.addEventListener("click", (event) => {
        if (event.target === wishFormModal) {
            closeWishFormModal();
        }
    });
}

function setupWishShareLink() {
    if (!wishPageUrlLink && !wishQrImage) return;

    const wishPageUrl = resolveWishPageUrl();

    if (wishPageUrlLink) {
        wishPageUrlLink.href = wishPageUrl;
        wishPageUrlLink.textContent = wishPageUrl;
    }

    if (wishQrImage) {
        const qrPrimaryUrl = buildQrImageUrl(wishPageUrl, "qrserver");
        const qrFallbackUrl = buildQrImageUrl(wishPageUrl, "quickchart");
        wishQrImage.referrerPolicy = "no-referrer";
        wishQrImage.loading = "lazy";
        wishQrImage.src = qrPrimaryUrl;
        wishQrImage.addEventListener(
            "error",
            () => {
                wishQrImage.src = qrFallbackUrl;
            },
            { once: true }
        );
    }
}

function resolveWishPageUrl() {
    const { protocol, host, origin, pathname } = window.location;

    // Opening index.html directly from disk (file://.../index.html).
    if (protocol === "file:") {
        return new URL("./wishes.html", window.location.href).href;
    }

    // GitHub Pages project site uses /<repo>/... paths.
    if (host.endsWith(".github.io")) {
        const firstPathPart = pathname.split("/").filter(Boolean)[0];
        const repoPrefix = firstPathPart ? `/${firstPathPart}` : "";
        return `${origin}${repoPrefix}/wishes.html`;
    }

    // Localhost and regular hosts resolve from site root.
    return `${origin}/wishes.html`;
}

function buildQrImageUrl(targetUrl, provider) {
    if (provider === "quickchart") {
        return `https://quickchart.io/qr?size=340&text=${encodeURIComponent(targetUrl)}`;
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=340x340&data=${encodeURIComponent(targetUrl)}`;
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

function sanitizeWishValue(value) {
    return (value || "").trim().replace(/\s+/g, " ");
}

function formatIstTimestamp(dateInput = Date.now()) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const formatter = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
    return `${formatter.format(date).replace(",", "")} IST`;
}

function setWishStatus(message, isError = false) {
    if (!wishFormStatus) return;
    wishFormStatus.textContent = message;
    wishFormStatus.classList.toggle("error", Boolean(isError));
    wishFormStatus.classList.toggle("success", !isError);
}

function loadWishesFromStorage() {
    try {
        const raw = localStorage.getItem(wishesStorageKey);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed
            .filter((entry) => entry && typeof entry === "object")
            .map((entry) => ({
                id: String(entry.id || `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`),
                name: sanitizeWishValue(entry.name),
                text: sanitizeWishValue(entry.text),
                createdAt: entry.createdAt || new Date().toISOString(),
                createdAtIst: sanitizeWishValue(entry.createdAtIst) || formatIstTimestamp(entry.createdAt || Date.now())
            }))
            .filter((entry) => entry.name && entry.text);
    } catch (error) {
        return [];
    }
}

function saveWishesToStorage() {
    try {
        localStorage.setItem(wishesStorageKey, JSON.stringify(wishesData.slice(0, 200)));
    } catch (error) {
        // Ignore storage quota/private mode write errors.
    }
}

function shuffleArray(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
    }
    return copy;
}

function rebuildWishCycleDeck() {
    wishCycleDeck = shuffleArray(wishesData.map((entry) => entry.id));
    wishCycleCursor = 0;
}

function pickCycledWishes(maxCount = 10) {
    if (!wishesData.length) return [];

    const ids = new Set(wishesData.map((entry) => entry.id));
    const deckIsInvalid =
        wishCycleDeck.length !== wishesData.length ||
        wishCycleDeck.some((id) => !ids.has(id));

    if (deckIsInvalid || !wishCycleDeck.length) {
        rebuildWishCycleDeck();
    }

    const wanted = Math.min(maxCount, wishesData.length);
    const selectedIds = [];

    while (selectedIds.length < wanted) {
        if (wishCycleCursor >= wishCycleDeck.length) {
            wishCycleDeck = shuffleArray(wishCycleDeck);
            wishCycleCursor = 0;
        }
        selectedIds.push(wishCycleDeck[wishCycleCursor]);
        wishCycleCursor += 1;
    }

    const byId = new Map(wishesData.map((entry) => [entry.id, entry]));
    return selectedIds.map((id) => byId.get(id)).filter(Boolean);
}

function findWishBubblePosition(width, height, bubbleWidth, bubbleHeight, placedRects) {
    const safeWidth = Math.max(width - bubbleWidth - 14, 8);
    const safeHeight = Math.max(height - bubbleHeight - 14, 8);
    let best = { left: 7, top: 7, score: Number.POSITIVE_INFINITY };

    for (let i = 0; i < 25; i += 1) {
        const left = 7 + Math.random() * safeWidth;
        const top = 7 + Math.random() * safeHeight;
        const currentRect = { left, top, right: left + bubbleWidth, bottom: top + bubbleHeight };

        let overlapScore = 0;
        placedRects.forEach((rect) => {
            const overlapX = Math.max(0, Math.min(currentRect.right, rect.right) - Math.max(currentRect.left, rect.left));
            const overlapY = Math.max(0, Math.min(currentRect.bottom, rect.bottom) - Math.max(currentRect.top, rect.top));
            overlapScore += overlapX * overlapY;
        });

        if (overlapScore < best.score) {
            best = { left, top, score: overlapScore };
            if (overlapScore === 0) break;
        }
    }

    return { left: best.left, top: best.top };
}

function playWishPopSound() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;

    if (!popAudioCtx) {
        popAudioCtx = new Ctx();
    }

    if (popAudioCtx.state === "suspended") {
        popAudioCtx.resume();
    }

    const now = popAudioCtx.currentTime;
    const oscillator = popAudioCtx.createOscillator();
    const gainNode = popAudioCtx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(70, now + 0.12);

    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    oscillator.connect(gainNode);
    gainNode.connect(popAudioCtx.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.12);
}

// Lightweight MD5 implementation for deterministic Gravatar hashes.
function md5(input) {
    function rotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function addUnsigned(lX, lY) {
        const lX8 = lX & 0x80000000;
        const lY8 = lY & 0x80000000;
        const lX4 = lX & 0x40000000;
        const lY4 = lY & 0x40000000;
        const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
        if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
            return lResult ^ 0x40000000 ^ lX8 ^ lY8;
        }
        return lResult ^ lX8 ^ lY8;
    }

    function F(x, y, z) { return (x & y) | (~x & z); }
    function G(x, y, z) { return (x & z) | (y & ~z); }
    function H(x, y, z) { return x ^ y ^ z; }
    function I(x, y, z) { return y ^ (x | ~z); }
    function FF(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
    function GG(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
    function HH(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
    function II(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }

    function convertToWordArray(value) {
        const lWordCount = (((value.length + 8) - ((value.length + 8) % 64)) / 64 + 1) * 16;
        const words = new Array(lWordCount - 1);
        let byteCount = 0;
        while (byteCount < value.length) {
            const wordCount = (byteCount - (byteCount % 4)) / 4;
            const bytePosition = (byteCount % 4) * 8;
            words[wordCount] = words[wordCount] | (value.charCodeAt(byteCount) << bytePosition);
            byteCount += 1;
        }
        const wordCount = (byteCount - (byteCount % 4)) / 4;
        const bytePosition = (byteCount % 4) * 8;
        words[wordCount] = words[wordCount] | (0x80 << bytePosition);
        words[lWordCount - 2] = value.length << 3;
        words[lWordCount - 1] = value.length >>> 29;
        return words;
    }

    function wordToHex(value) {
        let output = "";
        for (let i = 0; i <= 3; i += 1) {
            const temp = (value >>> (i * 8)) & 255;
            output += (`0${temp.toString(16)}`).slice(-2);
        }
        return output;
    }

    function utf8Encode(value) {
        return unescape(encodeURIComponent(value));
    }

    const x = convertToWordArray(utf8Encode(input));
    let a = 0x67452301;
    let b = 0xefcdab89;
    let c = 0x98badcfe;
    let d = 0x10325476;

    for (let k = 0; k < x.length; k += 16) {
        const AA = a;
        const BB = b;
        const CC = c;
        const DD = d;
        a = FF(a, b, c, d, x[k + 0], 7, 0xd76aa478);
        d = FF(d, a, b, c, x[k + 1], 12, 0xe8c7b756);
        c = FF(c, d, a, b, x[k + 2], 17, 0x242070db);
        b = FF(b, c, d, a, x[k + 3], 22, 0xc1bdceee);
        a = FF(a, b, c, d, x[k + 4], 7, 0xf57c0faf);
        d = FF(d, a, b, c, x[k + 5], 12, 0x4787c62a);
        c = FF(c, d, a, b, x[k + 6], 17, 0xa8304613);
        b = FF(b, c, d, a, x[k + 7], 22, 0xfd469501);
        a = FF(a, b, c, d, x[k + 8], 7, 0x698098d8);
        d = FF(d, a, b, c, x[k + 9], 12, 0x8b44f7af);
        c = FF(c, d, a, b, x[k + 10], 17, 0xffff5bb1);
        b = FF(b, c, d, a, x[k + 11], 22, 0x895cd7be);
        a = FF(a, b, c, d, x[k + 12], 7, 0x6b901122);
        d = FF(d, a, b, c, x[k + 13], 12, 0xfd987193);
        c = FF(c, d, a, b, x[k + 14], 17, 0xa679438e);
        b = FF(b, c, d, a, x[k + 15], 22, 0x49b40821);
        a = GG(a, b, c, d, x[k + 1], 5, 0xf61e2562);
        d = GG(d, a, b, c, x[k + 6], 9, 0xc040b340);
        c = GG(c, d, a, b, x[k + 11], 14, 0x265e5a51);
        b = GG(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa);
        a = GG(a, b, c, d, x[k + 5], 5, 0xd62f105d);
        d = GG(d, a, b, c, x[k + 10], 9, 0x02441453);
        c = GG(c, d, a, b, x[k + 15], 14, 0xd8a1e681);
        b = GG(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
        a = GG(a, b, c, d, x[k + 9], 5, 0x21e1cde6);
        d = GG(d, a, b, c, x[k + 14], 9, 0xc33707d6);
        c = GG(c, d, a, b, x[k + 3], 14, 0xf4d50d87);
        b = GG(b, c, d, a, x[k + 8], 20, 0x455a14ed);
        a = GG(a, b, c, d, x[k + 13], 5, 0xa9e3e905);
        d = GG(d, a, b, c, x[k + 2], 9, 0xfcefa3f8);
        c = GG(c, d, a, b, x[k + 7], 14, 0x676f02d9);
        b = GG(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);
        a = HH(a, b, c, d, x[k + 5], 4, 0xfffa3942);
        d = HH(d, a, b, c, x[k + 8], 11, 0x8771f681);
        c = HH(c, d, a, b, x[k + 11], 16, 0x6d9d6122);
        b = HH(b, c, d, a, x[k + 14], 23, 0xfde5380c);
        a = HH(a, b, c, d, x[k + 1], 4, 0xa4beea44);
        d = HH(d, a, b, c, x[k + 4], 11, 0x4bdecfa9);
        c = HH(c, d, a, b, x[k + 7], 16, 0xf6bb4b60);
        b = HH(b, c, d, a, x[k + 10], 23, 0xbebfbc70);
        a = HH(a, b, c, d, x[k + 13], 4, 0x289b7ec6);
        d = HH(d, a, b, c, x[k + 0], 11, 0xeaa127fa);
        c = HH(c, d, a, b, x[k + 3], 16, 0xd4ef3085);
        b = HH(b, c, d, a, x[k + 6], 23, 0x04881d05);
        a = HH(a, b, c, d, x[k + 9], 4, 0xd9d4d039);
        d = HH(d, a, b, c, x[k + 12], 11, 0xe6db99e5);
        c = HH(c, d, a, b, x[k + 15], 16, 0x1fa27cf8);
        b = HH(b, c, d, a, x[k + 2], 23, 0xc4ac5665);
        a = II(a, b, c, d, x[k + 0], 6, 0xf4292244);
        d = II(d, a, b, c, x[k + 7], 10, 0x432aff97);
        c = II(c, d, a, b, x[k + 14], 15, 0xab9423a7);
        b = II(b, c, d, a, x[k + 5], 21, 0xfc93a039);
        a = II(a, b, c, d, x[k + 12], 6, 0x655b59c3);
        d = II(d, a, b, c, x[k + 3], 10, 0x8f0ccc92);
        c = II(c, d, a, b, x[k + 10], 15, 0xffeff47d);
        b = II(b, c, d, a, x[k + 1], 21, 0x85845dd1);
        a = II(a, b, c, d, x[k + 8], 6, 0x6fa87e4f);
        d = II(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0);
        c = II(c, d, a, b, x[k + 6], 15, 0xa3014314);
        b = II(b, c, d, a, x[k + 13], 21, 0x4e0811a1);
        a = II(a, b, c, d, x[k + 4], 6, 0xf7537e82);
        d = II(d, a, b, c, x[k + 11], 10, 0xbd3af235);
        c = II(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb);
        b = II(b, c, d, a, x[k + 9], 21, 0xeb86d391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }

    return `${wordToHex(a)}${wordToHex(b)}${wordToHex(c)}${wordToHex(d)}`.toLowerCase();
}

function buildGravatarUrl(name) {
    const identity = `${sanitizeWishValue(name).toLowerCase().replace(/\s+/g, ".")}@wish.local`;
    const hash = md5(identity);
    return `https://www.gravatar.com/avatar/${hash}?s=96&d=identicon&r=g`;
}

function burstWishBubble(bubble) {
    if (!wishBubbleField || !bubble || bubble.classList.contains("popping")) return;
    bubble.classList.add("popping");
    playWishPopSound();

    const bubbleRect = bubble.getBoundingClientRect();
    const fieldRect = wishBubbleField.getBoundingClientRect();
    const originX = bubbleRect.left - fieldRect.left + bubbleRect.width / 2;
    const originY = bubbleRect.top - fieldRect.top + bubbleRect.height / 2;
    const shardCount = 8;

    for (let index = 0; index < shardCount; index += 1) {
        const angle = (Math.PI * 2 * index) / shardCount;
        const distance = 16 + Math.random() * 34;
        const shard = document.createElement("span");
        shard.className = "wish-pop-piece";
        shard.style.left = `${originX}px`;
        shard.style.top = `${originY}px`;
        shard.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
        shard.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
        wishBubbleField.appendChild(shard);
        setTimeout(() => shard.remove(), 540);
    }

    setTimeout(() => {
        bubble.remove();
        renderWishBubbles();
    }, 240);
}

function renderWishBubbles() {
    if (!wishBubbleField) return;
    wishBubbleField.innerHTML = "";

    const visibleWishes = pickCycledWishes(10);
    if (!visibleWishes.length) {
        const empty = document.createElement("p");
        empty.className = "wish-bubble-empty";
        empty.textContent = "No wishes yet. Add one and watch it float.";
        wishBubbleField.appendChild(empty);
        return;
    }

    const fieldWidth = wishBubbleField.clientWidth || 680;
    const fieldHeight = wishBubbleField.clientHeight || 520;
    const placedRects = [];

    visibleWishes.forEach((entry) => {
        const bubble = document.createElement("button");
        bubble.type = "button";
        bubble.className = "wish-bubble";
        bubble.setAttribute("aria-label", `Wish by ${entry.name}`);

        const head = document.createElement("div");
        head.className = "wish-bubble-head";

        const avatar = document.createElement("img");
        avatar.className = "wish-bubble-avatar";
        avatar.src = buildGravatarUrl(entry.name);
        avatar.alt = `${entry.name} avatar`;

        const name = document.createElement("p");
        name.className = "wish-bubble-name";
        name.textContent = `- ${entry.name}`;

        head.appendChild(avatar);
        head.appendChild(name);

        const wishTitle = document.createElement("p");
        wishTitle.className = "wish-bubble-wish";
        wishTitle.textContent = entry.text;

        bubble.appendChild(head);
        bubble.appendChild(wishTitle);

        const timestamp = document.createElement("p");
        timestamp.className = "wish-bubble-time";
        timestamp.textContent = entry.createdAtIst || formatIstTimestamp(entry.createdAt || Date.now());
        bubble.appendChild(timestamp);
        wishBubbleField.appendChild(bubble);

        const bubbleWidth = bubble.offsetWidth || 188;
        const bubbleHeight = bubble.offsetHeight || 108;
        const position = findWishBubblePosition(fieldWidth, fieldHeight, bubbleWidth, bubbleHeight, placedRects);

        bubble.style.left = `${position.left}px`;
        bubble.style.top = `${position.top}px`;
        bubble.style.setProperty("--float-duration", `${7 + Math.random() * 6}s`);
        bubble.style.animationDelay = `-${Math.random() * 4.5}s`;

        placedRects.push({
            left: position.left,
            top: position.top,
            right: position.left + bubbleWidth,
            bottom: position.top + bubbleHeight
        });

        bubble.addEventListener("click", () => burstWishBubble(bubble));
    });
}

function handleWishSubmit(event) {
    event.preventDefault();

    const nameValue = sanitizeWishValue(wishName?.value);
    const wishValue = sanitizeWishValue(wishText?.value);

    if (!nameValue || !wishValue) {
        setWishStatus("Please enter both your name and a well wish.", true);
        return;
    }

    wishesData.unshift({
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        name: nameValue,
        text: wishValue,
        createdAt: new Date().toISOString(),
        createdAtIst: formatIstTimestamp(Date.now())
    });

    saveWishesToStorage();
    rebuildWishCycleDeck();
    setWishStatus("Wish sent. Tap any floating bubble to pop it.");
    wishesForm.reset();
    renderWishBubbles();
    closeWishFormModal();
}

function toggleWishesPanel() {
    if (!weddingWishesPanel || !openWishesBtn) return;
    const isOpen = weddingWishesPanel.classList.toggle("open");
    openWishesBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (isOpen) {
        requestAnimationFrame(renderWishBubbles);
        setWishStatus(
            wishesData.length
                ? `Showing ${Math.min(10, wishesData.length)} of ${wishesData.length} wishes in dreamy cycle mode.`
                : "Be the first to leave a blessing."
        );
        weddingWishesPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    queuePanelSectionState(document.getElementById("countdown"));
}

function setupWeddingWishes() {
    if (!openWishesBtn || !weddingWishesPanel || !wishesForm || !wishBubbleField) return;

    wishesData = loadWishesFromStorage();
    rebuildWishCycleDeck();
    setWishStatus(
        wishesData.length
            ? `${wishesData.length} wish${wishesData.length === 1 ? "" : "es"} saved. Open Wishes Garden to view.`
            : "Be the first to leave a blessing."
    );

    openWishesBtn.addEventListener("click", toggleWishesPanel);
    wishesForm.addEventListener("submit", handleWishSubmit);

    if (!wishesRefreshTimer) {
        wishesRefreshTimer = setInterval(() => {
            if (weddingWishesPanel.classList.contains("open")) {
                renderWishBubbles();
            }
        }, 9000);
    }
}

unlockBtn.addEventListener("click", unlockLoveLetter);
secretInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        unlockLoveLetter();
    }
});

applyTabVisibilityConfig();
bindTabs();
setupTabSectionScrollExperience();
activateInitialTab("home");
setupRevealAnimations();
setupMemoryLightbox();
setupActivityModal();
setupWishFormModal();
setupWishShareLink();
setupWeddingItinerary();
setupWeddingWishes();
setupBackgroundMusic();
updateTimers();
setInterval(updateTimers, 1000);
