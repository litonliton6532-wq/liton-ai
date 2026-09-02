export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userText } = req.body || {};
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!userText) {
            return res.status(400).json({ reply: "দয়া করে কিছু লিখুন।" });
        }

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }]
            })
        });

        const data = await geminiRes.json();

        // সেফ চেক করে রেসপন্স বের করা
        if (data && data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                const aiReply = candidate.content.parts[0].text;
                return res.status(200).json({ reply: aiReply });
            }
        }

        // যদি এআই কোনো ব্লক বা অন্য কারণে রেসপন্স না দেয়
        return res.status(200).json({ reply: "দুঃখিত, এআই থেকে কোনো উত্তর আসেনি। API Key ঠিক আছে কি না চেক করুন।" });

    } catch (error) {
        return res.status(500).json({ reply: "সার্ভারে টেকনিক্যাল সমস্যা হয়েছে।" });
    }
}