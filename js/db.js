var dbPromised = idb.open("football", 1, function(upgradeDB){
    switch(upgradeDB.oldVersion) {
        case 0 : 
        upgradeDB.createObjectStore("teams", {keyPath : "id"});
        var teamsFootball = upgradeDB.transaction.objectStore("teams");
        teamsFootball.createIndex('name', 'name', {
            unique: false
        });
    }
});

function saveInformationTeam(team){
    dbPromised.then(function(db){
        var tx = db.transaction("teams", "readwrite");
        var football = tx.objectStore("teams");
        console.log(team);
        football.add(team);
        return tx.complete;
    }).then(function(){
        console.log("Information success to save");
    });
}

function getAll() {
    return new Promise(function(resolve, reject){
        dbPromised.then(function(db){
            var tx = db.transaction("teams", "readonly");
            var football = tx.objectStore("teams");
            return football.getAll();
        }).then(function(teams){
            resolve(teams);
        })
    })
}

function getById(id){
    return new Promise(function(resolve, reject){
        dbPromised.then(function(db){
            var tx = db.transaction("teams", "readonly");
            var football = tx.objectStore("teams");
            return football.get(id);
        })
        .then(function(teams){
            resolve(teams);
        })
    })
}

function deleteFav(id){
    dbPromised.then(function(db){
        var tx = db.transaction("teams", "readwrite");
        var football = tx.objectStore("teams");
        football.delete(id);
        return tx.complete;
    })
    .then(function(){
        console.log("Item fav deleted");
    })
}