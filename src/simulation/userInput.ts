import { SeatingMode, TicketAssignmetMode } from "../Models/types";

const numberOfRows = 3;
const spaceBetweenRows = 2;
const numberOfSeatsInHalfRow = 3;

// If number of passengers is larger than the capacity of the plane - the plane fills up
const numberOfPassengers = 2;
const seatingMode: SeatingMode = SeatingMode.RANDOM;
const ticketingMode: TicketAssignmetMode = TicketAssignmetMode.BACK_TO_FRONT;

export default {
  numberOfRows,
  spaceBetweenRows,
  numberOfSeatsInHalfRow,
  numberOfPassengers,
  seatingMode,
  ticketingMode
};
