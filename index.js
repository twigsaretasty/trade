console.log("Trading home page is alive!");

function getDays(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);

    if (diffDays < 1) {
        return "today";
    } else if (Math.floor(diffDays) === 1) {
        return "Yesterday";
    } else {
        return `${Math.floor(diffDays)}` + " days ago";
    }
}

Promise.all([
    fetch('profile.json').then(response => response.json()),
    fetch('weekly-profile.json').then(response => response.json()),
]).then(([profileData, weeklyData]) => {
    // const profile = data.profile;
    // const slug = data.slug;
    // const username = data.username;
    // const name = data.name;
    // const pronouns = data.pronouns;
    // const email = data.email;
    const status = profileData.status;
    const lastSeen = profileData.last_seen;
    const recordingsCount = profileData.recordings;
    // const wantsCount = data.wants;
    
    // Set status
    document.getElementById('status').textContent = status;
    
    // Apply respective styles for status
    if (status === "open") {
        document.getElementById('status').classList.add('status-open');
    }
    else if (status === "closed") {
        document.getElementById('status').classList.add('status-closed');
    }
    else if (status === "limited") {
        document.getElementById('status').classList.add('status-limited');
    }
    
    // Get last seen days
    const lastSeenString = getDays(lastSeen);
    
    // Add last seen to HTML
    document.getElementById('seen').textContent = lastSeenString;

    // Set weekly
    const weeklyRecordingsCount = weeklyData.recordings

    // Calculate recordings count
    let pendingCount = recordingsCount - weeklyRecordingsCount;

    // Calculate full count
    let nonencora = 5; // <-- UPDATE HERE
    let newTotal = (weeklyRecordingsCount + nonencora)

    // Add recordings count
    document.getElementById('recordings').textContent = newTotal;
    document.getElementById('pending').textContent = pendingCount;
})

function addClass(query) {
    console.log("adding current class")
    document.querySelector(query).classList.add('current')
}

document.querySelector(".dropdown").addEventListener("click", function () {
    addClass(".dropdown")
});