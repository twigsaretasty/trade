var acc = document.getElementsByClassName('accordion');
var i;

for (i = 0; i < acc.length; i++) {
acc[i].addEventListener('click', function() {
    /* Toggle between adding and removing the 'active' class,
    to highlight the button that controls the panel */
    this.classList.toggle('active');

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === 'block') {
    panel.style.display = 'none';
    } else {
    panel.style.display = 'block';
    }
});
}

fetch('audios.json')
    .then(response => response.json())
    .then(data => {
        function showInfo(name, tableId) {
            const showContainer = document.getElementById('shows');
            const count = data[name].length;

            // See if table exists
            let tableElement = document.getElementById(tableId);

            if (!tableElement) {
                // Create the accordion button
                const button = document.createElement('button');
                button.className = 'accordion';
                button.textContent = `${name} (${count})`;

                // Add accordion event listener for dynamically created button
                button.addEventListener('click', function() {
                    this.classList.toggle('active');
                    const panel = this.nextElementSibling;
                    if (panel.style.display === 'block') {
                        panel.style.display = 'none';
                    } else {
                        panel.style.display = 'block';
                    }
                });

                // Create panel
                const panel = document.createElement('div');
                panel.className = 'panel';

                // Create table
                const table = document.createElement('table');
                table.className = 'show';
                table.id = tableId;

                // Add table stuff
                table.innerHTML = `
                    <thead class="table-header text">
                        <tr>
                            <th style="width: 13%">tour</th>
                            <th style="width: 8%">date</th>
                            <th style="width: 4%">time</th>
                            <th style="width: 6%">master</th>
                            <th style="width: 27%">cast</th>
                            <th style="width: 25%">notes</th>
                            <th style="width: 9%">format</th>
                            <th style="width: 8%">size</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                    `;

                // Append table to panel
                panel.appendChild(table);
                showContainer.appendChild(button);
                showContainer.appendChild(panel);

                tableElement = table; // Update tableElement to the newly created table
            } else {
                const buttons = document.querySelectorAll('.accordion');
                buttons.forEach(button => {
                    if (button.textContent.includes(name)) {
                        button.textContent = `${name} (${count})`;
                    }
                });
            }

            const tbody = document.querySelector(`#${tableElement.id} tbody`);
            
            console.log(data)
            data[name].sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            })
            data[name].forEach(item => {
                const row = document.createElement('tr');
                row.classList.add('data-row');

                if (item.limited === 'limited')
                    row.classList.add('limited')

                if (item.gifting === 'req')
                    row.classList.add('gift-on-req')
                else if (item.gifting === 'ng')
                    row.classList.add('never-gift')

                if (item.amount == 'partial')
                    row.classList.add('partial')
                else if (item.amount == 'highlights')
                    row.classList.add('highlights')

                row.innerHTML = `
                    <td>${item.tour}</td>
                    <td>${item.date}</td>
                    <td>${item.time}</td>
                    <td>${item.master}</td>
                    <td><div class='scroll'>${item.cast}</div></td>
                    <td><div class='scroll'>${item.notes}</div></td>
                    <td>${item.format}</td>
                    <td>${item.size}</td>
                `;
                tbody.appendChild(row)
            })
        }
        showInfo('The 25th Annual Putnam County Spelling Bee', 'spelling-bee')
        showInfo('Anastasia', 'anastasia')
        showInfo('Back to the Future: The Musical', 'bttf')
        showInfo('Cabaret', 'cabaret')
        showInfo('Catch Me If You Can', 'catch')
        showInfo('Dear Evan Hansen', 'deh')
        showInfo('Falsettos', 'falsettos')
        showInfo('Footloose', 'footloose')
        showInfo('The Great Gatsby', 'greatgatsby')
        showInfo('Hadestown', 'hadestown')
        showInfo('Heathers: The Musical', 'heathers')
        showInfo('Hell\'s Kitchen', 'hellskitchen')
        showInfo('Into the Woods', 'intothewoods')
        showInfo('Legally Blonde', 'lb')
        showInfo('Mama I\'m A Big Girl Now!', 'mama')
        showInfo('Mean Girls', 'meangirls')
        showInfo('Les Mis\u00e9rables', 'lesmis')
        showInfo('Monty Python\'s Spamalot', 'spamalot')
        showInfo('Next to Normal', 'nexttonormal')
        showInfo('Oh, Mary!', 'ohmary')
        showInfo('The Outsiders', 'outsiders')
        showInfo('Something Rotten!', 'somethingrotten')
        showInfo('The Toxic Avenger', 'toxicavenger')
        showInfo('Waitress', 'waitress')
        showInfo('Wicked', 'wicked')
    })
    .catch(error => console.error('Error fetching JSON:', error));