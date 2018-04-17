exports.orderedList = {
    initPersons,
    addName,
    clickRemove
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

function clickRemove() {
    return element(by.css('#btnRemovePerson')).click();
}

async function addName(name) {
    await fillName(name);
    await clickAdd();
}