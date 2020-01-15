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
