
//
//Code to generate random circle set
//

//Function for random int
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//Arrays for circles and colors
var circles = [];
var colors = ["cyan", "steelblue", "red", "green", "yellow", "maroon", "pink", "grey", "orange", "purple"];

//Fill circles array with random circles
for (i = 0; i < 2000; i++) {
	y = Math.max(50, getRandomInt(10000)),
	x = 400,
	r = Math.max(5, getRandomInt(20))
	fill = colors[getRandomInt(8)];
	circles.push({
		"id": i,
		"y": y,
		"x": x,
		"r": r,
		"fill": fill
	})
}

//Sort circles based on y value
circles.sort(function(a, b){
   return d3.ascending(a.y, b.y);
})


//
//Set up variables
//

var clearedCircles = [];
var collisionCircles = [];
var searchedCircles = [];
var padding = 5;


//
//Set up functions
//

//Function to find place to plot a circle around another one
function searchOptions(c1, c2) {
	var rad = 0, error = 0;
	for (rad = 0; rad <= 360; rad++) {
		var error = 0;
		x2 = c1.x + (c1.r + c2.r + padding) * Math.sin(2 * Math.PI * rad / 360)
		y2 = c1.y + (c1.r + c2.r + padding) * Math.cos(2 * Math.PI * rad / 360)

		//If there is a collision with clearedCircles
		clearedCircles.forEach(function(c) {
			
			collision = collisionDetection(c.x, c.y, (c.r + (padding / 2)), x2, y2, c2.r)
			if (collision) {
				error++;
			}
		})
		if (error == 0) {
			return [x2, y2];
		}
		
		if (rad == 360 && error > 0) {
			searchedCircles.push(c1.id);
			var dxy, newCircle;
			clearedCircles.forEach(function(a) {
				if (searchedCircles.indexOf(a.id) == -1) {
					dx = Math.abs(a.x - c2.x);
					dy = Math.abs(a.y - c2.y);
					dxyNew = dx + dy;
					if (!dxy || dxyNew < dxy) {
						dxy = dxyNew;
						newCircle = a;
					}						
				}
			});
			return searchOptions(newCircle, c2)
		}
	}
}


//Check if a collision between two circles exists
function collisionDetection(x1, y1, r1, x2, y2, r2) {
	var dx = x2 - x1;
	var dy = y2 - y1;
	var L = Math.sqrt(dx*dx + dy*dy);

	var step = r1 + r2 - L;

	if (step > 0) {
		return true;
	}
	else {
		return false;
	}
}



//Function to draw the graph
function draw(force, svg) {
	var chart = d3.select(svg)
	//Loop through circles
	for (c = 0; c < circles.length ; c++) {
		if (force) {
			//If a circle has been appended
			if (clearedCircles.length > 0) {
				//Loop through the appended circles
				var d = 1;
				collisionCircles = [];
				clearedCircles.forEach(function(a) {
					var collisionCircles = [];
					//If a collision is detected
					if(collisionDetection(a.x, a.y, a.r, circles[c].x, circles[c].y, circles[c].r)) {
						collisionCircles.push(a);

						//Search for new options
						search = searchOptions(collisionCircles[0], circles[c]);
						circles[c].x = search[0];
						circles[c].y = search[1];
						
						chart.append("circle")
							.attr("cx", circles[c].x)
							.attr("cy", circles[c].y)
							.attr("r", circles[c].r)
							.attr("fill", circles[c].fill)
							.attr("id", circles[c].id)
						chart.append("text")
							.attr("x", circles[c].x)
							.attr("y", circles[c].y)
							.text(c)
						clearedCircles.push(circles[c])	
					}
					//If no collision is detected, append the circle
					else {
						if (d == clearedCircles.length) {
							chart.append("circle")
								.attr("cx", circles[c].x)
								.attr("cy", circles[c].y)
								.attr("r", circles[c].r)
								.attr("fill", circles[c].fill)
								.attr("id", circles[c].id)
							chart.append("text")
								.attr("x", circles[c].x)
								.attr("y", circles[c].y)
								.text(c)
							clearedCircles.push(circles[c])
						}
					}
					d++;
				})
			}
			//Else if its the first circle, append it
			else {
				chart.append("circle")
					.attr("cx", circles[c].x)
					.attr("cy", circles[c].y)
					.attr("r", circles[c].r)
					.attr("fill", circles[c].fill)
					.attr("id", circles[c].id)
				chart.append("text")
					.attr("x", circles[c].x)
					.attr("y", circles[c].y)
					.text(c)
				clearedCircles.push(circles[c])
			}
		}
		else {
			chart.append("circle")
				.attr("cx", circles[c].x)
				.attr("cy", circles[c].y)
				.attr("r", circles[c].r)
				.attr("fill", circles[c].fill)
				.attr("id", circles[c].id)
			chart.append("text")
				.attr("x", circles[c].x)
				.attr("y", circles[c].y)
				.text(c)
		}
	}
}


//
//Draw two charts to compare
//


draw(false, "#chart2");
draw(true, "#chart");
