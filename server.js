const express = require("express");

const app = express();
const PORT = 3000;


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
            messages: [{ role: "user", content: req.body.question }]
        })
    });

    if (!response.ok) return res.json( response.status );

    const data = await response.json();
    res.json({ answer: data.choices[0].message.content })
})

app.listen(PORT, () => {
    console.log("running at http://localhost:" + PORT);
});