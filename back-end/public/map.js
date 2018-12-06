class MapObjects {
    renderObj(type, x, y, size) {
        push();
        translate(x, y);
        switch (type) {
            case 1: // Basic Tree
                noStroke();
                fill(169, 169, 169, 255);
                ellipse(0, 30, size / 500, size / 500);
                break;
            case 2:
                fill("#C0C0C0");
                stroke(127, 127, 127);
                strokeWeight(4);
                ellipse(0, 0, 80, 80);
                fill("#A9A9A9");
                ellipse(7, 7, 20, 20);
                fill("#7CFC00");
                break;
            case 3:
                image(astroids[0], 0, 0, astroids[0].width/1.5, astroids[0].height/1.5)
                break;
            case 4:
                fill("#C0C0C0");
                stroke(127, 127, 127);
                strokeWeight(4);
                ellipse(0, 0, 80, 80);
                fill("#A9A9A9");
                fill("#7CFC00");
                for (let i =1; i < 4; i++) {
                    ellipse(7*i, 7*i, 10*i, 10*i);
                    ellipse(-7*i, -7*i, 10*i, 10*i);
                    ellipse(7*i, -7*i, 10*i, 10*i);
                    ellipse(-7*i, 7*i, 10*i, 10*i);
                }
                fill("#7CFC00");
                break;
        }
        pop();
    }

    renderMap() {
        terrains = [];
        for (let i = 0; i < randomNumList.length; i += 3) {
            if (((tank.x + (windowWidth / 2)) > randomNumList[i]) && ((tank.x - (windowWidth / 2)) < randomNumList[i])) {
                if (((tank.y + (windowHeight / 2)) > randomNumList[i + 1]) && ((tank.y - (windowHeight / 2)) < randomNumList[i + 1])) {
                    this.renderObj(1, randomNumList[i], randomNumList[i + 1], randomNumList[i + 3]);
                }
            }
        }
        // for (let i = 0; i < 30; i += 3) {
        //     if (((tank.x + (windowWidth / 2)) > randomNumList[i]) && ((tank.x - (windowWidth / 2)) < randomNumList[i])) {
        //         if (((tank.y + (windowHeight / 2)) > randomNumList[i + 1]) && ((tank.y - (windowHeight / 2)) < randomNumList[i + 1])) {
        //             this.renderObj(3, randomNumList[i], randomNumList[i + 1], randomNumList[i + 3]);
        //         }
        //     }
        // }

        for (let i = 0; i < asteroids.length; i++) {
            if (((tank.x + (windowWidth / 2)) > asteroids[i].x) && ((tank.x - (windowWidth / 2)) < asteroids[i].x)) {
                if (((tank.y + (windowHeight / 2)) > asteroids[i].y) && ((tank.y - (windowHeight / 2)) < asteroids[i].y)) {
                    console.log(asteroids[i].type);
                    if (asteroids[i].type == 3) {
                        this.renderObj(3, asteroids[i].x, asteroids[i].y, asteroids[i].hitbox);
                    } else {
                        this.renderObj(4, asteroids[i].x, asteroids[i].y, asteroids[i].hitbox);
                    }
                    terrains.push(asteroids[i]);
                }
            }
        }
    }
}