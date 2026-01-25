

function searchBarFilter(){
    searchQuery = document.getElementById("search-bar").value.toLowerCase().trim();
    let resourceItems = document.getElementsByClassName("resource-item");

    for(i = 0; i < resourceItems.length; i++){
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