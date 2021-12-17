# Seasons simulation

Latest **stable** version:

http://models-resources.concord.org/grasp-seasons/index.html

Latest **development** version:

http://models-resources.concord.org/grasp-seasons/branch/master/index.html

Old versions can be accessed via `/version/<tag>` path, e.g.:

http://models-resources.concord.org/grasp-seasons/version/0.1.0/index.html

Github Pages deployment is equal to version 0.1.0:

http://concord-consortium.github.io/grasp-seasons/

It won't be updated in the future.

## Development

This project is using [webpack](http://webpack.github.io/) to build the final JS file in `/dist` folder.

First, you need to make sure that webpack is installed and all the NPM packages required by this project are available:

```
npm install
```
Then you can build JavaScript files using:
```
npm run build
```
or:
```
npm start
```

## Deployment

This project is automatically deployed to S3 bucket by Travis-CI.

- `production` branch is deployed to top-level directory (http://models-resources.concord.org/grasp-seasons/index.html).
- other branches are deployed to `/branch/` subdirectories (e.g. http://models-resources.concord.org/grasp-seasons/branch/master/index.html)
- tags are deployed to `/version/` subdirectories  (e.g. http://models-resources.concord.org/grasp-seasons/version/0.1.0/index.html)

## License

[MIT](https://github.com/concord-consortium/grasp-seasons/blob/master/LICENSE)

### Textures

Source:
http://www.shadedrelief.com/natural3/pages/textures.html

License:
http://www.shadedrelief.com/natural3/pages/use.html

> All Natural Earth III data (and images) found on this website are in the public domain. You may use the data in any manner, including modifying the content and design, electronic dissemination, and offset printing. The author, Tom Patterson, renounces all financial claim to the data and invites you to use it for personal, educational, and commercial purposes.
> No permission is needed to use Natural Earth III. Crediting the author is unnecessary. However, if you wish to cite the data source, simply use: Tom Patterson, www.shadedrelief.com.
> The author provides Natural Earth III as a public service and is not responsible for any problems relating to accuracy, content, design, and how it is used.
