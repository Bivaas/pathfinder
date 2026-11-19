document.getElementById("asl").addEventListener("click", () => {

    const question = document.getElementById("question").value;
    const answer = document.getElementById("answer");
    const context = document.getElementById("details").innerText;

    answer.textContent = "thinking.......";


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

    // enter key for send
    document.getElementById("question").addEventListener("keydown", event => {

        if (event.key === "Enter") {

            document.getElementById("ask").click();
        }
    })

    .catch(() => {

        answer.textContent = "";

        Toastify ({ text: "Something went wrong..", style: {background: "#b00020"} }).showToast();
    })
})