import * as z from 'zod/mini'

/**
 * Zod probes `new Function("")` for a JIT parse fast path; under MV3 CSP that
 * still reports a script-src violation even though the throw is caught.
 * Opt out before any schema `.parse()` / `.safeParse()`.
 */
z.config({ jitless: true })
