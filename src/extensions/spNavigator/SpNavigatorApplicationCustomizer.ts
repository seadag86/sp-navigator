import { override } from "@microsoft/decorators";
import { Log } from "@microsoft/sp-core-library";
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from "@microsoft/sp-application-base";
import { MSGraphClient } from '@microsoft/sp-http';
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as strings from "SpNavigatorApplicationCustomizerStrings";

const LOG_SOURCE: string = "SpNavigatorApplicationCustomizer";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISpNavigatorApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpNavigatorApplicationCustomizer extends BaseApplicationCustomizer<
  ISpNavigatorApplicationCustomizerProperties
  > {
  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public async onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this.context.placeholderProvider.changedEvent.add(this, this.renderContent);

    return Promise.resolve();
  }

  protected renderContent() {
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this.onDispose }
      );

      const element = React.createElement(App, { context: this.context });
      ReactDOM.render(element, this._topPlaceholder.domElement);
    }
  }
}
