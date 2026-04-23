import { router } from "../../router";

export function Home() {
    var app = document.getElementById("app");
    app.innerHTML =
        '<div>' +
        '<h1>Formio Forms</h1>' +
        '<div class="columns-2">' +
        '<div class="card"><button id="multiPage" type="button">Multi page</button></div>' +
        '<p class="read-the-docs">View multi page form</p>' +
        '<div class="card"><button id="singlePage" type="button">Single page</button></div>' +
        '<p class="read-the-docs">View single page form</p>' +
        '</div>' +
        '</div>';

    var multiPageBtn = document.getElementById("multiPage");
    if (multiPageBtn) {
        multiPageBtn.addEventListener("click", function () {
            router.navigate("/multi-page-form");
        });
    }
}
