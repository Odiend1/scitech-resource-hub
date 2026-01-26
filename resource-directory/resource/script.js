import { resources } from "../resources.js";

var resourceName = decodeURIComponent(window.location.href.split("?name=")[1]);

function getResourceByName(name){
    for(let i = 0; i < resources.length; i++){
        if(resources[i].name == name){
            return resources[i];
        }
    }
    return null;
}

var resource = getResourceByName(resourceName);
if(!resource) window.location.href = "../";

document.getElementById("resource-title").innerHTML = resource.name;
document.getElementById("resource-desc").innerHTML = resource.description;
document.getElementById("resource-img").src = `../../assets/resource-images/${resourceName.toLowerCase().replaceAll(" ", "-")}.jpg`;
document.title = resource.name + " - Science Academy Resource Hub";

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

var tagContainer = document.getElementById("tag-container");
for(const tagGroup in resource.tags){
    for(let j = 0; j < resource.tags[tagGroup].length; j++){
        let tag = document.createElement("h5");
        tag.className = `tag ${tagGroup}-tag`;
        tag.innerHTML = resource.tags[tagGroup][j];
        tagContainer.appendChild(tag);
        tag.style.backgroundColor = tagColorFromString(tagGroup);
    }
}