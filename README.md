# Seasons simulation

Latest **stable** version:

http://grasp-seasons.concord.org/

Latest **development** version:

http://grasp-seasons.concord.org/branch/master/

Old versions can be accesed via `/version/<tag>` path, e.g.:

http://grasp-seasons.concord.org/version/0.1.0/

Github Pages deployment is equal to version 0.1.0:

http://concord-consortium.github.io/grasp-seasons/

It won't be updated in the future.

## Development

This project is using [webpack](http://webpack.github.io/) to build the final JS file in `/dist` folder.

First, you need to make sure that webpack is installed and all the NPM packages required by this project are available:

```
npm install -g webpack
npm install
```
Then you can build JavaScript files using:
```
webpack
```
or:
```
webpack --watch
```

## Deployment

This project is automatically deployed to S3 bucket by Travis-CI.

- `production` branch is deployed to top-level directory (http://grasp-seasons.concord.org/).
- other branches are deployed to `/branch/` subdirectories (e.g. http://grasp-seasons.concord.org/branch/master)
- tags are deployed to `/version/` subdirectories  (e.g. http://grasp-seasons.concord.org/version/0.1.0)

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


