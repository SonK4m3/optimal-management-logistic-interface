/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from 'socket.io-client'
import { EventsMap } from '@socket.io/component-emitter'

export type EventNames<Map extends EventsMap> = keyof Map & (string | symbol)
export type EventParams<Map extends EventsMap, Ev extends EventNames<Map>> = Parameters<Map[Ev]>

type DefaultServerEvents = {
    connect: () => void
    disconnect: () => void
}

export class BaseWebSocket<
    ServerEvents extends Record<string, (...args: any[]) => void> = DefaultServerEvents,
    ClientEvents extends Record<string, (...args: any[]) => void> = Record<string, never>
> {
    protected socket: Socket<ServerEvents, ClientEvents> | null = null
    private readonly endpoint: string
    private readonly token: string
    private readonly eventListeners: Map<string, Set<(...args: any[]) => void>> = new Map()

    constructor(endpoint: string, token: string) {
        this.endpoint = endpoint
        this.token = token
    }

    public connect(): void {
        if (this.socket?.connected) {
            console.warn('Already connected.')
            return
        }

        this.socket = io(this.endpoint, {
            auth: { token: this.token },
            transports: ['websocket'],
            reconnection: true
        })

        this.socket.on('connect', () => this.emit('connect'))
        this.socket.on('disconnect', () => {
            this.emit('disconnect')
            this.socket = null
        })

        this.eventListeners.forEach((listeners, event) => {
            listeners.forEach(listener => {
                if (this.socket) {
                    this.socket.on(event as EventNames<ServerEvents>, listener as any)
                }
            })
        })
    }

    public send<T extends EventNames<ClientEvents>>(
        event: T,
        ...args: EventParams<ClientEvents, T>
    ): void {
        if (!this.socket?.connected) {
            console.warn('WebSocket is not connected.')
            return
        }
        this.socket.emit(event, ...args)
    }

    public on<T extends EventNames<ServerEvents>>(
        event: T,
        listener: (...args: EventParams<ServerEvents, T>) => void
    ): void {
        if (!this.eventListeners.has(event as string)) {
            this.eventListeners.set(event as string, new Set())
        }
        this.eventListeners.get(event as string)?.add(listener)
        this.socket?.on(event, listener as any)
    }

    public off<T extends EventNames<ServerEvents>>(
        event: T,
        listener: (...args: EventParams<ServerEvents, T>) => void
    ): void {
        this.eventListeners.get(event as string)?.delete(listener)
        this.socket?.off(event, listener as any)
    }

    public close(): void {
        this.socket?.disconnect()
        this.socket = null
    }

    private emit(event: string, ...args: any[]): void {
        this.eventListeners.get(event)?.forEach(listener => listener(...args))
    }
}
