export type Plane = {
  rows: number;
  columns: number;
  spaceBetweenRows: number;
  aisle: Array<AisleBlock | EmptyAisleBlock>;
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
  assignedSeats: number;
  fullyAssigned: boolean;
};

export type EmptyAisleBlock = {
  hasRows: boolean;
};

export enum SeatStatus {
  FREE = "free",
  ASSIGNED = "assigned",
  TAKEN = "taken"
}

export type Seat = {
  status: SeatStatus;
};

export enum TicketAssignmetMode {
  RANDOM = "random"
}

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

export enum Speed {
  X = "Row_Speed",
  Y = "Aisle_Speed",
  LUGGADE = "Luggage_Delay"
}
