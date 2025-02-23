import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma"; // Prisma client
import fs from "fs-extra";
import path from "path";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const accessToken = session.accessToken;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Access token missing" }), { status: 401 });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth });

    // Fetch message IDs containing PDFs
    const { data } = await gmail.users.messages.list({
      userId: "me",
      q: "has:attachment filename:pdf",
    });

    if (!data.messages) {
      return new Response(JSON.stringify({ message: "No emails found" }), { status: 404 });
    }

    const pdfDir = path.join(process.cwd(), "pdfs");
    await fs.ensureDir(pdfDir);

    for (const message of data.messages) {
      const msg = await gmail.users.messages.get({ userId: "me", id: message.id });

      // Debugging logs
      console.log("Fetched email message:", JSON.stringify(msg.data, null, 2));

      if (!msg.data.payload) {
        console.warn(`Skipping message ${message.id}: No payload found.`);
        continue;
      }

      const headers = msg.data.payload.headers || [];
      const fromHeader = headers.find((h) => h.name === "From")?.value || "Unknown";
      const subjectHeader = headers.find((h) => h.name === "Subject")?.value || "No Subject";
      const dateHeader = headers.find((h) => h.name === "Date")?.value || new Date().toISOString();

      if (msg.data.payload.parts) {
        for (const part of msg.data.payload.parts) {
          if (part.filename && part.body?.attachmentId) {
            const attachment = await gmail.users.messages.attachments.get({
              userId: "me",
              messageId: message.id,
              id: part.body.attachmentId,
            });

            if (!attachment.data || !attachment.data.data) {
              console.warn(`Skipping attachment in message ${message.id}: No attachment data found.`);
              continue;
            }

            const buffer = Buffer.from(attachment.data.data, "base64");
            const filePath = path.join(pdfDir, part.filename);
            await fs.writeFile(filePath, buffer);
            console.log("Saving metadata:", {
              fromAddress: fromHeader,
              dateReceived: new Date(dateHeader),
              subject: subjectHeader,
              attachmentFileName: part.filename,
              filePath,
              emailConfig: {
                connect: { emailAddress: session.user?.email || "" },
              },
            });

            const userEmail = session.user?.email;
            if (!userEmail) {
              console.error("Error: User email is missing");
              return new Response(JSON.stringify({ error: "User email is missing" }), { status: 400 });
            }
            
            // Try to find the email config
            let emailConfig = await prisma.emailIngestionConfig.findUnique({
              where: { emailAddress: userEmail },
              select: { id: true },
            });
            
            // If no config found, create a new one
            if (!emailConfig) {
              console.warn(`No email config found for ${userEmail}. Creating a new one.`);
            
              emailConfig = await prisma.emailIngestionConfig.create({
                data: {
                  emailAddress: userEmail,
                  userId: session.user?.id || "unknown", // Assuming you have userId from NextAuth
                  provider: "Gmail", // Change this based on your logic
                },
                select: { id: true },
              });
            
              console.log(`Created new email config with ID: ${emailConfig.id}`);
            }
            
            // Store metadata in database
            await prisma.emailMetadata.create({
              data: {
                emailConfigId: emailConfig.id, // Use the ID directly
                fromAddress: fromHeader,
                dateReceived: new Date(dateHeader),
                subject: subjectHeader,
                attachmentFileName: part.filename,
                filePath,
              },
            });
            

            
            
          }
        }
      }
    }

    return new Response(JSON.stringify({ message: "PDFs downloaded and saved to DB" }), { status: 200 });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
