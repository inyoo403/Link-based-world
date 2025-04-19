class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
        this.engine.inventory = [];
    }
    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        const data = this.engine.storyData.Locations[key];
        this.engine.show(data.Body);

        if (data.Gain) {
            this.engine.inventory.push(data.Gain);
            this.engine.show(`(아이템 획득: ${data.Gain})`);
        }

        const list = [];
        if (data.Choices) list.push(...data.Choices);
        if (data.DynamicChoices) {
            for (let it of this.engine.inventory) {
                const opt = data.DynamicChoices[it];
                if (opt) list.push(opt);
            }
        }

        if (!list.length) this.engine.addChoice("The end.");

        for (let c of list) {
            if (c.Color) {
                const b = document.createElement("button");
                b.textContent = c.Text;
                b.style.color = c.Color;
                b.onclick = () => {
                    this.engine.show("> " + c.Text);
                    this.engine.gotoScene(Location, c.Target);
                };
                document.getElementById("game").appendChild(b);
                this.engine.show("");
            } else {
                this.engine.addChoice(c.Text, c);
            }
        }
    }
    handleChoice(choice) {
        if (choice) {
            this.engine.show("> " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, "myStory.json");
