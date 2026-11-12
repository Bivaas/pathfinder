function buildList(node) {

    const li = document.createElement("li");
    li.textContent = node.name;

    if (node.children) {

        const ul = document.createElement("ul");
        node.children.ForEach(child => {

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
    });