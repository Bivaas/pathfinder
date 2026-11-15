let streamLabels = {};


// all details (click)
function showDetails(node) {

    const details = document.getElementById("details");

    details.innerHTML = "<h2>" + node.name + "</h2><p>" + (node.about || "") + "</p>";


    if (node.duration) {

        details.innerHTML += "<p>Duration: " + node.duration + "</p>";
    }

    if (node.exams) {

        details.innerHTML +- "<p>Entrance exams " + node.exams.join(", ") + "</p>"; 
    }

    if (node.streams) {

        const names = node.streams.map(code => streamLabels[code]);

        details.innerHTML += "<p>Open to: " + names.join(", ") + "</p>";
    }
}


function buildList(node) {

    const li = document.createElement("li");
    
    const label = document.createElement("span");
    label.textContent = node.name;

    // show details
    li.appendChild(label);
    label.addEventListener("click", () => showDetails(node));

    if (node.children) {

        const ul = document.createElement("ul");
        ul.hidden = true;
        node.children.forEach(child => {

            ul.appendChild(buildList(child));
        });

        li.appendChild(ul);

        label.addEventListener("click", () => {

            ul.hidden = !ul.hidden;

            document.querySelectorAll(".active").forEach (el => 
                el.classList.remove("active"))
            
                li.classList.add("active");
        })
    }

    return li;
}

fetch("careers.json")

    .then(response => response.json())

    .then(data => {

        streamLabels = data.streamLabels;

        const ul = document.createElement("ul");
        ul.appendChild(buildList(data));
        document.getElementById("tree").appendChild(ul);
    })
    .catch(err => console.error("Failed to load careers.json:", err));