import {searchInput, searchList} from "./index";
import {debounce} from "./utils/debounce";


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


function makeErrorOption (value) {
    const option = makeSearchOption(value);
    option.style.color = "red";
    option.style.height = "100%";
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

export async function searchInputFunc () {
    let repositories;
    try {
        if (searchInput.value !== "") {
            repositories = await getRepos();
            repositories = await repositories.json();
            generateAndAddRepo(repositories.items);
        } else {
            [...searchList.children].forEach(el => el.remove());
        }
    } catch (error) {
        [...searchList.children].forEach(el => el.remove());
        let optionError = makeErrorOption(String(error));
        searchList.append(optionError)
    }
}


searchInputFunc = debounce(searchInputFunc, 200);
