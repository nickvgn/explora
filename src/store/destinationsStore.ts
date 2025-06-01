import { create } from 'zustand'
import data from '../../data.json'

export type DestinationWithEvent = (typeof data.destinations)[0] & {
  eventId?: string
}

interface DestinationsStore {
  destinations: Record<string, DestinationWithEvent>
  getDestination: (name: string) => DestinationWithEvent | undefined
  setEventId: (destinationName: string, eventId: string) => void
  removeEventId: (destinationName: string) => void
}

export const useDestinationsStore = create<DestinationsStore>((set, get) => ({
  // Transform array into indexed object on load
  destinations: data.destinations.reduce((acc, dest) => {
    acc[dest.name] = dest
    return acc
  }, {} as Record<string, DestinationWithEvent>),
  
  getDestination: (name: string) => get().destinations[name],
  
  setEventId: (destinationName, eventId) => 
    set((state) => ({
      destinations: {
        ...state.destinations,
        [destinationName]: {
          ...state.destinations[destinationName],
          eventId
        }
      }
    })),
    
  removeEventId: (destinationName) => 
    set((state) => ({
      destinations: {
        ...state.destinations,
        [destinationName]: {
          ...state.destinations[destinationName],
          eventId: undefined
        }
      }
    }))
})) 