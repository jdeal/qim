class MutationMarker {
  constructor(hasMutated) {
    this.hasMutated = hasMutated;
  }
}

export const hasNotMutatedMarker = new MutationMarker(false);

export const hasMutatedMarker = new MutationMarker(true);

export const isMutationMarker = (value) =>
  value instanceof MutationMarker;
