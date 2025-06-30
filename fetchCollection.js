import fetch from 'node-fetch';

import { writeFileSync } from 'fs';

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://encora.it/api/';

async function get_collection() {
    const allRecords = [];
    let url = BASE_URL + "collection";

    while (url) {
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + API_KEY,
            'Accept': 'application/json'
        },
        muteHttpExceptions: true
        });
        
        const json = await response.json();

        if (json.data) {
        allRecords.push(...json.data);
        console.log('Fetched more records: ' + json.data.length + ' | Total: ' + allRecords.length)
        }
        // Check for pagination URL
        url = json.next_page_url ? json.next_page_url : null;
    }
    
    return allRecords

}

function formatCharacter(performer, character, status) {
    // Set the status if needed, otherwise leave it empty
    const statusText = status ? `${status} ` : '';
    // Returns like "Stephanie J. Block (Elphaba)" or "Becky Gulsvig (u/s Elle Woods)"
    return `${performer} (${statusText}${character})`
}

function formatNotes(master_notes, general_notes, my_notes) {
    if (master_notes && general_notes && my_notes) {
        // All exist
        return `MASTER NOTES: ${master_notes}<br><br>GENERAL NOTES: ${general_notes}<br><br>MY NOTES: ${my_notes}`;
    }
    else if (master_notes && general_notes && !my_notes) {
        // Only master and general exist
        return `MASTER NOTES: ${master_notes}<br><br>GENERAL NOTES: ${general_notes}`;
    }
    else if (master_notes && !general_notes && my_notes) {
        // Only master and my notes exist
        return `MASTER NOTES: ${master_notes}<br><br>MY NOTES: ${my_notes}`;
    }
    else if (!master_notes && general_notes && my_notes) {
        // Only general and my notes exist
        return `GENERAL NOTES: ${master_notes}<br><br>MY NOTES: ${my_notes}`;
    }
    else if (master_notes && !general_notes && !my_notes) {
        // Only master notes exist
        return master_notes;
    }
    else if (!master_notes && general_notes && !my_notes) {
        // Only general exist
        return general_notes;
    }
    else if (!master_notes && !general_notes && my_notes) {
        // Only mine exist
        return my_notes;
    }
    else {
        // In any other case, return nothing
        return '';
    }
}

function formatSize(formatStr) {
    // Get the size
    try {
        // Split the format by the indicator
        const formatArray = formatStr.split(' - ');
        return formatArray
    }
    catch (error) {
        // If no size is found, return null
        console.log(`Possible null format value.`);
        return null;
    }
}

function calcNft(timestamp) {
    // Get the timestamp and convert it to an object
    const date = new Date(timestamp);
    // Get today's date
    const now = new Date();
    
    // Calculate the difference in days
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);
    
    if (diffDays > 0) {
        // In the past, so it's not NFT
        return false;
    } else {
        // In the future, so it's NFT
        return true;
    }
}

function parse_date(date) {
    if (!date) return 'Unknown';

    let formattedDate = '';

    if (date.month_known) {
        if (date.day_known) {
        formattedDate = date.full_date; // Use full date if day is known
        } else {
        formattedDate = date.full_date.substring(0, 7); // Use only YYYY-MM if day is unknown
        }
    } else {
        formattedDate = date.full_date.substring(0, 4); // Use only YYYY if month is unknown
    }

    if (date.date_variant) {
        formattedDate += ` (${date.date_variant})`; // Append date variant if available
    }

    return formattedDate;
}

function formatRecording(id, records) {
    // Make sure the ID exists
    const match = records.find(r => r.recording.id === id);

    // If no match is found, return null
    if (!match) return null;

    // Format the notes
    const formattedNotes = formatNotes(
        match.recording.master_notes, 
        match.recording.notes,
        match.notes
    )
    
    // Simplify the data call
    const rec = match.recording;

    // Set time as Unknown by default
    let time = 'U'

    if (rec.date.time === "evening") {
        // If evening is found, reset the variable to E
        time = 'E'
    }
    else if (rec.date.time === "matinee") {
        // If matinee is found, reset the variable to M
        time = 'E';
    }

    // Get the array for the format
    const formatArray = formatSize(match.format);
    const format = formatArray ? formatArray[0] : '';
    const size = formatArray ? formatArray[1] : '';

    // Calculate if the recording is NFT
    const isNft = calcNft(rec.nft.nft_date);

    // TODO: check for NFT forever
    // low priority since I don't have any

    // Return the formatted recording as an object with all needed information

    return {
        id: rec.id,
        show: rec.show,
        tour: rec.tour,
        date: parse_date(rec.date),
        time: time,
        master: rec.master,
        media_type: rec.metadata.media_type,
        cast: rec.cast.map(c => (
            formatCharacter(c.performer.name, c.character.name, c.status?.abbreviation || '')
        )).join(', '),
        notes: formattedNotes,
        amount_recorded: rec.metadata.amount_recorded,
        gifting_status: rec.metadata.gifting_status,
        limited_status: rec.metadata.limited_status,
        nft: isNft,
        format: format,
        size: size
    };
}

function createDictionaries(recordings) {
    // Create dictionaries for audio and video
    const audios = [];
    const videos = [];
    
    // For each, check if it is audio or video
    recordings.forEach(rec => {
        const type = rec.media_type?.toLowerCase();
        
        // Push to the respective array
        if (type === 'audio') {
            audios.push(rec);
        }
        else if (type === 'video') {
            videos.push(rec);
        }
    });
    
    return { audios, videos };
}

function groupRecordings(recordings) {
    // Group recordings by show
    const grouped = {};
    
    recordings.forEach(rec => {
        // Add the show if it doesn't already exist
        if (!grouped[rec.show]) {
            grouped[rec.show] = [];
        }
        grouped[rec.show].push(rec);
    });
    
    return grouped;
}

function stripArticle(title) {
    // Remove the article from the title for sorting
    const remove = [
        'a ', 'an ', 'the ',
        'de ', 'het ', 'een ', 't ', '\'t ',
        'el ', 'la ', 'los ', 'las ',
        'le ', 'las ', 'la ', 'les ',
        'der ', 'die ', 'das ', 'den ', 'dem ', 'des ',
        'ang ', 'sa ', 'ng ', 'mga ', '[ ', '& ']

    let newTitle = title.toLowerCase();

    for (const article of remove) {
        if (newTitle.startsWith(article)) {
            // Remove the article from the start of the title
            return newTitle.slice(article.length);
        }
    }

    return newTitle;
}

async function main() {
    const records = await get_collection();

    const formattedRecordings = records.map(record => formatRecording(record.recording.id, records)).filter(Boolean);

    const { audios, videos } = createDictionaries(formattedRecordings);

    const groupedAudios = groupRecordings(audios);
    const groupedVideos = groupRecordings(videos);

    const sortedAudioKeys = Object.keys(groupedAudios).sort((a, b) => {
        return stripArticle(a).localeCompare(stripArticle(b));
    });

    const sortedVideoKeys = Object.keys(groupedVideos).sort((a, b) => {
        return stripArticle(a).localeCompare(stripArticle(b));
    });

    const sortedGroupedAudios = {};
    const sortedGroupedVideos = {};

    sortedAudioKeys.forEach(key => {
        sortedGroupedAudios[key] = groupedAudios[key];
    });

    sortedVideoKeys.forEach(key => {
        sortedGroupedVideos[key] = groupedVideos[key];
    });

    writeFileSync(
        `./audios.json`,
        JSON.stringify(sortedGroupedAudios, null, 2),
        'utf-8'
    );

    writeFileSync(
        `./videos.json`,
        JSON.stringify(sortedGroupedVideos, null, 2),
        'utf-8'
    );

    console.log('Saved all formatted recordings!');
}

main()