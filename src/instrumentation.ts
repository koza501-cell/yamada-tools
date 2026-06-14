export async function register() {
  // Next.js 15 uses undici's Headers internally for metadata
  // Patch at the Node.js level to prevent ByteString errors
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      // Patch global Headers (undici)
      const origSet = globalThis.Headers?.prototype?.set;
      if (origSet) {
        globalThis.Headers.prototype.set = function(name: string, value: string) {
          if (typeof value === 'string') {
            let safe = value;
            for (let i = 0; i < value.length; i++) {
              if (value.charCodeAt(i) > 255) {
                safe = value.slice(0, 150) + '...';
                break;
              }
            }
            return origSet.call(this, name, safe);
          }
          return origSet.call(this, name, value);
        };
      }
    } catch {}
  }
}
