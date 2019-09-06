import {Scene, PerspectiveCamera, WebGLRenderer, GridHelper, SpotLight, AmbientLight, DirectionalLight, Vector3} from 'three';
import data from './data.js';
import consts from './consts.js';
import popup from './popup'
import scroller from './scroller';
import sprites from './sprites';
import spider from './spider'
import animator from './animator';
import style from './style.css'

//TEST
document.querySelector("#test").addEventListener('click', () => {
  animator.showBundesratsparteien();
  continuousRenderer(true)
  render();
});

var scene = new Scene();
var camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//Create Renderer
var renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 1 );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

//Register Resize Event
window.addEventListener( 'resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();

}, false);

//Register click event on animation icons
document.querySelector("#action").addEventListener("click", () => document.querySelector("#action").style.display = 'none');

//Add Grid
var gridHelper = new GridHelper( 100, 100 );
scene.add( gridHelper );

//Light
var spotLight1 = new SpotLight( 0xffffff, 0.5 );
spotLight1.position.set( 30, 10, 10 );
 scene.add( spotLight1 );

var spotLight2 = new SpotLight( 0xffffff, 0.5 );
spotLight2.position.set( 30, 100, 10 );
scene.add( spotLight2 );

var ambientLight = new AmbientLight(0x404040, 1);
scene.add( ambientLight );

var directionalLight = new DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set(0, 10, 0)
scene.add( directionalLight );

camera.position.x = 0;
camera.position.y = consts.cameraYOffset;
camera.position.z = consts.cameraZOffset;
camera.lookAt(new Vector3(0, 0, 0))

//Init Tower
const tower = spider.createTower();
scene.add(tower)

//Init Scroller
scroller.initScroller(camera, data.profile.length * consts.geometryHeight + consts.cameraYOffset, continuousRenderer)
scroller.addZoomControl();

//Add Infobutton
document.querySelector('#controls').insertAdjacentHTML('beforeend', `<button class='control information'></button>`);
document.querySelector('#controls .information').addEventListener("click", () => {
  document.querySelector('#credits').style.display = 'block'
  document.querySelector("#popup").style.display = 'none'
});
document.querySelector("canvas").addEventListener("click", () => document.querySelector('#credits').style.display = 'none');

//Init Sprites
var spriteArray = []
sprites.generateStripes(group => {
  
  //Add to Scene and hide
  group.visible = false;
  scene.add(group);

  //Move to top
  group.position.set(0, data.profile.length * consts.geometryHeight, 0);
  spriteArray.push(group);

  render();

  //Ready to start!
  document.querySelector('#intro button').style.visibility = 'visible';

});

function startAnimation()
{
  //Hide Intro
  document.querySelector('#intro').style.display = 'none';

  fadeIn(0, () => {

    //Show Navigation
    document.querySelector('#controls').style.display = 'block';

    //Init Popup
    popup(scene, camera, render, tower, spriteArray[spriteArray.length - 1]);

    //Show Animation Ivons
    document.querySelector("#action").style.display = 'block';

    //Show Sprites
    spriteArray.forEach(g => {
      g.visible = true;
    });
    render();
      
  });
}

document.querySelector('#intro button').addEventListener("click", startAnimation)

render();

//Fader
function fadeIn(currentIndex, callback)
{
  var posInternal = currentIndex;
  for(var i = posInternal; i < posInternal + consts.fadeSpiderPerRun && i <= data.spider.length - 1; i++)
  {
    data.profile[i].spider3d.visible = true;
    currentIndex = i;
  }

  //Set Camera
  const spider3d = data.profile[currentIndex].spider3d;
  camera.position.x = spider3d.position.x;
  camera.position.y = spider3d.position.y + consts.cameraYOffset;
  camera.position.z = spider3d.position.z + consts.cameraZOffset;
  camera.lookAt(new Vector3(spider3d.position.x, spider3d.position.y, spider3d.position.z))

  render();
  if(currentIndex < data.profile.length - 2)
    setTimeout(() => fadeIn(currentIndex, callback), 10)
  else
  {
    callback();
  }
}

function render()
{
  renderer.render( scene, camera );
}

function animate()
{
  if(continousRenderingRunning)
	  requestAnimationFrame( animate );

  render()
}

var continousRenderingRunning = false;
function continuousRenderer(shoudRender)
{

  //Hide Animation icons
  document.querySelector("#action").style.display = 'none';

  continousRenderingRunning = shoudRender;
  render();
  animate();

}