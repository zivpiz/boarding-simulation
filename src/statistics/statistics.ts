import * as _ from 'lodash'
import { TicketAssignmetMode } from '../Models/types'
import { findBestSeatingMode } from '../simulation/simulationUtils'

//Iterate over different plane sizes, for each plane check for 25% passengers, 50%, 75% and 100% passengers the best methods
//Will create an array of objects with the current data:
// {
//   planeCapacity,
//   numberOfRows,
//   spaceBetweenRows,
//   seatsInHalfRow,
//   numberOfPassengers,
//   random: (and the result for random),
//   window_to_isle: (and the result..),
//   ... the same for all seating modes, plus -
//   bestSeatingMode: (the mode with the best result for this specific plane and number of passengers)
// }

const MIN_NUMBER_OF_ROWS = 3;
// const MAX_NUMBER_OF_ROWS = 100;
const MAX_NUMBER_OF_ROWS = 3;
const ROWS_INCREMENT = 2;

const MIN_SPACE_BETWEEN_ROWS = 1;
const MAX_SPACE_BETWEEN_ROWS = 1;
// const MAX_SPACE_BETWEEN_ROWS = 5;
const SPACE_BETWEEN_INCREMENT = 1;

const MIN_SEATS_IN_HALF_ROW = 2;
const MAX_SEATS_IN_HALF_ROW = 2;
// const MAX_SEATS_IN_HALF_ROW = 5;
const SEATS_IN_HALF_INCREMENT = 1;

const ticketingMode = TicketAssignmetMode.RANDOM;

export const runStatistics = () => {
  const allResults = [];

  for (let rows = MIN_NUMBER_OF_ROWS; rows <= MAX_NUMBER_OF_ROWS; rows += ROWS_INCREMENT) {
    for (let spaceBetweenRows = MIN_SPACE_BETWEEN_ROWS; spaceBetweenRows <= MAX_SPACE_BETWEEN_ROWS; spaceBetweenRows += SPACE_BETWEEN_INCREMENT) {
      for (let seatsInHalfRow = MIN_SEATS_IN_HALF_ROW; seatsInHalfRow <= MAX_SEATS_IN_HALF_ROW; seatsInHalfRow += SEATS_IN_HALF_INCREMENT) {
        const numberOfSeats = rows * seatsInHalfRow * 2;
        for (let i = 1; i <= 4; i++) {

          const numberOfPassengers = (numberOfSeats / 4) * i;
          const allSeatingModesSimulation = findBestSeatingMode(rows, spaceBetweenRows, seatsInHalfRow, numberOfPassengers, ticketingMode);
          const bestSeatingMode = _.sortBy(allSeatingModesSimulation, "result")[0].seatingMode;

          const currentResult = {
            planeCapacity: numberOfSeats,
            numberOfRows: rows,
            spaceBetweenRows,
            seatsInHalfRow,
            numberOfPassengers,
          };
          allSeatingModesSimulation.forEach(seatingModeResult => {
            _.assign(currentResult, {
              [seatingModeResult.seatingMode]: seatingModeResult.result
            });
          });
          _.assign(currentResult, {
            bestSeatingMode
          });

          allResults.push(currentResult);
        }
      }
    }
  }

  return allResults;
}