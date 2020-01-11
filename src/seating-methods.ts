import * as _ from "lodash";
import { Person, Plane } from "./types";

export function random(plane: Plane, passengers: Array<Person>) {
  return _.shuffle(passengers);
}

export function windowToAisle(plane: Plane, passengers: Array<Person>) {
  const aisle: number = plane.columns / 2;
  return passengers.sort(
    (personA: Person, personB: Person): number =>
      Math.abs(personB.ticket.seatInRow - aisle) -
      Math.abs(personA.ticket.seatInRow - aisle)
  );
}

export function aisleToWindow(plane: Plane, passengers: Array<Person>) {
  const aisle: number = plane.columns / 2;
  return passengers.sort(
    (personA: Person, personB: Person): number =>
      Math.abs(personA.ticket.seatInRow - aisle) -
      Math.abs(personB.ticket.seatInRow - aisle)
  );
}

export function backToFront(plane: Plane, passengers: Array<Person>) {
  return passengers.sort(
    (personA: Person, personB: Person): number =>
      personB.ticket.row - personA.ticket.row
  );
}

export function frontToBack(plane: Plane, passengers: Array<Person>) {
  return passengers.sort(
    (personA: Person, personB: Person): number =>
      personA.ticket.row - personB.ticket.row
  );
}
