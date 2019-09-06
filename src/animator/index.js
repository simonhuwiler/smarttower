import {Scene, PerspectiveCamera, WebGLRenderer, GridHelper, SpotLight, AmbientLight, DirectionalLight, Vector3} from 'three';
import data from './../data.js';
import consts from './../consts.js';
import TWEEN from '@tweenjs/tween.js';

function showBundesratsparteien()
{
  console.log("run")
  var towerPosition = 0;
  for(var i = 0; i < data.profile.length; i++)
  {
    var prof = data.profile[i];
    if(consts.nrParties.indexOf(prof[consts.profile.party]) >= 0)
    {
      //Show Layer
      prof.oldPosition = new Vector3().copy(prof.spider3d.position);
      prof.newPosition = new Vector3(0, towerPosition * consts.geometryHeight, 0);
      prof.visible = true;
      towerPosition++;
    }
    else
    {
      //Hide Layer
      prof.visible = false;
    }
  }

  animate();
}

function animate()
{

  for(var i = 0; i < data.profile.length; i++)
  {
    const prof = data.profile[i];
    if(prof.visible)
    {
      // prof.spider3d.position.copy(prof.newPosition);
      prof.spider3d.visible = true;


      let t = new TWEEN.Tween({y: prof.spider3d.position.y});
      t.to({y: prof.newPosition.y}, 1000);
      t.onUpdate(y => {
        console.log("update")
          prof.spider3d.position.y = y;
      });
      t.start();

      /*
      let tw = new Tween({y: prof.spider3d.position.y})
        .to({y: prof.newPosition.y}, 1000)
        // .interpolation(bezier)
        .on('update', function() {
          //prof.spider3d.position.y = y;
          console.log("Hallo")
          console.log(this)
          this.spider3d.position.y = y;
        });
      //tw.spider3d = prof.spider3d;
      tw.start()
      */

    }
    else
    {
      //Hide
      prof.spider3d.visible = false;
    }
  }
}

export default {
  showBundesratsparteien: showBundesratsparteien
}