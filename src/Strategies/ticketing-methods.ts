import {
  Person,
  Plane,
  Speed,
  isAisleBlock,
  AisleBlock,
  Seat,
  SeatStatus
} from "../Models/types";
import * as _ from "lodash";

//max speed must be grater then 0 --> can cause error
export function generateRandom(
  axis: Speed,
  maxSpeed = 1,
  maxLuggade = 3
): number {
  switch (axis) {
    case Speed.X:
      return Math.floor(Math.random() * (maxSpeed - 1) + 1);
    case Speed.Y:
      return Math.floor(Math.random() * (maxSpeed - 1) + 1);
    case Speed.LUGGADE:
      return Math.floor(Math.random() * (maxLuggade - 1) + 1);
    default:
      return 1;
  }
}

const getRandomFreeSeat = (aisleBlocks: Array<AisleBlock>): Seat => {
  let block: AisleBlock = _.sample(
    _.shuffle(aisleBlocks.filter(block => !block.fullyAssigned))
  );
  let freeSeats = _.flat([block.leftRow, block.rightRow]).filter(
    (s: Seat) => s.status === SeatStatus.FREE
  );
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
    person.ticket = { row: freeSeat.row, seatInRow: freeSeat.column };
    freeSeat.status = SeatStatus.ASSIGNED;
    seatBlock.assignedSeats++;
    if (seatBlock.assignedSeats === 6) seatBlock.fullyAssigned = true;
  });
  return passengers;
}
