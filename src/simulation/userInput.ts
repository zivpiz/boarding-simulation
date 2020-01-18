import { SeatingMode, TicketAssignmetMode } from '../Models/types'

const numberOfRows = 20;
const spaceBetweenRows = 3;
const numberOfSeatsInHalfRow = 3;

// If number of passengers is larger than the capacity of the plane - the plane fills up
const numberOfPassengers = Infinity
const seatingMode: SeatingMode = SeatingMode.RANDOM

export default {
  numberOfRows,
  spaceBetweenRows,
  numberOfSeatsInHalfRow,
  numberOfPassengers,
  seatingMode
}