import userInput from "./userInput";
import { SeatingMode, TicketAssignmetMode } from "../Models/types";
import { findBestSeatingMode, runSimulation } from "./simulationUtils";
import { runStatistics } from '../statistics/statistics';

//Gets parameters from user input, including seating mode and returns the simulation result
const simulateBasedOnUserInputWithSeatingMode = (): number => {
  const {
    numberOfRows,
    spaceBetweenRows,
    numberOfSeatsInHalfRow,
    numberOfPassengers,
    seatingMode,
    ticketingMode
  } = userInput;

  const simulationResult = runSimulation(
    numberOfRows,
    spaceBetweenRows,
    numberOfSeatsInHalfRow,
    numberOfPassengers,
    seatingMode,
    ticketingMode
  );
  // console.log("User based simulation result is:", simulationResult);
  return simulationResult;
};

//Gets parameters from user input and returns an array of best to worst seating modes
const findBestSeatingModeForUserInput = (): Array<{
  ticketingMode: TicketAssignmetMode;
  seatingMode: SeatingMode;
  result: number;
}> => {
  const {
    numberOfRows,
    spaceBetweenRows,
    numberOfSeatsInHalfRow,
    numberOfPassengers,
    ticketingMode
  } = userInput;

  return findBestSeatingMode(
    numberOfRows,
    spaceBetweenRows,
    numberOfSeatsInHalfRow,
    numberOfPassengers,
    ticketingMode
  );
};

// let results = findBestSeatingModeForUserInput().map((run, index) => {return {run: index, ...run}});
// console.log("\n--------------Results:\n",...results);

console.log(findBestSeatingModeForUserInput());
// let allResult = runStatistics();
// console.log("\n--------------stats:\n", allResult);
