function buildList(node) {

    const li = document.createElement("li");
    li.textContent = node.name;

    if (node.children) {

        const ul = document.createElement("ul");
        node.children.forEach(child => {

            ul.appendChild(buildList(child));
        });

        li.appendChild(ul);
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