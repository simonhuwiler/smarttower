import {Vector3} from 'three';
import consts from '../consts.js';

var mouseDown = false;
var lastPosition = {x: 0, y: 0};
var camera, callback;

function addZoomControl()
{
  document.querySelector('#controls').insertAdjacentHTML('beforeend', `
    <div class='zoomgroup'>
        <button class='zoomPlus'></button>
        <button class='zoomMinus'></button>
      </div>`);

  document.querySelector('#controls .zoomPlus').addEventListener("click", () => zoom(-2));
  document.querySelector('#controls .zoomMinus').addEventListener("click", () => zoom(2));
}

function zoom(value)
{

  const x = camera.position.x;
  const z = camera.position.z;

  const speed = value;

  camera.position.x = camera.position.x >= 0 ? x + speed : x - speed;
  camera.position.z = camera.position.z >= 0 ? z + speed : z - speed;

  camera.lookAt(new Vector3(0, camera.position.y - consts.cameraYOffset, 0))

  callback(false)
}

function initScroller(_camera, maxSize, _callback)
{
  camera = _camera;
  callback = _callback;
  document.body.onmousedown = function(e) { 
    //Set last Position
    if('screenX' in e)
    {
      //Mouse
      lastPosition.x = e.screenX;
      lastPosition.y = e.screenY;
    }
    else
    {
      //Touch
      lastPosition.x = e.touches[0].clientX;
      lastPosition.y = e.touches[0].clientY;

    }
    callback(true)

    mouseDown = true;
  }
  document.body.onmouseup = function() {
    mouseDown = false;

    callback(false)
  }

  //Register Touch
  document.body.ontouchstart = document.body.onmousedown;
  document.body.ontouchend = document.body.onmouseup;

  window.addEventListener("wheel", e => {

    zoom(0.01 * event.deltaY)
  });

  function moveCamera(e)
  {
    if(mouseDown)
    {
      //Calc Y
      var y = camera.position.y + 0.1 * (e.y - lastPosition.y)

      if(y < maxSize && y >= 15)
      {
        camera.position.y = y;
      }

      //Calc X
      const rotSpeed = 0.01 * (lastPosition.x - e.x);

      const x = camera.position.x;
      const z = camera.position.z;

      camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
      camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);

      lastPosition.x = e.x;
      lastPosition.y = e.y;
      camera.lookAt(new Vector3(0, camera.position.y - consts.cameraYOffset, 0))
    }
  };
  // document.body.ontouchmove = document.body.onmousemove;
  document.body.onmousemove = e => moveCamera({x: e.screenX, y: e.screenY});
  document.body.ontouchmove = e => moveCamera({x: e.touches[0].clientX, y: e.touches[0].clientY});
}


export default {
  initScroller: initScroller,
  addZoomControl: addZoomControl
}