import { User } from '@/types/user'
import { SHIFT_STATUS } from '@/constant/enum'
import { Order } from './order'

export interface Department {
    id: number
    code: string
    name: string
    description: string
    manager: string
}

export type Staff = {
    id: number
    user: User
    position: string
    department?: Department
}

export type CustomerAddress = {
    id: number
    location: {
        address: string
        latitude: number
        longitude: number
    }
    isDefault: boolean
}

export type Customer = {
    id: number
    username: string
    fullName: string
    email: string
    phone: string
    addresses: CustomerAddress[]
    orderHistory: Order[]
}

export type Shift = {
    id: number
    name: string
    startTime: string
    endTime: string
    isActive: boolean
    shiftAssignments: ShiftAssignment[]
}

export type ShiftDetail = {
    id: number
    shift: Shift
    staff: Staff
}

export type Task = {
    id: number
    title: string
    description: string
    startTime: string
    endTime: string
    priority: string
    status: string
    createdAt: string
    updatedAt: string
}

export type TaskAssignment = {
    id: number
    task: Task
    staff: Staff
    status: string
    note: string
    createdAt: string
    updatedAt: string
}

export type ShiftAssignmentStatus = (typeof SHIFT_STATUS)[keyof typeof SHIFT_STATUS]

export type ShiftAssignment = {
    id: number
    workShiftId: number
    workShiftName: string
    startTime: string
    endTime: string
    staffId: number
    staffName: string
    workDate: string
    status: ShiftAssignmentStatus
    note: string
    createdAt: string
    updatedAt: string
}
