import * as _ from "lodash";
import { SeatingMode, TicketAssignmetMode } from "../Models/types";
import Plane from "../Models/plane";
import Person from "../Models/Person";
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

  const snapshot = createSnapshot(
    (numberOfRows + 1) * spaceBetweenRows + numberOfRows,
    1 + 2 * numberOfSeatsInHalfRow
  );

  let maxIteratinos = 30000;
  const simulator = new Simulator(plane, boardingQueue, snapshot, maxIteratinos, false);
  try {
    return simulator.simulate();
  } catch (e) {
    console.log("simulation with bug! " + e);
    return null;
  }
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
  passengers: number;
  result: number;
}> => {
  //Array of [{ticketingMode: __, seatingMode: __, passengers: __, result: __}...]
  //for all seating modes
  const modes = Object.values(SeatingMode).map(seatingMode => {
    return {
      ticketingMode: ticketingMode,
      seatingMode: seatingMode,
      passengers: numberOfPassengers,
      result: -1
    };
  });
  // let mode = 1;
  // console.log(modes[mode]);
  // modes[mode].result = runSimulation(
  //   numberOfRows,
  //   spaceBetweenRows,
  //   numberOfSeatsInHalfRow,
  //   numberOfPassengers,
  //   modes[mode].seatingMode,
  //   modes[mode].ticketingMode
  // );
  // return [modes[mode]];
  modes.forEach(mode => {
    // console.log(mode);
    mode.result = runSimulation(
      numberOfRows,
      spaceBetweenRows,
      numberOfSeatsInHalfRow,
      numberOfPassengers,
      mode.seatingMode,
      mode.ticketingMode
    );
  });
  //
  // return _.sortBy(modes, "result");
  return modes;
};

export const createSnapshot = (rows, columns) => {
  let snapshot = new Array(rows)
    .fill("garbage")
    .map((_, row) =>
      new Array(columns)
        .fill("garbage")
        .map((_, col) => ({ row, column: col, person: null }))
    );

  return snapshot;
};

// export const getTestPassengers = (plane: Plane) {
//   let positionById = (id: number) => {row: -id}
//   const numOfPassengers = 8;
//   let costumPersons = new Array<Person>([
//     Person.createTestPerson(plane.spaceBetweenRows, )
//   ])
//   const passengers = new Passengers(plane, numOfPassengers);
//   passengers.passengers = costumPersons;
//   passengers.assignTicketsBy(ticketingMode);
//   passengers.boardingBy(seatingMode);
//   const boardingQueue = new ActivePersonsQueue(passengers.getPassengers());
// }