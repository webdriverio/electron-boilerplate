import { Component, Prop, h, Fragment } from "@stencil/core";
import type { MessageBoxOptions } from 'electron'

declare global {
  interface Window {
    electron: {
      openDialog: (options: MessageBoxOptions) => void;
    };
  }
}

@Component({ tag: "app-root", shadow: true, styleUrl: "app-root.css" })
export class AppRoot {
  @Prop() count = 0;
  @Prop() docsHint = "NEW YORK, NY | #OSFF2023 | #OSINFINANCE";

  normalize(name: string): string {
    if (name) {
      return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
    }
    return "";
  }

  #handleClick () {
    this.count = this.count + 1;

    if (this.count > 5) {
      window.electron.openDialog({
        type: 'info',
        title: 'Limit reached',
        message: 'You have reached the limit of 5 clicks.',
        icon: 'info',
      })
    }
  }

  render() {
    return (
      <>
        <div>
          <a href="https://events.linuxfoundation.org/open-source-finance-forum-new-york/" target="_blank">
            <img
              src="https://events.linuxfoundation.org/wp-content/uploads/2022/02/2022_OSFF_FINOS_LINUX_WHT.svg"
              class="logo"
              alt="WebdriverIO logo"
            />
          </a>
        </div>
        <h1>
          <slot />
        </h1>
        <div class="card">
          <button
            onClick={this.#handleClick.bind(this)}
            part="button"
          >
            attendee count is {this.count}{" "}
          </button>
          <p>
          Open Source in Finance Forum is the only conference dedicated to driving collaboration and innovation in financial services through open source software and standards.
          </p>
        </div>
        <p class="read-the-docs">{this.docsHint}</p>
      </>
    );
  }
}
