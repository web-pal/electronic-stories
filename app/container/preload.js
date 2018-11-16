/* eslint react/jsx-filename-extension: 0 */

import React from 'react'; // eslint-disable-line no-unused-vars
import {
  render as reactRender,
} from 'react-dom';
import * as R from 'ramda';

import {
  remote,
  ipcRenderer,
} from 'electron';

import storiesOf, {
  albums,
} from './storiesOf';

import Placeholder from './components/Placeholder';

window.storiesOf = storiesOf;
window.talesOf = storiesOf;
const sourceId = remote.getCurrentWindow().id;


const renderTale = rootEl => R.pipe(
  x => el => reactRender(x(), el),
  render => render(rootEl),
);

window.storiesLoaded = () => {
  remote.BrowserWindow
    .getAllWindows()
    .filter(
      win => win.id === sourceId,
    )
    .forEach(
      win => (
        win.webContents.send(
          'electron-actions',
          {
            sourceId,
            albums,
            type: 'LOADED_STORIES',
          },
        )
      ),
    );
  ipcRenderer.on('electron-actions', (_, a) => {
    const {
      type,
      selectedAlbum,
      selectedTale,
    } = a;
    if (type === 'TELL_THE_TALE') {
      const rootEl = window.document.getElementById('root');
      renderTale(rootEl)(albums[selectedAlbum].stories[selectedTale].render);
    }
  });
};

window.onload = () => {
  const rootEl = window.document.getElementById('root');

  renderTale(rootEl)(() => (
    <Placeholder />
  ));
};
