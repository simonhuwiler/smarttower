import {Raycaster, Vector2, MeshPhongMaterial} from 'three';
import popup from './popup.css';
import data from '../data.js';
import consts from '../consts.js'

function initPopup(camera, renderCallback, intersectGroup, sprite)
{
  var raycaster = new Raycaster();
  var mouse = new Vector2();
  const hoverMaterial = new MeshPhongMaterial( { color: 0x06f3d4 } );

  var currentPopup = -1;

  function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( intersectGroup.children );
    if ( intersects.length > 0 ) {
      var intersect = intersects[ 0 ];
      if(intersect.object.userData.index && intersect.object.userData.index != currentPopup)
      {

        if(currentPopup >= 0 && data.profile[currentPopup].spider3d.materialOriginal)
        {
          data.profile[currentPopup].spider3d.material = data.profile[currentPopup].spider3d.materialOriginal;
        }

        //Move Sprite to position
        sprite.position.y = intersect.object.position.y;
        
        //Change Material vor Hover effect
        const pol = data.profile[intersect.object.userData.index];
        intersect.object.materialOriginal = intersect.object.material
        intersect.object.material = hoverMaterial;

        //Fill Data
        document.querySelector('#polName').textContent = `${pol[consts.profile['firstname']]} ${pol[consts.profile['lastname']]}`;
        document.querySelector('#polParty').textContent = pol[consts.profile['party']];
        document.querySelector('#polParty').style.backgroundColor = consts.partyColor[pol[consts.profile['party']]];
        document.querySelector('#polPlace').textContent = pol[consts.profile['place']];
        document.querySelector('#polListe').textContent = pol[consts.profile['liste']];
        if(pol[consts.profile['nr']] != "")
          document.querySelector('#polNr').textContent = ` (${pol[consts.profile['nr']]})`
        else
          document.querySelector('#polNr').textContent = ``;

        document.querySelector('#link').href = `https://smartvote.ch/de/group/2/election/19_ch_nr/db/candidates/${pol[consts.profile['id']]}`;

        //Show Popup
        document.querySelector('#popup').style.display = 'block';

        currentPopup = intersect.object.userData.index;

        renderCallback();
      }
    }
  }

  // function onDocumentMouseClick( event )
  // {
  //   console.log("click")
  //   var intersects = raycaster.intersectObjects( intersectGroup.children );
  //   if ( intersects.length > 0 ) {
  //     var intersect = intersects[ 0 ];
  //     if(intersect.object.userData.index)
  //     {
  //       //Move it!
  //       console.log(intersect.object.userData.index);

  //     }
  //   }

  // }

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  // document.addEventListener( 'click', onDocumentMouseClick, false );
}


export default initPopup