const wishesStorageKey = "wedding_wishes_v1";
const googleFormConfig = Object.freeze({
    actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfio5R8I7jqTdmQsqLD2_V05ZWoNqmCHZGnFe_jGzXWt6rztw/formResponse",
    nameEntryId: "entry.1388511805",
    wishEntryId: "entry.636900861"
});

const publicWishForm = document.getElementById("publicWishForm");
const publicWishName = document.getElementById("publicWishName");
const publicWishText = document.getElementById("publicWishText");
const publicWishStatus = document.getElementById("publicWishStatus");

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

function readWishes() {
    try {
        const raw = localStorage.getItem(wishesStorageKey);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveWishes(wishes) {
    localStorage.setItem(wishesStorageKey, JSON.stringify(wishes));
}

function setStatus(message, isError = false) {
    if (!publicWishStatus) return;
    publicWishStatus.textContent = message;
    publicWishStatus.classList.toggle("error", Boolean(isError));
}

async function submitWishToGoogleForm(name, text) {
    const payload = new URLSearchParams();
    payload.append(googleFormConfig.nameEntryId, name);
    payload.append(googleFormConfig.wishEntryId, text);

    // no-cors allows background submission to Google Forms from static pages.
    await fetch(googleFormConfig.actionUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: payload.toString()
    });
}

async function handlePublicWishSubmit(event) {
    event.preventDefault();

    const name = sanitizeWishValue(publicWishName?.value);
    const text = sanitizeWishValue(publicWishText?.value);

    if (!name || !text) {
        setStatus("Please fill in both fields before submitting.", true);
        return;
    }

    const wishes = readWishes();
    wishes.unshift({
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        name,
        text,
        createdAt: new Date().toISOString(),
        createdAtIst: formatIstTimestamp(Date.now())
    });

    saveWishes(wishes);

    try {
        await submitWishToGoogleForm(name, text);
        publicWishForm.reset();
        setStatus("Wish submitted successfully. Thank you for your blessings.");
    } catch (error) {
        publicWishForm.reset();
        setStatus("Wish saved, but Google Form submission failed. Please try again.", true);
    }
}

if (publicWishForm) {
    publicWishForm.addEventListener("submit", handlePublicWishSubmit);
}
