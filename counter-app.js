/**
 * Copyright 2026 igasparraj16
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";


/**
 * `counter-app`
 * 
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "counter-app";
  }

  // initializes all of our vairbles
  constructor() {
    super();
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/counter-app.ar.json", import.meta.url).href +
        "/../",
    });
    // important: sets the initial count value that loads upon open, and our max and min values
    this.count = 0;
    this.min = -5;
    this.max = 25;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      // declaring our variables. 'reflect' is to make sure it constantly updates
      title: { type: String },
      count: { type: Number, reflect: true },
      max: { type: Number, reflect: true },
      min: { type: Number, reflect: true }
    };
  }

  // constantly checking if the count is 21
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has('count')) {
      if (this.count === 21) { // if 21, confetti!
        this.makeItRain(); //call the below method
      }
    }
  }

  // confetti method
  makeItRain() {
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(() => {
      setTimeout(() => {
        const confetti = this.shadowRoot.querySelector("#confetti");
        if (!confetti) return;

        // reset the animation so it will run anytime the counter goes to 21
        confetti.removeAttribute("popped");
        confetti.setAttribute("popped", "");
      }, 0);
    });
  }


  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        /* setting the general spacing and visual variables for the counter */
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
        width: 150px;
        padding: 8px 36px 36px;
      }
      
      /* change color when 18 */
      :host([count="18"]) h3{
        color: var(--ddd-theme-default-keystoneYellow);
      }

      /* change color when 21 */
      :host([count="21"]) h3{
        color: var(--ddd-theme-default-original87Pink);
      }

      /* change color when max */
      h3.at-max {
        color: var(--ddd-theme-default-roarGolden);
      }

      /* change color when min */
      h3.at-min {
        color: var(--ddd-theme-default-globalNeon);
      }

      /* change css when buttons are hovered over */
      button:hover, button:focus {
        background-color: var(--ddd-theme-default-navy40);
        border-radius: 4px;
      }

      button {
        width: 28px;
        padding: 4px;
        margin: 4px;
      }

      /* added to fix the buttno spacing */
      .buttons {
        display: flex;
        justify-content: center;
      }

      h3 {
        font-size: var(--ddd-font-size-4xl);
        text-align: center;
      }

      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }

      h3 span {
        font-size: var((--counter-app-label-font-size, var(--ddd-font-size-xl)));
      }
    `];
  }

  // Lit render the HTML
  render() {
    // variables declared to handle min/max changes
    const atMin = this.count <= this.min;
    const atMax = this.count >= this.max;
    // if/then statements to ascribe html/css classes to max and min states (used in css above)
    const maxOrMin = atMin ? "at-min" : atMax ? "at-max" : "";

    return html`
    <confetti-container id="confetti">
      <div class="wrapper">
        <h3 class=${maxOrMin}>${this.count}</h3>
        <div class="buttons">
          <button @click="${this.decrement}" ?disabled="${this.min === this.count}">-</button>
          <button @click="${this.increment}" ?disabled="${this.max === this.count}">+</button>
        </div>
        <slot></slot>
      </div>
    </confetti-container>`;
  }

  // + button to add numbers to counter as long as the max hasn't been reached
  increment() {
    if (this.count < this.max) {
      this.count++;
    }
  }

  // - button to subtract numbers to counter as long as the min hasn't been reached
  decrement() {
    if (this.count > this.min) {
      this.count--;
    }
  }

  

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);