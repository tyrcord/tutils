export function applyMixins(
  derivedCtor: any,
  baseCtors: any[],
  override = false,
) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
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
