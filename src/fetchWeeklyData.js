import fetch from 'node-fetch';

import { writeFileSync } from 'fs';

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://encora.it/api/';

async function getProfile() {
    const url = BASE_URL + 'profile';

    const response = await fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
    }
    });

    const json = await response.json();

    const formattedProfile = {
        profile: json.profile,
        slug: json.slug,
        username: json.username,
        name: json.name,
        pronouns: json.pronouns,
        email: json.public_email,
        status: json.status,
        last_seen: json.last_seen_at,
        recordings: json.recordings_count,
        wants: json.wants_count
    };

    writeFileSync('../public/weekly-profile.json', JSON.stringify(formattedProfile, null, 2));

    console.log('Weekly profile info saved.');
}

getProfile().catch(console.error);