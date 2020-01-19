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
  let freeSeats = block.leftRow.concat(block.rightRow).filter(
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
    person.ticket = { row: freeSeat.row, column: freeSeat.column };
    freeSeat.status = SeatStatus.ASSIGNED;
    seatBlock.assignedSeats++;
    if (seatBlock.assignedSeats === 6) seatBlock.fullyAssigned = true;
  });
  return passengers;
}
