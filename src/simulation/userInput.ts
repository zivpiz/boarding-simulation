import { SeatingMode, TicketAssignmetMode } from "../Models/types";
import { frontToBack } from "../Strategies/seating-methods";

const numberOfRows = 4;
const spaceBetweenRows = 2;
const numberOfSeatsInHalfRow = 4;

// If number of passengers is larger than the capacity of the plane - the plane fills up
const numberOfPassengers = 25;
const seatingMode: SeatingMode = SeatingMode.AISLE_TO_WINDOW;
const ticketingMode: TicketAssignmetMode = TicketAssignmetMode.FRONT_TO_BACK;

export default {
  numberOfRows,
  spaceBetweenRows,
  numberOfSeatsInHalfRow,
  numberOfPassengers,
  seatingMode,
  ticketingMode
};
