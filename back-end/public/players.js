/*
{ x: 720,
  y: 259.5,
  angle: 3.988891283425406,
  bullets: [],
  weps: [],
  utility: [],
  health: 100,
  armor: 50,
  TankBody: 
   { width: 758,
     height: 758,
     canvas: {},
     drawingContext: {},
     _pixelDensity: 1,
     _modified: false,
     _pixelsDirty: true,
     pixels: [],
     modified: true },
  TankTop: 
   { width: 266,
     height: 536,
     canvas: {},
     drawingContext: {},
     _pixelDensity: 1,
     _modified: false,
     _pixelsDirty: true,
     pixels: [],
     modified: true },
  TankAngle: 0,
  TankStatus: true }
*/
class Players {
    constructor(data) {

        this.socketID = data.socketID;
        this.x = data.x;
        this.y = data.y;
        this.ang = data.angle;
        this.bulletss = data.bullets;
        this.TankAng = data.TankAngle;
        // this.moX = data.tank.moX;
        // this.moY = data.tank.moY;
        // this.health = data.tank.health;
        // this.armor = data.tank.armor;
        // this.weps = data.tank.weps;
        // this.utility = data.tank.utility;
        this.TankStatus = data.TankStatus;
        this.ang += PI / 2;
        this.updated = true;
        this.preX = 0;
        this.preY = 0;
    }
    settank(data) {
        this.updated = true;
        this.preX = data.x - this.x;
        this.preY = data.y - this.y;
        console.log(this.preX + ":" + this.preY);
        // console.log(this.preY);
        this.socketID = data.socketID;
        this.x = data.x;
        this.y = data.y;
        this.ang = data.angle;
        this.bulletss = data.bullets;
        this.TankAng = data.TankAngle;
        // this.moX = data.tank.moX;
        // this.moY = data.tank.moY;
        // this.health = data.tank.health;
        // this.armor = data.tank.armor;
        // this.weps = data.tank.weps;
        // this.utility = data.tank.utility;
        this.TankStatus = data.TankStatus;
        this.angle += PI / 2;
    }
}