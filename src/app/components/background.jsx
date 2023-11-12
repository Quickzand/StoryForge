import React from "react";

class Background extends React.Component {
	canvasRef = React.createRef();

	constructor(props) {
		super(props);
		this.state = {
			environmentalState: props.environmentalState || {
				environment: "forest",
				leafCount: 50,
				timeOfDay: 0.12,
				weather: {
					type: "cloudy",
					cloudCoverage: 0.1,
				},
			},
		};
		this.leaves = [];
		this.clouds = [];
	}

	componentDidMount() {
		this.updateCanvas();
		this.initializeEnvironment();
		this.initializeWeather();
		window.addEventListener("resize", this.updateCanvas); // Handle window resizing
	}
	componentWillUnmount() {
		window.removeEventListener("resize", this.updateCanvas); // Clean up event listener
	}

	initializeEnvironment() {
		switch (this.state.environmentalState.environment) {
			case "forest":
				this.initializeForest();
				break;
			// TODO add other environments
			default:
				this.initializeForest(); // Default to forest
		}
		this.animateFrame();
	}

	initializeForest() {
		this.leaves = [];
		const leafCount = this.state.environmentalState.leafCount;
		for (let i = 0; i < leafCount; i++) {
			this.leaves.push(this.createLeaf());
		}
	}

	initializeWeather() {
		// Example: Initialize weather based on props or state
		const weather = this.state.environmentalState.weather;
		switch (weather.type) {
			case "cloudy":
				this.initializeClouds(weather.cloudCoverage);
				break;
			// Future weather types can be added here
		}
		this.animateFrame();
	}

	initializeClouds(cloudCoverage) {
		this.clouds = [];
		const cloudCount = Math.round(cloudCoverage * 100); // Adjust the number based on coverage
		for (let i = 0; i < cloudCount; i++) {
			this.clouds.push(new Cloud(this.canvasRef.current.getContext("2d")));
		}
	}

	createLeaf() {
		const x = Math.random() * window.innerWidth; // Random starting X
		const y = Math.random() * window.innerHeight; // Random starting Y
		const radius = Math.random() * 5 + 5; // Random size
		const color = `rgba(${Math.random() * 255}, ${
			Math.random() * 255
		}, 0, 0.7)`; // Random shade of green
		const speed = Math.random() * 2 + 1; // Random speed
		const angle = Math.random() * Math.PI * 2; // Random angle
		return new Leaf(
			this.canvasRef.current.getContext("2d"),
			x,
			y,
			radius,
			color,
			speed,
			angle
		);
	}

	animateFrame = () => {
		requestAnimationFrame(this.animateFrame);
		if (this.canvasRef.current) {
			const ctx = this.canvasRef.current.getContext("2d");
			ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); // Clear the canvas

			// Update and draw clouds
			this.clouds.forEach((cloud) => {
				cloud.update();
			});

			// Update and draw leaves
			this.leaves.forEach((leaf) => {
				leaf.update();
			});
		}
	};

	updateCanvas = () => {
		const canvas = this.canvasRef.current;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const ctx = canvas.getContext("2d");
		// Drawing logic goes here
		// Example: fill the canvas with a color
		ctx.fillStyle = "red";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	};

	render() {
		const style = {
			position: "absolute", // Position it absolutely
			top: 0,
			left: 0,
			zIndex: -1, // Ensure it stays in the background
			width: "100%", // Fill the width
			height: "100%", // Fill the height
			background: getGradientForTimeOfDay(
				this.state.environmentalState.timeOfDay
			),
		};

		return <canvas ref={this.canvasRef} style={style}></canvas>;
	}
}

class Leaf {
	constructor(ctx, x, y, radius, color, angle) {
		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.radius = radius; // Size of the leaf
		this.color = color; // Color of the leaf
		this.angle = angle; // Angle for swaying motion
		this.rotation = Math.random() * Math.PI * 2; // Initial random rotation
		this.rotationSpeed = Math.random() * 0.04 - 0.02; // Random rotation speed

		this.fallSpeed = Math.random() * 0.5 + 0.2; // Vertical fall speed
		this.driftSpeed = Math.random() * 0.5 + 0.2; // Horizontal drift speed
	}

	draw() {
		const leafLength = this.radius * 2; // Length of the leaf
		const leafWidth = leafLength * 0.6; // Width of the leaf

		this.ctx.save();
		this.ctx.translate(this.x, this.y);
		this.ctx.rotate(this.rotation);
		this.ctx.fillStyle = this.color;

		// Drawing a leaf shape
		this.ctx.beginPath();
		this.ctx.moveTo(0, -leafLength / 2); // Start at the top tip of the leaf
		// Draw the right side
		this.ctx.quadraticCurveTo(leafWidth, 0, 0, leafLength); // Bottom right curve
		// Draw the left side
		this.ctx.quadraticCurveTo(-leafWidth, 0, leafWidth / 2, -leafLength); // Top left curve
		this.ctx.closePath();
		this.ctx.fill();

		this.ctx.restore();
	}

	update() {
		// Horizontal drift
		this.x += Math.cos(this.angle) * this.driftSpeed;
		this.angle += 0.01; // Slow angle change for continuous swaying

		// Vertical descent
		this.y += this.fallSpeed;

		// Rotation
		this.rotation += this.rotationSpeed;

		// Reset position if off-screen
		if (this.x > window.innerWidth + 50 || this.y > window.innerHeight + 50) {
			this.x = Math.random() * window.innerWidth;
			this.y = -10;
		}

		this.draw();
	}
}

class Cloud {
	constructor(ctx) {
		this.ctx = ctx;

		// Set initial random position, scale, and speed
		this.x = Math.random() * window.innerWidth;
		this.y = Math.random() * (50 * 0.2) - 20; // Upper part of the screen
		this.scale = Math.random() * 0.5 + 0.5; // Random scale
		this.speed = Math.random() * 0.05 + 0.05; // Random horizontal drift speed
	}

	draw() {
		const cloudHeight = 20 * this.scale; // Adjust for cloud height

		this.ctx.save();
		this.ctx.translate(this.x, this.y);
		this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // Light gray, semi-transparent

		// Simple cloud drawing logic
		this.ctx.beginPath();
		this.ctx.arc(0, cloudHeight / 2, 25 * this.scale, 0, Math.PI * 2, false);
		this.ctx.arc(
			35 * this.scale,
			cloudHeight / 2 - 15 * this.scale,
			35 * this.scale,
			0,
			Math.PI * 2,
			false
		);
		this.ctx.arc(
			70 * this.scale,
			cloudHeight / 2,
			25 * this.scale,
			0,
			Math.PI * 2,
			false
		);
		this.ctx.fill();

		this.ctx.restore();
	}

	update() {
		// Update the horizontal position based on the cloud's speed
		this.x += this.speed;

		// Wrap around logic
		if (this.x > window.innerWidth + 100 * this.scale) {
			// Adjust based on cloud width
			this.x = -100 * this.scale;
		}

		this.draw();
	}
}

export default Background;

function getGradientForTimeOfDay(timeOfDay) {
	// Ensure timeOfDay is within bounds
	timeOfDay = Math.max(0, Math.min(timeOfDay, 1));

	// Define key times and their associated gradient colors
	const timesAndGradients = [
		{ time: 0.0, gradient: ["#003973", "#0b3d91"] }, // Midnight (dark blue)
		{ time: 0.25, gradient: ["#f2ec54", "#FFD700"] }, // Dawn (yellow)
		{ time: 0.5, gradient: ["#87CEEB", "#00BFFF"] }, // Noon (light blue sky)
		{ time: 0.75, gradient: ["#f2b632", "#FFA500"] }, // Dusk (orange)
		{ time: 1.0, gradient: ["#003973", "#0b3d91"] }, // Next Midnight (dark blue)
	];

	// Find the current segment of time
	let lowerBound, upperBound;
	for (let i = 0; i < timesAndGradients.length - 1; i++) {
		if (
			timeOfDay >= timesAndGradients[i].time &&
			timeOfDay <= timesAndGradients[i + 1].time
		) {
			lowerBound = timesAndGradients[i];
			upperBound = timesAndGradients[i + 1];
			break;
		}
	}

	// Interpolate the gradient
	const mixRatio =
		(timeOfDay - lowerBound.time) / (upperBound.time - lowerBound.time);
	const startColor = lerpColor(
		lowerBound.gradient[0],
		upperBound.gradient[0],
		mixRatio
	);
	const endColor = lerpColor(
		lowerBound.gradient[1],
		upperBound.gradient[1],
		mixRatio
	);
	return `linear-gradient(to bottom, ${startColor}, ${endColor})`;
}

// Linear interpolation between two colors
function lerpColor(color1, color2, ratio) {
	var r = Math.round(
		parseInt(color1.substring(1, 3), 16) * (1 - ratio) +
			parseInt(color2.substring(1, 3), 16) * ratio
	);
	var g = Math.round(
		parseInt(color1.substring(3, 5), 16) * (1 - ratio) +
			parseInt(color2.substring(3, 5), 16) * ratio
	);
	var b = Math.round(
		parseInt(color1.substring(5, 7), 16) * (1 - ratio) +
			parseInt(color2.substring(5, 7), 16) * ratio
	);
	return (
		"#" +
		("0" + r.toString(16)).slice(-2) +
		("0" + g.toString(16)).slice(-2) +
		("0" + b.toString(16)).slice(-2)
	);
}
