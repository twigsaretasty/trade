"""
1. Load an excel file
2. Convert it to a json file
"""

import json, pandas as pd
from datetime import datetime

filename = "twigsaretasty-Collection-2025-05-30.xlsx"

df = pd.read_excel(filename)
def format_date(date_str):
    try:
        date = datetime.strptime(date_str, "%B %d, %Y")
        return date.strftime("%Y-%m-%d")
    except ValueError:
        try:
            date = datetime.strptime(date_str, "%B, %Y")
            return date.strftime("%Y-%m")
        except ValueError:
            return date_str
        

def format_notes(master_notes, recording_notes, trader_notes):
    if (not pd.isnull(master_notes) 
        and not pd.isnull(recording_notes)):
        # Both notes exist, list both
        notes = f"MASTER NOTES: {master_notes}<br><br>GENERAL NOTES: {recording_notes}"
    elif (not pd.isnull(master_notes)
        and pd.isnull(recording_notes)):
        # Only master notes exist, just list master's
        notes = master_notes
    elif (pd.isnull(master_notes)
        and not pd.isnull(recording_notes)):
        # Only general notes exist, just list general
        notes = recording_notes
    else:
        # No notes exist
        notes = ""

    # Further logic
    if not pd.isnull(trader_notes):
        # If trader notes exist, define those last
        notes += f"<br><br>MY NOTES: {trader_notes}"

    return notes


def get_id(link):
    """Get the id of a recording from the link."""
    num = link.split("/")[-2]
    id = "e-" + num
    return id


def check_fields(id):
    """Check if all the fields are the same."""
    return


audios = {}
videos = {}

def format_recordings():
    """Format recordings to dictionary."""
    for index, row in df.iterrows():
        # First, get the link to get the id
        link = row["Link"] # Link - 22
        id = get_id(link)

        # Used to decide what dictionary to add to
        recording_type = row["Audio / Video"] # Audio/Video - 0

        # Differentiates between shows
        show = row["Show"] # Show - 1
        date = row["Date"] # Date - 3
        date = format_date(date)

        print(id)

        # See if the show already exists

        if recording_type == "Audio":
            # See if show already exists
            if show not in audios:
                audios[show] = []

            # See if performance already exists
            # if id in audios[show]:
            #     # already in there so skip it
            #     check_fields(id)
            #     return
            
            # Define the list to append to
            append = audios

        else:
            # See if show already exists
            if show not in videos:
                videos[show] = []

            # See if show already exists
            # if id in videos[show]:
            #     # already in there, check to make sure there haven't been any updates
            #     check_fields(id)
            #     return
            
            # Define the list to append to
            append = videos

        # Check to see if it's not a bootleg
        if row["Type"] != "Bootleg":
            # Set the master to the "type"
            master = row["Type"] # Type - 14
        else:
            # Otherwise, set it to the master
            master = row["Master"] # Master - 5
            
        time = row["Matinée / Evening"] # Matinee/Evening - 4
        # Set the time to the first letter
        if time == "Matinee":
            time = "M"
        elif time == "Evening":
            time = "E"
        else:
            time == ""

        # Set the format and size values
        try:
            format_size = row["Format"].split(" - ") # Format - 16
            format = format_size[0]
            size = format_size[1]
        except AttributeError:
            # Format is missing, skip for now
            continue

        # Get the master notes
        master_notes = row["Master Notes"] # Master Notes - 7
        # Get recording notes
        recording_notes = row["Notes"] # Notes - 8
        # Get trader (my) notes
        trader_notes = row["My Notes"] # My Notes - 17

        notes = format_notes(master_notes, recording_notes, trader_notes)
            
        nft_date = row["NFT Date"] # NFT Date - 9
        nft = "No"

        # Check if nft_date is not null/empty and is a valid date in the future
        if not pd.isnull(nft_date) and str(nft_date).strip() != "":
            try:
                # If already a datetime, use it; otherwise, try to parse
                if not isinstance(nft_date, datetime):
                    nft_date_parsed = pd.to_datetime(nft_date)
                else:
                    nft_date_parsed = nft_date

                if nft_date_parsed < datetime.now():
                    nft = "No"
                else:
                    # Add the date to the notes
                    nft = "Yes"
                    notes = f"NFT Date: {nft_date_parsed.strftime('%Y-%m-%d')}<br><br>" + notes
            except Exception:
                # If parsing fails, just add the raw value
                nft = "Yes"
                notes = f"NFT Date: {nft_date}<br><br>" + notes

        # nft_f = row["NFT Forever"] # NFT Forever - 10
        # if nft_date != "" and nft_date > datetime.now():
        #     nft = "No"

        gifting = row["Gifting Status"] # Gifting Status - 12

        if gifting == "Gift on Request":
            gifting = "req"
        elif gifting == "Never Gift":
            gifting = "ng"
        else:
            gifting = "none"
            
        lts = row["Limited Trade Status"] # Limited Trade Status - 13
        if lts != "Unrestricted":
            lts = "limited"
        
        amount_recorded = row["Amount Recorded"] # Amount Recorded - 18

        if amount_recorded == "Partial recording":
            amount = "partial"
        elif amount_recorded == "Highlights":
            amount = "highlights"
        else:
            amount = "full"

        collected = row["Collected"] # Collected - 21

        # Data displayed on the site, needed in dictionary
        performance = {
            "id" : id,
            "tour" : row["Tour"], # Tour - 2
            "date" : date,
            "time" : time,
            "master" : master,
            "cast" : row["Cast"], # Cast - 6
            "notes" : notes,
            "format" : format,
            "size": size,
            # These aren't being shown, but need to be collected for colour coords or other reasons
            "nft": nft,
            "gifting": gifting,
            "limited": lts,
            "amount": amount,
            "collected": collected,
        }

        # Data not needed but keeping just in case
        # nfs = row["Not For Sale"] # Not For Sale - 11
        # venue = row["Venue"] # Venue - 19
        # city = row["City"] # City - 20
        # release_format = row["Release Format"] # Release Format - 15

        # Everything should be good now, so append the performance
        append[show].append(performance)

format_recordings()

with open("audios.json", "w") as file:
    print("Creating audios file.")
    json.dump(audios, file, indent=4)

with open("videos.json", "w") as file:
    print("Creating videos file.")
    json.dump(videos, file, indent=4)