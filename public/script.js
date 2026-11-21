let streamLabels = {};
let allNodes = [];
let careerData;
let chosen = "all";


// degrees open to chosen faculty
function fits(node) {

    if (node.streams) 
    
        return chosen === "all" || node.streams.includes(chosen);

    if (node.type === "faculty")

        return node.children.some(fits);

    return true;
}

// tree line again
function drawTree() {

    allNodes = [];
    const tree = document.getElementById("tree");
    tree.innerHTML = "";

    const ul = document.createElement("ul");
    ul.appendChild(buildList(careerData));
    tree.appendChild(ul);
}

// all details (click)
function showDetails(node) {

    const details = document.getElementById("details");

    details.innerHTML = "<h2>" + node.name + "</h2><p>" + (node.about || "") + "</p>";


    if (node.duration) {

        details.innerHTML += "<p>Duration: " + node.duration + "</p>";
    }

    if (node.exams) {

        details.innerHTML += "<p>Entrance exams: " + node.exams.join(", ") + "</p>"; 
    }

    if (node.streams) {

        const names = node.streams.map(code => streamLabels[code]);

        details.innerHTML += "<p>Open to: " + names.join(", ") + "</p>";
    }
}


function buildList(node) {

    const li = document.createElement("li");

    allNodes.push(node);
    
    const label = document.createElement("span");
    label.textContent = node.name;


    // field picture
    if (node.type === "faculty") {

        const img = document.createElement("img");
        img.src = "images/" + node.name + ".png";
        label.prepend(img);
    }


    // show details
    li.appendChild(label);


    label.addEventListener("click", () => showDetails(node));

    if (node.children) {

        const ul = document.createElement("ul");
        ul.hidden = true;
        node.children.filter(fits).forEach(child => {

            ul.appendChild(buildList(child));
        });

        li.appendChild(ul);

        label.addEventListener("click", () => {

            ul.hidden = !ul.hidden;
            li.classList.toggle("open");

            document.querySelectorAll(".active").forEach (el => 
                el.classList.remove("active"))
            
                // when branch is open or closed
                if (ul.hidden) {

                    ul.querySelectorAll(".open").forEach(el => el.classList.remove("open"));
                    
                    ul.querySelectorAll("ul").forEach(el => el.hidden = true);

                    li.parentElement.parentElement.classList.add("active");
                }

                else {

                    li.classList.add("active");
                }
        })
    }

    return li;
}

fetch("careers.json")

    .then(response => response.json())

    .then(data => {

        streamLabels = data.streamLabels;

        // dropdown data
        for (const code in streamLabels) {

            document.getElementById("stream").innerHTML += "<option value='" + code + "'>" + streamLabels[code] + "</option>";
        }

        careerData = data;
        drawTree();

        // open address field
        const field = new URLSearchParams(location.search).get("field");

        if (field) {

            document.querySelector("#tree span").click();

            document.querySelectorAll("#tree span").forEach(span => {

                if (span.textContent === field) {

                    span.click();
                }
            })
        }
    })

    .catch(err => console.error("failed to load careers.json", err))

    // degree and stream changes
    document.getElementById("stream").addEventListener("change", event => {

        chosen = event.target.value;
        drawTree();

    })

    // student types
    document.getElementById("search").addEventListener("input", event => {

        const text = event.target.value.toLowerCase();

        const results = document.getElementById("results");

        results.innerHTML = "";


        if (text.length < 2) return;

        allNodes.filter(node => node.name.toLowerCase().includes(text)).forEach(node => {

            const li = document.createElement("li");
             li.textContent = node.name;

            li.addEventListener("click", () => showDetails(node));

            results.appendChild(li);
        })
    })