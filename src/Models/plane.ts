import { AisleBlock, EmptyAisleBlock, SeatStatus } from "./types";
import {
  createAisleBlockWithRows,
  createAisleBlockWithoutRows
} from "../utils";
import Person from "./Person";
import { IPlane } from "./interfaces";

class Plane implements IPlane {
  rows: number;
  seatsRows: number;
  columns: number;
  spaceBetweenRows: number;
  aisle: Array<AisleBlock | EmptyAisleBlock>;
  centerColumn: number;

  constructor(
    seatsRows: number,
    spaceBetweenRows: number,
    seatsInHalfRow: number
  ) {
    this.seatsRows = seatsRows;
    this.rows = seatsRows + (seatsRows - 1) * spaceBetweenRows;
    this.columns = seatsInHalfRow * 2 + 1;
    this.spaceBetweenRows = spaceBetweenRows;
    this.centerColumn = seatsInHalfRow + 1;
    this.aisle = new Array<AisleBlock | EmptyAisleBlock>(this.rows);

    for (let i = 0; i < this.rows; i++) {
      if (i % (spaceBetweenRows + 1) === 0)
        this.aisle[i] = createAisleBlockWithRows(i, seatsInHalfRow);
      else this.aisle[i] = createAisleBlockWithoutRows();
    }
  }

  getAisle(): Array<AisleBlock | EmptyAisleBlock> {
    return this.aisle;
  }

  getCenter(): number {
    return this.centerColumn;
  }

  getNumberOfSeats(): number {
    return this.seatsRows;
  }

  initSeats() {
    this.aisle.forEach(block => {
      if (block.hasRows) {
        (<AisleBlock>block).leftRow.forEach(
          seat => (seat.status = SeatStatus.FREE)
        );
        (<AisleBlock>block).rightRow.forEach(
          seat => (seat.status = SeatStatus.FREE)
        );
      }
    });
  }
}

export default Plane;
