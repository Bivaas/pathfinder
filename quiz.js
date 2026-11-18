 const questions = [

    {
        text: "what is fun ?",

        options: [

            { text: "Making cool apps and websites", field: "Software" },
            { text: "opening gadgets and fixing things", field: "Hardware" },
            { text: "Helping sick and injured people", field: "Medical"},
            { text: "selling things and running a shop", field: "Business"}
        ]
    },

 {
    text: "What is your favourite subject ?",
    options: [

        { text: "Computer", field: "Software" },
        { text: "Physics", field: "Engineering" },
        { text: "Biology", field: "Medical" },
        { text: "Account", field: "Business" }

    ]
 }
 ];

 // answer points
let scores = {

    Software: 0, 
    Hardware: 0,
    Engineering: 0,
    Medical: 0,
    Science: 0,
    Business: 0,
    Law: 0,
    Humanities: 0
}


//  one question and answer
 function showQuestion(index) {

    const question = questions[index];

    const quiz = document.getElementById("quiz");
    quiz.innerHTML = "<p>" + question.text + "</p>";

    question.options.forEach(option => {

        const button = document.createElement("button");
        button.textContent = option.text;
        
        button.addEventListener("click", () => {

            if (index + 1 < questions.length) {

                scores[option.field] = scores[option.field] + 1;

                showQuestion(index + 1);

            } else {

                showResult();
            }
        });

        quiz.appendChild(button);
    })
 }

// answers to fields
function showResult() {

    let best = "Software";

    for (const field in scores) {

        if (scores[field] > scores[best]) {

            best = field;
        }
    }

    document.getElementById("quiz").innerHTML = "<p>Your best career match is: " + best + "</p>";

    document.getElementById("quiz").innerHTML += "<a href='index.html?field=" + best + "'>See " + best + " in the career map</a>";
}

showQuestion(0);