/*
global process, window
*/

import '@babel/polyfill';
import React from 'react';
import {
  render as reactRender,
} from 'react-dom';
import * as R from 'ramda';
import path from 'path';
import {
  ipcRenderer,
} from 'electron';

import StoriesList from './components/StoriesList';

const listEl = window.document.getElementById('stories-list');
const webiewEl = window.document.getElementById('stories-render');

const renderInto = rootEl => R.pipe(
  (x, callback) => el => reactRender(x, el, callback),
  render => render(rootEl),
);

let webviewRef;

R.pipe(
  () => renderInto(webiewEl),
  render => render(
    (
      <webview
        src="http://localhost:9002/"
        nodeintegration="true"
        preload={`file://${
          (process.env.NODE_ENV === 'development'
            ? path.join(process.cwd(), 'app/containerDist/preload.js')
            : path.resolve(__dirname, 'preload.prod.js'))}`}
        ref={(el) => { webviewRef = el; }}
      />
    ),
    () => {
      if (webviewRef) {
        webviewRef.addEventListener('dom-ready', () => {
          ipcRenderer.on('electron-actions', (_, a) => {
            if (a.type === 'TOGGLE_WEBVIEW_DEVTOOLS') {
              webviewRef.getWebContents().toggleDevTools();
            }
          });
        });
      }
    },
  ),
)();

R.pipe(
  () => renderInto(listEl),
  render => render(<StoriesList webviewRef={webviewRef} />),
)();
