type Location = {
    id: number
    x: number // latitude
    y: number // longitude
}

type Depot = {
    id: number
    location: Location
}

type Customer = {
    id: number
    location: Location
    demand: number
}

type Vehicle = {
    id: number
    capacity: number
    depot?: Depot
    customerList?: Customer[]
    totalDistanceMeters: number
    remainingCapacity: number
}

type MarkerType = 'depot' | 'customer' | null

export type { Depot, Customer, Vehicle, Location, MarkerType }
