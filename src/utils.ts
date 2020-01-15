import { AisleBlock, EmptyAisleBlock, Seat, SeatStatus } from "./Models/types";
import Plane from "./Models/Plane";

const createHalfRow = (
  rowNumber: number,
  numOfSeats: number,
  side: string
): Array<Seat> => {
  let seats = new Array<Seat>(numOfSeats);
  return seats.map((seat: Seat, index: number) => {
    return side === "left"
      ? { status: SeatStatus.FREE, row: rowNumber, column: index }
      : {
          status: SeatStatus.FREE,
          row: rowNumber,
          column: index + numOfSeats + 1
        };
  });
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
