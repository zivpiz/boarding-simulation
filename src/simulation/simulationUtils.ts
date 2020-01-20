import * as _ from "lodash";
import { SeatingMode, TicketAssignmetMode } from "../Models/types";
import Plane from "../Models/plane";
import Passengers from "../Models/passengers";
import ActivePersonsQueue from "../Models/ActivePersonsQueue";
import { Simulator } from "./Simulator";

export const runSimulation = (
  numberOfRows: number,
  spaceBetweenRows: number,
  numberOfSeatsInHalfRow: number,
  numberOfPassengers: number,
  seatingMode: SeatingMode,
  ticketingMode: TicketAssignmetMode
) => {
  const plane = new Plane(
    numberOfRows,
    spaceBetweenRows,
    numberOfSeatsInHalfRow
  );
  const passengers = new Passengers(plane, numberOfPassengers);
  passengers.assignTicketsBy(ticketingMode);
  passengers.boardingBy(seatingMode);
  const boardingQueue = new ActivePersonsQueue(passengers.getPassengers());

  const simulator = new Simulator(plane, boardingQueue);
  return simulator.simulate();
};

export const findBestSeatingMode = (
  numberOfRows: number,
  spaceBetweenRows: number,
  numberOfSeatsInHalfRow: number,
  numberOfPassengers: number,
  ticketingMode: TicketAssignmetMode
): Array<{
  ticketingMode: TicketAssignmetMode;
  seatingMode: SeatingMode;
  result: number;
}> => {
  //Array of [{ticketingMode: __, seatingMode: __, result: __}, {ticketingMode: __, seatingMode: __, result: __}..]
  //for all seating modes
  const modes = Object.values(SeatingMode).map(seatingMode => {
    return {
      ticketingMode: ticketingMode,
      seatingMode: seatingMode,
      result: -1
    };
  });

  modes.forEach(mode => {
    mode.result = runSimulation(
      numberOfRows,
      spaceBetweenRows,
      numberOfSeatsInHalfRow,
      numberOfPassengers,
      mode.seatingMode,
      mode.ticketingMode
    );
  });

  return _.sortBy(modes, "result");
};
