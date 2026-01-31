import { resources } from "./resource-directory/resources.js";

let resourceItems = document.getElementsByClassName("resource-item");


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

var numResourcesFeatured = 0;

function populateResources(random=false){
    let resourceList = document.getElementById("resource-list");
    
    let submittedResources = JSON.parse(localStorage.getItem("submittedResources")) || [];
    let allResources = resources.concat(submittedResources);

    // allResources = allResources.sort((a, b) => {
    //     let nameA = a.name.toUpperCase();
    //     let nameB = b.name.toUpperCase();
    //     if (nameA < nameB) {
    //         return -1;
    //     }
    //     if (nameA > nameB) {
    //         return 1;
    //     }
    //     return 0;
    // });

    if(random) allResources = allResources.sort(() => Math.random() - 0.5);

    numResourcesFeatured = 0;
    for(let i = 0; i < allResources.length; i++){
        if(!allResources[i].featured) continue;
        let resourceItem = document.createElement("li");
        resourceItem.className = "resource-item";
        resourceItem.addEventListener("click", function(){
            window.location.href = "./resource/?name=" + encodeURIComponent(allResources[i].name);
        })

        let resourceImage = document.createElement("img");
        imageExists(`./assets/resource-images/${allResources[i].name.toLowerCase().replaceAll(" ", "-")}.jpg`).then(function(isValid){
            if (isValid) {
                resourceImage.src = `./assets/resource-images/${allResources[i].name.toLowerCase().replaceAll(" ", "-")}.jpg`;
            } else {
                resourceImage.src = './assets/resource-images/default-resource-image.webp';
            }
        });
        resourceImage.src = `./assets/resource-images/${allResources[i].name.toLowerCase().replaceAll(" ", "-")}.jpg`;
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

        numResourcesFeatured++;
        if((numResourcesFeatured + 1) * 282 + (numResourcesFeatured) * 0.03 * window.innerWidth > window.innerWidth && numResourcesFeatured > 1) break;
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

populateResources();
window.addEventListener("resize", function(e){
    if((numResourcesFeatured) * 282 + (numResourcesFeatured - 1) * 0.03 * window.innerWidth > window.innerWidth || (numResourcesFeatured + 1) * 282 + (numResourcesFeatured) * 0.03 * window.innerWidth < window.innerWidth){
        console.log("repopulating")
        document.getElementById("resource-list").innerHTML = "";
        populateResources();
    }
})
document.getElementById("shuffle-button").addEventListener("click", function(e){
    document.getElementById("resource-list").innerHTML = "";
    populateResources(true);
});