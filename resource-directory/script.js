let resourceItems = document.getElementsByClassName("resource-item");

function searchBarFilter(){
    searchQuery = document.getElementById("search-bar").value.toLowerCase().trim();

    for(let i = 0; i < resourceItems.length; i++){
        let item = resourceItems[i];
        let itemTitle = item.querySelector("a").innerHTML.toLowerCase().trim();
        let itemDesc = item.querySelector("p").innerHTML.toLowerCase().trim();

        if(itemTitle.includes(searchQuery)){
            item.style.display = "inline-block";
        }
        else if(searchQuery.length > 4 && itemDesc.includes(searchQuery)){
            item.style.display = "inline-block";
        }
        else{
            item.style.display = "none";
        }
    }
}

function capitalizeTitle(string){
    const splitString = string.split(" ");
    for(let i = 0; i < splitString.length; i++){
        splitString[i] = splitString[i].charAt(0).toUpperCase() + splitString[i].slice(1);
    }
    return splitString.join(" ");
}

function generateFilters(){
    let tags = [];

    for(let i = 0; i < resourceItems.length; i++){
        resourceItem = resourceItems[i];
        let itemTags = resourceItem.getElementsByClassName("tag");
        for(let j = 0; j < itemTags.length; j++){
            tagGroups = itemTags[j].classList;
            for(let k = 0; k < tagGroups.length; k++){
                if(tagGroups[k].endsWith("-tag")){
                    let tagName = itemTags[j].innerHTML;
                    if(!JSON.stringify(tags).includes(`{"group":"${capitalizeTitle(tagGroups[k].slice(0, -4))}","name":"${tagName}"`)){
                        tags.push({group: capitalizeTitle(tagGroups[k].slice(0, -4)), name: tagName, count: 1});
                    }
                    else{
                        for(let l = 0; l < tags.length; l++){
                            if(tags[l].group == capitalizeTitle(tagGroups[k].slice(0, -4)) && tags[l].name == tagName){
                                tags[l].count += 1;
                            }
                        }
                    }
                }
            }
        }
    }
    alert(JSON.stringify(tags))

    let filterContainer = document.getElementById("filter-container");
    for(let i = 0; i < tags.length; i++){
        let filterGroupDiv;
        let filterOptionsDiv;
        if(filterContainer.querySelector("#" + tags[i].group.toLowerCase() + "-filter-group") == null){
            filterGroupDiv = document.createElement("div");
            filterGroupDiv.className = "filter-group";
            filterGroupDiv.id = tags[i].group.toLowerCase() + "-filter-group";
            filterContainer.appendChild(filterGroupDiv)

            let filterGroupTitle = document.createElement("h3");
            filterGroupTitle.innerHTML = tags[i].group;
            filterGroupDiv.appendChild(filterGroupTitle);

            filterOptionsDiv = document.createElement("div");
            filterOptionsDiv.className = "filter-options";
            filterGroupDiv.appendChild(filterOptionsDiv);
        }
        else{
            filterGroupDiv = filterContainer.querySelector("#" + tags[i].group.toLowerCase() + "-filter-group");
            filterOptionsDiv = filterGroupDiv.querySelector(".filter-options");
        }

        let filterOptionLabel = document.createElement("label");
        filterOptionLabel.innerHTML = `<input type="checkbox" class="${tags[i].group.toLowerCase()}-filter" onchange="applyFilters()" value="${tags[i].name}"> ${tags[i].name}`;
        filterOptionLabel.innerHTML += ` (${tags[i].count})`;
        filterOptionsDiv.appendChild(filterOptionLabel);
    }
}

generateFilters();