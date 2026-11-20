const path = require("path");
const express = require("express");
const careers = require("./public/careers.json");

const app = express();
const PORT = process.env.PORT || 3000;

// absolute path so it works no matter which folder the server starts from (Vercel runs it elsewhere)
const PUBLIC_DIR = path.join(__dirname, "public");

// fast model with thinking turned off (muse-glimmer took 50-120s per answer)
const MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";

// system prompt
const SYS_PROMPT = "you are helpful AI for pathfinder, a simplified guide for students (especially from Nepal) to find their future specialization degree after +2. Write in PLAIN TEXT without * or # symbols. Your answer should be short, simple and focused for Nepal. If Nepal has no good option for the degree, say foreign university is recommeneded (avoid saying university name directly unless it is very well known and reputed)"

const QUIZ = "You are helpful AI for pathfinder, a simplified guide for students in Nepal after +2. " + "Read the student's quiz answer and what they wrote about themselves then pick one field that fits them the best. " + "Write in PLAIN TEXT without * or # symbols. " + "On line 1, write only field name. Then suggest 3 degrees from that field, each with a short reason and description. " + "Only use the fields and degrees from the list: \n";

// fields with degrees
const FIELD_LIST = careers.children.map(field =>

    field.name + ": " + field.children.map(degree => degree.name).join(", ")
).join("\n");


app.use(express.static(PUBLIC_DIR));
app.use(express.json());

// sends messages to NVIDIA and returns the reply text (throws a readable error message)
async function askAI(messages) {

    let response;

    try {

        response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {

            method: "POST",
            headers: {

                "Authorization": "Bearer " + process.env.NV_API_KEY,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                model: MODEL,
                messages: messages,
                max_tokens: 600,
                // turn off thinking so the answer comes back fast
                chat_template_kwargs: { enable_thinking: false }
            }),

            // give up after 60 seconds instead of hanging forever
            signal: AbortSignal.timeout(60000)
        });

    } catch (error) {

        throw new Error(error.name === "TimeoutError" ? "AI took too long, try again" : "Could not reach AI");
    }

    if (response.status === 429) throw new Error("Too many requests, try again in a minute");
    if (!response.ok) throw new Error("AI error " + response.status);

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;

    if (!answer) throw new Error("AI gave an empty answer, try again");

    // model still sometimes uses markdown, strip it
    return answer.replace(/[*#]/g, "").trim();
}

// api setup to ask AI
app.post("/chat", async (req, res) => {

    const question = (req.body.question || "").trim();
    if (!question) return res.status(400).json({ error: "Type a question first" });

    try {

        const answer = await askAI([

            { role: "system", content: SYS_PROMPT + "\n\nThe student is looking at:\n" + (req.body.context || "nothing selected") },
            { role: "user", content: question },
        ]);

        res.json({ answer: answer });

    } catch (error) {

        res.status(502).json({ error: error.message });
    }
})

// AI decides field
app.post("/quiz", async (req, res) => {

    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];

    try {

        const reply = await askAI([

            { role: "system", content: QUIZ + FIELD_LIST },
            { role: "user", content: "My answers: \n" + answers.join("\n") + "\nAbout me: " + (req.body.about || "") }
        ]);

        // find the field in the first few lines (AI sometimes writes "Field: Software" or a heading first)
        const names = careers.children.map(f => f.name);
        const lines = reply.split("\n").filter(line => line.trim());
        let field;
        let fieldLine = -1;

        for (let i = 0; i < Math.min(3, lines.length) && !field; i++) {

            // pick the name that appears first in the line ("Humanities (Political Science)" is Humanities)
            const line = lines[i].toLowerCase();
            const found = names.filter(name => line.includes(name.toLowerCase()));
            found.sort((a, b) => line.indexOf(a.toLowerCase()) - line.indexOf(b.toLowerCase()));

            if (found.length) {

                field = found[0];
                fieldLine = i;
            }
        }

        res.json ({ field: field, reasons: lines.slice(fieldLine + 1).join("\n").trim() });

    } catch (error) {

        res.status(502).json({ error: error.message });
    }
})


// locally: start the server. On Vercel: just export the app, Vercel runs it.
if (require.main === module) {

    app.listen(PORT, () => {
        console.log("running at http://localhost:" + PORT);
    });
}

module.exports = app;
