import { browserRuntimeConnect } from "../browser";
import Message from "./message";

class PortMessage extends Message {
  port: any | null = null;
  listenCallback: any = undefined;

  constructor(port?: any) {
    super();

    if (port) {
      this.port = port;
    }
  }

  connect(name?: string) {
    this.port = browserRuntimeConnect(name ? { name } : undefined);
    this.port.onMessage.addListener(({ _type_, data }) => {
      if (_type_ === `${this._EVENT_PRE}message`) {
        this.emit("message", data);
        return;
      }

      if (_type_ === `${this._EVENT_PRE}response`) {
        this.onResponse(data);
      }
    });

    return this;
  }

  listen(listenCallback: any) {
    if (!this.port) return;
    this.listenCallback = listenCallback;
    this.port.onMessage.addListener(({ _type_, data }) => {
      if (_type_ === `${this._EVENT_PRE}request`) {
        this.onRequest(data);
      }
    });

    return this;
  }

  send(type: string, data) {
    if (!this.port) return;
    try {
      this.port.postMessage({ _type_: `${this._EVENT_PRE}${type}`, data });
    } catch (e) {
      // DO NOTHING BUT CATCH THIS ERROR
    }
  }

  dispose() {
    this._dispose();
    this.port?.disconnect();
  }
}

export default PortMessage;
