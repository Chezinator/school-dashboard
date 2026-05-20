import json
import sys
import os
from datetime import datetime

def update_weekly_report_json(week_data, json_path):
    """
    Updates the weeklyReport.json with new week data.
    Ensures the data is a list of weeks.
    """
    try:
        if os.path.exists(json_path):
            with open(json_path, 'r') as f:
                data = json.load(f)
        else:
            data = []
        
        # Ensure data is a list
        if not isinstance(data, list):
            data = [data]
            
        # Check if week already exists (by weekOf), update or insert
        exists = False
        for i, week in enumerate(data):
            if week.get('weekOf') == week_data['weekOf']:
                data[i] = week_data
                exists = True
                break
        
        if not exists:
            # Insert at the beginning so newest week is first
            data.insert(0, week_data)
            
        with open(json_path, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Successfully updated {json_path}")
        return True
    except Exception as e:
        print(f"Error updating JSON: {e}")
        return False

def process_teacher_comms(raw_emails):
    """
    Example helper for Gideon to process raw emails into the interactive format.
    Gideon should call this during Phase 3.
    """
    processed = []
    for email in raw_emails:
        processed_email = {
            "teacher": email.get("sender_name", "Unknown Teacher"),
            "subject": email.get("subject", "No Subject"),
            "message": email.get("body", ""),
            "date": email.get("date", datetime.now().strftime("%Y-%m-%d")),
            "gmailUrl": email.get("thread_url", ""),
            "attachments": []
        }
        
        # Logic to identify URLs vs Files
        for att in email.get("attachments", []):
            if "http" in att.get("url", ""):
                processed_email["attachments"].append({
                    "name": att.get("name", "Link"),
                    "url": att["url"],
                    "type": "url"
                })
            else:
                processed_email["attachments"].append({
                    "name": att.get("name", "Attachment"),
                    "type": "file"
                })
        processed.append(processed_email)
    return processed

if __name__ == "__main__":
    if "--status" in sys.argv:
        print("School Engine Status: READY")
        print("Features: List-based JSON, Interactive Attachments, Swipe Support")
    else:
        print("Usage: python3 school_engine.py --status")
