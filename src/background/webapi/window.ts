import { EventEmitter } from "events";

import { IS_WINDOWS } from "@/shared/constant";
import {
  browserWindowsOnFocusChanged,
  browserWindowsOnRemoved,
  browserWindowsGetCurrent,
  browserWindowsCreate,
  browserWindowsUpdate,
  browserWindowsRemove,
} from "@/shared/utils/browser";
import { CreateNotificationProps, OpenNotificationProps } from "@/shared/interfaces/notification";

export const event = new EventEmitter();

browserWindowsOnFocusChanged((winId: number) => {
  event.emit("windowFocusChange", winId);
});

browserWindowsOnRemoved((winId: number) => {
  event.emit("windowRemoved", winId);
});

const BROWSER_HEADER = 80;
const WINDOW_SIZE = {
  width: 350 + (IS_WINDOWS ? 14 : 0),
  height: 600,
};

const create = async ({ url, ...rest }: CreateNotificationProps): Promise<number | undefined> => {
  const {
    top: cTop,
    left: cLeft,
    width,
  } = (await browserWindowsGetCurrent({
    windowTypes: ["normal"],
  })) as any;

  const top = cTop! + BROWSER_HEADER;
  const left = cLeft! + width! - WINDOW_SIZE.width;

  const win = await browserWindowsCreate({
    focused: true,
    url,
    type: "popup",
    top,
    left,
    ...WINDOW_SIZE,
    ...rest,
  });

  // shim firefox
  if (win.left !== left) {
    await browserWindowsUpdate(win.id!, { left, top });
  }

  return win.id;
};

export const remove = async (winId: number) => {
  return browserWindowsRemove(winId);
};

export const openNotification = async (
  { route, ...rest }: OpenNotificationProps = { route: "" }
): Promise<number | undefined> => {
  const url = `notification.html#${route}`;

  return create({ url, ...rest });
};
