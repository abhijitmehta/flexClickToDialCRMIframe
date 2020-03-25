import { VERSION } from "@twilio/flex-ui";
import { FlexPlugin } from "flex-plugin";

import reducers, { namespace } from "./states";

const PLUGIN_NAME = "ClickToDialIframePlugin";

export default class ClickToDialIframePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);

    if (window.self !== window.top) {
      // i.e. Flex in an iFrame
      //first hide CRM container since Flex is in iFrame
      flex.AgentDesktopView.defaultProps.showPanel2 = false;

      //tap into Action Framework  and call your CRM's relevant functions - see below for example.

      function receiveMessage(event) {
        console.log("Message Received", event);
        /*if (event.origin !== event.sourceElement.origin )
              return;      */

        flex.Actions.invokeAction("StartOutboundCall", {
          destination: event.data
        });
      }
      window.addEventListener("message", receiveMessage, false);
    }
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(
        `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`
      );
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
