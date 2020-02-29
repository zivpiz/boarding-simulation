import {
  AisleBlock,
  EmptyAisleBlock,
  Seat,
  SeatStatus,
  Speed
} from "./Models/types";
import Plane from "./Models/Plane";

const createHalfRow = (
  rowNumber: number,
  numOfSeats: number,
  side: string
): Array<Seat> => {
  let seats = new Array<Seat>(numOfSeats);
  for (let index = 0; index < numOfSeats; index++) {
    seats[index] =
      side === "left"
        ? { status: SeatStatus.FREE, row: rowNumber, column: index }
        : {
            status: SeatStatus.FREE,
            row: rowNumber,
            column: index + numOfSeats + 1
          };
  }
  return seats;
};

export const createAisleBlockWithRows = (
  rowNumber: number,
  seatsInHalfRow: number
): AisleBlock => {
  return {
    hasRows: true,
    rightRow: createHalfRow(rowNumber, seatsInHalfRow, "right"),
    leftRow: createHalfRow(rowNumber, seatsInHalfRow, "left"),
    assignedSeats: 0,
    fullyAssigned: false,
    id: rowNumber,
    occupied: null
  };
};

export const createAisleBlockWithoutRows = (): EmptyAisleBlock => {
  return { hasRows: false, occupied: null };
};

//max speed must be grater then 0 --> can cause error
export const generateRandomSpeed = (
  axis: Speed,
  maxSpeed = 1,
  maxLuggade = 3
): number => {
  switch (axis) {
    case Speed.X:
      return generateRandomNatNumber(1, maxSpeed);
    case Speed.Y:
      return generateRandomNatNumber(1, maxSpeed);
    case Speed.LUGGADE:
      return generateRandomNatNumber(1, maxLuggade);
    default:
      return 1;
  }
};

export const generateRandomNatNumber = (
  minNum: number,
  maxNum: number
): number => {
  return Math.floor(Math.random() * (maxNum - minNum) + minNum);
};
