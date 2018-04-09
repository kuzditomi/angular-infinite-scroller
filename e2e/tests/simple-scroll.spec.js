describe('Simple list', function () {
  beforeEach(async function () {
    await browser.get(browser.baseUrl);
  });

  it('should be filled by default', async function () {
    const elementsInSimpleScroll = await element.all(by.css('#simple-list > div')).count();

    expect(elementsInSimpleScroll).toEqual(21);
  });

  it('should load the first items in order', async function () {
    const elementsInSimpleScroll = element.all(by.css('#simple-list > div'));
    const texts = await elementsInSimpleScroll.map(elm => elm.getText());

    const numbersInOrder = Array.from(Array(21).keys());

    expect(elementsInSimpleScroll).toEqual(numbersInOrder);
  });
});