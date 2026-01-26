import { resources } from '../resource-directory/resources.js';

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
    tagInput.name = 'resource-tags[]';
    tagInput.placeholder = 'Tag name...';
    let removeTagButton = document.createElement('button');
    removeTagButton.type = 'button';
    removeTagButton.className = 'remove-tag';
    removeTagButton.textContent = '-';
    removeTagButton.addEventListener('click', function(){
        tagInputRow.remove();
    });
    tagInputRow.appendChild(tagInput);
    tagInputRow.appendChild(removeTagButton);
    document.getElementById("tag-input-container").appendChild(tagInputRow);
});