import * as _ from "lodash";
import Person from "../Models/Person";
import Plane from "../Models/plane";

export function random(aisle: number, passengers: Array<Person>) {
  return _.shuffle(passengers);
}

export function windowToAisle(aisle: number, passengers: Array<Person>) {
  return passengers.sort(
    (personA: Person, personB: Person): number =>
      Math.abs(personB.ticket.column - aisle) -
      Math.abs(personA.ticket.column - aisle)
  );
}

export function aisleToWindow(aisle: number, passengers: Array<Person>) {
  return passengers.sort(
    (personA: Person, personB: Person): number =>
      Math.abs(personA.ticket.column - aisle) -
      Math.abs(personB.ticket.column - aisle)
  );
}

export function backToFront(aisle: number, passengers: Array<Person>) {
  return passengers.sort(
    (personA: Person, personB: Person): number =>
      personB.ticket.row - personA.ticket.row
  );
}

export function frontToBack(aisle: number, passengers: Array<Person>) {
  return passengers.sort(
    (personA: Person, personB: Person): number =>
      personA.ticket.row - personB.ticket.row
  );
}
