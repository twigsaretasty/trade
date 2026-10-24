import fetch from 'node-fetch';

import { writeFileSync } from 'fs';

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://encora.it/api/';

// lists
const highest = []
const high = []
const mid = []
const low = []
const lowest = []
const inprogress = []

async function get_wants() {
    const allRecords = [];
    let url = BASE_URL + "wants";

    while (url) {
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + API_KEY,
            'Accept': 'application/json'
        },
        muteHttpExceptions: true
        });
        // console.log(response); // debug
        
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

    if (date.time === "matinee") {
        formattedDate += " (M)"; // append to variant if matinee
    }

    return formattedDate;
}

function parse_amount(metadata) {
    if (metadata.amount_recorded === "complete")
        return null
    else if (metadata.amount_recorded === "highlights")
        return 'Highlights'
    else if (metadata.amount_record === "partial")
        return 'Partial'
}

function parse_nft(rec)
{
    // is it nft?
    let isNft = calcNft(rec.nft_date)

    if (isNft) {
        return `NFT: ${rec.nft_date.split('T')[0]}`
    }

    if (rec.nft_forever) {
        return `NFT Forever`
    }

    return null
}

function formatRecording(recording, records) {
    // make sure we arent hallucinating
    const match = records.find(r => r.recording.id === recording.id);

    // return null if not
    if (!match) return null;

    // less typing 4 me
    const rec = match.recording

    // format everything into an object

    return {
        id: rec.id,
        show: rec.show,
        tour: rec.tour,
        date: parse_date(rec.date),
        master: rec.master,
        nft: parse_nft(rec.nft), 
        media_type: rec.metadata.media_type,
        amount: parse_amount(rec.metadata),
        priority: match.priority
    }

}

function formatSmall(obj)
{
    // ex: Legally Blonde | Broadway | 2007-08-09 (M) | SunsetBlvd79 | Video | Highlights | NFT: 2043-02-12
    let rec = `${obj.show} | ${obj.tour} | ${obj.date} | ${obj.master} | ${obj.media_type == "audio" ? "Audio" : "Video"}`
    
    if (obj.amount == "highlights" || obj.amount == "partial")
        rec += ` | ${obj.amount}`

    if (obj.nft != null)
        rec += ` | ${obj.nft}`

    return rec
}

function stripArticle(title) {
    // Remove the article from the title for sorting
    const remove = [
        'a ', 'an ', 'the ',
        'de ', 'het ', 'een ', 't ', '\'t ',
        'el ', 'la ', 'los ', 'las ',
        'le ', 'las ', 'la ', 'les ',
        'der ', 'die ', 'das ', 'den ', 'dem ', 'des ',
        'ang ', 'sa ', 'ng ', 'mga ', '[', '& ']

    let newTitle = title.toLowerCase();

    for (const article of remove) {
        if (newTitle.startsWith(article)) {
            // Remove the article from the start of the title
            return newTitle.slice(article.length);
        }
    }

    return newTitle;
}

function sortRecording(recording) {
    // push to the respective list
    // 0 - in progress
    // 1 - lowest
    // 2 - low
    // 3 - medium
    // 4 - high
    // 5 - highest

    let rec = formatSmall(recording)

    switch (recording.priority)
    {
        case(1): lowest.push(rec); break;
        case(2): low.push(rec); break;
        case(3): mid.push(rec); break;
        case(4): high.push(rec); break;
        case(5): highest.push(rec); break;
        case(0): inprogress.push(rec); break;
        case -1:
            break;
    }
}

function sortByShowTitle(list) {
    list.sort((a, b) => {
        const showA = a.split(' | ')[0];
        const showB = b.split(' | ')[0];
        return stripArticle(showA).localeCompare(stripArticle(showB));
    });
}

async function main() {
    // get the records
    const records = await get_wants()

    // format them
    const formattedRecordings = records
        .map(record => 
            formatRecording(record.recording, records)
        ).filter(Boolean)

    formattedRecordings.forEach(recording => {
        sortRecording(recording)
    });

    [lowest, low, mid, high, highest].forEach(sortByShowTitle);

    const wants = { lowest, low, mid, high, highest, inprogress }

    writeFileSync(
        `public/wants.json`,
        JSON.stringify(wants, null, 2),
        'utf-8'
    );
}

main()