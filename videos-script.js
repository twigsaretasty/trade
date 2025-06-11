var acc = document.getElementsByClassName('accordion');
var i;
console.log("yyup im alive");

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

fetch('videos.json')
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

                if (item.nft === 'Yes')
                    row.classList.add('nft');

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
        showInfo('42nd Street', 'fortysecond')
        showInfo('The Addams Family', 'addamsfamily')
        showInfo('All Shook Up', 'allshookup')
        showInfo('Am\u00e9lie', 'amelie')
        showInfo('Anastasia', 'anastasia')
        showInfo('Anything Goes', 'anythinggoes')
        showInfo('Assassins', 'assassins')
        showInfo('Avenue Q', 'avenueq')
        showInfo('Back to the Future: The Musical', 'bttf')
        showInfo('The Band\'s Visit', 'bandsvisit')
        showInfo('Be More Chill', 'bmc')
        showInfo('Beetlejuice', 'beetlejuice')
        showInfo('Between the Lines', 'between')
        showInfo('Big Fish', 'bigfish')
        showInfo('The Book of Mormon', 'bom')
        showInfo('Boop! The Musical', 'boop')
        showInfo('Bright Star', 'brightstar')
        showInfo('Cabaret', 'cabaret')
        showInfo('Catch Me If You Can', 'cmifyc')
        showInfo('Cats', 'cats')
        showInfo('Charlie and the Chocolate Factory', 'charlie')
        showInfo('Chicago', 'chicago')
        showInfo('A Chorus Line', 'chorus')
        showInfo('Cinderella (Andrew Lloyd Webber)', 'cinderella-alw')
        showInfo('Come From Away', 'comefromaway')
        showInfo('Concerts (Miscellaneous)', 'concertsmisc')
        showInfo('Dear Evan Hansen', 'deh')
        showInfo('Death Becomes Her', 'death')
        showInfo('Dogfight', 'dogfight')
        showInfo('The Drowsy Chaperone', 'drowsy')
        showInfo('Elegies: A Song Cycle', 'elegies')
        showInfo('Elf', 'elf')
        showInfo('Falsettos', 'falsettos')
        showInfo('Frozen', 'frozen')
        showInfo('Funny Girl', 'funnygirl')
        showInfo('Gatsby: An American Myth', 'gatsbymyth')
        showInfo('The Great Gatsby', 'greatgatsby')
        showInfo('Groundhog Day', 'groundhogday')
        showInfo('Gutenberg! The Musical', 'gutenberg')
        showInfo('Gypsy', 'gypsy')
        showInfo('Hadestown', 'hadestown')
        showInfo('Hairspray', 'hairspray')
        showInfo('Hamilton', 'hamilton')
        showInfo('Heathers: The Musical', 'heathers')
        showInfo('Hell\'s Kitchen', 'hellskitchen')
        showInfo('Hercules', 'hercules')
        showInfo('How to Succeed in Business Without Really Trying', 'howtosucceed')
        showInfo('If/Then', 'ifthen')
        showInfo('In the Heights', 'intheheights')
        showInfo('Into the Woods', 'intothewoods')
        showInfo('Jekyll and Hyde (Wildhorn)', 'jnh')
        showInfo('Jersey Boys', 'jerseyboys')
        showInfo('& Juliet', 'njuliet')
        showInfo('The King and I', 'kingandi')
        showInfo('Legally Blonde', 'lb')
        showInfo('The Little Mermaid', 'tlm')
        showInfo('Little Shop of Horrors', 'lsoh')
        showInfo('Little Women (Howland/Dickstein/Knee)', 'littlewomen')
        showInfo('Mame', 'mame')
        showInfo('Man of La Mancha', 'lamancha')
        showInfo('Maybe Happy Ending', 'mhe')
        showInfo('Me and My Girl', 'menmygirl')
        showInfo('Mean Girls', 'meangirls')
        showInfo('Merrily We Roll Along', 'merrily')
        showInfo('Les Mis\u00e9rables', 'lesmis')
        showInfo('Monty Python\'s Spamalot', 'spamalot')
        showInfo('Moulin Rouge! The Musical', 'moulinrouge')
        showInfo('Mrs. Doubtfire', 'doubtfire')
        showInfo('The Muppets Take The Bowl', 'muppets')
        showInfo('Murder Ballad', 'murderballad')
        showInfo('The Music Man', 'musicman')
        showInfo('Natasha, Pierre & The Great Comet of 1812', 'greatcomet')
        showInfo('Newsies', 'newsies')
        showInfo('Next to Normal', 'nexttonormal')
        showInfo('The Notebook', 'notebook')
        showInfo('Oh, Mary!', 'ohmary')
        showInfo('Oliver!', 'oliver')
        showInfo('Operation Mincemeat', 'operation')
        showInfo('The Outsiders', 'outsiders')
        showInfo('Parade', 'parade')
        showInfo('Peter and the Starcatcher', 'starcatcher')
        showInfo('The Phantom of the Opera (Andrew Lloyd Webber)', 'phantom')
        showInfo('The Pirates of Penzance', 'pirates')
        showInfo('RENT', 'rent')
        showInfo('Ride', 'ride')
        showInfo('Ride The Cyclone', 'ridethecyclone')
        showInfo('School of Rock', 'schoolofrock')
        showInfo('She Loves Me', 'shelovesme')
        showInfo('Shrek: The Musical', 'shrek')
        showInfo('Six', 'six')
        showInfo('Smash', 'smash')
        showInfo('Some Like it Hot', 'somelikeithot')
        showInfo('Something Rotten!', 'somethingrotten')
        showInfo('The Sound of Music', 'soundofmusic')
        showInfo('The SpongeBob Musical', 'spongebob')
        showInfo('Spring Awakening', 'springawakening')
        showInfo('Suffs', 'suffs')
        showInfo('Sunset Boulevard', 'sunset')
        showInfo('Sweeney Todd: The Demon Barber of Fleet Street', 'sweeney')
        showInfo('Thoroughly Modern Millie', 'tmm')
        showInfo('Titanique', 'titanique')
        showInfo('Uncle Vanya', 'unclevanya')
        showInfo('Waitress', 'waitress')
        showInfo('Water for Elephants', 'waterforelephants')
        showInfo('Wicked', 'wicked')
    })
    .catch(error => console.error('Error fetching JSON:', error));