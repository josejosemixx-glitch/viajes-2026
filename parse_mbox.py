import mailbox
import email
from email.header import decode_header
import sys
import os

mbox_path = "/Users/joseluissanchezmoreno/Library/CloudStorage/OneDrive-Personal/Aplicaciones/Google\u2060 Download Your Data/Todo el correo, con Spam y Papelera incluidos-663.mbox"

def get_decoded_str(header_str):
    if not header_str:
        return ""
    try:
        decoded_parts = decode_header(header_str)
        return "".join([str(part[0], part[1] or 'utf-8', errors='ignore') if isinstance(part[0], bytes) else part[0] for part in decoded_parts])
    except:
        return str(header_str)

def get_body(msg):
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                try:
                    return part.get_payload(decode=True).decode(errors='ignore')
                except:
                    return ""
    else:
        try:
            return msg.get_payload(decode=True).decode(errors='ignore')
        except:
            return ""
    return ""

def search_mbox():
    if not os.path.exists(mbox_path):
        print(f"File not found: {mbox_path}")
        return
        
    mbox = mailbox.mbox(mbox_path)
    print(f"Total emails: {len(mbox)}")
    
    keywords = ["pacifico", "visa signature", "seguro de viaje", "airbnb", "cordillera", "cordilera"]
    
    count = 0
    for message in mbox:
        count += 1
        if count % 10000 == 0:
            print(f"Processed {count} emails...")
            
        subject = get_decoded_str(message.get("subject", "")).lower()
        body = get_body(message).lower()
        combined = subject + " " + body
        
        for k in keywords:
            if k in combined:
                print(f"MATCH [{k}]: Subject: {subject}")
                with open(f"match_{k.replace(' ', '_')}_{count}.txt", "w", encoding="utf-8") as f:
                    f.write(f"Subject: {subject}\n")
                    f.write(f"Date: {message.get('date', '')}\n")
                    f.write(f"Body: {body[:1000]}\n")
                break # save once per message if matched
                
if __name__ == "__main__":
    search_mbox()
