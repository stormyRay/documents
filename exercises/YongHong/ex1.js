//M*N table/grid, from left-button to right-top, only can step right or up, determine the total way number

function waysOfGrid(xNum, yNum){
	if(xNum <= 1 || yNum <=1)
		return 1;
	var waysOn = function(x, y){
		if(x > xNum || y > yNum){
			return 1;
		} else {
			var xR = x + 1;
			var yR = y;
			var xU = x;
			var yU = y + 1;
			return (waysOn(xR, yR) + waysOn(xU, yU));
		}
	}

	return waysOn(1, 1);
}

console.log(waysOfGrid(1, 2));
console.log(waysOfGrid(2, 2));
console.log(waysOfGrid(5, 5));
