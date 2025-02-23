import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

 // ✅ REMOVE `/route`

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("SESSION DATA:", session);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const accessToken = session.accessToken;
    console.log("ACCESS TOKEN:", accessToken);

    if (!accessToken) {
      return new Response("Access token missing", { status: 401 });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth });

    const response = await gmail.users.messages.list({
      userId: "me",
      q: "has:attachment filename:pdf",
    });

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return new Response(`Error fetching emails: ${error.message}`, { status: 500 });
  }
}
