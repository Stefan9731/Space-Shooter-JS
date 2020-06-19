/**
 * 
 * @authors John Flynn, Stefan Ignat
 * This is a space shooter game designed to be played in an internet browser
 * 
 */
/* 

------------------------------
------- INPUT SECTION -------- 
------------------------------
*/

/**
 * This class binds key listeners to the window and updates the controller in attached player body.
 * 
 * @typedef InputHandler
 */
class InputHandler {
	key_code_mappings = {
		button: {
			32: {key: 'space', state: 'action_1'}
		},
		axis: {
			68: {key: 'right', state: 'move_x', mod: 1},
			65: {key: 'left', state: 'move_x', mod: -1},
			87: {key: 'up', state: 'move_y', mod: -1},
			83: {key: 'down', state: 'move_y', mod: 1}
		}
	};
	player = null;

	constructor(player) {
		this.player = player;

		// bind event listeners
		window.addEventListener("keydown", (event) => this.keydown(event), false);
		window.addEventListener("keyup", (event) => this.keyup(event), false);
	}

	/**
	 * This is called every time a keydown event is thrown on the window.
	 * 
	 * @param {Object} event The keydown event
	 */
	keydown(event) {
		this.player.raw_input[event.keyCode] = true;
	}

	/**
	 * This is called every time a keyup event is thrown on the window.
	 * 
	 * @param {Object} event The keyup event
	 */
	keyup(event) {
		delete this.player.raw_input[event.keyCode];
	}

	resetController() {
		// reset all buttons to false
		for (let mapping of Object.values(this.key_code_mappings.button)) {
			this.player.controller[mapping.state] = false;
		}

		// reset all axis to zero
		for (let mapping of Object.values(this.key_code_mappings.axis)) {
			this.player.controller[mapping.state] = 0;
		}
	}

	pollController() {
		this.resetController();

		// poll all bound buttons
		for (let [key_code, mapping] of Object.entries(this.key_code_mappings.button)) {
			if (this.player.raw_input[key_code] === true) {
				this.player.controller[mapping.state] = true;
			}
		}

		// poll all bound axis
		for (let [key_code, mapping] of Object.entries(this.key_code_mappings.axis)) {
			if (this.player.raw_input[key_code] === true) {
				this.player.controller[mapping.state] += mapping.mod;
			}
		}
	}
}

/* 
------------------------------
------- BODY SECTION  -------- 
------------------------------
*/

/**
 * Represents a basic physics body in the world. It has all of the necessary information to be
 * rendered, checked for collision, updated, and removed.
 * 
 * @typedef Body
 */
class Body {
	position = {x: 0, y: 0};
	velocity = {x: 0, y: 0};
	size = {width: 10, height: 10};
	health = 100;

	/**
	 * Creates a new body with all of the default attributes
	 */
	constructor() {
		// generate and assign the next body id
		this.id = running_id++;
		// add to the entity map
		entities[this.id] = this;
	}

	/**
	 * @type {Object} An object with two properties, width and height. The passed width and height
	 * are equal to half ot the width and height of this body.
	 */
	get half_size() {
		return {
			width: this.size.width / 2,
			height: this.size.height / 2
		};
	}

	/**
	 * @returns {Boolean} true if health is less than or equal to zero, false otherwise.
	 */
	isDead() {
		return this.health <= 0;
	}

	/**
	 * Updates the position of this body using the set velocity.
	 * 
	 * @param {Number} delta_time Seconds since last update
	 */
	update(delta_time) {
		// move body
		this.position.x += delta_time * this.velocity.x;
		this.position.y += delta_time * this.velocity.y;
	}

	/**
	 * This function draws a green line in the direction of the body's velocity. The length of this
	 * line is equal to a tenth of the length of the real velocity
	 * 
	 * @param {CanvasRenderingContext2D} graphics The current graphics context.
	 */
	draw(graphics) {
		graphics.strokeStyle = '#00FF00';
		graphics.beginPath();
		graphics.moveTo(this.position.x, this.position.y);
		graphics.lineTo(this.position.x + this.velocity.x / 10, this.position.y + this.velocity.y / 10);
		graphics.stroke();
	}

	/**
	 * Marks this body to be removed at the end of the update loop
	 */
	remove() {
		queued_entities_for_removal.push(this.id);
	}
}

/**
 * Represents an player body. Extends a Body by handling input binding and controller management.
 * 
 * @typedef Player
 */
class Player extends Body {
	// this controller object is updated by the bound input_handler
	controller = {
		move_x: 0,
		move_y: 0,
		action_1: false
	};
	raw_input = {};
	speed = 100;
	input_handler = null;

	/**
	 * Creates a new player with the default attributes.
	 */
	constructor() {
		super();

		// bind the input handler to this object
		this.input_handler = new InputHandler(this);

		// we always want our new players to be at this location
		this.position = {
			x: config.canvas_size.width / 2,
			y: config.canvas_size.height - 100
		};
	}

	/**
	 * Draws the player as a triangle centered on the player's location.
	 * 
	 * @param {CanvasRenderingContext2D} graphics The current graphics context.
	 */
	draw(graphics) {
		graphics.strokeStyle = '#000000';
		graphics.beginPath();
		graphics.moveTo(
			this.position.x,
			this.position.y - this.half_size.height
		);
		graphics.lineTo(
			this.position.x + this.half_size.width,
			this.position.y + this.half_size.height
		);
		graphics.lineTo(
			this.position.x - this.half_size.width,
			this.position.y + this.half_size.height
		);
		graphics.lineTo(
			this.position.x,
			this.position.y - this.half_size.height
		);
		graphics.stroke();

	}

	/**
	 * Updates the player given the state of the player's controller.
	 * 
	 * @param {Number} delta_time Time in seconds since last update call.
	 */
	update(delta_time) {
		/*
			implement player movement here!

			I recommend you look at the development console's log to get a hint as to how you can use the
			controllers state to implement movement.

			You can also log the current state of the player's controller with the following code
			console.log(this.controller);
		 */
		console.log(this.controller);
		if (this.controller.move_x == 0) {
			this.velocity.x = 0;
		}
		if (this.controller.move_x == 1) {
			this.velocity.x = 250;
		}
		if (this.controller.move_x == -1) {
			this.velocity.x = -250;
		}
		if (this.controller.move_y == 0) {
			this.velocity.y = 0;
		}
		if (this.controller.move_y == 1) {
			this.velocity.y = 250;
		}
		if (this.controller.move_y == -1) {
			this.velocity.y = -250;
		}
		console.log(this.position.x);

		// update position
		super.update(delta_time);

		// clip to screen
		this.position.x = Math.min(Math.max(0, this.position.x), config.canvas_size.width);
		this.position.y = Math.min(Math.max(0, this.position.y), config.canvas_size.height);
	}
}


/**
 * Represents an player body. Extends a Body by handling input binding and controller management.
 * 
 * @typedef Enemy
 */
class Enemy extends Body {
	// this controller object is updated by the bound input_handler
	controller = {
		move_x: 0,
		move_y: 0,
		action_1: false
	};
	raw_input = {};
	speed = 0;
	input_handler = null;

	/**
	 * Creates a new enemy with the default attributes.
	 */
	constructor() {
		super();

		// we always want our new enemies to spawn above the canvas
		this.position = {
			x: Math.floor(Math.random() * 300) + 1,
			y: config.canvas_size.height - 600
		};
	}

	/**
	 * Draws the enemy as a triangle centered on the enemy's location.
	 * 
	 * @param {CanvasRenderingContext2D} graphics The current graphics context.
	 */
	draw(graphics) {
		graphics.strokeStyle = '#FF0000';
		graphics.beginPath();
		graphics.moveTo(
			this.position.x,
			this.position.y + this.half_size.height
		);
		graphics.lineTo(
			this.position.x - this.half_size.width,
			this.position.y - this.half_size.height
		);
		graphics.lineTo(
			this.position.x + this.half_size.width,
			this.position.y - this.half_size.height
		);
		graphics.lineTo(
			this.position.x,
			this.position.y + this.half_size.height
		);
		graphics.stroke();

	}

	/**
	 * Updates the player given the state of the player's controller.
	 * 
	 * @param {Number} delta_time Time in seconds since last update call.
	 */
	update(delta_time) {
		/*
			implement player movement here!

			I recommend you look at the development console's log to get a hint as to how you can use the
			controllers state to implement movement.

			You can also log the current state of the player's controller with the following code
			console.log(this.controller);
		 */
		this.velocity.y = 270;

		// update position
		super.update(delta_time);

		// Check if touching player by checking the position of the enemy plus its dimensions
		if (this.position.x < player.position.x + player.size.width &&
			this.position.x + this.size.width > player.position.x &&
			this.position.y < player.position.y + player.size.height &&
			this.position.y + this.size.height > player.position.y){
				this.remove();
				player.health -= 25;
			}

		// clip to screen
		this.position.x = Math.min(Math.max(0, this.position.x), config.canvas_size.width);
		this.position.y = Math.min(Math.max(-100, this.position.y), config.canvas_size.height);
		if (this.position.y == config.canvas_size.height){
			this.remove();
		}
	}
}

/**
 * Represents an player body. Extends a Body by handling input binding and controller management.
 * 
 * @typedef Projectile
 */
class Projectile extends Body {
	// this controller object is updated by the bound input_handler
	controller = {
		move_x: 0,
		move_y: 0,
	};
	raw_input = {};
	speed = 100;
	input_handler = null;

	/**
	 * Creates a new enemy with the default attributes.
	 */
	constructor() {
		super();

		// we always want our new players to be at this location
		this.position = {
			x: player.position.x,
			y: player.position.y - 14
		};
	}

	/**
	 * Draws the projectile as a blue filled rectangle.
	 * 
	 * @param {CanvasRenderingContext2D} graphics The current graphics context.
	 */
	draw(graphics) {
		graphics.strokeStyle = '#0000FF';
		graphics.beginPath();
		graphics.moveTo(
			this.position.x - 2,
			this.position.y + this.half_size.height
		);
		graphics.lineTo(
			this.position.x + 2,
			this.position.y + this.half_size.height
		);
		graphics.lineTo(
			this.position.x + 2,
			this.position.y - this.half_size.height
		);
		graphics.lineTo(
			this.position.x - 2,
			this.position.y - this.half_size.height
		);
		graphics.lineTo(
			this.position.x - 2,
			this.position.y + this.half_size.height
		);
		graphics.stroke();
		graphics.fillStyle = '#0000FF';
		graphics.fill();
	}

	/**
	 * Updates the player given the state of the player's controller.
	 * 
	 * @param {Number} delta_time Time in seconds since last update call.
	 */
	update(delta_time) {
		/*
			implement player movement here!

			I recommend you look at the development console's log to get a hint as to how you can use the
			controllers state to implement movement.

			You can also log the current state of the player's controller with the following code
			console.log(this.controller);
		 */
		this.velocity.y = -350;

		// update position
		super.update(delta_time);

		// Check if touching player
		

		// clip to screen
		this.position.x = Math.min(Math.max(0, this.position.x), config.canvas_size.width);
		this.position.y = Math.min(Math.max(-100, this.position.y), config.canvas_size.height);
		if (this.position.y == 0){
			this.remove();
		}
	}
}

/**
 * Represents a collision handler.
 * 
 * @typedef collisionHandler
 */
class collisionHandler {
	update(delta_time){
		/**
		 * Checks all entities to see whether they are touching a projectile, delete it if it is.
		 * 
		 * @param {Array<Number>} entities 
		 */
	Object.values(entities).forEach(entity1 => {
		Object.values(entities).forEach(entity2 => {
		if(entity1.id != entity2.id){
		if (entity1.position.x < entity2.position.x + entity2.size.width &&
			entity1.position.x + entity1.size.width > entity2.position.x &&
			entity1.position.y < entity2.position.y + entity2.size.height &&
			entity1.position.y + entity1.size.height > entity2.position.y){
				//If a projectile makes contact with an enemy, delete both entities.
				if (entity1.constructor.name  == 'Projectile') {
				entity1.remove();
				entity2.remove();

				//keep track of enemies hit
				enemiesHit++;
				}
			}
		}
		});
	});
}
}

/* 
------------------------------
------ CONFIG SECTION -------- 
------------------------------
*/

const config = {
	graphics: {
		// set to false if you are not using a high resolution monitor
		is_hi_dpi: true
	},
	canvas_size: {
		width: 300,
		height: 500
	},
	update_rate: {
		fps: 60,
		seconds: null
	}
};

config.update_rate.seconds = 1 / config.update_rate.fps;

// grab the html span
const game_state = document.getElementById('game_state');

// grab the html canvas
const game_canvas = document.getElementById('game_canvas');
game_canvas.style.width = `${config.canvas_size.width}px`;
game_canvas.style.height = `${config.canvas_size.height}px`;

const graphics = game_canvas.getContext('2d');

// for monitors with a higher dpi
if (config.graphics.is_hi_dpi) {
	game_canvas.width = 2 * config.canvas_size.width;
	game_canvas.height = 2 * config.canvas_size.height;
	graphics.scale(2, 2);
} else {
	game_canvas.width = config.canvas_size.width;
	game_canvas.height = config.canvas_size.height;
	graphics.scale(1, 1);
}

/* 
------------------------------
------- MAIN SECTION  -------- 
------------------------------
*/

/** @type {Number} last frame time in seconds */
var last_time = null;

/** @type {Number} A counter representing the number of update calls */
var loop_count = 0;

/** @type {Number} A counter that is used to assign bodies a unique identifier */
var running_id = 0;

/** @type {Object<Number, Body>} This is a map of body ids to body instances */
var entities = null;

/** @type {Array<Number>} This is an array of body ids to remove at the end of the update */
var queued_entities_for_removal = null;

/** @type {Player} The active player */
var player = null;

/** @type {EnemySpawner} Handles the spawning of enemy within intervals */ 
var enemy_spawner = null;

/** @type {collisionHandler} Handles collision checking with all entities in relation to projectile */
var collision_handler = null;

/** @type {ProjectileSpawner} Handles projectile spawning by the player */
var projectile_spawner = null;

/** @type {Array<Number>} Keeps track of the projectiles */
var projectiles = [];

/** @type {Number} Keeps track of the number of enemies spawned */
var enemies = 0;

/** @type {Number} Keeps track of the score */
var score = 0;

/** @type {Number} Keeps track of enemies killed */
var enemiesHit = 0;

/** @type {Number} To keep track at what time the game restarts in order to give an accurate time alive */
var spawnedat = 0;

/** @type {Number} Keeps track of the High Score */
var HighScore = 0;

/** @type {Boolean} To know if there's a new high score */
newScore = false;

/**
 * This function updates the state of the world given a delta time.
 * 
 * @param {Number} delta_time Time since last update in seconds.
 */
function update(delta_time) {
	// poll input
	player.input_handler.pollController();

	// move entities
	Object.values(entities).forEach(entity => {
		entity.update(delta_time);
	});

	// detect and handle collision events
	if (collision_handler != null) {
		collision_handler.update(delta_time);
	}

	// remove enemies
	queued_entities_for_removal.forEach(id => {
		delete entities[id];
	})
	queued_entities_for_removal = [];

	// spawn enemies
	if (enemy_spawner != null) {
		enemy_spawner.update(delta_time);
	}

	if (projectile_spawner != null) {
		projectile_spawner.update(delta_time);
	}

	// allow the player to restart when dead
	if (player.isDead() && player.controller.action_1) {
		start();
	}
}

/**
 * This function draws the state of the world to the canvas.
 * 
 * @param {CanvasRenderingContext2D} graphics The current graphics context.
 */
function draw(graphics) {
	// default font config
	graphics.font = "10px Arial";
	graphics.textAlign = "left";

	// draw background (this clears the screen for the next frame)
	graphics.fillStyle = '#FFFFFF';
	graphics.fillRect(0, 0, config.canvas_size.width, config.canvas_size.height);

	// for loop over every eneity and draw them
	Object.values(entities).forEach(entity => {
		entity.draw(graphics);
	});

	// game over screen
	if (player.isDead()) {
		player.remove();
		graphics.fillStyle = "#000000"
		graphics.font = "30px Arial";
		graphics.textAlign = "center";
		graphics.fillText('Game Over', config.canvas_size.width / 2, config.canvas_size.height / 2);

		graphics.font = "12px Arial";
		graphics.textAlign = "center";
		graphics.fillText('press space to restart', config.canvas_size.width / 2, 18 + config.canvas_size.height / 2);
		if (newScore == true) {
		graphics.fillStyle = "#FFD700"
		graphics.font = "30px Arial";
		graphics.textAlign = "center";
		graphics.fillText('New High Score!', config.canvas_size.width / 2,  config.canvas_size.height / 2 - 30);

		}
	}
}
/**
 * This class handles the spawning of new enimies
 */
class EnemySpawner {
	timer = {
		accumulated: 0
	};
	/**
	 * The update function takes time as a parameter and spawn enemies four at a time every 1/10 of a second. 
	 * 
	 * @param {Number} delta_time 
	 */
	update(delta_time){
		this.timer.accumulated += delta_time;
		if (this.timer.accumulated > .1) {
			entities.push(new Enemy());
			entities.push(new Enemy());
			entities.push(new Enemy());
			entities.push(new Enemy());
			this.timer.accumulated -= .1;
			enemies += 4;
		}
	}
}
/**
 * This class facilitates the spawning of the projectiles the player shoots
 */
class ProjectileSpawner {
	cooldown = {
		seconds: 1
	};
	/**
	 * This function does the actual spawning of the projectile object.
	 * 
	 * @param {Number} delta_time 
	 */
	update(delta_time){
		this.cooldown.seconds += delta_time;
		if (player.controller.action_1 == true && this.cooldown.seconds > .5 ) {
			projectiles.push(new Projectile());
			this.cooldown.seconds = 0;
		}
	}
}

/**
 * This is the main driver of the game. This is called by the window requestAnimationFrame event.
 * This function calls the update and draw methods at static intervals. That means regardless of
 * how much time passed since the last time this function was called by the window the delta time
 * passed to the draw and update functions will be stable.
 * 
 * @param {Number} curr_time Current time in milliseconds
 */
function loop(curr_time) {
	// convert time to seconds
	curr_time /= 1000;

	// edge case on first loop
	if (last_time == null) {
		last_time = curr_time;
	}

	var delta_time = curr_time - last_time;

	// this allows us to make stable steps in our update functions
	while (delta_time > config.update_rate.seconds) {
		update(config.update_rate.seconds);
		draw(graphics);

		delta_time -= config.update_rate.seconds;
		last_time = curr_time;
		console.log(HighScore);
		if (player.isDead()){
			spawnedat = last_time;
		}
		loop_count++;
		if (!player.isDead()){

			//check for new high score
			if (HighScore < score) {
				HighScore = score;
				newScore = true;
			}

		score = Math.floor(30 * enemiesHit + (last_time-spawnedat));
		game_state.innerHTML = `loop count ${loop_count}`;
		Time.innerHTML = `Time alive: ${Math.floor(last_time-spawnedat)}`;
		Enemies.innerHTML = `Enemies Spawned: ${enemies}`;
		PlayerScore.innerHTML = `Score: ${score}`;
		High.innerHTML = `High Score: ${HighScore}`;
		}

	}
	window.requestAnimationFrame(loop);
}

function start() {
	newScore = false;
	loop_count = 0;
	enemies = 0;
	enemiesHit = 0;
	score = 0;
	entities = [];
	queued_entities_for_removal = [];
	player = new Player();
	projectile_spawner = new ProjectileSpawner();
	enemy_spawner = new EnemySpawner();
	collision_handler = new collisionHandler();
}

// start the game
start();

// start the loop
window.requestAnimationFrame(loop);

