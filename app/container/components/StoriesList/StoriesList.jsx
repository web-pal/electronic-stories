/* eslint react/no-array-index-key: 0 */
import React from 'react';
import {
  ipcRenderer,
} from 'electron';

import Component from '../../../components/Component';
import {
  AlbumName,
  AlbumStories,
  TaleName,
  GlobalStyle,
} from '../styled';

const StoriesList = ({ webviewRef }) => (
  <>
    <Component
      initialState={{
        selectedAlbum: null,
        selectedTale: null,
        albums: [],
      }}
      componentDidMount={({ setState }) => {
        ipcRenderer.on('electron-actions', (_, a) => {
          if (a.type === 'LOADED_STORIES') {
            setState({
              albums: a.albums,
            });
          }
        });
      }}
    >
      {(_, {
        setState,
        state,
      }) => (
        <div>
          {state.albums.map((album, albumIndex) => (
            <div key={`${albumIndex}${album.name}`}>
              <AlbumName selected={albumIndex === state.selectedAlbum}>
                {album.name}
              </AlbumName>
              <AlbumStories>
                {album.stories.map((tale, taleIndex) => (
                  <TaleName
                    key={`${tale.name}${albumIndex}${taleIndex}`}
                    onClick={() => {
                      setState({
                        selectedAlbum: albumIndex,
                        selectedTale: taleIndex,
                      });
                      if (webviewRef) {
                        webviewRef.getWebContents().send(
                          'electron-actions',
                          {
                            type: 'TELL_THE_TALE',
                            selectedAlbum: albumIndex,
                            selectedTale: taleIndex,
                          },
                        );
                      }
                    }}
                    selected={
                      albumIndex === state.selectedAlbum
                      && taleIndex === state.selectedTale
                    }
                  >
                    {tale.name}
                  </TaleName>
                ))}
              </AlbumStories>
            </div>
          ))}
        </div>
      )}
    </Component>
    <GlobalStyle />
  </>
);

export default StoriesList;
