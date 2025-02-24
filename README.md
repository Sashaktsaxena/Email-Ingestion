📧 Email PDF Extractor
This project fetches emails from Outlook using IMAP, extracts attached PDFs, and provides download links in a Next.js frontend.

The pdfs folder is directly in the root directory (D:\email-ingestion\pdfs)

The page.tsx is in this path email-ingestion\src\app\page.tsx


🔧 Environment Variables
Create a .env.local file in the root directory and add:

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GMAIL_REFRESH_TOKEN=
DATABASE_URL=




✅ Testing Steps
To confirm PDFs are fetched and downloadable:

Run the project:

npm install
npm run dev


Check API response: Open http://localhost:3000/api//api/email-ingestion in a browser or Postman to verify that email data is fetched successfully.

Check UI: Open http://localhost:3000/ in a browser and ensure emails with PDF attachments are displayed.

The pdfs folder would be generated and the pdf will save when the api is called 
