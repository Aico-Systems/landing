/* tslint:disable */
/* eslint-disable */

/**
 * One glove's session. See the module docs.
 */
export class Glove {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * One of the glove's other buttons, by its ref id: a reply's option, a
     * page to turn, CANCEL.
     */
    button(ref_id: string): string;
    /**
     * The room is joined; `identity` is this page's participant in it.
     */
    connected(identity: string): string;
    /**
     * The room went: `stopped` (the page left it), `room_closed`,
     * `peer_left`, `connection_lost`.
     */
    disconnected(reason: string): string;
    /**
     * The agent subscribed to the page's microphone: it hears from now on.
     */
    listening(): string;
    /**
     * A glove whose turns end as `turn` says (`hold`, `adaptive`, `auto`),
     * set up as the Studio sets a glove by default.
     */
    constructor(turn: string);
    /**
     * The glove's conversation screen, opened as the session starts, before
     * the room is there. `held`: the press that started it is still held,
     * so the worker is talking already (the pre-roll).
     */
    open(held: boolean): string;
    /**
     * One data packet from the room, on `topic`.
     */
    packet(topic: string | null | undefined, payload: Uint8Array): string;
    /**
     * The glove's AI button: `hold-start`, `hold-end`, `tap`.
     */
    press(gesture: string): string;
    /**
     * Who is talking right now (identities, loudest first).
     */
    speakers(identities: string[]): string;
    /**
     * Time passes: call every quarter second or so. `uplink`: the page's
     * microphone is streaming.
     */
    tick(uplink: boolean): string;
}

/**
 * The wire's names the page itself needs (the participant attributes it
 * sets, the topic it publishes on), from the one source.
 */
export function names(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_glove_free: (a: number, b: number) => void;
    readonly glove_button: (a: number, b: number, c: number) => [number, number];
    readonly glove_connected: (a: number, b: number, c: number) => [number, number];
    readonly glove_disconnected: (a: number, b: number, c: number) => [number, number];
    readonly glove_listening: (a: number) => [number, number];
    readonly glove_new: (a: number, b: number) => number;
    readonly glove_open: (a: number, b: number) => [number, number];
    readonly glove_packet: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly glove_press: (a: number, b: number, c: number) => [number, number];
    readonly glove_speakers: (a: number, b: number, c: number) => [number, number];
    readonly glove_tick: (a: number, b: number) => [number, number];
    readonly names: () => [number, number];
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
