const parePageSize = 5;
const debounceMs = 400;

let searchInput = document.getElementById("search__input");
let searchList = document.querySelector(".search__options");
let myRepoList = document.querySelector(".my-repo__list");


// ===================== utils =====================
function debounce(callee, timeoutMs) {
    return function perform(...args) {
        let previousCall = this.lastCall
        this.lastCall = Date.now()
        if (previousCall && this.lastCall - previousCall <= timeoutMs) {
            clearTimeout(this.lastCallTimer)
        }
        this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs)
    }
}


//============================================================================

function makeSearchOption (value, id) {
    const option = document.createElement("li");
    option.classList.add("search__option");
    const text = document.createTextNode(value)
    option.appendChild(text);
    if (id !== undefined) {
        option.id = String(id);
    }
    return option;
}

async function getRepos() {
    return await fetch(`https://api.github.com/search/repositories?q=${searchInput.value}&page=1&per_page=${parePageSize}`)
}

function generateAndAddRepo(repositories) {
    [...searchList.children].forEach(el => el.remove());
    repositories.forEach(repo => {
        let option = makeSearchOption(repo.name, `${repo.owner.login} ${repo.name}`);
        searchList.append(option)    })
}

async function searchInputFunc () {
    let repositories;
    try {
        if (searchInput.value !== "" && /\S/.test(searchInput.value)) {
            repositories = await getRepos();
            repositories = await repositories.json();
            generateAndAddRepo(repositories.items);
        } else {
            [...searchList.children].forEach(el => el.remove());
        }
    } catch (error) {
        [...searchList.children].forEach(el => el.remove());
        console.log(error);
    }
}


searchInputFunc = debounce(searchInputFunc, debounceMs);

// =================================================================


function makeRepoP(title, text) {
    const res = document.createElement("p");
    res.textContent = `${title}: ${text}`;
    return res
}

function makeRepoButton() {
    const btn = document.createElement("button");
    const img = document.createElement("img");
    btn.classList.add("my-repo__button");
    img.src = "media/cross.svg"
    btn.append(img);
    return btn
}

function makeMyRepo (name, owner, stars, id) {
    let myRepo = document.createElement('li');
    myRepo.classList.add("my-repo__repo");
    const text = document.createElement('div');
    text.append(makeRepoP('Имя', name));
    text.append(makeRepoP('Владелец', owner));
    text.append(makeRepoP('Звезды', stars));
    myRepo.append(text);
    myRepo.append(makeRepoButton());
    myRepo.id = String(id);
    return myRepo;
}

function checkIdRepo(id) {
    let res = false
    const repoList = myRepoList.children;
    [...repoList].forEach(el => {
        if (el.id == id) {
            res = true;
        }
    })
    return res;
}



async function getReposOfId(event) {
    const [owner, name] = event.target.id.split(" ");
    return await fetch(`https://api.github.com/repos/${owner}/${name}`);
}

async function addRepoToListFunc(event) {
    try {
        let response = await getReposOfId(event);
        response = await response.json();
        if (!checkIdRepo(response.id)) {
            const repo = makeMyRepo(response.name, response.owner.login, response.stargazers_count, response.id);
            myRepoList.append(repo);
        }
        searchInput.value = "";
        [...searchList.children].forEach(el => el.remove());
    }
    catch (error) {
        console.log(error);
    }
}


const addRepoToList = debounce(addRepoToListFunc, debounceMs);


// =================================================================


function removeRepoFromList(event) {
    if (event.target.parentElement.classList.contains("my-repo__button")) {
        event.target.parentElement.parentElement.remove();
    }
}



// =================================================================


searchInput.addEventListener("input", searchInputFunc)
searchList.addEventListener("click", addRepoToList)
myRepoList.addEventListener("click", removeRepoFromList)


