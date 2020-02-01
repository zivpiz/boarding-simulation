import {
  Speed,
  isAisleBlock,
  AisleBlock,
  Seat,
  SeatStatus
} from "../Models/types";
import * as _ from "lodash";
import Plane from "../Models/plane";
import Person from "../Models/Person";

const getRandomFreeSeat = (aisleBlocks: Array<AisleBlock>): Seat => {
  let block: AisleBlock = _.sample(
    _.shuffle(aisleBlocks.filter(block => !block.fullyAssigned))
  );
  let freeSeats = block.leftRow
    .concat(block.rightRow)
    .filter((s: Seat) => s.status === SeatStatus.FREE);
  return _.sample(freeSeats);
};

export function assignRandomly(
  plane: Plane,
  passengers: Array<Person>
): Array<Person> {
  let aisleBlocks = plane.aisle.filter(<(x) => x is AisleBlock>(
    (a => isAisleBlock(a))
  ));
  passengers.forEach(person => {
    let freeSeat = getRandomFreeSeat(aisleBlocks);
    let seatBlock = aisleBlocks.find(block => block.id === freeSeat.row);
    person.ticket = { row: freeSeat.row, column: freeSeat.column };
    freeSeat.status = SeatStatus.ASSIGNED;
    seatBlock.assignedSeats++;
    if (seatBlock.assignedSeats === (plane.getCenter() * 2)) seatBlock.fullyAssigned = true;
  });
  return passengers;
}

//row 0 --> row max, column 0 --> column max
export function frontToBack(
  plane: Plane,
  passengers: Array<Person>
): Array<Person> {
  let aisleBlocks = plane.aisle.filter(<(x) => x is AisleBlock>(
    (a => isAisleBlock(a))
  ));
  let person_index = 0;

  for (let block of aisleBlocks) {
    let blockSeats = block.leftRow.concat(block.rightRow);
    for (let seat of blockSeats) {
      let person = passengers[person_index];
      if (!person) break;
      person.ticket = { row: seat.row, column: seat.column };
      seat.status = SeatStatus.ASSIGNED;
      block.assignedSeats++;
      if (block.assignedSeats === (plane.getCenter() * 2)) block.fullyAssigned = true;
      person_index++;
    }
    if (person_index >= passengers.length) break;
  }
  return passengers;
}

//row max --> row 0, column max --> column 0
export function backToFront(
  plane: Plane,
  passengers: Array<Person>
): Array<Person> {
  let aisleBlocks = plane.aisle
    .filter(<(x) => x is AisleBlock>(a => isAisleBlock(a)))
    .reverse();
  let person_index = 0;

  for (let block of aisleBlocks) {
    let blockSeats = block.rightRow.concat(block.leftRow);
    for (let seat of blockSeats) {
      let person = passengers[person_index];
      if (!person) break;
      person.ticket = { row: seat.row, column: seat.column };
      seat.status = SeatStatus.ASSIGNED;
      block.assignedSeats++;
      if (block.assignedSeats === (plane.getCenter() * 2)) block.fullyAssigned = true;
      person_index++;
    }
    if (person_index >= passengers.length) break;
  }
  return passengers;
}
