const resources = [
    {
        name: "Food Bank of the Rio Grande Valley",
        description: "This local food bank provides for students in the Rio Grande Valley. bla bla bla bla bla bla bl abl abl abla bl abl abl bla",
        tags: {
            category: ["Public Facilities", "Food Assistance"],
            audience: ["Students", "Parents", "Faculty"]
        },
        contact: {
            website: "https://foodbankrgv.com/",
            phone: "956-682-8101",
            instagram: "@foodbankrgv",
            address: "2601 Zinnia Ave, McAllen, Texas 78501"
        }
    },
    {
        name: "Online Library",
        description: "An online library for students.",
        tags: {
            category: ["Library", "Online"],
            audience: ["Students"]
        }
    }
];

var masterTagObject = {}
for(const resource of resources){
    for(const tagGroup of Object.keys(resource.tags)){
        if(!masterTagObject[tagGroup]) masterTagObject[tagGroup] = [];
        for(let i = 0; i < resource.tags[tagGroup].length; i++){
            if(!masterTagObject[tagGroup].includes(resource.tags[tagGroup][i])){
                masterTagObject[tagGroup].push(resource.tags[tagGroup][i]);
            }
        }
    }
}

export { resources, masterTagObject };