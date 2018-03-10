import { autoinject, observable } from 'aurelia-framework';

const COUNT = 200;
const LOOPS = 6;

export class App {
  x = 0;
  y = 0;
  big = false;
  counter = 0;

  cursors: ICursorData[] = [];

  @observable()
  immutable: boolean;

  immutableChanged(immutable: boolean) {
    this.render = immutable ? this.immutableRerder : this.mutableRender;
  }

  attached() {
    requestAnimationFrame(this.render);
  }

  immutableRerder = () => {
    let counter = ++this.counter;
    let max = COUNT + Math.round(Math.sin(counter / 90 * 2 * Math.PI) * COUNT * 0.5);
    let cursors: ICursorData[] = [];

    for (let i = max; i--;) {
      let f = i / max * LOOPS;
      let θ = f * 2 * Math.PI;
      let m = 20 + i * 2;
      let hue = (f * 255 + counter * 10) % 255;
      cursors[i] = {
        big: this.big,
        color: `hsl(${hue}, 100%, 50%)`,
        x: (this.x + Math.sin(θ) * m) | 0,
        y: (this.y + Math.cos(θ) * m) | 0
      };
    }

    this.cursors = cursors;
    requestAnimationFrame(this.render);
  }

  mutableRender = () => {
    let counter = ++this.counter;
    let max = COUNT + Math.round(Math.sin(counter / 90 * 2 * Math.PI) * COUNT * 0.5);
    let oldCursors = this.cursors;
    let cursors: ICursorData[] = [];

    if (oldCursors.length > max) {
      oldCursors.splice(max);
    }

    /**
     * Optimization, as aurelia repeater doesn't handle crazy immutability scenario well
     * Instead, we carefully mutate the collection based on the value of max and LOOPS
     */
    for (let i = oldCursors.length; i < max; ++i) {
      let f = i / max * LOOPS;
      let θ = f * 2 * Math.PI;
      let m = 20 + i * 2;
      let hue = (f * 255 + counter * 10) % 255;
      oldCursors.push({
        big: this.big,
        color: `hsl(${hue}, 100%, 50%)`,
        x: (this.x + Math.sin(θ) * m) | 0,
        y: (this.y + Math.cos(θ) * m) | 0
      });
    }

    for (let i = max; i--;) {
      let f = i / max * LOOPS;
      let θ = f * 2 * Math.PI;
      let m = 20 + i * 2;
      let hue = (f * 255 + counter * 10) % 255;
      Object.assign(oldCursors[i], {
        big: this.big,
        color: `hsl(${hue}, 100%, 50%)`,
        x: (this.x + Math.sin(θ) * m) | 0,
        y: (this.y + Math.cos(θ) * m) | 0
      });
    }

    requestAnimationFrame(this.render);
  }

  render = this.mutableRender;

  setXY({ pageX, pageY }: MouseEvent) {
    this.x = pageX;
    this.y = pageY;
  }
}

export interface ICursorData {
  big: boolean;
  color: string;
  x: number;
  y: number;
}
