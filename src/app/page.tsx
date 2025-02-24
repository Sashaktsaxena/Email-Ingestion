"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { FaGoogle, FaSignOutAlt, FaEnvelope, FaFilePdf } from "react-icons/fa";

export default function HomePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/email-ingestion");
      const data = await res.json();
      console.log("Full Email Details:", data);

      if (data.error) {
        alert(`Error: ${data.error}`);           
        return;
      }

      // Filter emails that contain PDF attachments
      const pdfEmails = data.filter((email) =>
        email.payload?.parts?.some((part) => part.filename?.endsWith(".pdf"))
      );
      console.log(data);
      setEmails(pdfEmails);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Email PDF Fetcher
        </h1>

        {!session ? (
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaGoogle />
            <span>Sign in with Google</span>
          </button>
        ) : (
          <div className="flex flex-col items-center">
            {session.user?.image && (
              <img
                src={session.user.image || "/placeholder.svg"}
                alt="Profile"
                className="w-24 h-24 rounded-full shadow-md border-4 border-white"
              />
            )}
            <p className="mt-4 text-xl font-semibold text-gray-800">
              {session.user?.name}
            </p>
            <p className="text-gray-600 mb-6">{session.user?.email}</p>

            <button
              onClick={fetchEmails}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 mb-3"
            >
              {isLoading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                <>
                  <FaEnvelope />
                  <span>Fetch PDF Emails</span>
                </>
              )}
            </button>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      {/* 📧 List of Emails with PDFs */}
      <div className="max-w-md w-full mt-6">
        {emails.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              Emails with PDFs 📂
            </h2>
            <ul className="divide-y divide-gray-200">
              {emails.map((email) => (
                <li key={email.id} className="py-3">
                  <p className="text-gray-800 font-semibold">{email.snippet}</p>
                  {email.payload.parts
                    .filter((part) => part.filename?.endsWith(".pdf"))
                    .map((pdf, index) => (
                      <a
                        key={index}
                        href={`data:application/pdf;base64,${pdf.body.data}`}
                        download={pdf.filename}
                        className="mt-2 flex items-center text-blue-500 hover:underline"
                      >
                        <FaFilePdf className="mr-2" />
                        <span>{pdf.filename}</span>
                      </a>
                    ))}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
