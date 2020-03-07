import { SeatingMode, TicketAssignmetMode } from "../Models/types";
import { frontToBack } from "../Strategies/seating-methods";

const numberOfRows = 30;
const spaceBetweenRows = 1;
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
