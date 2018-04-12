const orderedListPage = require('./ordered-list.page').orderedList;

describe('Ordered list', function () {
  beforeEach(async function () {
    await browser.get(browser.baseUrl);
  });

  it('should be initialized properly on click', async function () {
    await orderedListPage.initPersons();

    const elementsInOrderedScroll = element.all(by.css('#person-list > div'));
    const texts = await elementsInOrderedScroll.map(elm => elm.getText());

    expect(elementsInOrderedScroll).toEqual(['Aladar', 'Bela', 'Denes']);
  });

  it('should add new name in proper order', async function () {
    await orderedListPage.initPersons();
    await orderedListPage.addName("Cecil");

    const elementsInOrderedScroll = element.all(by.css('#person-list > div'));
    const texts = await elementsInOrderedScroll.map(elm => elm.getText());

    expect(elementsInOrderedScroll).toEqual(['Aladar', 'Bela', 'Cecil', 'Denes']);
  });
});