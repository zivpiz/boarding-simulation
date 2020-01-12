import { AisleBlock, EmptyAisleBlock, Plane, Seat, SeatStatus } from "./types";

const createEmptyRow = (numOfSeats: number): Array<Seat> => {
  return new Array(numOfSeats).fill({
    status: SeatStatus.FREE
  });
};

const createAisleBlockWithRows = (seatsInRow: number): AisleBlock => {
  return {
    hasRows: true,
    rightRow: createEmptyRow(seatsInRow),
    leftRow: createEmptyRow(seatsInRow),
    assignedSeats: 0,
    fullyAssigned: false
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
      aisle[i] = createAisleBlockWithRows(seatsInRow);
    else aisle[i] = createAisleBlockWithoutRows();
  }

  return {
    rows: seatsRows,
    columns: seatsInRow,
    aisle: aisle
  };
};
