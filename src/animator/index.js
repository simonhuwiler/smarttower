import {Scene, PerspectiveCamera, WebGLRenderer, GridHelper, SpotLight, AmbientLight, DirectionalLight, Vector3} from 'three';
import data from './../data.js';
import consts from './../consts.js';
import TWEEN from '@tweenjs/tween.js';

var renderer;
var onlyFractionStrengthPartysVisible = false;

function addRenderCallback(cb)
{
  renderer = cb;
}

function showBundesratsparteien()
{

  if(!onlyFractionStrengthPartysVisible)
  {
    //Show only Fraction Parties
    var towerPosition = 0;
    for(var i = 0; i < data.profile.length; i++)
    {
      var prof = data.profile[i];
      if(consts.nrFractionStrength.indexOf(prof[consts.profile.party]) >= 0)
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
        prof.oldPosition = new Vector3().copy(prof.spider3d.position);
        prof.newPosition = new Vector3(0, 0, 0);
      }
    }
  }
  else
  {
    //Reset Tower
    for(var i = 0; i < data.profile.length; i++)
    {
      var prof = data.profile[i];

      //Show Layer
      prof.newPosition = new Vector3().copy(prof.oldPosition);
      prof.visible = true;
    }
  }

  onlyFractionStrengthPartysVisible = !onlyFractionStrengthPartysVisible;

  animate();
}

function animateFrame(time)
{
  if(tweenList.length > 0)
    requestAnimationFrame(animateFrame);
  else
    document.querySelector('#controls .fractionstrength').disabled = false;

  TWEEN.update(time)

  renderer()
}

var tweenList = [];

function animate()
{

  tweenList = [];

  document.querySelector('#controls .fractionstrength').disabled = true;

  for(var i = 0; i < data.profile.length; i++)
  {
    const prof = data.profile[i];

      prof.spider3d.visible = prof.visible;

      let t = new TWEEN.Tween({y: prof.spider3d.position.y})
        .to({y: prof.newPosition.y}, 1000)
        .easing(TWEEN.Easing.Elastic.Out)
        .onUpdate(d => prof.spider3d.position.y = d.y)
        .onComplete(t => tweenList.splice( tweenList.indexOf(t), 1 ));

      //Add to Tween List
      tweenList.push(t);

      //Start Tween
      t.start();
  }

  //Start Animation loop
  animateFrame();
}

export default {
  addRenderCallback: addRenderCallback,
  showBundesratsparteien: showBundesratsparteien
}