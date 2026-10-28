fetch('wants.json')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        const parent = document.getElementById('wants-bottom')
        function createDiv(list, properName) {
            // make sure there is data here
            if (list.length === 0) 
                return

            // create the button
            const button = document.createElement('button');
            button.className = 'accordion'
            button.textContent = `${properName} (${list.length})`

            // add an event listener for this button
            button.addEventListener('click', function() {
                this.classList.toggle('active');
                const wantsList = this.nextElementSibling;
                if (wantsList.style.display === 'block') {
                    wantsLists.style.display = 'none';
                } else {
                    wantsLists.style.display = 'block';
                }
            })

            // create the ul element
            const wantsLists = document.createElement(('ul'))
            wantsLists.className = 'wants-lists text'

            // add the li elements
            wantsLists.innerHTML = list.map(item => `<li>${item}</li>`).join('')

            // append everything
            parent.appendChild(button);
            parent.appendChild(wantsLists);
        }

        createDiv(data.highest, "Very High")
        createDiv(data.high, "High")
        createDiv(data.mid, "Medium")
        createDiv(data.low, "Low")
        createDiv(data.lowest, "Lowest")
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