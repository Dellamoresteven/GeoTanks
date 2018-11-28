class MapObjects {
    renderObj(type, x, y) {
        push();
        translate(x, y);
        switch (type) {
            case 1: // Basic Tree
                noStroke();
                fill("#336600");
                for (var i = 0; i < 10; i++) {
                    ellipse(0, 30, 40, 80);
                    rotate(PI / 5);
                }
                fill("#663300");
                for (var i = 0; i < 10; i++) {
                    ellipse(0, 0, 20, 40);
                    rotate(PI / 4);
                }
                break;
            case 2:
                fill("#C0C0C0");
                stroke(127, 127, 127);
                strokeWeight(4);
                ellipse(0, 0, 80, 80);
                fill("#A9A9A9");
                ellipse(7, 7, 20, 20);
                fill("#7CFC00"); 
        }
        pop();
    }
    renderMap() {
        this.renderObj(1, 500, 500);
        this.renderObj(1, 75, 300);
        this.renderObj(1, 900, 200);
        this.renderObj(1, 900, 700);
        this.renderObj(2, 700, 200);
        this.renderObj(2, 200, 700);
        this.renderObj(2, 200, 500);
        this.renderObj(2, 1200, 500);
    }
}