import * as THREE from 'three';
import helpers from '../helpers.js'




function generateStripes(callback)
{

  const texturesToLoad = ["sprites/spider.png"
  , "sprites/offene_aussenpolitik.png"
  , "sprites/liberale_wirtschaftspolitik.png"
  , "sprites/restriktive_finanzpolitik.png"
  , "sprites/law_order.png"
  , "sprites/restriktive_migrationspolitik.png"
  , "sprites/ausgebauter_umweltschutz.png"
  , "sprites/ausgebauter_sozialstaat.png"
  , "sprites/liberale_gesellschaft.png"
];
  var textures = [];

  var loader = new THREE.TextureLoader();

  //Texture Loader for multiple textures
  const loadTextures = (cb) => loader.load(texturesToLoad[textures.length], tex => {
    textures.push(tex);
    if(textures.length < texturesToLoad.length)
    {
      loadTextures(cb);
    }
    else
    {
      cb();
    }
  });

  loadTextures(() => {
    var group = new THREE.Group();

    //Create spidergrid
    var spidergrid_geometry = new THREE.PlaneBufferGeometry( 20, 20 );
    var spidergrid_material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BackSide});
    spidergrid_material.transparent = true;
    spidergrid_material.map = textures[0];
    spidergrid_material.needsUpdate = true;  
    var spidergrid_mesh = new THREE.Mesh( spidergrid_geometry, spidergrid_material );
    group.add(spidergrid_mesh)

    function addSprite(texture, circlePosition)
    {
      //Create SpriteMap
      var spriteMaterial = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
      var sprite = new THREE.Sprite( spriteMaterial );
      sprite.scale.set(5,5)


      const x = Math.sin(helpers.deg2rad(helpers.angles[circlePosition])) * 16
      const y = Math.cos(helpers.deg2rad(helpers.angles[circlePosition])) * 16
      sprite.position.set(x, y, 0)

      return sprite;
    }

    //Add Labels
    group.add(addSprite(textures[1], 2))
    group.add(addSprite(textures[2], 1))
    group.add(addSprite(textures[3], 0))
    group.add(addSprite(textures[4], 7))
    group.add(addSprite(textures[5], 6))
    group.add(addSprite(textures[6], 5))
    group.add(addSprite(textures[7], 4))
    group.add(addSprite(textures[8], 3))

    group.rotateX(90 * Math.PI / 180)

    callback(group)
  });

}

export default {
  generateStripes: generateStripes
}