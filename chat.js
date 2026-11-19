const askButton = document.getElementById("ask");
const questionBox = document.getElementById("question");

askButton.addEventListener("click", () => {

    const question = questionBox.value.trim();
    const answer = document.getElementById("answer");
    const context = document.getElementById("details").innerText;

    if (!question) {

        Toastify({ text: "Type a question first", style: { background: "#b00020" }}).showToast();
        return;
    }

    answer.textContent = "thinking.......";
    askButton.disabled = true;

    fetch("/chat", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question, context: context })
    })

    .then(response => response.json())
    .then( data => {

        if (data.error) {

            answer.textContent = "";

            Toastify({ text: data.error, style: { background: "#b00020" }}).showToast();

        }
        else {

            answer.textContent = data.answer;
        }
    })

    .catch(() => {

        answer.textContent = "";

        Toastify ({ text: "Something went wrong..", style: {background: "#b00020"} }).showToast();
    })

    .finally(() => {

        askButton.disabled = false;
    })
})

// enter key for send
questionBox.addEventListener("keydown", event => {

    if (event.key === "Enter" && !askButton.disabled) {

        askButton.click();
    }
})
