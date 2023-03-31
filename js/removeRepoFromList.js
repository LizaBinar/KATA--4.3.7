export function removeRepoFromList(event) {
    if (event.target.parentElement.classList.contains("my-repo__button")) {
        event.target.parentElement.parentElement.remove();
    }
}
