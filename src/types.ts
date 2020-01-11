export type Plane = {
  rows: number;
  columns: number;
  aisle: Array<AisleBlock>;
};

export enum SeatingMode {
  RANDOM = "random",
  AISLE_TO_WINDOW = "aisle_to_window",
  WINDOW_TO_AISLE = "window_to_isle",
  FRONT_TO_BACK = "front_to_back",
  BACK_TO_FRONT = "back_to_front"
}

export type AisleBlock = {
  hasRows: boolean;
  rightRow: Array<Seat>;
  leftRow: Array<Seat>;
};

export type Seat = {
  taken: boolean;
};

export type Person = {
  isSeated: boolean;
  xSpeed: number;
  ySpeed: number;
  luggageDelay: number;
  ticket: {
    row: number;
    seatInRow: number;
  };
};
