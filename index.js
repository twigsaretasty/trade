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
    const profile = profileData.profile;
    // const slug = data.slug; // should be the same    
    // const username = data.username; // should be the same
    // const name = data.name; // should be the same
    // const pronouns = data.pronouns; // should be the same
    // const email = data.email; // not displaying here; should be the same
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
    let nonencora = 12; // <-- UPDATE HERE
    let newTotal = (weeklyRecordingsCount + nonencora)

    // Add recordings count
    document.getElementById('recordings').textContent = newTotal;
    document.getElementById('pending').textContent = pendingCount;

    // update the profile info
    document.getElementById('profile').innerHTML = profile;
})

function showAudios() {
    document.getElementById("audios").classList.toggle("display");
}

function showVideos() {
    document.getElementById("videos").classList.toggle("display");
}

window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
    var myDropdown = document.querySelector(".dropdown");
        if (myDropdown.classList.contains('display')) {
        myDropdown.classList.remove('display');
        }
    }
}
