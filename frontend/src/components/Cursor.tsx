import React from "react";
import $ from "jquery";
import { gsap } from "gsap";

// Extend jQuery type to include callable signature
type JQueryFunc = ((selector: string | Element) => JQuery) & {
  extend: (...args: any[]) => any;
};

interface CursorOptions {
  container?: string;
  speed?: number;
  ease?: string;
  visibleTimeout?: number;
}

class Cursor {
  private options: CursorOptions;
  private body: JQuery<HTMLElement>;
  private el: JQuery<HTMLElement>;
  private text: JQuery<HTMLElement>;
  private pos: { x: number; y: number } = { x: 0, y: 0 };
  private stick: { x: number; y: number } | null = null;
  private visible: boolean = false;
  private visibleInt?: NodeJS.Timeout;
  private initialized: boolean = false;

  constructor(options?: CursorOptions) {
    const jq = $ as JQueryFunc;

    this.options = jq.extend(
        true,
        {
          container: "body",
          speed: 0.7,
          ease: "expo.out",
          visibleTimeout: 300,
        },
        options
    );
    this.body = jq(this.options.container || "body");
    this.el = jq('<div class="cb-cursor"></div>');
    this.text = jq('<div class="cb-cursor-text"></div>');
  }

  // Public method to initialize the cursor
  public initialize() {
    if (this.initialized) return;

    this.el.append(this.text);
    this.body.append(this.el);
    this.bind();
    this.move(-window.innerWidth, -window.innerHeight, 0);
    this.initialized = true;
  }

  private bind() {
    const self = this;
    const jq = $ as JQueryFunc;

    this.body
        .on("mouseleave", () => {
          self.hide();
        })
        .on("mouseenter", () => {
          self.show();
        })
        .on("mousemove", (e) => {
          this.pos = {
            x: this.stick
                ? this.stick.x - (this.stick.x - e.clientX) * 0.15
                : e.clientX,
            y: this.stick
                ? this.stick.y - (this.stick.y - e.clientY) * 0.15
                : e.clientY,
          };
          this.update();
        })
        .on("mousedown", () => {
          self.setState("-active");
        })
        .on("mouseup", () => {
          self.removeState("-active");
        })
        .on("mouseenter", "a,input,textarea,button", () => {
          self.setState("-pointer");
        })
        .on("mouseleave", "a,input,textarea,button", () => {
          self.removeState("-pointer");
        })
        .on("mouseenter", "iframe", () => {
          self.hide();
        })
        .on("mouseleave", "iframe", () => {
          self.show();
        })
        .on("mouseenter", "[data-cursor]", function () {
          self.setState(jq(this).data("cursor"));
        })
        .on("mouseleave", "[data-cursor]", function () {
          self.removeState(jq(this).data("cursor"));
        })
        .on("mouseenter", "[data-cursor-text]", function () {
          self.setText(jq(this).data("cursor-text"));
        })
        .on("mouseleave", "[data-cursor-text]", function () {
          self.removeText();
        })
        .on("mouseenter", "[data-cursor-stick]", function () {
          self.setStick(jq(this).data("cursor-stick"));
        })
        .on("mouseleave", "[data-cursor-stick]", function () {
          self.removeStick();
        });
  }

  private setState(state: string) {
    this.el.addClass(state);
  }

  private removeState(state: string) {
    this.el.removeClass(state);
  }

  private setText(text: string) {
    this.text.html(text);
    this.el.addClass("-text");
  }

  private removeText() {
    this.el.removeClass("-text");
  }

  private setStick(el: string) {
    const jq = $ as JQueryFunc;
    const target = jq(el);
    const bound = target.get(0)!.getBoundingClientRect();

    // Handle the possibility of undefined values
    const height = target.height() ?? 0; // Fallback to 0 if undefined
    const width = target.width() ?? 0; // Fallback to 0 if undefined

    this.stick = {
      y: bound.top + height / 2,
      x: bound.left + width / 2,
    };
    this.move(this.stick.x, this.stick.y, 5);
  }

  private removeStick() {
    this.stick = null;
  }

  private update() {
    this.move();
    this.show();
  }

  private move(x?: number, y?: number, duration?: number) {
    gsap.to(this.el[0], {
      x: x ?? this.pos.x,
      y: y ?? this.pos.y,
      force3D: true,
      overwrite: true,
      ease: this.options.ease,
      duration: this.visible ? duration ?? this.options.speed : 0,
    });
  }

  private show() {
    if (this.visible) return;
    clearTimeout(this.visibleInt);
    this.el.addClass("-visible");
    this.visibleInt = setTimeout(() => (this.visible = true), 0);
  }

  private hide() {
    clearTimeout(this.visibleInt);
    this.el.removeClass("-visible");
    this.visibleInt = setTimeout(
        () => (this.visible = false),
        this.options.visibleTimeout
    );
  }
}

// Export a singleton instance of Cursor
const cursor = new Cursor();
export default cursor;