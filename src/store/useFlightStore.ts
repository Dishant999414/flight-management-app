import { create } from "zustand";

import { persist } from "zustand/middleware";

interface FlightStore {
  selectedFlight: any;
  selectedSeat: any;

  passengerData: {
    fullName: string;
    nationality: string;
  };

  setSelectedFlight: (flight: any) => void;

  setSelectedSeat: (seat: any) => void;

  setPassengerData: (
    data: {
      fullName: string;
      nationality: string;
    }
  ) => void;

  resetBooking: () => void;
}

export const useFlightStore =
  create<FlightStore>()(
    persist(
      (set) => ({
        selectedFlight: null,

        selectedSeat: null,

        passengerData: {
          fullName: "",
          nationality: "",
        },

        setSelectedFlight: (flight) =>
          set({
            selectedFlight: flight,
          }),

        setSelectedSeat: (seat) =>
          set({
            selectedSeat: seat,
          }),

        setPassengerData: (data) =>
          set({
            passengerData: data,
          }),

        resetBooking: () =>
          set({
            selectedFlight: null,

            selectedSeat: null,

            passengerData: {
              fullName: "",
              nationality: "",
            },
          }),
      }),

      {
        name: "flight-booking-storage",

        partialize: (state) => ({
          selectedFlight:
            state.selectedFlight,

          selectedSeat:
            state.selectedSeat,

          passengerData: {
            fullName:
              state.passengerData
                .fullName,

            nationality:
              state.passengerData
                .nationality,
          },
        }),
      }
    )
  );