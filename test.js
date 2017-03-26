class classA {
	constructor() {
		createjs.EventDispatcher.initialize(classA.prototype);
		this.addEventListener("someEvent", function(evt) {
			console.log("classA has detected something has happened!");
		});
	}
}

class classB {
	constructor() {
		createjs.EventDispatcher.initialize(classB.prototype);

		this.addEventListener("someEvent", function(evt) {
			console.log("classB has detected something has happened!");
		});

		this.dispatchEvent("someEvent");
	}
}

console.log("Trying to test out the event system...");
let a = new classA();
let b = new classB();
console.log("End of test");