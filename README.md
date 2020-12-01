## Introduction

Viewer that shows the basemap of Amsterdam in Amersfoort New (*Rijksdriehoekstel*) projection.

Inspiration from example using [Swiss tile grid](https://github.com/rzoller/swiss-tile-grid-vt) and vector tiles from SwissTopo. The use of Mapbox Styles in OpenLayers comes from the workshop [Making things look bright](https://openlayers.org/workshop/en/vectortile/bright.html).

We're using [Webpack](https://webpack.js.org/) to serve locally while developing and create a self-contained production build.

Get all the required modules:

    npm install

Start development:

    npm run start

Create a production build:

    npm run build

To deploy production build, commit to `git` explicitly:

    git add -f app/dist