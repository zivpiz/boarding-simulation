import * as _ from "lodash";
import * as R from "ramda";
import Person from "../Models/Person";

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

export function frontToBackWindowToAisle(
  aisle: number,
  passengers: Array<Person>
) {
  return composeSeatingMode(windowToAisle, frontToBack)(aisle, passengers);
}

export function frontToBackAisleToWindow(
  aisle: number,
  passengers: Array<Person>
) {
  return composeSeatingMode(aisleToWindow, frontToBack)(aisle, passengers);
}

export function backToFrontWindowToAisle(
  aisle: number,
  passengers: Array<Person>
) {
  return composeSeatingMode(windowToAisle, backToFront)(aisle, passengers);
}

export function backToFrontAisleToWindow(
  aisle: number,
  passengers: Array<Person>
) {
  return composeSeatingMode(aisleToWindow, backToFront)(aisle, passengers);
}

// for example - composeSeatingMode(random, windowToAisle)(plane, passengers)
function composeSeatingMode(
  ...modes
): (aisle: number, passengers: Array<Person>) => Array<Person> {
  return R.compose(...modes);
}
