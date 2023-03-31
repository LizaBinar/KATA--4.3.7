import {myRepoList, searchInput, searchList} from "./index";
import {debounce} from "./utils/debounce";

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


export const addRepoToList = debounce(addRepoToListFunc, 200);