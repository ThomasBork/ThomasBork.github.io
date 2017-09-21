function GameElement (x, y, width, height, imageUrl) {
    // Set up object properties
	this.x = x;
	this.y = y;
    this.width = width;
	this.height = height;
	this.dx = 0;
	this.dy = 0;
	this.imageUrl = imageUrl;
	this.image = new Image();
	this.imageLoaded = false;
	this.children = [];
	this.parent = null;

    // Set up a callback to the onload event on image
	this.image.onload = function () {
		this.imageLoaded = true;
	}.bind(this); // Binding "this" to the function, so it can refer to this element.

    // Start loading the image
	this.image.src = "res/" + imageUrl + ".png";
}

// Updates the position of the element relative to time elapsed since last update.
GameElement.prototype.updatePosition = function (deltaTime) {
    this.x += this.dx * deltaTime;
    this.y += this.dy * deltaTime;
};

// Draws the image on the given context if the image is loaded.
GameElement.prototype.draw = function (context) {
	if(this.imageLoaded) {
		context.drawImage(this.image, this.x * canvas.width, this.y * canvas.height, this.width * canvas.width, this.height * canvas.height);
	}

	// Draw children
	for(var index in this.children) {
		this.children[index].draw(context);
	}
};

// Returns whether this element collides with the given element.
GameElement.prototype.collidesWith = function (element) {
	if(
		this.x < element.x + element.width && 
		element.x < this.x + this.width && 
		this.y < element.y + element.height && 
		element.y < this.y + this.height 
	) {
		return true;
	}
	return false;
};

// Returns whether this element contains the given point.
GameElement.prototype.containsPoint = function (x, y) {
	x = x / canvas.width;
	y = y / canvas.height;
    if(
        this.x <= x && x <= this.x + this.width &&
        this.y <= y && y <= this.y + this.height
    ) {
        return true;
    }
    return false;
};

// Adds an element to the array of children
GameElement.prototype.addChild = function (element) {
	this.children.push(element);
	element.parent = this;
};