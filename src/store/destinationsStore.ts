import { create } from 'zustand'

interface DestinationsStore {
  calendarEvents: Record<string, string> // destinationName -> eventId
  addEvent: (eventId: string, destinationName: string) => void
  removeEvent: (eventId: string) => void
  getEventByDestination: (destinationName: string) => string | undefined
  removeEventByDestination: (destinationName: string) => void
}

export const useDestinationsStore = create<DestinationsStore>((set, get) => ({
  calendarEvents: {},
  
  addEvent: (eventId, destinationName) =>
    set((state) => ({
      calendarEvents: {
        ...state.calendarEvents,
        [destinationName]: eventId
      }
    })),
    
  removeEvent: (eventId) =>
    set((state) => {
      const destinationName = Object.keys(state.calendarEvents).find(
        name => state.calendarEvents[name] === eventId
      )
      if (destinationName) {
        const { [destinationName]: removed, ...rest } = state.calendarEvents
        return { calendarEvents: rest }
      }
      return state
    }),
    
  getEventByDestination: (destinationName) => {
    return get().calendarEvents[destinationName]
  },
  
  removeEventByDestination: (destinationName) =>
    set((state) => {
      const { [destinationName]: removed, ...rest } = state.calendarEvents
      return { calendarEvents: rest }
    })
})) 
