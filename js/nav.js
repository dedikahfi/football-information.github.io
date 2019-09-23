document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelector(".sidenav");
    M.Sidenav.init(elems);
    loadNav();

    function loadNav() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4)
                if (this.status == 200) {
                    document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
                        elm.innerHTML = xhttp.responseText;
                    });

                    document.querySelectorAll(".topnav a, .sidenav a").forEach(function (elm) {
                        elm.addEventListener("click", function (event) {
                            var sidenav = document.querySelector(".sidenav");
                            M.Sidenav.getInstance(sidenav).close();

                            page = event.target.getAttribute("href").substr(1);
                            loadPage(page);
                        })
                    })
                } else return;
        }
        xhttp.open("GET", "nav.html", true);
        xhttp.send();
    }

    var page = window.location.hash.substr(1);
    if (page == "") page = "home";
    loadPage(page);

    function loadPage(page) {
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                var domPage = document.querySelector("#body-content");
                if (this.status == 200)
                    domPage.innerHTML = xhttp.responseText;
                else if (this.status == 404)
                    domPage.innerHTML = "Uppss.. Halaman tidak dapat ditemukan..";
                else
                    domPage.innerHTML = "Maaf.. Halaman tidak dapat diakses..";


            }
        }
        xhttp.open("GET", "pages/" + page + ".html", true);
        xhttp.send();
    }
});