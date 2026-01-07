export default async function handler(req, res) {
  const message = req.body.message;

  if (!message || !message.text) {
    return res.status(200).send("OK");
  }

  const chatId = message.chat.id;
  const userText = message.text;

  // Call OpenAI
  const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional business assistant responding via Telegram."
        },
        { role: "user", content: userText }
      ]
    })
  });

  const aiData = await aiRes.json();
  const reply = aiData.choices[0].message.content;

  // Send reply to Telegram
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply
      })
    }
  );

  res.status(200).send("OK");
}
