const express = require("express");

const app = express();
const PORT = 3000;

// system prompt
const SYS_PROMPT = "you are helpful AI for pathfinder application which is a simplified guide for students (especially from Nepal) to find their future specialization degree. Write in PLAIN TEXT without * or # symbols. Your answer should be short, simple and focused for Nepal. If Nepal has no good option for the degree, say foreign university is recommeneded (avoid saying university name directly unless it is very well known and reputed)"


app.use(express.static("."));
app.use(express.json());

// api setup to ask AI
app.post("/chat", async (req, res) => {

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {

        method: "POST",
        headers: {

            "Authorization": "Bearer " + process.env.NV_API_KEY,
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            model: "meta/muse-glimmer-30b",
            messages: [
                
                { role: "system", content: "SYS_PROMPT" + req.body.context },
                { role: "user", content: req.body.question },
            ]
        })
    });

    if (!response.ok) return res.json( response.status );

    const data = await response.json();
    res.json({ answer: data.choices[0].message.content })
})

app.listen(PORT, () => {
    console.log("running at http://localhost:" + PORT);
});