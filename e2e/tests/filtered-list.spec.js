const filteredListPage = require('./filtered-list.page').filteredList;

describe('Filtered list', function () {
  beforeEach(async function () {
    await browser.get(browser.baseUrl);
  });

  it('should be filled properly', async function () {
    const elementsInFilterdScroll = await element.all(by.css('#filtered-list > div'));

    expect(elementsInFilterdScroll.length).toEqual(15);
  });

  it('should display proper elements on filter', async function () {
    const filterInput = element(by.css('#txtFilter'));
    await filterInput.sendKeys('B');

    const elementsInFilterdScroll = await element.all(by.css('#filtered-list > div .name'));
    const texts = await Promise.all(elementsInFilterdScroll.map(e => e.getText()))
    expect(texts).toEqual(["B","B","B","B","B","B","B","B","B","B"]);
  });

  it('should clean up elements on filter', async function () {
    const filterInput = element(by.css('#txtFilter'));
    await filterInput.sendKeys('B');

    const elementsInFilterdScroll = await element.all(by.css('#filtered-list > div'));

    expect(elementsInFilterdScroll.length).toEqual(10);
  });

  it('should repopulate elements when removing filter', async function () {
    const filterInput = element(by.css('#txtFilter'));
    await filterInput.sendKeys('B');

    let elementsInFilterdScroll = await element.all(by.css('#filtered-list > div'));
    expect(elementsInFilterdScroll.length).toEqual(10);

    await filterInput.sendKeys(protractor.Key.BACK_SPACE);

    elementsInFilterdScroll = await element.all(by.css('#filtered-list > div'));
    expect(elementsInFilterdScroll.length).toEqual(20);
  });

  it('should keep the order of elements when filtering while scrolled', async function () {
    await filteredListPage.scrollDown();

    const filterInput = element(by.css('#txtFilter'));
    await filterInput.sendKeys('B');
    await filterInput.sendKeys(protractor.Key.BACK_SPACE);

    await filteredListPage.scrollDown();

    const elementsInFilterdScroll = await element.all(by.css('#filtered-list > div span.id'));
    const ids = await Promise.all(elementsInFilterdScroll.map(e => e.getText()));
    const numbersFromZero = Array.from(Array(30).keys()).map(i => '' + i);

    expect(ids).toEqual(numbersFromZero);
  });
});