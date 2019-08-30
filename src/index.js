import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


//restriktive_finanzpolitik	liberale_wirtschaftspolitik	offene_aussenpolitik	liberale_gesellschaft	ausgebauter_sozialstaat	ausgebauter_umweltschutz	restriktive_migrationspolitik	law_order
var spider = [39.671123, 36.389095, 61.155204, 69.786063, 68.795720, 77.838097, 24.622771, 36.363786]

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );

var x = 0, y = 0;
var angles = []
console.log(spider.length)
for(var i = 0; i < spider.length; i++)
{
  // angles.push(i / spider.length * 2 * Math.PI)
  angles.push(360 / spider.length * i)
}
angles.push(angles[0])
console.log(angles)

function deg2rad(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

// spider.push(spider[0]);
var points = []
for(var i = 0; i < spider.length; i++)
{
  //b = x
  //a = y
  // const a = spider[i] * Math.sin(angles[i]);
  // const b = Math.sqrt(Math.pow(a, 2) * -1 + Math.pow(spider[i], 2))
  // points.push({x: b, y: a})

  const x = Math.sin(deg2rad(angles[i])) * spider[i]
  const y = Math.cos(deg2rad(angles[i])) * spider[i]
  // points.push({x: x, y: y})
  points.push({x: y, y: x})
}
points.push(points[0])


console.log(points)
var s = ""
points.forEach(p => {
  s += p.x +','+ p.y + '\n'
})
console.log(s)

var shape = new THREE.Shape();
shape.moveTo(points[0].x, points[0].y)
for(var i = 1; i < points.length -1; i++)
{
  shape.lineTo(points[i].x, points[i].y);
}
var geometry = new THREE.ShapeGeometry( shape );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var mesh = new THREE.Mesh( geometry, material ) ;
scene.add( mesh );


var heartShape = new THREE.Shape();

heartShape.moveTo( 0, 0 );
heartShape.lineTo( 10, 0 );
heartShape.lineTo( 10, 10 );
heartShape.lineTo( 0, 10 );
heartShape.lineTo( 0, 0 );

// var geometry = new THREE.ShapeGeometry( heartShape );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var mesh = new THREE.Mesh( geometry, material ) ;
// scene.add( mesh );

//Light
var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );

scene.add( light );

camera.position.z = 200;
camera.position.x = 2;
camera.position.y = 2;


	renderer.render( scene, camera );


// var controls = new OrbitControls( camera, renderer.domElement );
// controls.update();


// function animate() {

// 	requestAnimationFrame( animate );

// 	// required if controls.enableDamping or controls.autoRotate are set to true
// 	controls.update();

// 	renderer.render( scene, camera );

// }

// animate();