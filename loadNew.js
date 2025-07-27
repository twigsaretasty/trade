console.log("I'm alive!")

function formatNum(num) {
    // If less than 10, add a leading zero
    if (num < 10) {
        return `0${num}`
    }
    return num
}

Promise.all([
    fetch('weekly-profile.json').then(response => response.json()),
    fetch('new.json').then(response => response.json()),
]).then(([profileData, newData]) => {
    // Get the date from profile data
    const endThisWeek = new Date(profileData.last_seen);

    // Get the exact day of the last logged date
    const endThisWeekDay = endThisWeek.getDate();
    
    // Set up the start and end times
    const startThisWeek = new Date(endThisWeek);
    const startLastWeek = new Date(endThisWeek)

    // Set the start to 7 and 14 days before
    startThisWeek.setDate(endThisWeekDay - 7);
    startLastWeek.setDate(endThisWeekDay - 14);

    const nowMonth = formatNum(endThisWeek.getMonth() + 1);
    const nowDay = formatNum(endThisWeek.getDate());
    const startThisMonth = formatNum(startThisWeek.getMonth() + 1);
    const startThisDay = formatNum(startThisWeek.getDate());

    const thisWeekDates = `${startThisMonth}-${startThisDay} - ${nowMonth}-${nowDay}`;
    
    // These are the same values just renaming for clarity
    const endLastMonth = startThisMonth;
    const endLastDay = startThisDay;

    // Set values for last week's count
    const startLastMonth = formatNum(startLastWeek.getMonth() + 1);
    const startLastDay = formatNum(startLastWeek.getDate());
    const lastWeekDates = `${startLastMonth}-${startLastDay} - ${endLastMonth}-${endLastDay}`;

    // add this to html
    document.getElementById('this-week').textContent = thisWeekDates;
    document.getElementById('last-week').textContent = lastWeekDates;

    // NEW DATA

    const thisWeek = newData.thisWeekIns;
    const lastWeek = newData.lastWeekIns;

    if (thisWeek.length != 0) {
        const ul = document.getElementById('this')
        ul.innerHTML = thisWeek
        .map(item =>
            `<li>${item}</li>`
        ).join('');
    }

    if (lastWeek.length != 0) {
        const ul = document.getElementById('last')
        ul.innerHTML = lastWeek
        .map(item =>
            `<li>${item}</li>`
        ).join('');
    }

})

function showAudios() {
    console.log("adding current class")
    document.getElementById("audios").classList.toggle("display");
}

function showVideos() {
    console.log("adding current class")
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