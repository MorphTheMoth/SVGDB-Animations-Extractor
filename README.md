## SVGDB Shadowverse Animations Extractor

Fork  of [SVGDB-frontend](https://github.com/Heionbuji/SVGDB-frontend)

Roughly added a way to extract the Leader's animations into keyframes using the [Canvas Capture](https://github.com/amandaghassaei/canvas-capture) module, so that it will download every frame you want as a .png and it will preserve the original transparency.

## Usage

Make sure you have [nodejs](https://nodejs.org/en/download) and [git](https://git-scm.com/downloads) installed 

To get the project running on your machine, first clone the repository
```
git clone https://github.com/MorphTheMoth/SVGDB-Shadowverse-Animations-Extractor
```
Then install the dependencies with
```
npm ci
```
And start a development server with
```
npm run start
```
Then to extract the animation :
 - Go to /leaders, choose the one you want, and click `View Leader Animations`
 - Pause and unpause the animation to view it, and on the right choose the animaton you want
 - Reload the page after you chose it
 - Dont touch the play button
 - Click the animation you want on the right
 - Click the fullscreen button, and F11 so that the canvas is max size
 - Click anywhere in the canvas and press `c` 
 - It will advance to the next frame and download it\
   ( If it works there will be logs in the browser console )\
   ( To change the fps go to `\src\components\LeaderAnimations.jsx` and edit line 15 )
 - Keep pressing `c` to progress the animation and download more frames
