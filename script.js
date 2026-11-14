function buildList(node) {

    const li = document.createElement("li");
    
    const label = document.createElement("span");
    label.textContent = node.name;
    li.appendChild(label);

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

        const ul = document.createElement("ul");
        ul.appendChild(buildList(data));
        document.getElementById("tree").appendChild(ul);
    })
    .catch(err => console.error("Failed to load careers.json:", err));