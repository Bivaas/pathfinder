//  quiz questions
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
 },

 {
    text: "How do you spend time in a free day?",

    options: [

        { text: "Doing experiments or watching nature shows", field: "Science" },
        { text: "Debating and making counter arguments", field: "Law" },
        { text: "Reading, writing or drawing", field: "Humanities" },
        { text: "Building and fixing things", field: "Engineering" }
    ]
 },

{
    text: "Which job sounds cool ?",
    options: [

        { text: "Researcher in a lab", field: "Science" },
        { text: "Lawyer in a court", field: "Law" },
        { text: "Journalist or teacher", field: "Humanities" },
        { text: "Designing electronic circuits", field: "Hardware" } 
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

let answers = [];


//  one question and answer
 function showQuestion(index) {

    const question = questions[index];

    const quiz = document.getElementById("quiz");
    quiz.innerHTML = "<p>" + question.text + "</p>";

    question.options.forEach(option => {

        const button = document.createElement("button");
        button.textContent = option.text;
        
        button.addEventListener("click", () => {

            scores[option.field] = scores[option.field] + 1;
            answers.push(question.text + " " + option.text );

            if (index + 1 < questions.length) {


                showQuestion(index + 1);

            } else {

                showAbout();
            }
        });

        quiz.appendChild(button);
    })
 }


//  about me box
function showAbout() {

    const quiz = document.getElementById("quiz");
    quiz.innerHTML = "<<p>Describe yourself (hobbies, academics, dream job) </p>";

    const box = document.createElement("textarea");
    box.id = "about";
    box.rows = 4;
    box.cols = 40;
    quiz.appendChild(box);

    const button = document.createElement("button");
    button.textContent = "See my result";
    button.addEventListener("click", showResult);
    quiz.appendChild(button);
}


// answers to fields
function showResult() {

    const about = document.getElementById("about").value;

    let best = "Software";

    for (const field in scores) {

        if (scores[field] > scores[best]) {

            best = field;
        }
    }

    showPick(best, "asking AI for personal pick....");

    fetch("/quiz", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify ({ answers: answers, about: about })
    })

        .then(response => response.json())
        .then(data => {

            if (data.error) {
                showPick(best, "");
                Toastify({ text: data.error, style: { background: "#b00020" }}).showToast();
            }

            else {

                showPick(data.field || best, data.reasons);
            }
        })

        .catch(() => {

            showPick(best, "");
            Toastify ({ text: "Something went wrong...", style: {background: "#b0020" } }).showToast();
        })
}

// AI field display
function showPick(field, reasons) {

    const quiz = document.getElementById("quiz");
    quiz.innerHTML = "<p>your best match: " + field + "</p><p id='aiPick'></p>";

    document.getElementById("aiPick").textContent = reasons;
    quiz.innerHTML += "<a href='index.html?field=" + field + "'>See " + field + " in the career map </a>";
}

showQuestion(0);