console.log("I'm alive!")

function formatNum(num) {
    // If less than 10, add a leading zero
    if (num < 10) {
        return `0${num}`
    }
    return num
}

Promise.all([
    fetch('new.json').then(response => response.json()),
]).then(([newData]) => {

    // first get today
    const today = new Date();

    // find the most recent sunday in in UTC
    const startThisWeek = new Date(today);
    startThisWeek.setUTCHours(0,0,0,0); // reset to midnight
    startThisWeek.setUTCDate(today.getUTCDate() - today.getUTCDay()) // set to most recent sunday

    // set the start of last week
    const startLastWeek = new Date(startThisWeek);
    startLastWeek.setUTCDate(startThisWeek.getUTCDate() - 7); // set to a week before

    const endThisWeek = new Date(startThisWeek);
    endThisWeek.setUTCDate(startThisWeek.getUTCDate() + 6); // set to saturday 
    console.log("end this week", endThisWeek)

    const endThisMonth = formatNum(endThisWeek.getUTCMonth() + 1);
    const endThisDay = formatNum(endThisWeek.getUTCDate());
    const startThisMonth = formatNum(startThisWeek.getUTCMonth() + 1);
    const startThisDay = formatNum(startThisWeek.getUTCDate());

    const thisWeekDates = `${startThisMonth}-${startThisDay} - ${endThisMonth}-${endThisDay}`;

    // set the end of last week
    const endLastWeek = new Date(startThisWeek);
    endLastWeek.setUTCDate(startThisWeek.getUTCDate() - 1);
    
    // These are the same values just renaming for clarity
    const endLastMonth = formatNum(endLastWeek.getUTCMonth() + 1);;
    const endLastDay = formatNum(endLastWeek.getUTCDate());;

    // Set values for last week's count
    const startLastMonth = formatNum(startLastWeek.getUTCMonth() + 1);
    const startLastDay = formatNum(startLastWeek.getUTCDate());
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