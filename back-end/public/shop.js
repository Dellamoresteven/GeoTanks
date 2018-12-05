function displayShop() {
    push();
    fill(50, 50, 50, 100);
    rect(tank.x, tank.y, 600, 400, 100);
    fill(50, 50, 50, 150);
    rect(tank.x - 200, tank.y - 100, 100, 50, 10);
    pop();
}