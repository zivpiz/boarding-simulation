import { AisleBlock, Plane, Seat, SeatStatus } from "./types";

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

const createAisleBlockWithoutRows = () => {
  return { hasRows: false };
};

export const createPlane = (
  numOfLines: number,
  spaceBetweenLines: number,
  seatsInRow: number
): Plane => {
  const aisle = [];

  for (let i = 0; i < numOfLines; i++) {
    if (i % spaceBetweenLines === 0)
      aisle[i] = createAisleBlockWithRows(seatsInRow);
    else aisle[i] = createAisleBlockWithoutRows();
  }

  return { aisle };
};
