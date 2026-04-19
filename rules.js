class Start extends Scene {
    create() {
        console.log("Start storydata", this.engine.storyData);
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        console.log("Location.create key", key);
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);
        
        if(locationData.Choices) {
            for(let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class InteractiveObject extends Location {
    interacted = false;

    create(key) {
        console.log("InteractiveObject.create key", key);
        let InteractiveObjectData = this.engine.storyData.Locations[key].InteractiveObject;
        this.engine.show(InteractiveObjectData.Body);
        
        if(InteractiveObjectData.Choices) {
            for(let choice of InteractiveObjectData.Choice) {
                this.engine.addChoice(InteractiveObjectData.Text, choice);
            }
        }
    }

    handleChoice(choice) {
        this.engine.show("&gt; "+choice.Text);
        this.engine.gotoScene(InteractiveObject, choice.Target);
        interacted = true;
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');