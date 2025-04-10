import React from 'react';
import { CanvasCapture } from 'canvas-capture';
import * as PIXI from 'pixi.js';
import { withTranslation } from 'react-i18next';
import {
  ForegroundDiv,
  DimBackground,
  StyledDiv,
  ResponsiveButton,
  FadingDiv,
  ColorPickerContainer
} from '../styles/leaderAnimationStyles';
import { HexColorPicker, HexColorInput } from 'react-colorful';

var framesPerSecond = 22

window.PIXI = PIXI;
require("pixi-spine")

var saveNextFrame = false
console.log(`
 - Go to /leaders, choose the one you want, and click \`View Leader Animations\`
 - On the right choose the animaton you want
 - Pause the animation
 - Click the fullscreen button, and F11 so that the animation canvas is max size
 - Click anywhere in the animation canvas and press \`c\`
 - It will advance to the next frame and download it
   ( If it works there will be logs in the browser console )
   ( To change the fps go to \`\\src\\components\\LeaderAnimations.jsx\` and edit line 15 )
 - Keep pressing \`c\` to progress the animation and download more frames`)

// this component is all kinds of messed up, I should be using state properly
class LeaderAnimations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.loading = true;
    this.pixi_cnt = null;
    this.buttonRow = React.createRef();
    this.app = new PIXI.Application({
        width: window.innerWidth > window.innerHeight ? window.innerWidth / 2 : window.innerWidth,
        height: window.innerWidth > window.innerHeight ? window.innerWidth / 2 : window.innerWidth,
        transparent: true
    });
    this.animation = null;
    this.animScale = 1;
    this.isFullscreen = false;
    this.isDragging = false;
    this.mouse = {
      x: null,
      y: null
    }
    this.showButtons = false;
    this.isPaused = false;
    this.colorPicker = false;
    this.bgColor = '#000000'

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onTouchDown = this.onTouchDown.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.togglePaused = this.togglePaused.bind(this);
    this.rotate = this.rotate.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.setBgColor = this.setBgColor.bind(this);
    this.toggleColorPicker = this.toggleColorPicker.bind(this);
  };

  componentWillUnmount() {
    window.PIXI.spine.Spine.globalAutoUpdate = false;
  }

  updatePixiCnt = (element) => {
    this.pixi_cnt = element;
    if(this.pixi_cnt && this.pixi_cnt.children.length<=0) {
      this.pixi_cnt.appendChild(this.app.view);
      this.app.view.tabIndex=1
      this.app.view.addEventListener('mousedown', this.onMouseDown);
      this.app.view.addEventListener('mouseup', this.onMouseUp);
      this.app.view.addEventListener('mousemove', this.onMouseMove);
      this.app.view.addEventListener('mouseenter', this.onMouseEnter);
      this.app.view.addEventListener('mouseleave', this.onMouseLeave);
      this.app.view.addEventListener('touchstart', this.onTouchDown);
      this.app.view.addEventListener('touchmove', this.onTouchMove);
      this.app.view.addEventListener('keydown', this.onKeydown)
      this.setup();
    }
  };

  animate = () => {
    let renderer = this.app.renderer;
    let time = 1/framesPerSecond;

    if(saveNextFrame){
      this.animation.update(time)
      console.log('updating..');
    }

    renderer.render(this.app.stage)

    //CanvasCapture.checkHotkeys();
    if (/*CanvasCapture.isRecording()*/ saveNextFrame){
      //CanvasCapture.recordFrame();
      console.log('saving img');
      CanvasCapture.takePNGSnapshot();
      saveNextFrame = false
      console.log("RECORDING>>>");
    }

    requestAnimationFrame( this.animate )
  }

  setup = () => {
    window.PIXI.spine.Spine.globalAutoUpdate = true;
    this.app.loader.baseUrl = process.env.REACT_APP_ASSETS_URL + '/anim/';
    this.app.loader
    .add('class_' + this.props.classId + '.json', 'class_' + this.props.classId + '.json')
    .load((loader, resources) => {
        this.animation = new window.PIXI.spine.Spine(resources['class_' + this.props.classId + '.json'].spineData);
        //console.log(this.animation);
        this.animation.x = this.app.screen.width / 2;
        this.animation.y = this.app.screen.height / 2;
        this.animation.scale.set(this.animScale);

        if (this.animation.spineData.skins.length > 1) {
          this.animation.skeleton.setSkinByName(this.animation.spineData.skins[1].name);
        }

        this.app.stage.addChild(this.animation);

        this.animation.state.setAnimation(0, 'idle', true);
        this.loading = false;
        this.setState(this.state);

        CanvasCapture.init(
          document.getElementsByClassName("sc-fzoXWK kThARv")[0].children[0],
          { showRecDot: true }
        );

        CanvasCapture.bindKeyToPNGFramesRecord('f', {
          onProgress: (progress) => {
            console.log(`Zipping... ${Math.round(progress * 100)}% complete.`);
          },
          name: 'MilteoAnimation',
          onError: (err) => {
            console.log(err);
          }
        });

        CanvasCapture.bindKeyToVideoRecord('v', {
          format: CanvasCapture.MP4, // Options are optional, more info below.
          name: 'myVideo',
          quality: 1,
        });

        //saveNextFrame = true
        this.animate()

    });
  };

  renderButtons = () => {
    if(this.animation) {
      return(
        this.animation.spineData.animations.map((animation) => (
          <ResponsiveButton
            type="button"
            onClick={() => this.animation.state.setAnimation(0, animation.name, true)}
            style={{ margin: '5px' }}
            key={`button${animation.name}`}
          >
            {animation.name}
          </ResponsiveButton>
        ))
      )
    }
  };

  renderSkinButtons = () => {
    if(this.animation
      && this.animation.spineData.skins.length > 1
      && this.animation.spineData.skins[1].attachments.length !== 0) {
      return(
        <>
          <p style={{ marginBottom: '20px', borderBottom: '2px solid pink', paddingTop: '14px' }}>{this.props.t('Switch expression')}</p>
          {this.animation.spineData.skins.map((skin) => (
            <ResponsiveButton
              type="button"
              onClick={() => this.animation.skeleton.setSkinByName(skin.name)}
              key={`skin${skin.name}`}
            >
              {skin.name}
            </ResponsiveButton>
          ))}
        </>
      )
    }
  }

  renderActionButtons() {
    const rect = this.app.renderer.gl.canvas.getBoundingClientRect();
    const maxWidth = window.screen.width;
    const maxHeight = window.screen.height;
    let width = rect.width / 2 - 50;
    let height = rect.height - 50;
    if(maxHeight > maxWidth && this.isFullscreen) {
      width = maxWidth / 2 - 40;
      height = maxHeight - 200;
    }
    if(width > maxWidth) {
      width = 100;
    }
    if(height > maxHeight) {
      height = -100;
    }
    const isInBottomHalf = height > maxHeight / 2;
    return (
      <FadingDiv style={{ position: 'absolute', zIndex: '999', top: height, left: width, display: !this.showButtons && 'none' }} ref={this.buttonRow}>
        <img
          src={`${process.env.PUBLIC_URL}/svgs/play.svg`}
          alt="Play animation"
          title="Play animation"
          className="actionButton"
          style={{ display: !this.isPaused && 'none' }}
          onClick={this.togglePaused}
        />
        <img
          src={`${process.env.PUBLIC_URL}/svgs/pause.svg`}
          alt="Pause animation"
          title="Pause animation"
          className="actionButton"
          style={{ display: this.isPaused && 'none' }}
          onClick={this.togglePaused}
        />
        <img
          src={`${process.env.PUBLIC_URL}/svgs/rotateRight.svg`}
          alt="Rotate"
          title="Rotate"
          className="actionButton"
          onClick={this.rotate}
        />
        <img
          src={`${process.env.PUBLIC_URL}/svgs/plus.svg`}
          alt="Zoom in"
          title="Zoom in"
          className="actionButton"
          onClick={() => {
            this.animScale += 0.1
            this.animation.scale.set(this.animScale);
          }}
        />
        <ColorPickerContainer
          mobile={!isInBottomHalf}
          style={{ display: !this.colorPicker && 'none' }}
        >
          <HexColorPicker color={this.bgColor} onChange={this.setBgColor} />
          <HexColorInput color={this.bgColor} onChange={this.setBgColor} prefixed />
        </ColorPickerContainer>
        <img
          src={`${process.env.PUBLIC_URL}/svgs/minus.svg`}
          alt="Zoom out"
          title="Zoom out"
          className="actionButton"
          onClick={() => {
            this.animScale -= 0.1
            this.animation.scale.set(this.animScale);
          }}
        />
        <img
          src={`${process.env.PUBLIC_URL}/svgs/color.svg`}
          alt="Change background color"
          title="Change background color"
          className="actionButton"
          onClick={this.toggleColorPicker}
        />
        <img
          src={`${process.env.PUBLIC_URL}/svgs/fullscreen.svg`}
          alt="Fullscreen"
          title="Fullscreen"
          className="actionButton"
          onClick={this.toggleFullscreen}
        />



      </FadingDiv>
    )
  }

  onMouseDown(e) {
    if(e.button !== 0) return;
    this.mouse.x = e.pageX;
    this.mouse.y = e.pageY;
    this.isDragging = true;
  }

  onTouchDown(e) {
    this.mouse.x = e.touches[0].pageX;
    this.mouse.y = e.touches[0].pageY;
    this.isDragging = true;
    this.showButtons = true;
    this.setState(this.state);
  }

  onMouseUp(e) {
    if(e.button !== 0) return;
    this.isDragging = false;
  }

  onMouseMove(e) {
    if(!this.isDragging) return;
    this.animation.x = this.animation.x - (this.mouse.x - e.pageX);
    this.animation.y = this.animation.y - (this.mouse.y - e.pageY);
    this.mouse.x = e.pageX;
    this.mouse.y = e.pageY;
  }

  onTouchMove(e) {
    if(!this.isDragging) return;
    this.animation.x = this.animation.x - (this.mouse.x - e.touches[0].pageX);
    this.animation.y = this.animation.y - (this.mouse.y - e.touches[0].pageY);
    this.mouse.x = e.touches[0].pageX;
    this.mouse.y = e.touches[0].pageY;
  }

  onMouseEnter() {
    this.showButtons = true;
    this.setState(this.state);
  }
  onMouseLeave(e) {
    if(!e.relatedTarget || (!e.relatedTarget.classList.contains('actionButton') && !this.colorPicker)) {
      this.showButtons = false;
      this.setState(this.state);
    }
  }

  onKeydown(e) {
    switch (e.key.toString()) {
      case 'c':
        saveNextFrame = true;
        console.log("'C' clicked");
    }
  }

  togglePaused() {
    this.isPaused = !this.isPaused;
    window.PIXI.spine.Spine.globalAutoUpdate = !this.isPaused;
    this.setState(this.state);
  }

  rotate() {
    this.animation.angle = (this.animation.angle + 90) % 360;
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    if(this.isFullscreen) {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
    } else {
      this.app.renderer.resize(window.innerWidth > window.innerHeight ? window.innerWidth / 2 : window.innerWidth, window.innerWidth > window.innerHeight ? window.innerWidth / 2 : window.innerWidth)
    }
    this.setState(this.state);
  }

  setBgColor(newColor) {
    this.bgColor = newColor;
    //this.app.renderer.backgroundColor = this.bgColor.replace('#', '0x');
    this.setState(this.state);
  }

  toggleColorPicker() {
    this.colorPicker = !this.colorPicker;
    this.setState(this.state)
  }

  render() {
    //console.log(this.capturer);
    //this.capturer.capture( this.app.renderer.gl.canvas );
    return (
      <DimBackground>
        <ForegroundDiv fullscreen={this.isFullscreen}>
          { this.loading && <p style={{ position: 'absolute', top: '50%', left: '50%' }}>Loading...</p> }
          <StyledDiv fullscreen={this.isFullscreen} ref={this.updatePixiCnt} style={{ display: this.loading ? 'hidden' : 'inline' }} />
          { !this.isFullscreen &&
            <div style={{ display: 'inline' }}>
              <p style={{ marginBottom: '20px', borderBottom: '2px solid pink', paddingTop: '14px' }}>{this.props.t('Switch animation')}</p>
              <div>
                {this.renderButtons()}
              </div>
              <div>
                {this.renderSkinButtons()}
              </div>
              <ResponsiveButton
                style={{ width: '5vw' }}
                onClick={() => {
                  this.animScale += 0.1
                  this.animation.scale.set(this.animScale);
                  }}>
                Zoom +
              </ResponsiveButton>
              <ResponsiveButton
                style={{ width: '5vw' }}
                onClick={() => {
                  this.animScale -= 0.1
                  this.animation.scale.set(this.animScale);
                  }}>
                Zoom -
              </ResponsiveButton>
              <ResponsiveButton
                type="button"
                onClick={() => this.props.close()}
                style={{ backgroundColor: '#502020', position: 'relative' }}
              >
                {this.props.t('Close')}
              </ResponsiveButton>
            </div>
          }
          {this.renderActionButtons()}

        </ForegroundDiv>
      </DimBackground>
    );
  }
};

export default withTranslation()(LeaderAnimations);
