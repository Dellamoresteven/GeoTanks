class ability {
	constructor(tankType, active) {
		this.passive = this.setPassive(tankType);
		this.active = this.setActive(tankType, active);
	}

	setActive(tankType, active) {
		console.log(tankType);
		console.log(active);
		if (tankType == "Bruser") {
			if (active == 0) {
				return 0;
			} else if (active == 1) {
				return 1;
			} else {
				return -1;
			}
		} else if (tankType == "Scout") {
			if (active == 0) {
				return 2;
			} else if (active == 1) {
				return 3;
			} else {
				return -1;
			}
		}
	}

	setPassive(tankType) {
		if (tankType == "Bruser") {
			return 0;
		} else if (tankType == "Scout") {
			return 1
		} else {
			return -1;
		}
	}

	useActive() {
		switch (this.active) {
			case 0:
				for (let i = 1; i < 6; i++) {
					for (let j = 1; j < 7; j++) {
						let intervalX = Math.cos(j*PI/3) * i/4.00;
						let intervalY = Math.sin(j*PI/3) * i/4.00;
						tank.bullets.push(new bullet(0, tank.x, tank.y, intervalX, intervalY, tank.angle));
				        let dataBullet = {
				            socketID: socketID,
				            type: 0,
				            x: tank.bullets[tank.bullets.length - 1].x,
				            y: tank.bullets[tank.bullets.length - 1].y,
				            intervalX: tank.bullets[tank.bullets.length - 1].intervalX,
				            intervalY: tank.bullets[tank.bullets.length - 1].intervalY,
				            angle: tank.angle
				        }
				        // console.log(dataBullet);
				        socket.emit('bulletShot', dataBullet);
					}
				}
				break;
			case 1:
				
			case 2:
			case 3:
		}
	}
}