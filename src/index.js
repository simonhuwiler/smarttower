import {Scene, PerspectiveCamera, WebGLRenderer, GridHelper, SpotLight, AmbientLight, DirectionalLight, Vector3} from 'three';
import data from './data.js';
import consts from './consts.js';
import popup from './popup'
import scroller from './scroller';
import sprites from './sprites';
import spider from './spider'
import style from './style.css'

var scene = new Scene();
var camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//Create Renderer
var renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 1 );
document.body.appendChild( renderer.domElement );

//Register Resize Event
window.addEventListener( 'resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();

}, false);

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

camera.position.z = 30;
camera.position.x = 0;
camera.position.y = 0;

//Init Tower
const tower = spider.createTower();
scene.add(tower)

//Init Scroller
scroller.initScroller(camera, data.profile.length * consts.geometryHeight + consts.cameraYOffset, continuousRenderer)
scroller.addZoomControl();

//Add Infobutton
document.querySelector('#controls').insertAdjacentHTML('beforeend', `<button class='control information'></button>`);
//  document.querySelector('#controls .zoomPlus').addEventListener("click", () => zoom(-2));

//Init Sprites
var spriteArray = []
sprites.generateStripes(group => {
  
  //Add to Scene and hide
  group.visible = false;
  scene.add(group);

  //Move to top
  group.position.set(0, data.profile.length * consts.geometryHeight, 0);
  spriteArray.push(group);

  /*
  group.visible = false;
  spriteArray.push(group);
  scene.add(group);
  console.log(spriteArray, group)

  //Clone
  for(var i = 0; i < 5; i++)
  {
    var clone = group.clone();
    clone.position.set(0, data.profile.length * consts.geometryHeight / 5 * (i + 1), 0)
    scene.add(clone)
    spriteArray.push(clone)
  }
  */


  //Init Popup
  popup(scene, camera, render, tower, spriteArray[spriteArray.length - 1]);

  //Ready to animate!
  fadeIn(0, () => {

    //Show Sprites
    spriteArray.forEach(g => {
      g.visible = true;
    });
    render();
      
  });


});

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
  continousRenderingRunning = shoudRender;
  render();
  animate();

}