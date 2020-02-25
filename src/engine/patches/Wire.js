import uuid from 'uuid/v4';

class Wire {
  constructor(fromPatch, fromOutport, toPatch, toInport) {
      this.id = `${uuid()}(${fromOutport}:${toInport})`;
      this.fromPatch = fromPatch;
      this.fromOutport = fromOutport;
      this.toPatch = toPatch;
      this.toInport = toInport;
      this.value = undefined;
      this.isSticky = false;
  }

  canGive() {
      return this.value !== undefined;
  }

  hold(value) {
      if (value === undefined) {
          throw new Error("Wires can't hold undefined");
      }
      this.value = value;
  }

  give() {
      if (!this.canGive()) {
          throw new Error("Wire has nothing to give");
      }
      let val = this.value;
      if (!this.isSticky) {
          this.value = undefined;
      }
      return val;
  }
}

export default Wire;
