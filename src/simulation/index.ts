import userBasedInput from './userBasedInput'
import { SeatingMode } from '../Models/types'
import { findBestSeatingMode, runSimulation } from './simulationUtils'


//Gets parameters from user input, including seating mode and returns the simulation result
const simulateBasedOnUserInputWithSeatingMode = (): number => {
  const {
    numberOfRows,
    spaceBetweenRows,
    numberOfSeatsInHalfRow,
    numberOfPassengers,
    seatingMode
  } = userBasedInput

  const simulationResult = runSimulation(numberOfRows, spaceBetweenRows, numberOfSeatsInHalfRow, numberOfPassengers, seatingMode);
  console.log('User based simulation result is:', simulationResult);
  return simulationResult;
}


//Gets parameters from user input and returns an array of best to worst seating modes
const findBestSeatingModeForUserInput = (): Array<{mode: SeatingMode, result: number}> => {
  const {
    numberOfRows,
    spaceBetweenRows,
    numberOfSeatsInHalfRow,
    numberOfPassengers,
  } = userBasedInput;

  return findBestSeatingMode(numberOfRows, spaceBetweenRows, numberOfSeatsInHalfRow, numberOfPassengers)
}
