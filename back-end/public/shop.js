function displayShop() {
    push();
    fill(0, 200, 255, 70);
    rect(tank.x, tank.y, 600, 400, 100);
    let splacingX = 0;
    let splacingY = 0;

    fill(0, 200, 255, 70);
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 2; j++) {
            rect(tank.x - 115 + splacingX, tank.y - 120 -  splacingY, 100, 50, 10);
            splacingX += 220;
        }
        splacingY -= 75;
        splacingX = 0;
    }
    pop();
    push();
    textSize(20);
    fill(211, 211, 211)
    text("Rocket", tank.x - 155, tank.y - 115);
    // fill("#FFD700");
    // text("95", tank.x - 260, tank.y - 95)
    pop();
}