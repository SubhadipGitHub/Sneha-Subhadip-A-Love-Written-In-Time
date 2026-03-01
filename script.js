const startDate = new Date("March 1, 2025 00:00:00").getTime();

function updateTimer() {
    const now = new Date().getTime();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("timer").innerHTML =
        days + " Days " + hours + " Hours " +
        minutes + " Minutes " + seconds + " Seconds Together 💖";
}

setInterval(updateTimer, 1000);

const memories = [
    "Sharing Kunafa on our first date — sweet like the beginning of us 🍮",
    "Having JD Honey together and our first kiss — warmth I’ll never forget 🥃💋",
    "Our first trip to Wayanad — where love felt endless 🌄",
    "Our first dance at my house — just us and the music 💃",
    "Our first bike ride — wind, laughter, and you holding me 🏍",
    "Watching sunset at Agara Lake — golden sky, golden memories 🌅",
    "New Year at your house — paan, chocolates & midnight magic 🎉",
    "The day we decided to get married — our forever began 💍",
    "Ooty before our wedding — one last trip before forever 🌲",
    "Our first Valentine date — candlelight concert & heartbeats 🕯"
];

function showMemory(index) {
    document.getElementById("memoryText").innerText = memories[index];
}

function unlockLove() {
    const password = prompt("Enter the secret word:");
    if(password === "forever") {
        document.getElementById("secret").innerText =
            "Sneha, from Kunafa to forever… I choose you today, tomorrow and always. ❤️";
    } else {
        alert("Wrong password ❤️");
    }
}