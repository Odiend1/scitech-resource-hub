import { resources, masterTagObject } from '../resource-directory/resources.js';

var tagsSet = new Set();
tagsSet.add("Students"); tagsSet.add("Faculty"); tagsSet.add("Parents");

for(let resource of resources){
    if(resource.tags){
        for(const tagGroup in resource.tags){
            for(let tag of resource.tags[tagGroup]){
                tagsSet.add(tag);
            }
        }
    }
}

let tagsDatalist = document.getElementById('tags-datalist');
tagsSet.forEach(tag => {
    let option = document.createElement('option');
    option.value = tag;
    tagsDatalist.appendChild(option);
});

let addTagButton = document.getElementById('add-tag');
addTagButton.addEventListener('click', function(event){
    event.preventDefault();
    if(document.getElementsByClassName('tag-input-row').length >= 5){
        alert("You can only add up to 5 tags.");
        return;
    }
    let tagInputRow = document.createElement('div');
    tagInputRow.className = 'tag-input-row';
    let tagInput = document.createElement('input');
    tagInput.className = 'resource-tags';
    tagInput.type = 'text';
    tagInput.setAttribute('list', 'tags-datalist');
    tagInput.name = 'tags[]';
    tagInput.placeholder = 'Tag name...';
    let removeTagButton = document.createElement('button');
    removeTagButton.type = 'button';
    removeTagButton.className = 'remove-row';
    removeTagButton.textContent = '-';
    removeTagButton.addEventListener('click', function(){
        tagInputRow.remove();
    });
    tagInputRow.appendChild(tagInput);
    tagInputRow.appendChild(removeTagButton);
    document.getElementById("tag-input-container").appendChild(tagInputRow);
});

let resourceContactTypeElements = document.getElementsByClassName("resource-contact-type")
let resourceContactElements = document.getElementsByClassName("resource-contact")

function addContactRow(){
    let contactInputRow = document.createElement('div');
    contactInputRow.className = 'contact-input-row';
    let contactTypeInput = document.createElement('input');
    contactTypeInput.className = 'resource-contact-type';
    contactTypeInput.type = 'text';
    contactTypeInput.name = 'contact-type[]';
    contactTypeInput.placeholder = 'Method...';
    contactTypeInput.setAttribute('list', 'contact-datalist');
    let contactInput = document.createElement('input');
    contactInput.className = 'resource-contact';
    contactInput.type = 'text';
    contactInput.name = 'contact[]';
    contactInput.placeholder = 'Contact...';
    let removeContactButton = document.createElement('button');
    removeContactButton.type = 'button';
    removeContactButton.className = 'remove-row';
    removeContactButton.textContent = '-';
    removeContactButton.addEventListener('click', function(){
        contactInputRow.remove();
    });

    resourceContactTypeElements = document.getElementsByClassName("resource-contact-type")
    resourceContactElements = document.getElementsByClassName("resource-contact")
    for(let i = 0; i < resourceContactElements.length; i++){
        resourceContactElements[i].addEventListener("change", function(e){
            if(resourceContactElements[i].value.trim().length > 0){
                resourceContactTypeElements[i].required = true;
            }
            else{
                resourceContactTypeElements[i].required = false;
            }
        })
    }

    contactInputRow.appendChild(contactTypeInput);
    contactInputRow.appendChild(contactInput);
    contactInputRow.appendChild(removeContactButton);
    document.getElementById("contact-input-container").appendChild(contactInputRow);
}

addContactRow();
let addContactButton = document.getElementById('add-contact');
addContactButton.addEventListener('click', function(event){
    event.preventDefault();
    if(document.getElementsByClassName('contact-input-row').length >= 5){
        alert("You can only add up to 4 methods of contact.");
        return;
    }
    addContactRow();
});

const resourceForm = document.getElementById("resource-form");
resourceForm.addEventListener("submit", function(e){
    e.preventDefault();
    const formData = new FormData(resourceForm);
    var formObject = Object.fromEntries(formData.entries());
    const tagsArr = formData.getAll("tags[]");
    const tagsObject = {}
    let tagPushed = false;
    for(let i = 0; i < tagsArr.length; i++){
        if(tagsArr[i].trim() == "") continue;
        for(const group of Object.keys(masterTagObject)){
            if(masterTagObject[group].includes(tagsArr[i])){
                if(!tagsObject[group]) tagsObject[group] = [];
                tagsObject[group].push(tagsArr[i])
                tagPushed = true;
            }
        }
        if(tagPushed) tagPushed = false;
        else{
            if(!tagsObject["other"]) tagsObject["other"] = [];
            tagsObject["other"].push(tagsArr[i].trim())
        }
    }
    formObject["tags"] = tagsObject;
    if(Object.keys(formObject["tags"]).length == 0){
        delete formObject["tags"];
    }

    let contactTypesArr = formData.getAll("contact-type[]");
    let contactsArr = formData.getAll("contact[]");
    formObject["contact"] = {};
    for(let i = 0; i < contactTypesArr.length; i++){
        if(contactTypesArr[i].trim() == "" || contactsArr[i].trim() == "") continue;
        formObject["contact"][contactTypesArr[i].toLowerCase().trim()] = contactsArr[i].trim();
    }

    if(formObject.website && formObject.website.trim().length > 0){
        formObject["contact"]["website"] = formObject.website.trim();
    }
    delete formObject.website;

    if(Object.keys(formObject["contact"]).length == 0){
        delete formObject["contact"];
    }
    delete formObject["tags[]"];
    delete formObject["contact-type[]"];
    delete formObject["contact[]"];

    let submittedResources = JSON.parse(localStorage.getItem("submittedResources")) || [];
    submittedResources.push(formObject);
    localStorage.setItem("submittedResources", JSON.stringify(submittedResources));
    alert("Resource submitted successfully!");
    resourceForm.reset();
})

for(let i = 0; i < resourceContactElements.length; i++){
    resourceContactElements[i].addEventListener("change", function(e){
        if(resourceContactElements[i].value.trim().length > 0){
            resourceContactTypeElements[i].required = true;
        }
        else{
            resourceContactTypeElements[i].required = false;
        }
    })
}

document.getElementById("clear-resources").addEventListener("click", function(){
    let confirmation = confirm("Are you sure you want to clear all submitted resources? This action cannot be undone.");
    if(confirmation){
        localStorage.removeItem("submittedResources");
        alert("Submitted resources cleared.");
    }
})