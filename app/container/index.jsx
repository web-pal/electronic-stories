/* eslint react/no-array-index-key: 0 */
/*
global process, window
*/

import '@babel/polyfill';
import React from 'react';
import {
  render as reactRender,
} from 'react-dom';
import path from 'path';

import styled, {
  createGlobalStyle,
} from 'styled-components';

import {
  ipcRenderer,
} from 'electron';

import * as R from 'ramda';

import NanumGothicRegular from '../assets/fonts/NanumGothic-Regular.ttf';
import NanumGothicBold from '../assets/fonts/NanumGothic-Bold.ttf';
import NanumGothicExtraBold from '../assets/fonts/NanumGothic-ExtraBold.ttf';

import Component from '../components/Component';

const listEl = window.document.getElementById('stories-list');
const webiewEl = window.document.getElementById('stories-render');

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Nanum Gothic';
    font-style: normal;
    font-weight: 400;
    src: local('Nanum Gothic'), local('Nanum Gothic'),
         url('${NanumGothicRegular}') format('truetype');
  }
  @font-face {
    font-family: 'Nanum Gothic';
    font-style: normal;
    font-weight: 700;
    src: local('Nanum Gothic'), local('Nanum Gothic'),
         url('${NanumGothicBold}') format('truetype');
  }
  @font-face {
    font-family: 'Nanum Gothic';
    font-style: normal;
    font-weight: 900;
    src: local('Nanum Gothic'), local('Nanum Gothic'),
         url('${NanumGothicExtraBold}') format('truetype');
  }
  body {
    padding: 0;
    margin: 0;
    font-family: 'Nanum Gothic';
  };

  #main-container {
    width: 100%;
    height: 100vh;
    display: flex;
  }
  #stories-list {
    flex: 0 0 200px;
    background: #f7f7f7;
    height: 100vh;
  }
  #stories-render {
    flex: 1 0;
    text-align: center;
  }
  #stories-render > * {
    height: 100vh;
  }

  .no-tale {
    margin: 0 auto;
    height: 100%;
    font-size: 30pt;
    padding: 100px 0;
  }
`;

const AlbumName = styled.div`
  padding: 5px;
  background: #eee;
  text-align: center;
`;

const AlbumStories = styled.div``;
const TaleName = styled.a`
  padding: 5px;
  display: block;
  cursor: pointer;
  font-weight: ${({ selected }) => (selected ? '700' : '400')};
  :hover {
    background: #eef;
  }
`;

const renderInto = rootEl => R.pipe(
  (x, callback) => el => reactRender(x, el, callback),
  render => render(rootEl),
);

let webviewRef;

R.pipe(
  () => renderInto(webiewEl),
  render => render((
    <webview
      src="http://localhost:9002/"
      nodeintegration="true"
      preload={`file://${path.join(process.cwd(), 'app/containerDist/preload.js')}`}
      ref={(el) => { webviewRef = el; }}
    />
  ), () => {
    if (webviewRef) {
      webviewRef.addEventListener('dom-ready', () => {
        ipcRenderer.on('electron-actions', (_, a) => {
          if (a.type === 'TOGGLE_WEBVIEW_DEVTOOLS') {
            webviewRef.getWebContents().toggleDevTools();
          }
        });
      });
    }
  }),
)();

R.pipe(
  () => renderInto(listEl),
  render => render((
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
  )),
)();
