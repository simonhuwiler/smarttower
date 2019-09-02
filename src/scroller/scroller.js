import * as THREE from 'three';
import consts from '../consts.js';
import helpers from '../helpers.js';

function initScroller(camera, maxSize, callback)
{
  const divSize = document.querySelector('#scroller').clientHeight;
  const divWidth = document.querySelector('#scroller').clientWidth;
  window.addEventListener('scroll', e => {
    //Calc Y
    const  positionYInPercent = 100 / divSize * ( divSize - window.scrollY)
    const y =  maxSize / 100 * positionYInPercent;
    camera.position.y = y;

    //Calc X
    const  positionXInPercent = 100 / (divWidth - window.innerWidth) * window.scrollX;

    //Calc degrees. Add Initial Value
    var degrees = helpers.deg2rad(360 / 100 * positionXInPercent + 90)

    const pos_x = Math.cos(degrees) * consts.cameraZOffset;
    const pos_z = Math.sin(degrees) * consts.cameraZOffset;
  
    camera.position.x = pos_x;
    camera.position.z = pos_z;

    camera.lookAt(new THREE.Vector3(0, camera.position.y - consts.cameraYOffset, 0))
    callback()
  });
}

export default initScroller