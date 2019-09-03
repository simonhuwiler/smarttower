exports.deg2rad = function(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

exports.angles = [0, 45, 90, 135, 180, 225, 270, 315, 0];
/*
//If you need to calculate anlges on the fly:
var angles = []
for(var i = 0; i < 8; i++)
{
  // angles.push(i / spider.length * 2 * Math.PI)
  angles.push(360 / 8 * i)
}
angles.push(angles[0])
*/