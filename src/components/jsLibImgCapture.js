import React from "react";
import CameraPhoto, { FACING_MODES } from "jslib-html5-camera-photo";

const config = {
  sizeFactor: 1
};
class ImgCapture extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.cameraPhoto = null;
    this.videoRef = this.refs.videoId;
    this.state = {
      dataUri: ""
    };
  }
  componentDidMount() {
    this.cameraPhoto = new CameraPhoto(this.refs.videoId);
  }
  // starting camera by passing the resolution in idealResolution.
  startCamera(idealFacingMode, idealResolution) {
    this.cameraPhoto
      .startCamera(idealFacingMode, idealResolution)
      .then(() => {
        console.log("camera is started !");
      })
      .catch(error => {
        console.error("Camera not started!", error);
      });
  }
  // starting camera with maximum resolution.
  startCameraMaxResolution(idealFacingMode) {
    this.cameraPhoto
      .startCameraMaxResolution(idealFacingMode)
      .then(() => {
        console.log("camera is started !");
      })
      .catch(error => {
        console.error("Camera not started!", error);
      });
  }
  takePhoto() {
    let dataUri = this.cameraPhoto.getDataUri(config);
    this.setState({ dataUri });
    this.changeResolution(dataUri);
  }
  // change resolution of taken photo by 220x150
  changeResolution(dataUri) {
    let canvas, context;
    let image = this.refs.SourceImage;
    canvas = this.refs.Canvas;
    context = canvas.getContext("2d");
    image = new Image();
    canvas.width = 220;
    canvas.height = 150;
    image.src = dataUri;
    image.onload = function() {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }

  stopCamera() {
    this.cameraPhoto
      .stopCamera()
      .then(() => {
        console.log("Camera stoped!");
      })
      .catch(error => {
        console.log("No camera to stop!:", error);
      });
  }

  render() {
    return (
      <div>
        <button onClick={ () => {
          let facingMode = FACING_MODES.ENVIRONMENT;
          let idealResolution = { width: 640, height: 480 };
          this.startCamera(facingMode, idealResolution);
        }}> Start environment facingMode resolution ideal 640 by 480 </button>

        <button
          onClick={() => {
            let facingMode = FACING_MODES.USER;
            this.startCamera(facingMode, {});
          }}
        >
          Start user facingMode resolution default
        </button>
        <button
          onClick={() => {
            let facingMode = FACING_MODES.USER;
            this.startCameraMaxResolution(facingMode);
          }}
        >
          {" "}
          Start user facingMode resolution maximum{" "}
        </button>

        <button
          onClick={() => {
            this.takePhoto();
          }}
        >
          {" "}
          Take photo{" "}
        </button>

        <button
          onClick={() => {
            this.stopCamera();
          }}
        >
          {" "}
          Stop{" "}
        </button>
        {this.state.dataUri !== "" && (
          <button onClick={this.changeResolution}>
            Change Resolution(220 x 150px)
          </button>
        )}
        <video ref="videoId" autoPlay={true} />
        <img alt="imgCamera" src={this.state.dataUri} />
        <img alt="pic"
          ref="SourceImage"
          style={{ display: "none" }}
          src={this.state.dataUri}
        />
        <br />
        <div style={{ width: "400px" }}>
          <canvas ref="Canvas" style={{ maxWidth: "100%" }} />
        </div>
      </div>
    );
  }
}
export default ImgCapture;

// Note :
// The npm package used here is 'jslib-html5-camera-photo' (https://www.npmjs.com/package/jslib-html5-camera-photo)