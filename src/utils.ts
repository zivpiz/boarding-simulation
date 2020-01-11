import { AisleBlock, Plane, Seat } from "./types";

const createEmptyRow = (numOfSeats: number): Array<Seat> => {
  return new Array(numOfSeats).fill({
    taken: false
  });
};

const createAisleBlockWithRows = (seatsInRow: number): AisleBlock => {
  return {
    hasRows: true,
    rightRow: createEmptyRow(seatsInRow),
    leftRow: createEmptyRow(seatsInRow)
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
