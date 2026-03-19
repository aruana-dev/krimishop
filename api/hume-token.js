export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.HUME_API_KEY;
  const secretKey = process.env.HUME_SECRET_KEY;

  if (!apiKey || !secretKey) {
    return res.status(500).json({ error: "Hume credentials not configured" });
  }

  try {
    const response = await fetch("https://api.hume.ai/oauth2-cc/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + Buffer.from(apiKey + ":" + secretKey).toString("base64"),
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      console.error("Hume token error:", response.status);
      return res.status(502).json({ error: "Failed to get access token" });
    }

    const data = await response.json();
    return res.status(200).json({ accessToken: data.access_token });
  } catch (err) {
    console.error("Hume token error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
