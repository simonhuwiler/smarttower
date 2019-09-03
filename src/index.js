import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import data from './data.js';
import consts from './consts.js';
import helpers from './helpers.js';
import popup from './popup/popup.js'
import scroller from './scroller/scroller.js';
import sprites from './sprites';
import style from './style.css'

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


//Create Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 1 );
document.body.appendChild( renderer.domElement );

//Init Popup
popup(scene, camera);

var extrudeSettings = {
  steps: 1,
  depth: consts.geometryHeight,
  bevelEnabled: false,
  bevelThickness: 0,
  bevelSize: 0,
  bevelOffset: 0,
  bevelSegments: 0
};

function createSpider(index, values, color)
{
  //Calculate Points
  var points = []
  for(var i = 0; i < values.length; i++)
  {
    const x = Math.sin(helpers.deg2rad(helpers.angles[i])) * values[i] / 10
    const y = Math.cos(helpers.deg2rad(helpers.angles[i])) * values[i] / 10
    points.push({x: y, y: x})
  }
  points.push(points[0])

  //Create Shape
  var shape = new THREE.Shape();
  shape.moveTo(points[0].x, points[0].y)
  for(var i = 1; i < points.length -1; i++)
  {
    shape.lineTo(points[i].x, points[i].y);
  }

  //Create Geometry
  var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );

  //Create Material
  var material = new THREE.MeshPhongMaterial( { color: color } );
  //Create Mesh
  var mesh = new THREE.Mesh( geometry, material ) ;

  //Add Data
  mesh.userData = {index: index}
  mesh.visible = false;

  mesh.rotateX(90 * Math.PI / 180)

  return mesh;

}

//Create Spider;
for(var i = 0; i <= data.spider.length - 1; i++)
{
  var spider3d = createSpider(i, data.spider[i], consts.partyColor[data.profile[i].party]);
  spider3d.position.set(0, i * consts.geometryHeight, 0)
  data.profile[i].spider3d = spider3d;
  scene.add(spider3d);
}

//Init Scroller
scroller.initScroller(camera, data.profile.length * consts.geometryHeight + consts.cameraYOffset, continuousRenderer)
scroller.addZoomControl();

//Create Sprites
sprites.generateStrips(group => {
  //group.position.set(0, data.profile.length * consts.geometryHeight + 1, 0);
  group.position.set(0, 1, 0);
  scene.add(group);

  //Clone
  for(var i = 0; i < 5; i++)
  {
    var clone = group.clone();
    clone.position.set(0, data.profile.length * consts.geometryHeight / 5 * (i + 1), 0)
    scene.add(clone)
  }

  //PreRender
  render();
});


var currentIndex = 0;
function fadeIn()
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
  camera.lookAt(new THREE.Vector3(spider3d.position.x, spider3d.position.y, spider3d.position.z))

  render();
  if(currentIndex < data.profile.length - 2)
    setTimeout(fadeIn, 10)
  // else addOrbiter();

}

fadeIn();
// addOrbiter()

//Add Grid
var gridHelper = new THREE.GridHelper( 100, 100 );
scene.add( gridHelper );

//Light
var spotLight1 = new THREE.SpotLight( 0xffffff, 0.5 );
spotLight1.position.set( 30, 10, 10 );
 scene.add( spotLight1 );

var spotLight2 = new THREE.SpotLight( 0xffffff, 0.5 );
spotLight2.position.set( 30, 100, 10 );
scene.add( spotLight2 );

var ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add( ambientLight );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set(0, 10, 0)
scene.add( directionalLight );

camera.position.z = 30;
camera.position.x = 0;
camera.position.y = 0;


render();


function render()
{
  renderer.render( scene, camera );
}

var controls;

function addOrbiter()
{
  controls = new OrbitControls( camera, renderer.domElement );
  controls.update();
  animate();
}


function animate()
{
  if(continousRenderingRunning)
	  requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	//controls.update();

	renderer.render( scene, camera );

}

var continousRenderingRunning = false;
function continuousRenderer(shoudRender)
{
  continousRenderingRunning = shoudRender;
  render();
  animate();

}