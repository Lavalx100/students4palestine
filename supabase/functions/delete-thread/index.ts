// deleteThread.ts
import express from "express";
import { createClient } from "@supabase/supabase-js";

// Create an Express app instance
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Retrieve Supabase credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

// Create a Supabase client using the service role key (for elevated privileges)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Define a POST route for deleting a thread
app.post("/delete-thread", async (req, res) => {
  try {
    const { threadId } = req.body;
    if (!threadId) {
      return res.status(400).json({ error: "Missing threadId" });
    }

    // Call the RPC to delete the thread (with cascade)
    const { error } = await supabase.rpc("delete_thread_cascade", {
      _thread_id: threadId,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    let errorMessage = "Unknown error";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return res.status(400).json({ error: errorMessage });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
