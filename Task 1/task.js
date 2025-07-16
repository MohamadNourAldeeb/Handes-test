function getDistance(point1, point2) {
  // default values for test
  const distances = {
    "G-H1": 5,
    "G-H2": 6,
    "G-H3": 5,
    "G-H4": 8,
    "G-H5": 3,
    "H1-H2": 2,
    "H1-H3": 3,
    "H1-H4": 7,
    "H1-H5": 4,
    "H2-H3": 1,
    "H2-H4": 5,
    "H2-H5": 3,
    "H3-H4": 4,
    "H3-H5": 2,
    "H4-H5": 6,
  };
  //  sort the key by alph for not repeat the keys
  const key = point1 < point2 ? `${point1}-${point2}` : `${point2}-${point1}`;

  //    Infinity if not found
  return distances[key] || Infinity;
}

function whoGivesRide(unwellPeople) {
  const allPeople = ["P1", "P2", "P3", "P4", "P5"];
  const houseMap = { P1: "H1", P2: "H2", P3: "H3", P4: "H4", P5: "H5" };

  const availablePeople = allPeople.filter((p) => !unwellPeople.includes(p));

  const result = {};

  for (const sick of unwellPeople) {
    // get house sick value
    const sickHome = houseMap[sick];

    let minDistance = Infinity;
    let bestDriver = null;

    for (const driver of availablePeople) {
      const driverHome = houseMap[driver];
      //   the distance from gym to driver home
      const distanceToDriver = getDistance("G", driverHome);
      //   the distance from driver home to sick home
      const distanceDriverToSick = getDistance(driverHome, sickHome);
      const totalDistance = distanceToDriver + distanceDriverToSick;

      if (totalDistance == Infinity) {
        console.error(
          `the distance of some key not found ,error when calculate for sick :${sick}`
        );
        break;
      }

      if (totalDistance < minDistance) {
        minDistance = totalDistance;
        bestDriver = driver;
      }
    }
    //  delete the best driver from avaliable
    if (bestDriver) {
      result[sick] = bestDriver;
      const index = availablePeople.indexOf(bestDriver);
      availablePeople.splice(index, 1);
    }
  }

  return result;
}

// for test the code
console.log(whoGivesRide(["P1", "P2"]));
