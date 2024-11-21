export interface Department {
    id: number
    code: string
    name: string
    description: string
    manager: string
}

export type Staff = {
    id: number
    code: string
    username: string
    fullName: string
    email: string
    isActive: boolean
    position: string
    department: Department
}

export type Customer = {
    id: number
    username: string
    fullName: string
    email: string
    phone: string
}

export type Shift = {
    id: number
    name: string
    startTime: string
    endTime: string
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

export type ShiftAssignment = {
    id: number
    workShift: Shift
    staff: Staff
    workDate: string
    status: string
    note: string
    createdAt: string
    updatedAt: string
}
