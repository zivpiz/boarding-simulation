import { AisleBlock, EmptyAisleBlock, Plane, Seat, SeatStatus } from "./types";

const createEmptyRow = (
  rowNumber: number,
  numOfSeats: number,
  dir: string
): Array<Seat> => {
  let seats = new Array<Seat>(numOfSeats);
  return seats.map((seat: Seat, index: number) => {
    return dir === "left"
      ? { status: SeatStatus.FREE, row: rowNumber, column: index }
      : { status: SeatStatus.FREE, row: rowNumber, column: index + numOfSeats };
  });
};

const createAisleBlockWithRows = (
  rowNumber: number,
  seatsInRow: number
): AisleBlock => {
  return {
    hasRows: true,
    rightRow: createEmptyRow(rowNumber, seatsInRow, "right"),
    leftRow: createEmptyRow(rowNumber, seatsInRow, "left"),
    assignedSeats: 0,
    fullyAssigned: false,
    id: rowNumber
  };
};

const createAisleBlockWithoutRows = (): EmptyAisleBlock => {
  return { hasRows: false };
};

export const createPlane = (
  seatsRows: number,
  spaceBetweenRows: number,
  seatsInRow: number
): Plane => {
  const numberOfRows = seatsRows + (seatsRows - 1) * spaceBetweenRows;
  const aisle = new Array<AisleBlock | EmptyAisleBlock>(numberOfRows);

  for (let i = 0; i < numberOfRows; i++) {
    if (i % (spaceBetweenRows + 1) === 0)
      aisle[i] = createAisleBlockWithRows(i, seatsInRow);
    else aisle[i] = createAisleBlockWithoutRows();
  }

  return {
    rows: seatsRows,
    columns: seatsInRow,
    spaceBetweenRows: spaceBetweenRows,
    aisle: aisle
  };
};

export const initPlaneSeats = (plane: Plane): Plane => {
  plane.aisle.forEach(block => {
    if (block.hasRows) {
      (<AisleBlock>block).leftRow.forEach(
        seat => (seat.status = SeatStatus.FREE)
      );
      (<AisleBlock>block).rightRow.forEach(
        seat => (seat.status = SeatStatus.FREE)
      );
    }
  });
  return plane;
};
