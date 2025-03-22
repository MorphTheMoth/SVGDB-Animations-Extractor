## SVGDB Shadowverse Animations Extractor

Fork  of [SVGDB-frontend](https://github.com/Heionbuji/SVGDB-frontend)

Added a pretty rough way to extract the Leader's animations into keyframes using the [Canvas Capture](https://github.com/amandaghassaei/canvas-capture) module

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
 - Click anywhere in the canvas and press `c` (If it works there will be logs in the F12 js console, and one frame will be downloaded)
 - It will advance to the next frame and download it (To change the fps go to `\src\components\LeaderAnimations.jsx` and edit line 15)
 - Keep pressing `c` to progress the animation and download more frames
