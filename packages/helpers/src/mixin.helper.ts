export function applyMixins(
  derivedCtor: any,
  baseCtors: any[],
  override = false,
): void {
  baseCtors.forEach((baseCtor: any) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name: string) => {
      if (override || !derivedCtor.prototype.hasOwnProperty(name)) {
        const descriptor = Object.getOwnPropertyDescriptor(
          baseCtor.prototype,
          name,
        );

        if (descriptor) {
          Object.defineProperty(derivedCtor.prototype, name, descriptor);
        }
      }
    });
  });
}
