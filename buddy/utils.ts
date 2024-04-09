declare global {
  interface String {
    hashCode(seed?: number): number;
    formatDate(options: any): string;
  }
}

String.prototype.hashCode = function (seed = 0): number {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch: number; i < this.length; i++) {
    ch = this.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

String.prototype.formatDate = function (options: any): string {
  let date = new Date(Date.parse(this as string));
  
  return date.toLocaleDateString('en-US', options);
}

export {};

export async function getPaletteVars(
  uri: string,
  themeID: string
): Promise<any> {
  let paletteVars: any = {};

  const response = await fetch(uri);

  const data = await response.json();
  if (response.ok) {
    const themeColors = data[themeID]["colors"];
    for (var key in themeColors) {
      paletteVars[`--${key}-hex`] = themeColors[key]["hex"];
    }

    return paletteVars;
  } else {
    return Promise.reject();
  }
}

export async function getBuddyHashes(uri: string): Promise<any> {
  const response = await fetch(uri);

  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    return Promise.reject();
  }
}