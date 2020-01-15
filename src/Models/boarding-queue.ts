import * as _ from "lodash";
import * as R from "ramda";
import * as seatingMethods from "../Strategies/seating-methods";
import { Person, SeatingMode } from "./types";
import Plane from "./Plane";

// Usage:
// bq = new BoardingQueue(plane).create(passengers);
// or bq = BoardingQueue.composeSeatingMode()

class BoardingQueue {
  private aisle: number;

  constructor(plane: Plane) {
    this.aisle = plane.columns / 2;
  }

  create(
    plane: Plane,
    passengers: Array<Person>,
    mode: SeatingMode = SeatingMode.RANDOM
  ): Array<Person> {
    this.aisle = plane.columns / 2;
    switch (mode) {
      case SeatingMode.RANDOM:
        return seatingMethods.random(plane, passengers);
      case SeatingMode.WINDOW_TO_AISLE:
        return seatingMethods.windowToAisle(plane, passengers);
      case SeatingMode.AISLE_TO_WINDOW:
        return seatingMethods.aisleToWindow(plane, passengers);
      case SeatingMode.BACK_TO_FRONT:
        return seatingMethods.backToFront(plane, passengers);
      case SeatingMode.FRONT_TO_BACK:
        return seatingMethods.frontToBack(plane, passengers);
      default:
        return seatingMethods.random(plane, passengers);
    }
  }

  // for example - composeSeatingMode(random, windowToAisle)(plane, passengers)
  static composeSeatingMode(
    ...modes
  ): (plane: Plane, passengers: Array<Person>) => Array<Person> {
    return R.compose(...modes);
  }
}

export default BoardingQueue;
