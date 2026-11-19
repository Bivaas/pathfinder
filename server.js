const express = require("express");
const careers = require("./careers.json");

const app = express();
const PORT = 3000;

// system prompt
const SYS_PROMPT = "you are helpful AI for pathfinder, a simplified guide for students (especially from Nepal) to find their future specialization degree after +2. Write in PLAIN TEXT without * or # symbols. Your answer should be short, simple and focused for Nepal. If Nepal has no good option for the degree, say foreign university is recommeneded (avoid saying university name directly unless it is very well known and reputed)"

const QUIZ = "You are helpful AI for pathfinder, a simplified guide for students in Nepal after +2" + "Read the student's quiz answer and what they wrote about themselves then pick one field that fits them the best. " + "Write in PLAIN TEXT without * or # symbols" + "On line 1, write only field name. Then suggest 3 degrees from that field, each with a short season and description " + "Only use the fields and degrees from the list: \n";

// fields with degrees
const FIELD_LIST = careers.children.map(field => 

    field.name + ": " + field.children.map(degree => degree.name).join(", ")
).join("\n");


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

    if (!response.ok) return res.status(502).json( response.status );

    const data = await response.json();
    res.json({ answer: data.choices[0].message.content })
})

// AI decides field 
app.post("/quiz", async (req, res) => {

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {

        method: "POST",
        headers: {

            "Authorization": "Bearer " + process.env.NV_API_KEY,
            "Content-Type": "application/json"
        },

        body: JSON.stringify ({ 

            model: "meta/muse-glimmer-30b",
            messages: [

                { rile: "system", content: QUIZ + FIELD_LIST },

                { role: "user", content: "My answers: \n" + req.body.answers.join("\n") + "\nAbout me: " + req.body.about }
            ]
        })
    });

    if (!response.ok) return res.status(502).json({ error: response.status });

    const data = await response.json();
    const lines = data.choices[0].message.content.split("\n");
    const field = careers.children.map(f => f.name).find(name => lines[0].includes(name));

    res.json ({ field: field, reasons: lines.slice(1).join("\n").trim() });
})


app.listen(PORT, () => {
    console.log("running at http://localhost:" + PORT);
});