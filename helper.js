const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const url = 'https://corona.kompa.ai/';

try {
  nCov19 = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const html = await page
      .goto('https://corona.kompa.ai/', { waitUntil: 'networkidle2', timeout: 60000 })
      .then(function() {
        return page.content();
      });

    const $ = cheerio.load(html);
    let infoVietNam = [];
    let totalInVietNam = 0;
    let infoOtherCountries = [];
    let totalInfectedInTheWorld = 0;
    let totalDeadIntheWorld = 0;
    let totalRecoveredIntheWorld = 0;

    $('ul.list-group')
      .eq(0)
      .children('li')
      .each((index, ele) => {
        let firstDigit = $(ele)
          .text()
          .search(/\d/);
        let firstSpaceAfterFirtDigit = $(ele)
          .text()
          .slice(firstDigit)
          .search(/\s/);

        let province = $(ele)
          .text()
          .slice(0, firstDigit - 1);

        let infected = $(ele)
          .text()
          .slice(firstDigit)
          .slice(0, firstSpaceAfterFirtDigit);

        let recovered = '0';
        let recover_temp = $(ele)
          .text()
          .slice(firstDigit)
          .slice(firstSpaceAfterFirtDigit + 2); //14  0(two space)
        if (recover_temp !== '') recovered = recover_temp;
        infoVietNam.push({ province, infected, recovered });
      });

    totalInVietNam = $('.box.confirmed.confirmed-box')
      .eq(0)
      .children('div')
      .children('font')
      .text();

    $('ul.list-group')
      .eq(1)
      .children('li')
      .each((index, ele) => {
        let firstDigit = $(ele)
          .text()
          .search(/\d/);
        let nameCountry = $(ele)
          .text()
          .slice(0, firstDigit - 1);
        let infected = $(ele)
          .text()
          .slice(firstDigit);
        if (index !== 0) {
          infoOtherCountries.push({
            nameCountry,
            infected,
          });
        }
      });
    totalInfectedInTheWorld = $('.box.top-box.col')
      .eq(0)
      .children('div')
      .children('div')
      .first()
      .text();
    totalDeadIntheWorld = $('.box.top-box.col')
      .eq(1)
      .children('div')
      .children('div')
      .first()
      .text();
    totalRecoveredIntheWorld = $('.box.top-box.col')
      .eq(2)
      .children('div')
      .children('div')
      .first()
      .text();
    await browser.close();
    return {
      totalInVietNam,
      infoVietNam,
      infoOtherCountries,
      totalInfectedInTheWorld,
      totalDeadIntheWorld,
      totalRecoveredIntheWorld,
    };
    // return infoVietNam;
  };
} catch (error) {
  console.log('Something wrong');
}
module.exports.nCov19 = nCov19;
