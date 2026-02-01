import { resources } from "./resources.js";

let resourceItems = document.getElementsByClassName("resource-item");

function searchBarFilter(){
    let searchQuery = document.getElementById("search-bar").value.toLowerCase().trim();

    for(let i = 0; i < resourceItems.length; i++){
        let item = resourceItems[i];
        let itemTitle = item.querySelector("a").innerHTML.toLowerCase().trim();
        let itemDesc = item.querySelector("p").innerHTML.toLowerCase().trim();

        if(itemTitle.includes(searchQuery)){
            item.style.display = "block";
        }
        else if(searchQuery.length > 4 && itemDesc.includes(searchQuery)){
            item.style.display = "block";
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

function imageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve(true);
    };

    img.onerror = () => {
      resolve(false);
    };

    img.src = url;
  });
}

function populateResources(){
    let resourceList = document.getElementById("resource-list");
    
    let submittedResources = JSON.parse(localStorage.getItem("submittedResources")) || [];

    let allResources = resources;
    allResources = allResources.sort((a, b) => {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    allResources = submittedResources.concat(allResources);

    for(let i = 0; i < allResources.length; i++){
        let resourceItem = document.createElement("li");
        resourceItem.className = "resource-item";
        resourceItem.addEventListener("click", function(){
            window.location.href = "./resource/?name=" + encodeURIComponent(allResources[i].name);
        })
        if(allResources[i].name.includes("Pending")){
            resourceItem.style.border = "1px dashed #ccc";
        }

        let resourceImage = document.createElement("img");
        imageExists(`../assets/resource-images/${allResources[i].name.toLowerCase().replaceAll(" ", "-")}.jpg`).then(function(jpgIsValid){
            if (jpgIsValid) {
                resourceImage.src = `../assets/resource-images/${allResources[i].name.toLowerCase().replaceAll(" ", "-")}.jpg`;
            } else {
                imageExists(`../assets/resource-images/${allResources[i].name.toLowerCase().replaceAll(" ", "-")}.webp`).then(function(webpIsValid){
                    if (webpIsValid) {
                        resourceImage.src = `../assets/resource-images/${allResources[i].name.toLowerCase().replaceAll(" ", "-")}.webp`;
                    } else {
                        imageExists(`../assets/resource-images/${allResources[i].name.toLowerCase().replaceAll(" ", "-")}.jpeg`).then(function(jpegIsValid){
                            if (jpegIsValid) {
                                resourceImage.src = `../assets/resource-images/${allResources[i].name.toLowerCase().replaceAll(" ", "-")}.jpeg`;
                            } else {
                                imageExists(`../assets/resource-images/${allResources[i].name.toLowerCase().replaceAll(" ", "-")}.png`).then(function(pngIsValid){
                                    if (pngIsValid) {
                                        resourceImage.src = `../assets/resource-images/${allResources[i].name.toLowerCase().replaceAll(" ", "-")}.png`;
                                    } else {
                                        resourceImage.src = '../assets/resource-images/default-resource-image.webp';
                                    }
                                });
                            }
                        });                    
                    }
                });            
            }
        });
        resourceImage.src = `../assets/resource-images/${allResources[i].name.toLowerCase().replaceAll(" ", "-")}.jpg`;
        resourceItem.appendChild(resourceImage);

        let resourceTitle = document.createElement("a");
        resourceTitle.href = "./resource/?name=" + encodeURIComponent(allResources[i].name);
        resourceTitle.innerHTML = allResources[i].name;
        resourceItem.appendChild(resourceTitle);

        let resourceDesc = document.createElement("p");
        resourceDesc.innerHTML = allResources[i].description;
        resourceItem.appendChild(resourceDesc);

        let tagContainer = document.createElement("div");
        tagContainer.className = "tag-container";

        for(const tagGroup in allResources[i].tags){
            for(let j = 0; j < allResources[i].tags[tagGroup].length; j++){
                let tag = document.createElement("h5");
                tag.className = `tag ${tagGroup}-tag`;
                tag.innerHTML = allResources[i].tags[tagGroup][j];
                tagContainer.appendChild(tag);
                tag.style.backgroundColor = tagColorFromString(tagGroup);
            }
        }
        resourceItem.appendChild(tagContainer);

        resourceList.appendChild(resourceItem);
    }
}

function tagColorFromString(str){
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    
    hash = Math.abs(hash);

    function hslToHex(h, s, l) {
        s /= 100;
        l /= 100;

        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

        const toHex = x =>
            Math.round(255 * x).toString(16).padStart(2, "0");

        return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
    }

    const hue = hash % 360;
    const saturation = 55 + (hash % 15);
    const lightness  = 72 + (hash % 8);

    return hslToHex(hue, saturation, lightness)
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
                    if(tagGroups[k] == group + "-tag" && activeFilters[group].includes(itemTags[j].innerHTML.replace("&amp;", "&"))){
                        groupMatch = true;
                    }
                }
            }
            if(!groupMatch){
                showItem = false;
            }
        }

        if(showItem){
            item.style.display = "block";
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

if(window.location.href.split("?filters=").length > 0){
    let urlFilters = decodeURIComponent(window.location.href.split("?filters=")[1]).split("&");
    if(urlFilters){
        for(let i = 0; i < urlFilters.length; i++){
            let filterName = capitalizeTitle(urlFilters[i].replaceAll("-", " ").replaceAll("_", " & "));
            let categoryFilterBoxes = document.getElementsByClassName("category-filter");
            for(let j = 0; j < categoryFilterBoxes.length; j++){
                if(categoryFilterBoxes[j].value === filterName){
                    categoryFilterBoxes[j].checked = true;
                }
            }
        }
    }
}

applyFilters();