import { resources } from "../resources.js";

var resourceName = decodeURIComponent(window.location.href.split("?name=")[1]);

function getResourceByName(name, customResources=null){
    if(!customResources) customResources = resources;
    for(let i = 0; i < customResources.length; i++){
        if(customResources[i].name == name){
            return customResources[i];
        }
    }
    return null;
}

var resource = getResourceByName(resourceName) || getResourceByName(resourceName, JSON.parse(localStorage.getItem("submittedResources")) || []);
if(!resource) window.location.href = "../";

document.getElementById("resource-title").innerHTML = resource.name;
document.getElementById("resource-desc").innerHTML = resource.description;
document.title = resource.name + " | Science Academy Resource Hub";

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

imageExists(`../../assets/resource-images/${resourceName.replaceAll(" ", "-")}.jpg`).then(function(jpgIsValid){
    if (jpgIsValid) {
        document.getElementById("resource-img").src = `../../assets/resource-images/${resourceName.replaceAll(" ", "-")}.jpg`;
    } else {
        imageExists(`../../assets/resource-images/${resourceName.replaceAll(" ", "-")}.webp`).then(function(webpIsValid){
            if (webpIsValid) {
                document.getElementById("resource-img").src = `../../assets/resource-images/${resourceName.replaceAll(" ", "-")}.webp`;
            } else {
                imageExists(`../../assets/resource-images/${resourceName.replaceAll(" ", "-")}.jpeg`).then(function(jpegIsValid){
                    if (jpegIsValid) {
                        document.getElementById("resource-img").src = `../../assets/resource-images/${resourceName.replaceAll(" ", "-")}.jpeg`;
                    } else {
                        imageExists(`../../assets/resource-images/${resourceName.replaceAll(" ", "-")}.png`).then(function(pngIsValid){
                            if (pngIsValid) {
                                document.getElementById("resource-img").src = `../../assets/resource-images/${resourceName.replaceAll(" ", "-")}.png`;
                            } else {
                                document.getElementById("resource-img").src = '../../assets/resource-images/default-resource-image.webp';
                            }
                        });
                    }
                });                    
            }
        });            
    }
});


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

function capitalizeTitle(string){
    const splitString = string.split(" ");
    for(let i = 0; i < splitString.length; i++){
        splitString[i] = splitString[i].charAt(0).toUpperCase() + splitString[i].slice(1);
    }
    return splitString.join(" ");
}

for(const contactMethod in resource.contact){
    let contactText = document.createElement("h4");
    contactText.innerHTML = `${capitalizeTitle(contactMethod)}: `;
    if(contactMethod.startsWith("http") || contactMethod.startsWith("www.") || contactMethod == "website"){
        contactText.innerHTML += `<a href="${resource.contact[contactMethod]}" target="_blank">${resource.contact[contactMethod]}</a>`;
    }
    else if(contactMethod == "instagram"){
        if(resource.contact[contactMethod].includes("@")) contactText.innerHTML += `<a href="https://instagram.com/${resource.contact[contactMethod].replace("@", "")}" target="_blank">${resource.contact[contactMethod]}</a>`;
        else contactText.innerHTML += `<a href="https://instagram.com/${resource.contact[contactMethod]}" target="_blank">${resource.contact[contactMethod]}</a>`;
    }
    else if(contactMethod == "email"){
        contactText.innerHTML += `<a href="mailto:${resource.contact[contactMethod]}">${resource.contact[contactMethod]}</a>`;
    }
    else if(contactMethod == "phone"){
        contactText.innerHTML += `<a href="tel:${resource.contact[contactMethod]}">${resource.contact[contactMethod]}</a>`;
    }
    else if(contactMethod == "address"){
        contactText.innerHTML += `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resource.contact[contactMethod])}" target="_blank">${resource.contact[contactMethod]}</a>`;
    }
    else{
        contactText.innerHTML += resource.contact[contactMethod];
    }
    document.getElementById("contact-container").appendChild(contactText);
}