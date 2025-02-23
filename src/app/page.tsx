"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  const fetchEmails = async () => {
    try {
      const res = await fetch("/api/email-ingestion");
      const data = await res.json();
      console.log("Full Email Details:", data); // Check the response in console
  
      if (data.error) {
        alert(`Error: ${data.error}`);
        return;
      }
  
      data.forEach((email) => {
        console.log(`📧 Email ID: ${email.id}`);
        console.log(`📌 Snippet: ${email.snippet}`);
        console.log(`📂 Payload:`, email.payload);
      });
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };
  
  
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Email PDF Fetcher</h1>

      {!session ? (
        <button
          onClick={() => signIn("google")}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Sign in with Google
        </button>
      ) : (
        <>
          <p className="mt-4">Signed in as {session.user?.email}</p>
          <button
            onClick={fetchEmails}
            className="mt-4 p-2 bg-green-500 text-white rounded"
          >
            Fetch PDF Emails
          </button>
          <button
            onClick={() => signOut()}
            className="mt-4 p-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  );
}
