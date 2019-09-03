import * as THREE from 'three';
import popup from './popup.css';
import data from '../data.js';
import consts from '../consts.js'


function initPopup(scene, camera)
{
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  var currentPopup = -1;

  function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {
      var intersect = intersects[ 0 ];
      if(intersect.object.userData.index && intersect.object.userData.index != currentPopup)
      {

        const pol = data.profile[intersect.object.userData.index];

        //Fill Data
        document.querySelector('#polName').textContent = `${pol.firstname} ${pol.lastname}`;
        document.querySelector('#polParty').textContent = pol.party;
        document.querySelector('#polParty').style.backgroundColor = consts.partyColor[pol.party];
        document.querySelector('#polPlace').textContent = pol.place;
        document.querySelector('#polListe').textContent = pol.liste;
        document.querySelector('#polNr').textContent = `(${pol.nr})`;
        document.querySelector('#link').href = `https://smartvote.ch/de/group/2/election/19_ch_nr/db/candidates/${pol.id}`;

        //Show Popup
        document.querySelector('#popup').style.display = 'block';

        currentPopup = intersect.object.userData.index;
      }
    }
  }

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
}

export default initPopup