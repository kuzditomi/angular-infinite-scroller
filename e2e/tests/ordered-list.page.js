exports.orderedList = {
    initPersons,
    addName
};

function initPersons() {
    return element(by.css('#btnInitPersons')).click();
}

function fillName(name) {
    return element(by.css('#txtName')).sendKeys(name);
}

function clickAdd() {
    return element(by.css('#btnAddPerson')).click();
}

async function addName(name) {
    await fillName(name);
    await clickAdd();
}