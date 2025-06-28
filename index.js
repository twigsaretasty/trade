console.log("Trading home page.");

function getDays(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);

    console.log(`${diffDays} days`)

    if (diffDays < 1) {
        return "today";
    } else if (diffDays === 2) {
        return "1 day ago";
    } else {
        return `${Math.floor(diffDays)} diffDays` + " days ago";
    }
}

fetch('profile.json')
    .then(response => response.json())
    .then(data => {
        const profile = data.profile;
        const slug = data.slug;
        const username = data.username;
        const name = data.name;
        const pronouns = data.pronouns;
        const email = data.email;
        const status = data.status;
        const lastSeen = data.last_seen;
        const recordingsCount = data.recordings;
        const wantsCount = data.wants;

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

        // Add recordings count
        document.getElementById('recordings').textContent = recordingsCount;
    })