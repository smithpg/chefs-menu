require("dotenv").config();

const _ = require("lodash");

const { getCoordinates, CoordPair } = require("../services/geo");

const {
  insertNewDishForChef,
  insertNewChef,
  insertNewCustomer,
  dropUsers
} = require("./helpers");

const newChefs = [];

const locations = [
  "San Francisco, CA",
  "Richmond, CA",
  "Hayward, CA",
  "Sacramento, CA",
  "Berkeley, CA",
  "Oakland, CA",
  "Concord, CA",
  "Fremont, CA",
  "Antioch, CA"
];

try {
  (async function() {
    await dropUsers();
    // Create 10 fake customers
    for (let n of _.range(10)) {
      await insertNewCustomer({ email: `customer${n}@gmail.com` });
    }

    // Create 40 fake chefs at various locations in the Bay Area
    for (let n of _.range(40)) {
      const strlocation = _.sample(locations),
        location = (await getCoordinates(strlocation)).toGeoJsonPoint();

      console.log(location);

      newChefs.push(
        await insertNewChef({
          email: `chef${n}@gmail.com`,
          strlocation,
          location,
          description: `Award-winning chef with 10 years experience.`
        })
      );
    }

    console.log("Done with chefs!");

    await new Promise((resolve, reject) =>
      setTimeout(() => resolve("done"), 2000)
    );

    for (let chef of newChefs) {
      console.log("creating dishs for chef with id ", chef._id);

      await insertNewDishForChef(chef._id);
      await insertNewDishForChef(chef._id);
      await insertNewDishForChef(chef._id);
    }

    process.exit(0);
  })();
} catch (error) {
  console.log(error);
}
