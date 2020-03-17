let { nCov19 } = require('./helper.js');
let express = require('express');
let app = express();
const port = process.env.port || 3000;

app.get('/', async (req, res) => {
  let data = await nCov19();
  let {
    totalInVietNam,
    infoVietNam,
    infoOtherCountries,
    totalInfectedInTheWorld,
    totalDeadIntheWorld,
    totalRecoveredIntheWorld,
  } = data;

  res.json({
    totalInVietNam,
    infoVietNam,
    infoOtherCountries,
    totalInfectedInTheWorld,
    totalDeadIntheWorld,
    totalRecoveredIntheWorld,
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
