import { SeatingMode, TicketAssignmetMode } from "../Models/types";

const numberOfRows = 3;
const spaceBetweenRows = 2;
const numberOfSeatsInHalfRow = 3;

// If number of passengers is larger than the capacity of the plane - the plane fills up
const numberOfPassengers = 2;
const seatingMode: SeatingMode = SeatingMode.WINDOW_TO_AISLE;
const ticketingMode: TicketAssignmetMode = TicketAssignmetMode.FRONT_TO_BACK;

export default {
  numberOfRows,
  spaceBetweenRows,
  numberOfSeatsInHalfRow,
  numberOfPassengers,
  seatingMode,
  ticketingMode
};
