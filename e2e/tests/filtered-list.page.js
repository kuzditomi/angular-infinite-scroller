exports.filteredList = {
    scrollDown
};

function scrollDown() {
    return browser.executeScript("document.querySelector('#filtered-list').children[document.querySelector('#filtered-list').children.length-1].scrollIntoView();");
}