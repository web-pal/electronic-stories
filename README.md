# Electronic-Stories


Electronic-Stories is a tool for developing UI components in Electron environment.
It allows you to browse a component library, view the different states of each component, and interactively develop and test components.

![Chronos-timetracker Screenshot](https://web-pal.com/assets/images/electronic-stories-cover.png)

## Getting Started

First install Electronic-Stories:
```sh
yarn add -D electronic-stories
```
or
```sh
npm i -D electronic-stories
```

Then add stories and way to serve them. Fro example:
```js
// index.js
(r => r.keys().forEach(r))(require.context('./story', true, /\.tale\.jsx$/));
```
```js
// basic.story.jsx

/* global storiesOf */
import React from 'react';

storiesOf('Basic')
  .add(
    'First',
    () => (
      <button type="button">First</button>
    ),
  )
  .add(
    'Second',
    () => (
      <button type="button">Second</button>
    ),
  );

```
Notice that for proper work HTML file served on port must have "root" element and have "index.js" script.
```html
// index.tpl.js
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Stories</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript" src="/bundle.js"></script>
  </body>
</html>
```
For example you can use webpack for serving stories:
```js
// webpack.config.js
const path = require('path');

module.exports = () => ({
  target: 'electron-renderer',
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    app: path.join(__dirname, './index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 9001,
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
```

## Contributing

We welcome contributions to Electronic-Stories!
We use conventional commits specification for commit messages.
