import * as THREE from 'three';
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

  camera.lookAt(new THREE.Vector3(0, camera.position.y - consts.cameraYOffset, 0))

  callback(false)
}

function initScroller(_camera, maxSize, _callback)
{
  camera = _camera;
  callback = _callback;
  document.body.onmousedown = function(e) { 
    //Set last Position
    lastPosition.x = e.screenX;
    lastPosition.y = e.screenY;
    callback(true)

    mouseDown = true;
  }
  document.body.onmouseup = function() {
    mouseDown = false;

    callback(false)
  }

  window.addEventListener("wheel", e => {

    zoom(0.01 * event.deltaY)
  });

  window.addEventListener('mousemove', e => {
    if(mouseDown)
    {
      //Calc Y
      var y = camera.position.y + 0.1 * (e.screenY - lastPosition.y)

      if(y < maxSize && y >= 15)
      {
        camera.position.y = y;
      }

      //Calc X
      const rotSpeed = 0.01 * (lastPosition.x - e.screenX);

      const x = camera.position.x;
      const z = camera.position.z;

      camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
      camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);

      lastPosition.x = e.screenX;
      lastPosition.y = e.screenY;
      camera.lookAt(new THREE.Vector3(0, camera.position.y - consts.cameraYOffset, 0))
    }
  });
}


export default {
  initScroller: initScroller,
  addZoomControl: addZoomControl
}