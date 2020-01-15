import {
  SeatingMode,
  SeatStatus,
  TicketAssignmetMode,
  AisleBlock,
  Speed
} from "./types";
import Plane from "./Plane";
import Person from "./Person";
import * as ticketingMethods from "../Strategies/ticketing-methods";
import { IPassengers } from "./interfaces";

export default class Passengers implements IPassengers {
  private passengers: Array<Person>;
  private plane: Plane;

  constructor(plane: Plane, numOfPassengers: number) {
    const numOfPlaneSeats = plane.rows * plane.columns;
    if (numOfPassengers > numOfPlaneSeats) numOfPassengers = numOfPlaneSeats;
    this.plane.initSeats();
    this.passengers = new Array<Person>(numOfPassengers).fill({
      isSeated: false,
      xSpeed: ticketingMethods.generateRandom(Speed.X, plane.spaceBetweenRows),
      ySpeed: ticketingMethods.generateRandom(Speed.Y),
      luggageDelay: ticketingMethods.generateRandom(Speed.LUGGADE),
      ticket: null
    });
  }

  assignTicketsBy(mode: TicketAssignmetMode): Array<Person> {
    switch (mode) {
      case TicketAssignmetMode.RANDOM:
        return ticketingMethods.assignRandomly(this.plane, this.passengers);
      default:
        return ticketingMethods.assignRandomly(this.plane, this.passengers);
    }
  }

  getPassengers() {
    return this.passengers;
  }
}

//   create(
//     plane: Plane,
//     passengers: Array<Person>,
//     mode: SeatingMode = SeatingMode.RANDOM
//   ): Array<Person> {
//     this.aisle = plane.columns / 2;
//     switch (mode) {
//       case SeatingMode.RANDOM:
//         return seatingMethods.random(plane, passengers);
//       case SeatingMode.WINDOW_TO_AISLE:
//         return seatingMethods.windowToAisle(plane, passengers);
//       case SeatingMode.AISLE_TO_WINDOW:
//         return seatingMethods.aisleToWindow(plane, passengers);
//       case SeatingMode.BACK_TO_FRONT:
//         return seatingMethods.backToFront(plane, passengers);
//       case SeatingMode.FRONT_TO_BACK:
//         return seatingMethods.frontToBack(plane, passengers);
//       default:
//         return seatingMethods.random(plane, passengers);
//     }
//   }

//   // for example - composeSeatingMode(random, windowToAisle)(plane, passengers)
//   static composeSeatingMode(
//     ...modes
//   ): (plane: Plane, passengers: Array<Person>) => Array<Person> {
//     return R.compose(...modes);
//   }
// }
