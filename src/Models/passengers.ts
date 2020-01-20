import { SeatingMode, TicketAssignmetMode } from "./types";
import { IPassengers } from "./interfaces";
import * as ticketingMethods from "../Strategies/ticketing-methods";
import * as seatingMethods from "../Strategies/seating-methods";
import * as R from "ramda";
import Plane from "./Plane";
import Person from "./Person";

export default class Passengers implements IPassengers {
  passengers: Array<Person>;
  plane: Plane;

  constructor(plane: Plane, numOfPassengers: number) {
    const numOfPlaneSeats = plane.getNumberOfSeats();
    if (numOfPassengers > numOfPlaneSeats) numOfPassengers = numOfPlaneSeats;
    this.plane = plane;
    this.plane.initSeats();
    this.passengers = this.initPersons(plane, numOfPassengers);
    this.assignTicketsBy(TicketAssignmetMode.RANDOM);
  }

  getPassengers() {
    return this.passengers;
  }

  initPersons(plane: Plane, numOfPassengers: number): Array<Person> {
    let persons = new Array<Person>(numOfPassengers);
    for (let i = 0; i < numOfPassengers; i++) {
      persons[i] = new Person(
        plane.spaceBetweenRows,
        {
          row: i == 0 ? 0 : -1 * i,
          column: plane.getCenter()
        },
        i
      );
    }
    return persons;
  }

  setPassengersTargetToTicket(passengers: Array<Person>): Array<Person> {
    passengers.forEach(p => p.setTarget(p.ticket));
    return this.passengers;
  }
  //assign tickets to passengers by mode
  //return passengers
  assignTicketsBy(mode: TicketAssignmetMode): Array<Person> {
    switch (mode) {
      case TicketAssignmetMode.RANDOM:
        return this.setPassengersTargetToTicket(
          ticketingMethods.assignRandomly(this.plane, this.passengers)
        );
      case TicketAssignmetMode.FRONT_TO_BACK:
        return this.setPassengersTargetToTicket(
          ticketingMethods.frontToBack(this.plane, this.passengers)
        );
      case TicketAssignmetMode.BACK_TO_FRONT:
        return this.setPassengersTargetToTicket(
          ticketingMethods.backToFront(this.plane, this.passengers)
        );
      default:
        return this.setPassengersTargetToTicket(
          ticketingMethods.assignRandomly(this.plane, this.passengers)
        );
    }
  }
  //create sort queue by mode.
  //set Persons frontPerson and BackPerson by mode
  boardingBy(mode: SeatingMode): Array<Person> {
    let asile = this.plane.getCenter();
    switch (mode) {
      case SeatingMode.RANDOM:
        return seatingMethods.random(asile, this.passengers);
      case SeatingMode.WINDOW_TO_AISLE:
        return seatingMethods.windowToAisle(asile, this.passengers);
      case SeatingMode.AISLE_TO_WINDOW:
        return seatingMethods.aisleToWindow(asile, this.passengers);
      case SeatingMode.BACK_TO_FRONT:
        return seatingMethods.backToFront(asile, this.passengers);
      case SeatingMode.FRONT_TO_BACK:
        return seatingMethods.frontToBack(asile, this.passengers);
      default:
        return seatingMethods.random(asile, this.passengers);
    }
  }

  // for example - composeSeatingMode(random, windowToAisle)(plane, passengers)
  static composeSeatingMode(
    ...modes
  ): (aisle: number, passengers: Array<Person>) => Array<Person> {
    return R.compose(...modes);
  }
}
