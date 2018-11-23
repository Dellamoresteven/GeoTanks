/**
 * 0 - Armour Basic
 * 1 - Basic SMG
 * 2 - MG
 * 3 - Heavy MG
 * 4 - Armor level 2
 * 5 - armor level 3
 */

class Drop {
    constructor(data) {
        // {type: 2, rare: 1, locationX: 304, locationY: 138}
        this.type = data.type;
        this.rare = data.rare;
        this.x = data.locationX;
        this.y = data.locationY;
        this.imgA = loadImage("jpgs/MachineGun_Basic.png");
        this.imgD = loadImage("jpgs/Basic_Armor.png");
        this.imgDD = loadImage("jpgs/Armor_Level_2.png");
        this.imgDDD = loadImage("jpgs/Armor_Level_3.png");
        this.imgAA = loadImage("jpgs/LightMachineGun.png");
        this.imgAAA = loadImage("jpgs/Heavy_MG.png");
    }

    displayDrop() {
        push();
        if (this.type == 0) {
            image(this.imgD, this.x, this.y, this.imgD.width / 5, this.imgD.height / 5);
        } else if (this.type == 1) {
            image(this.imgAA, this.x, this.y, this.imgAA.width / 5, this.imgAA.height / 5);
        } else if (this.type == 2) {
            image(this.imgA, this.x, this.y, this.imgA.width / 3, this.imgA.height / 3);
        } else if (this.type == 3) {
            image(this.imgAAA, this.x, this.y, this.imgAAA.width / 4, this.imgAAA.height / 4);
        } else if (this.type == 4) {
            image(this.imgDD, this.x, this.y, this.imgDD.width / 5, this.imgDD.height / 5);
        } else if (this.type == 5) {
            image(this.imgDDD, this.x, this.y, this.imgDDD.width / 3, this.imgDDD.height / 3);
        }
        pop();
    }

    checkDrops(x, y) {
        if (dist(x, y, this.x + 40, this.y + 40) < 40) {
            if (this.type == 0) {
            	tank.armor += 50;
            } else if (this.type == 1) {

            } else if (this.type == 2) {

            } else if (this.type == 3) {

            } else if (this.type == 4) {
            	tank.armor += 75;
            } else if (this.type == 5) {
            	tank.armor += 100;
            }
            return this.type;
        } else {
            return -1;
        }
    }
}