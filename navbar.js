var navbarLinks = document.getElementsByClassName("navbar-link");

document.getElementById("expand-navbar").onclick = function(e){
    for(let i = 0; i < navbarLinks.length; i++){
        if(!navbarLinks[i].classList.contains("hidden-navbar-link")){
            navbarLinks[i].classList.add("hidden-navbar-link");
        }
        else{
            navbarLinks[i].classList.remove("hidden-navbar-link");
        }
    }
}

document.addEventListener("click", function(e){
    if(!navbarLinks[0].classList.contains("hidden-navbar-link") && !(e.target.id === "expand-navbar" || e.target.classList.contains("navbar-link"))){
        for(let i = 0; i < navbarLinks.length; i++){
            navbarLinks[i].classList.add("hidden-navbar-link");
        }
    }
})