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
  numberOfSeats: number;

  constructor(
    seatsRows: number,
    spaceBetweenRows: number,
    seatsInHalfRow: number
  ) {
    this.seatsRows = seatsRows;
    this.rows = seatsRows + seatsRows * spaceBetweenRows;
    this.columns = seatsInHalfRow * 2 + 1;
    this.spaceBetweenRows = spaceBetweenRows;
    this.centerColumn = seatsInHalfRow;
    this.numberOfSeats = seatsRows * seatsInHalfRow * 2;
    this.aisle = new Array<AisleBlock | EmptyAisleBlock>(this.rows);

    let preAisle = Array<EmptyAisleBlock>(spaceBetweenRows).fill(
      createAisleBlockWithoutRows()
    );
    for (let i = 0; i < this.rows - this.spaceBetweenRows; i++) {
      if (i % (spaceBetweenRows + 1) === 0)
        this.aisle[i] = createAisleBlockWithRows(
          i + spaceBetweenRows,
          seatsInHalfRow
        );
      else this.aisle[i] = createAisleBlockWithoutRows();
    }
    this.aisle.unshift(...preAisle);
  }

  getAisle(): Array<AisleBlock | EmptyAisleBlock> {
    return this.aisle;
  }

  getCenter(): number {
    return this.centerColumn;
  }

  getNumberOfSeats(): number {
    return this.numberOfSeats;
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
