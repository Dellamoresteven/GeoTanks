class Drop{
	constructor(data){
		// {type: 2, rare: 1, locationX: 304, locationY: 138}
		this.type = data.type;
		this.rare = data.rare;
		this.x = data.locationX;
		this.y = data.locationY;
	}

	displayDrop(x ,y){
		push();
		if(this.type == 0){
			fill(0,0,255,255);
			rect(this.x, this.y, 30,45);
			fill(255);
	  		text("D", this.x, this.y);
		}else if(this.type == 1){
			fill(0,255,0,255);
			rect(this.x, this.y, 30,45);
			fill(255);
	  		text("U", this.x, this.y);
		}else if(this.type == 2){
			fill(255,0,0,255);
			rect(this.x, this.y, 30,45);
			fill(255);
	  		text("A", this.x, this.y);
		}
		pop();
	}
}