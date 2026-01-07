export default async function handler(req, res) {
  const incomingMsg = req.body.Body;

  const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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
          content: "You are a professional WhatsApp customer support assistant for a business."
        },
        {
          role: "user",
          content: incomingMsg
        }
      ]
    })
  });

  const data = await aiResponse.json();
  const reply = data.choices[0].message.content;

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(`
    <Response>
      <Message>${reply}</Message>
    </Response>
  `);
}
