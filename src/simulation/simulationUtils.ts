import * as _ from 'lodash'
import { SeatingMode } from '../Models/types'
import Plane from '../Models/plane'
import Passengers from '../Models/passengers'
import { Simulator } from './Simulator'

export const runSimulation = (numberOfRows, spaceBetweenRows, numberOfSeatsInHalfRow, numberOfPassengers, seatingMode) => {
  const plane = new Plane(numberOfRows, spaceBetweenRows, numberOfSeatsInHalfRow)
  const passengers = new Passengers(plane, numberOfPassengers)
  passengers.boardingBy(seatingMode)
  const boardingQueue = passengers.getPassengers()

  const simulator = new Simulator(plane, boardingQueue)
  return simulator.simulate()
}


export const findBestSeatingMode = (numberOfRows, spaceBetweenRows, numberOfSeatsInHalfRow, numberOfPassengers): Array<{mode: SeatingMode, result: number}> => {
  //Array of [{mode: __, result: __}, {mode: __, result: __}..] for all seating modes
  const seatingModes = Object.values(SeatingMode).map(seatingMode => {
    return {mode: seatingMode, result: -1};
  })

  seatingModes.forEach(seatingMode => {
    seatingMode.result = runSimulation(numberOfRows, spaceBetweenRows, numberOfSeatsInHalfRow, numberOfPassengers, seatingMode.mode);
  })

  _.sortBy(seatingModes, 'result')
  return seatingModes
}