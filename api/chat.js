export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userText } = req.body || {};
        const API_KEY = "এখানে_তোমার_আসল_Google_AI_Studio_API_Key_বসাও";

        if (!userText) {
            return res.status(400).json({ error: "Text is required" });
        }

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }]
            })
        });

        const data = await geminiRes.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: aiReply });
        } else {
            return res.status(500).json({ reply: "এআই থেকে সঠিক উত্তর পাওয়া যায়নি।" });
        }
    } catch (error) {
        return res.status(500).json({ reply: "সার্ভারে টেকনিক্যাল সমস্যা হয়েছে।" });
    }
}