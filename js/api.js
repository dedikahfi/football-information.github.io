var baseUrl = "https://api.football-data.org/";
var apikey = "563847396c8f4c7aa24c38d1a59e8cae";

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log(error);
}

function getStandings() {
    if ("caches" in window) {
        caches.match(baseUrl + "v2/competitions/2001/standings").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    toParsingStandings(data);
                })
            }
        })
    }

    fetch(baseUrl + "v2/competitions/2001/standings", {
        headers: {
            'X-Auth-Token': "" + apikey
        }
    }).then(status).then(json).then(function (data) {
        toParsingStandings(data);
    }).catch(error);
}

function getTeams() {
    if ("caches" in window) {
        caches.match(baseUrl + "v2/competitions/2001/teams").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    toParsingTeams(data)
                })
            }
        })
    }


    fetch(baseUrl + "v2/competitions/2001/teams", {
        headers: {
            'X-Auth-Token': '' + apikey
        }
    }).then(status).then(json).then(function (data) {
        toParsingTeams(data)
    }).catch(error);
}

function getTeamById(id) {
    if ("caches" in window) {
        caches.match(baseUrl + "v2/competitions/2001/teams").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    toParsingDetail(data, id);
                })
            }
        })
    }

    fetch(baseUrl + "v2/competitions/2001/teams", {
        headers: {
            'X-Auth-Token': '' + apikey
        }
    }).then(status).then(json).then(function (data) {
            toParsingDetail(data, id);
        }).catch(error);
}

function toParsingStandings(data) {
    var elemHTML = "";
    data.standings.forEach(function (fetchData) {
        if (fetchData.type != "TOTAL") return;
        else {
            var dataTeam = "";
            fetchData.table.forEach(function (fetchTable) {
                var url = fetchTable.team.crestUrl;
                if (url.match('^http://')) {
                    url = url.replace("http://", "https://")
                }
                dataTeam +=
                    "<tr><td>"
                    + "<img width=15px height=15px src='"
                    + url
                    + "' alt='' class='circle responsive-img'/>"
                    + "</td><td>"
                    + fetchTable.team.name
                    + "</td><td>"
                    + fetchTable.won
                    + "</td><td>"
                    + fetchTable.lost
                    + "</td><td>"
                    + fetchTable.draw
                    + "</td></tr>";

            })
            elemHTML += `
            <div class="col s12 m12">
            <div class="card darken-1 setcardcontent">
            <div class="card-content">
                <span class="card-title">${fetchData.group}</span><hr>
                <table><tr>
                    <th width=100px>Logo</th>
                    <th width=400px>Team</th>
                    <th>Won</th>
                    <th>Lost</th>
                    <th>Draw</th>
                </tr>${dataTeam}</table>
            </div>
            </div>
            </div>`
        }
    })
    document.querySelector("#uefacontent").innerHTML = elemHTML;
}

function toParsingTeams(data) {
    var elemHTML = "";
    data.teams.forEach(function (dataTeams) {

        var url = dataTeams.crestUrl;
        if (url == null || url == "" || dataTeams.name == "APOEL FC" || dataTeams.name == "NK Maribor" || dataTeams.name == "Lille OSC")
            return;
        //APOEL FC and NK Maribor and Lille OSC image broken becouse not finding resource image.

        if (url.match('^http://')) {
            url = url.replace("http://", "https://")
        }

        elemHTML +=`
        <div class="col s12 m4">
        <div class="card darken-1">
            <a href="/detailteam.html?id=${dataTeams.id}">
            <div class="card-content setcardlogoteam" style="text-align:center;height:300px;">
                <img style="height: 150px; width: 150px;" src='${url}' alt='' class='circle responsive-img'/>
                <hr><span class="card-title">${dataTeams.name}</span>
            </div>
            </a>
        </div>
        </div>`
    })
    document.querySelector("#teamcontent").innerHTML = elemHTML;
}

function toParsingDetail(data, id) {
    var elemHTML = "";
    data.teams.forEach(function (dataTeams) {
        if (dataTeams.id != id)
            return;

        var url = dataTeams.crestUrl;
        if (url == null || url == "")
            return;

        if (url.match('^http://')) {
            url = url.replace("http://", "https://")
        }

        elemHTML += `
                <div class="container">
                <div class="col s12 m12">
                    <a style="float:right; margin-top:15px; right:3%;" class="btn-floating btn-large cyan pulse"><i class="material-icons">add</i></a>
                    <div class="card darken-1">
                    <div class="card-content">
                        <img style="float:left; margin-right:20px; height: 50px; width: 50px;" src='${url}' alt='' class='circle responsive-img'/>    
                        <span class="card-title" style="font-weight:600;margin-bottom:20px; margin-top:10px;">${dataTeams.name}</span>
                        <hr><table><tr>
                                <td>Short Name</td><td>:</td><td>${dataTeams.shortName}</td></tr><tr>
                                <td>Address</td><td>:</td><td>${dataTeams.address}</td></tr><tr>
                                <td>Club Colors</td><td>:</td><td>${dataTeams.clubColors}</td></tr><tr>
                                <td>Founded</td><td>:</td><td>${dataTeams.founded}</td></tr><tr>
                                <td>Venue</td><td>:</td><td>${dataTeams.venue}</td></tr><tr>
                                <td>Email</td><td>:</td><td>${dataTeams.email}</td></tr><tr>
                                <td>Phone</td><td>:</td><td>${dataTeams.phone}</td></tr><tr>
                                <td>Website</td><td>:</td><td>${dataTeams.website}</td>
                        </tr></table>
                    </div>
                    </div>
                </div>
                </div>
                `
    })
    document.querySelector("#body-content").innerHTML = elemHTML;
}