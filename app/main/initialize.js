/* global process */
import {
  BrowserWindow,
} from 'electron';

import MenuBuilder from './menu';

export default function () {
  const url = (
    process.env.NODE_ENV === 'development'
      ? `http://localhost:${process.env.PORT || '9001'}`
      : `file://${__dirname}/index.html`
  );
  const win = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
  });
  win.loadURL(url);

  const menuBuilder = new MenuBuilder(win);
  menuBuilder.buildMenu();
}
