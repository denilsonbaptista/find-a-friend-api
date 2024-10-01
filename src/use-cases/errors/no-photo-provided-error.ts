export class NoPhotoProvidedError extends Error {
  constructor() {
    super('No photo provided.')
  }
}
