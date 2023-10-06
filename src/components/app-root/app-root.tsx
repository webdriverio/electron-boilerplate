import { Component, Prop, h, Fragment } from "@stencil/core";

@Component({ tag: "app-root", shadow: true, styleUrl: "app-root.css" })
export class AppRoot {
  @Prop() count = 0;
  @Prop() docsHint = "Click on the project logos to learn more!";

  normalize(name: string): string {
    if (name) {
      return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
    }
    return "";
  }

  render() {
    return (
      <>
        <div>
          <a href="https://webdriver.io/docs/component-testing" target="_blank">
            <img
              src="https://webdriver.io/assets/images/robot-3677788dd63849c56aa5cb3f332b12d5.svg"
              class="logo"
              alt="WebdriverIO logo"
            />
          </a>

          <a href="https://www.electronjs.org" target="_blank">
            <img
              src="https://www.electronjs.org/assets/img/logo.svg"
              class="logo electron"
              alt="React logo"
            />
          </a>
        </div>
        <h1>
          <slot />
        </h1>
        <div class="card">
          <button
            onClick={() => {
              this.count = this.count + 1;
            }}
            part="button"
          >
            count is {this.count}{" "}
          </button>
          <p>
            Edit
            <code>src/app-root.tsx</code>
            and save to change application.
          </p>
        </div>
        <p class="read-the-docs"> {this.docsHint}</p>
      </>
    );
  }
}
