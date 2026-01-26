import { resources } from "./resources.js";

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

function populateResources(){
    let resourceList = document.getElementById("resource-list");
    // resourceList.innerHTML = "";

    for(let i = 0; i < resources.length; i++){
        let resourceItem = document.createElement("li");
        resourceItem.className = "resource-item";

        let resourceImage = document.createElement("img");
        resourceImage.src = `../assets/resource-images/${resources[i].name.toLowerCase().replaceAll(" ", "-")}.jpg`;
        resourceItem.appendChild(resourceImage);

        let resourceTitle = document.createElement("a");
        resourceTitle.href = "./resource/?name=" + encodeURIComponent(resources[i].name);
        resourceTitle.innerHTML = resources[i].name;
        resourceItem.appendChild(resourceTitle);

        let resourceDesc = document.createElement("p");
        resourceDesc.innerHTML = resources[i].description;
        resourceItem.appendChild(resourceDesc);

        let tagContainer = document.createElement("div");
        tagContainer.className = "tag-container";

        for(const tagGroup in resources[i].tags){
            for(let j = 0; j < resources[i].tags[tagGroup].length; j++){
                let tag = document.createElement("h5");
                tag.className = `tag ${tagGroup}-tag`;
                tag.innerHTML = resources[i].tags[tagGroup][j];
                tagContainer.appendChild(tag);
            }
        }
        resourceItem.appendChild(tagContainer);

        resourceList.appendChild(resourceItem);
    }
}

function applyFilters(){
    let activeFilters = {};

    let filterGroups = document.getElementsByClassName("filter-group");
    for(let i = 0; i < filterGroups.length; i++){
        let groupName = filterGroups[i].id.slice(0, -13); // remove "-filter-group"
        let checkboxes = filterGroups[i].getElementsByTagName("input");
        for(let j = 0; j < checkboxes.length; j++){
            if(checkboxes[j].checked){
                if(!(groupName in activeFilters)){
                    activeFilters[groupName] = [];
                }
                activeFilters[groupName].push(checkboxes[j].value);
            }
        }
    }

    for(let i = 0; i < resourceItems.length; i++){
        let item = resourceItems[i];
        let itemTags = item.getElementsByClassName("tag");

        let showItem = true;
        for(const group in activeFilters){
            let groupMatch = false;
            for(let j = 0; j < itemTags.length; j++){
                let tagGroups = itemTags[j].classList;
                for(let k = 0; k < tagGroups.length; k++){
                    if(tagGroups[k] == group + "-tag" && activeFilters[group].includes(itemTags[j].innerHTML)){
                        groupMatch = true;
                    }
                }
            }
            if(!groupMatch){
                showItem = false;
            }
        }

        if(showItem){
            item.style.display = "inline-block";
        }
        else{
            item.style.display = "none";
        }
    }
}

function generateFilters(){
    let tags = [];

    for(let i = 0; i < resourceItems.length; i++){
        let resourceItem = resourceItems[i];
        let itemTags = resourceItem.getElementsByClassName("tag");
        for(let j = 0; j < itemTags.length; j++){
            let tagGroups = itemTags[j].classList;
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
        filterOptionLabel.innerHTML = `<input type="checkbox" class="${tags[i].group.toLowerCase()}-filter" value="${tags[i].name}"> ${tags[i].name}`;
        filterOptionLabel.innerHTML += ` (${tags[i].count})`;
        filterOptionsDiv.appendChild(filterOptionLabel);

        let filterCheckbox = filterOptionLabel.querySelector("input");
        filterCheckbox.addEventListener("change", applyFilters);
    }
}

populateResources();
generateFilters();