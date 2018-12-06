function displayShop() {
    push();
    fill(0, 200, 255, 70);
    rect(tank.x, tank.y, 600, 400, 100);
    let splacingX = 0;
    let splacingY = 0;

    fill(0, 200, 255, 70);
    // for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 2; j++) {

            ellipse((tank.x - 115 + splacingX), tank.y - 120 - splacingY, 100, 50, 10);
            console.log(mouseX + ":" + mouseY)
            if (dist(tank.x - 115 + splacingX , tank.y - 120 - splacingY , mouseX, mouseY) < 50) {
                // if ((mouseY > (tank.y - 120 - splacingY)) && (mouseX < (tank.y - 120 - splacingY + 100))) {
                    rect(tank.x - 115 + splacingX, tank.y - 120 - splacingY, 100, 50, 10);
                // }
            }
            splacingX += 220;
        }
        splacingY -= 75;
        splacingX = 0;
    // }
    pop();
    push();
    textSize(20);
    fill(211, 211, 211)
    text("Lazers", tank.x - 155, tank.y - 115);
    pop();
    //Rockets

    // if (mouseX > 442 && mouseX < 604) {
    //     if (mouseY > 142 && mouseY < 218) {
    // if(mouseIsPressed){
    //     console.log(mouseX +":" + mouseY)
    //     if(tank.weps.indexOf(1) == -1){
    //         if(tank.points >= 50){
    //             fill(0, 200, 255, 70);
    //             rect(tank.x - 115, tank.y - 120)
    //             tank.weps.push(1);
    //             tank.points -= 50;
    //         }
    //     }
    // }
    //     }
    // }
}