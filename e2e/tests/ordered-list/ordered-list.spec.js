const orderedListPage = require('./ordered-list.page').orderedList;

describe('Ordered list', function () {
  beforeEach(async function () {
    await browser.get(browser.baseUrl);
  });

  it('should be initialized properly on click', async function () {
    await orderedListPage.initPersons();

    const elementsInOrderedScroll = await element.all(by.css('#person-list > div'));
    const texts = await Promise.all(elementsInOrderedScroll.map(elm => elm.getText()));

    expect(texts).toEqual(['Aladar', 'Bela', 'Denes']);
  });

  it('should add new name in proper order', async function () {
    await orderedListPage.initPersons();
    await orderedListPage.addName("Cecil");

    const elementsInOrderedScroll = await element.all(by.css('#person-list > div'));
    const texts = await Promise.all(elementsInOrderedScroll.map(elm => elm.getText()));

    expect(texts).toEqual(['Aladar', 'Bela', 'Cecil', 'Denes']);
  });

  it('should remove element from DOM if not needed', async function () {
    await orderedListPage.initPersons();
    await orderedListPage.clickRemove();    

    const elementsInOrderedScroll = await element.all(by.css('#person-list > div')).count();

    expect(elementsInOrderedScroll).toEqual(2);
  });
});