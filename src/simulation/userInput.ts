import { SeatingMode, TicketAssignmetMode } from "../Models/types";

const numberOfRows = 30;
const spaceBetweenRows = 3;
const numberOfSeatsInHalfRow = 3;

// If number of passengers is larger than the capacity of the plane - the plane fills up
const numberOfPassengers = Infinity;
const seatingMode: SeatingMode = SeatingMode.WINDOW_TO_AISLE;
const ticketingMode: TicketAssignmetMode = TicketAssignmetMode.RANDOM;

export default {
  numberOfRows,
  spaceBetweenRows,
  numberOfSeatsInHalfRow,
  numberOfPassengers,
  seatingMode,
  ticketingMode
};
