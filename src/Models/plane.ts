import { AisleBlock, EmptyAisleBlock, Person } from "./types";
import {
  createAisleBlockWithRows,
  createAisleBlockWithoutRows
} from "../utils";
import { IPlane } from "./interfaces";

class Plane implements IPlane {
  rows: number;
  columns: number;
  spaceBetweenRows: number;
  aisle: Array<AisleBlock | EmptyAisleBlock>;

  constructor(
    seatsRows: number,
    spaceBetweenRows: number,
    seatsInHalfRow: number
  ) {
    this.rows = seatsRows + (seatsRows - 1) * spaceBetweenRows;
    this.columns = seatsInHalfRow * 2 + 1;
    this.spaceBetweenRows = spaceBetweenRows;
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
}

export default Plane;
