# Email PDF Extractor

A Next.js application that fetches emails from Outlook using IMAP, extracts PDF attachments, and provides a web interface for downloading them.

## 📋 Features

- IMAP integration with Outlook
- Automatic PDF attachment extraction
- Next.js frontend with download capabilities
- Google OAuth authentication
- Local PDF storage management

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm
- A Google Cloud Platform account for OAuth credentials
- Access to an Outlook email account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd email-ingestion
```

2. Install dependencies:
```bash
npm install
```

### Configuration

1. Create a `.env.local` file in the root directory with the following variables:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
DATABASE_URL=your_database_url
```

### Project Structure

```
email-ingestion/
├── src/
│   └── app/
│       └── page.tsx
├── pdfs/           # PDF storage directory
├── .env.local
└── package.json
```

## 🔧 Usage

1. Start the development server:
```bash
npm run dev
```

2. The application will be available at:
- Frontend: `http://localhost:3000`
- API Endpoint: `http://localhost:3000/api/email-ingestion`

### Testing

To verify the setup:

1. Access the API endpoint in your browser or Postman:
   ```
   http://localhost:3000/api/email-ingestion
   ```
   This should return email data in JSON format.

2. Visit the frontend:
   ```
   http://localhost:3000
   ```
   You should see a list of emails with PDF attachments.

3. The PDFs folder will be automatically generated when the API is called, and PDFs will be saved there.

## 📁 PDF Storage

PDFs are stored in the `pdfs` directory at the root of the project:
```
D:\email-ingestion\pdfs
```

## ⚠️ Important Notes

- Ensure your `.env.local` file is properly configured before running the application
- The PDFs directory is created automatically on first API call
- Make sure you have proper permissions set for PDF storage directory

## 🤝 Contributing

Feel free to submit issues and enhancement requests.
