import fetch from 'node-fetch';

import { writeFile, writeFileSync } from 'fs';

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://encora.it/api/';

async function formatRecoridng(id) {
    const url = `${BASE_URL}recording/${id}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Accept': 'application/json'
        }
    });

    const json = await response.json()

    if (!json.id) {
        console.log('Invalid or non-existent ID: ' + id);
        return null;
    }

    const formattedRecording = {
        id: json.id,
        show: json.show,
        tour: json.tour,
        date: json.date.full_date,
        master: json.master,
        venue: json.metadata.venue,
        city: json.metadata.city,
        media_type: json.metadata.media_type,
        recording_type: json.metadata.recording_type,
        amount_recorded: json.metadata.amount_recorded,
        gifting_status: json.metadata.gifting_status,
        limited_status: json.metadata.limited_status,
        has_subtitles: json.metadata.has_subtitles,
        cast: json.cast.map(c => ({
            performer: c.performer.name,
            character: c.character.name,
            status: c.status ?? '',
            })),
        notes: json.notes
    };

    return formattedRecording;
    
}

function parse_date(date) {
    if (!date) return 'Unknown';

    const formattedDate = '';

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
    
    writeFileSync('./collection.json', JSON.stringify(allRecords, null, 2))

    console.log('Collected data.')
}

get_collection().catch(console.error);
