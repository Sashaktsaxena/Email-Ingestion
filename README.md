📧 Email PDF Extractor
This project fetches emails from Outlook using IMAP, extracts attached PDFs, and provides download links in a Next.js frontend.

/project-root
│── /pages
│   ├── /api
│   │   ├── fetchEmails.js  # API route to fetch emails via IMAP
│   ├── index.js            # Next.js page displaying emails with PDF links
│
│── /components
│   ├── EmailList.js        # Component rendering emails with PDF download links
│
│── /pdfs                   # Local folder where PDFs are stored
│
│── .env.local              # Environment variables for IMAP credentials
│── next.config.js          # Next.js configuration
│── package.json            # Dependencies and scripts
│── README.md               # This documentation



🔧 Environment Variables
Create a .env.local file in the root directory and add:

IMAP_HOST=imap.outlook.com
IMAP_PORT=993
IMAP_USER=your-email@example.com
IMAP_PASSWORD=your-email-password
NEXT_PUBLIC_API_URL=http://localhost:3000/api/fetchEmails



✅ Testing Steps
To confirm PDFs are fetched and downloadable:

Run the project:

npm install
npm run dev


Check API response: Open http://localhost:3000/api//api/email-ingestion in a browser or Postman to verify that email data is fetched successfully.
Check UI: Open http://localhost:3000/ in a browser and ensure emails with PDF attachments are displayed.
The pdfs folder would be generated and the pdf will save when the api is called 
