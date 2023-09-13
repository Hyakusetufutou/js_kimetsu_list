let dispCategory = new Map();

window.onload = function() {
    dispCategory.set("all", "https://ihatov08.github.io/kimetsu_api/api/all.json");
    dispCategory.set("hashira", "https://ihatov08.github.io/kimetsu_api/api/hashira.json");
    dispCategory.set("oni", "https://ihatov08.github.io/kimetsu_api/api/oni.json");
    dispCategory.set("kisatsutai", "https://ihatov08.github.io/kimetsu_api/api/kisatsutai.json")
    main("all");
}

async function main(category) {

    const spinner = document.querySelector("#loading");
    spinner.classList.remove('loaded');
    try {
        const charactorsInfo = await fetchKimetsuCharactorInfo(category);
        console.log('a');
        displayClear();
        charactorsInfo.forEach((charactorInfo) => {
            const view = createView(charactorInfo);
            displayView(view);
        });
        setTimeout(() => {
            spinner.classList.add('loaded');
        },500);

    } catch(error) {
        console.error(`エラーが発生しました(${error})`);
    }
}

function fetchKimetsuCharactorInfo(category) {
    const kimetsuApi = dispCategory.get(category);
    return fetch(kimetsuApi)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
            } else {
                return response.json();
            }
        });
}

function createView(charactorInfo) {
    return escapeHTML`
        <h4 class="name">名前：${charactorInfo.name}</h4>
        <p class="category">カテゴリ：${charactorInfo.category}</p>
        <img src="https://ihatov08.github.io/${charactorInfo.image}" alt="${charactorInfo.name}" height="300" >`;
}

function displayView(view) {
    const result = document.querySelector("#charactor-list");
    result.appendChild(view);
}

function displayClear() {
    const result = document.querySelector("#charactor-list");
    result.innerHTML = "";
}

function escapeHTML(strings, ...values) {
    const htmlString = strings.reduce((result, str, i) => {
        const value = values[i - 1];
        if (typeof value === "string") {
            return result + escapeSpecialChars(value) + str;
        } else {
            return result + String(value) + str;
        }
    });
    return htmlToElement(htmlString);
}

function htmlToElement(html) {
    const template = document.createElement("div");
    template.className = "charactor-item";
    template.innerHTML = html;
    return template;
}

function escapeSpecialChars(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

