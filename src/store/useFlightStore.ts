import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Flight {
  id: string;
  flight_no: string;
  origin: string;
  destination: string;
  base_price: number;
}

interface Seat {
  id: string;
  seat_number: string;
  class: string;
  is_available: boolean;
  extra_fee: number;
}

interface FlightStore {
  selectedFlight: Flight | null;
  selectedSeat: Seat | null;

  setSelectedFlight: (flight: Flight) => void;
  setSelectedSeat: (seat: Seat) => void;

  resetBooking: () => void;
}

export const useFlightStore = create<FlightStore>()(
  persist(
    (set) => ({
      selectedFlight: null,
      selectedSeat: null,

      setSelectedFlight: (flight) =>
        set({
          selectedFlight: flight,
        }),

      setSelectedSeat: (seat) =>
        set({
          selectedSeat: seat,
        }),

      resetBooking: () =>
        set({
          selectedFlight: null,
          selectedSeat: null,
        }),
    }),
    {
      name: "flight-booking-storage",
    }
  )
);