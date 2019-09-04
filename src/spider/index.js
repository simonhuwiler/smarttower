import * as THREE from 'three';
import data from '../data.js';
import consts from '../consts.js';
import helpers from '../helpers.js'

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

  if(!color)
    console.info('Unknown Color for party', data.profile[index])

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

function createTower()
{
  var towerGroup = new THREE.Group();
  //Create Spider;
  for(var i = 0; i <= data.spider.length - 1; i++)
  {
    var spider3d = createSpider(i, data.spider[i], consts.partyColor[data.profile[i][consts.profile['party']]]);
    spider3d.position.set(0, i * consts.geometryHeight, 0)
    data.profile[i].spider3d = spider3d;
    towerGroup.add(spider3d)
  }
  return towerGroup;
}

export default {
  createTower: createTower
}
