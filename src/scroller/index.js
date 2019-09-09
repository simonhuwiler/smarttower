import {Vector3} from 'three';
import consts from '../consts.js';

var mouseDown = false;
var lastPosition = {x: 0, y: 0};
var camera, callback;

function addZoomControl()
{
  document.querySelector('#controls').insertAdjacentHTML('beforeend', `
    <div class='zoomgroup'>
        <button class='zoomPlus' data-hover='Näher heran'></button>
        <button class='zoomMinus' data-hover='Weiter weg'></button>
      </div>`);

  document.querySelector('#controls .zoomPlus').addEventListener("click", () => zoom(-6));
  document.querySelector('#controls .zoomMinus').addEventListener("click", () => zoom(6));
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
  document.querySelector("canvas").onmousedown = function(e) { 
    //Hide Credits
    document.querySelector('#credits').style.display = 'none';

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
  document.querySelector("canvas").onmouseup = function() {
    mouseDown = false;

    callback(false)
  }

  //Register Touch
  document.querySelector("canvas").ontouchstart = document.querySelector("canvas").onmousedown;
  document.body.ontouchend = document.querySelector("canvas").onmouseup;

  window.addEventListener("wheel", e => {

    //Calc Y
    var y = camera.position.y - (0.04 * event.deltaY)
    setCameraY(y)
    _callback(false);
  });

  function setCameraY(y)
  {
    //Calc Y
    if(y < maxSize && y >= 15)
    {
      camera.position.y = y;
      camera.lookAt(new Vector3(0, camera.position.y - consts.cameraYOffset, 0))
    }

  }

  function moveCamera(e)
  {
    if(mouseDown)
    {
      //Calc Y
      setCameraY(camera.position.y + 0.1 * (e.y - lastPosition.y));

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

  document.body.onmousemove = e => moveCamera({x: e.screenX, y: e.screenY});

  document.addEventListener("touchmove", e => {
    
    //Prevent default to prevent reloading on swiping up on mobile
    moveCamera({x: e.touches[0].clientX, y: e.touches[0].clientY})
    e.preventDefault();
    }, {
      passive: false
    });
  }


export default {
  initScroller: initScroller,
  addZoomControl: addZoomControl
}