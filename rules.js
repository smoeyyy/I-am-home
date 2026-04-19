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
                let showChoice = true;
                if(choice.Scene === "InteractiveObject") {
                    let interactiveData = locationData.InteractiveObject;
                    if(interactiveData && interactiveData.Flag && this.engine.getFlag(interactiveData.Flag)) {
                        showChoice = false;
                    }
                }
                if(showChoice) {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            if(choice.Text === "Leave") {
                if(this.engine.getFlag("pollyPetted") && this.engine.getFlag("colonelPetted")) {
                    this.engine.gotoScene(Location, choice.Target);
                } else {
                    this.engine.show("You can't leave yet. You haven't said goodbye to the cats.");
                    this.engine.gotoScene(Location, "Living Room");
                }
            } else if(choice.Scene === "InteractiveObject") {
                this.engine.gotoScene(InteractiveObject, choice.Target);
            } else {
                this.engine.gotoScene(Location, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class InteractiveObject extends Scene {
    create(key) {
        console.log("InteractiveObject.create key", key);
        let interactiveData = this.engine.storyData.Locations[key].InteractiveObject;
        this.engine.show(interactiveData.Body);
        
        if(interactiveData.Choices) {
            for(let choice of interactiveData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("Step back", { Text: "Step back", Target: key });
        }
    }

    handleChoice(choice) {
        if(choice.SetFlag) {
            this.engine.setFlag(choice.SetFlag);
        }
        if(choice.Result) {
            this.engine.show(choice.Result);
        }
        if(choice.Target) {
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');