export const config = {
  debug: false,
  get stdio(): 'pipe' | 'inherit' {
    return this.debug ? 'inherit' : 'pipe';
  },
};
