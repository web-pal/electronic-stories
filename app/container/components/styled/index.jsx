import styled, {
  createGlobalStyle,
} from 'styled-components';

import NanumGothicRegular from '../../../assets/fonts/NanumGothic-Regular.ttf';
import NanumGothicBold from '../../../assets/fonts/NanumGothic-Bold.ttf';
import NanumGothicExtraBold from '../../../assets/fonts/NanumGothic-ExtraBold.ttf';

export const GlobalStyle = createGlobalStyle`
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

export const AlbumName = styled.div`
  padding: 5px;
  background: #eee;
  text-align: center;
`;

export const AlbumStories = styled.div``;
export const TaleName = styled.a`
  padding: 5px;
  display: block;
  cursor: pointer;
  font-weight: ${({ selected }) => (selected ? '700' : '400')};
  :hover {
    background: #eef;
  }
`;
