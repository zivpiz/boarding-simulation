import { SeatingMode, TicketAssignmetMode } from "../Models/types";
import { frontToBack } from "../Strategies/seating-methods";

const numberOfRows = 3;
const spaceBetweenRows = 1;
const numberOfSeatsInHalfRow = 3;

// If number of passengers is larger than the capacity of the plane - the plane fills up
const numberOfPassengers = 12;
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
