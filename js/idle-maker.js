var idleMaker = {
    resources: {},
    gameObjects: [],
    gameLoop: null,
    updateInterval: 50,
    start: function (jqResourceContainer) {
        // Build resource elements
        for(var key in idleMaker.resources){
            var resource = idleMaker.resources[key];
            resource.jqElement = $('<div class="im-resource">');
            resource.jqElement.html(resource.name + ": " + getPrettyNumberString(resource.amount));
            jqResourceContainer.append(resource.jqElement);
        }

        // Start the game loop with the given update interval
        idleMaker.gameLoop = setInterval(idleMaker.update, idleMaker.updateInterval);
    },
    update: function () {
        var deltaTime = idleMaker.updateInterval;

        // Update all game objects
        for(var index in idleMaker.gameObjects) {
            var object = idleMaker.gameObjects[index];
            object.update(deltaTime);
        }

        // Update all resources
        for(var key in idleMaker.resources) {
            var resource = idleMaker.resources[key];
            resource.jqElement.html(resource.name + ": " + getPrettyNumberString(resource.amount)); 
        }
    }
}

function GameObject (options) {
    var defaults = {
        jqParent: null,
        name: "No name",
        count: 0,
        enabled: false,
        hidden: false,
        cost: [],
        updateCost: [],
        updateGain: [],
        multipliers: []
    };
    
    var settings = $.extend( {}, defaults, options );

    for(var key in settings) {
        this[key] = settings[key];
    }

    idleMaker.gameObjects.push(this);

    if(!this.hidden) {
        this.jqElement = $('<div class="im-object">');

        this.jqElement.append($('<p class="im-text">'));

        this.updateText();

        this.jqElement.on('click', function () {
            this.buy(1);
            this.updateText();
            this.updateDescription();
        }.bind(this));

        if(!this.enabled) {
            this.jqElement.hide();
        }

        this.jqParent.append(this.jqElement);


        var jqDescription = $('<div class="im-description">');

        this.jqElement.append(jqDescription);

        this.updateDescription();
    }

    for(var index in this.updateGain) {
        var resource = this.updateGain[index].type;
        if(idleMaker.resources[resource.name] === undefined) {
            idleMaker.resources[resource.name] = resource;
            resource.amount = 0;
        }
    }
}

GameObject.prototype = {
    buy: function (count) {
        var resources = idleMaker.resources;
        var canBuy = true;
        for(var resourceIndex in this.cost) {
            var resource = this.cost[resourceIndex];

            // If an insufficient amount of the resource exists 
            if(resources[resource.type.name].amount < resource.getValue(this)) {
                canBuy = false;
            }
        }

        if(canBuy) {
            // Pay costs
            for(var resourceIndex in this.cost) {
                var resource = this.cost[resourceIndex];

                resources[resource.type.name].amount -= resource.getValue(this);
            }

            this.count++;
        }
    },
    enable: function () {
        this.jqElement.show();  
    },
    update: function (deltaTime) {
        var resources = idleMaker.resources;
        var delta = deltaTime / 1000;
        for(var i = 0; i<this.count; i++){
            var canUpdate = true;
            for(var resourceIndex in this.updateCost) {
                var resource = this.updateCost[resourceIndex];

                // If an insufficient amount of the resource exists 
                if(resources[resource.type.name].amount * delta < resource.value * delta) {
                    canUpdate = false;
                }
            }

            if(canUpdate) {
                // Pay update costs
                for(var resourceIndex in this.updateCost) {
                    var resource = this.updateCost[resourceIndex];

                    resources[resource.type.name].amount -= resource.value * delta;
                }

                // Receive update gains
                for(var resourceIndex in this.updateGain) {
                    var resource = this.updateGain[resourceIndex];

                    // Calculate total multiplier from other objects
                    var totalMultiplier = 1;
                    for(var objectIndex in idleMaker.gameObjects) {
                        var object = idleMaker.gameObjects[objectIndex];
                        totalMultiplier *= object.getMultiplier(this);
                    }

                    resources[resource.type.name].amount += resource.value * totalMultiplier * delta;
                }
            }
        }
    },
    getMultiplier: function (object) {
        var totalMultiplier = 1;
        for(var index in this.multipliers) {
            var multiplier = this.multipliers[index];
            if(multiplier.target == object) {
                for(var i = 0; i < this.count; i++) {
                    totalMultiplier *= multiplier.value;
                }
            }
        }
        return totalMultiplier;
    },
    updateText: function () {
        var text = this.name;
        text += this.count > 0 ? " (" + this.count + ")" : "";
        this.jqElement.find('.im-text').html(text);
    },
    updateDescription: function () {
        var jqDescription = this.jqElement.find('.im-description');

        jqDescription.empty();

        jqDescription.append($('<p>Costs:</p>'));

        for(var index in this.cost) {
            var resource = this.cost[index];
            jqDescription.append($('<span class="im-name">' + resource.type.name + '</span>'));
            jqDescription.append($('<span class="im-value">' + getPrettyNumberString(resource.getValue(this)) + '</span>'));
        }

        if(this.updateCost.length > 0) {
            jqDescription.append($('<br /><hr />'));

            jqDescription.append($('<p>Consumes:</p>'));

            for(var index in this.updateCost) {
                var resource = this.updateCost[index];
                jqDescription.append($('<span class="im-name">' + resource.type.name + '</span>'));
                jqDescription.append($('<span class="im-value">' + getPrettyNumberString(resource.value) + "/s" + '</span>'));
            }
        }

        if(this.updateGain.length > 0) {
            jqDescription.append($('<br /><hr />'));

            jqDescription.append($('<p>Produces:</p>'));

            for(var index in this.updateGain) {
                var resource = this.updateGain[index];
                jqDescription.append($('<span class="im-name">' + resource.type.name + '</span>'));
                jqDescription.append($('<span class="im-value">' + getPrettyNumberString(resource.value) + "/s" + '</span>'));
            }
        }

        if(this.multipliers.length > 0) {
            jqDescription.append($('<br /><hr />'));

            jqDescription.append($('<p>Improves:</p>'));

            for(var index in this.multipliers) {
                var multiplier = this.multipliers[index];
                jqDescription.append($('<span class="im-name">' + multiplier.target.name + '</span>'));
                jqDescription.append($('<span class="im-value">' + getPrettyNumberString(multiplier.value) + "x" + '</span>'));
            }
        }
    }
};

function ResourceCost(type, value, growthFunction) {
    this.type = type;
    this.value = value;
    
    if(growthFunction) {
        this.growthFunction = growthFunction;
    } else {
        this.growthFunction = RESOURCE_GROWTH.STANDARD_EXP;
    }
}

ResourceCost.prototype = {
    getValue: function (gameObject){
        return this.growthFunction(gameObject, this);
    }
}

function ResourceChange(type, value) {
    this.type = type;
    this.value = value;
}

function Multiplier(target, value) {
    this.target = target;
    this.value = value;
}

var RESOURCE_GROWTH = {
    STANDARD_EXP: function (object, cost) {
        return cost.value * Math.pow(1.15, object.count);
    },
    NONE: function (object, cost) {
        return cost.value;
    }
}

function getPrettyNumberString(number) {
    var numberStringWithoutComma = Math.round(number * 100) + "";
    return numberStringWithoutComma.slice(0, numberStringWithoutComma.length - 2) + "." + numberStringWithoutComma.slice(numberStringWithoutComma.length - 2);
}