class PatchRegistry {
  constructor(patches) {
    this.patchClasses = new Map();

    patches.forEach((p) => this.registerPatch(p));
  }

  registerPatch(patchClass) {
    if (!patchClass.patchName) {
      throw new Error('Patch class should have static patchName');
    }
    this.patchClasses.set(patchClass, patchClass.patchName);
  }
}

export default PatchRegistry;
