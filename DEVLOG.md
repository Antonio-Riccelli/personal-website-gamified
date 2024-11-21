# DevLog

## 18/11/2024

### Reasons I started this project:
- I wanted to learn how to use a JS framework to build simple games, as I'm planning to make one of my own in the near future.
  - In doing so, I will start learning some common patterns and best practices for game making (e.g, state management, event handling, creating an inventory system, etc.). Some of these transfer nicely from non-game programming whilst others are more specific to game making.
- I thought the idea of having a gamified version of my portfolio would be fun. Being fun is generally enough of a reason for me to do something.
- Making a game allows me to be creative and leverage some of my other passions: music making, sound design, and art. I won't be able to indulge in all of these at once but I can at least start in some of them.
- I would like to experiment with the concept of micro-frontends and having two versions of the portfolio site (one standard and one game-ified) seemed like a decent use case. I'm fully aware it might be over-engineering but the whole point of working on personal project is to learn stuff and experiment.

I've started the project roughly a week ago. Learning and development have been going rather smoothly although somewhat slow, obviously due to having a full-time job and preparing for a certification exam (CompTIA Project+) at the same time.

I've started out with a useful TypeScript/WebPack project template provided on the Phaser website and journeyed on from there. I can't say I found the documentation easy to navigate. It's excessively "stingy" in providing information and there are not many explanations of how the different components of the framework work together. I've had to rely a lot on blog posts, StackOverflow, YouTube and the Phaser official forums. I fully appreciate the docs can't explain everything but I think they could do a better job. On the other hand, someone could rightfully argue that I could open a pull request and contribute, instead of complaining about someone else's efforts - and they wouldn't be wrong!

### Things I've learned and done so far:
- Created different scenes and added them to the game's scene manager.
- Imported free pre-made assets, courtesy of [CraftPix](https://craftpix.net/)
- Created and added music and sound effects for two different scenes: a Character Selection screen and a general Town/World scene from which the player will be able to access different buildings or characters, corresponding to sections of my portfolio. I started writing one of the tracks from scratch, whereas the other was a soothing guitar arpeggio loop that I had sitting around for years to which I only added some beats. Using GuitarPro and Audacity to handle it all.
- How to extract frames from spritesheet and animate them.
- Manage objects in the game's scene and add them to the scene's physics world so that the player can interact with them (still a work in progress)
- How to connect scenes and transition between them, implementing effects like fade outs and fade ins.

## 21/11/2024

- Done some refactoring work. As I started creating new scenes, it became clear that some code needed to be abstracted to separate importable methods or classes to avoid unnecessary duplication. For now, I've created a Player class containing behaviour logic, so I can instantiate the player and share the same code across areas.
Retrieving and generating texture was challenging due to Phaser structuring the game as Scenes, where assets are generally loaded in the `preload()` method and then made available in the `create()` method. This means that loading additional ones, such as the player's sprite, needs to be done in the former as well, in order to avoid issues. It still requires me reloading the same asset in every scene, so I think I can eventually move it to the `Preload` scene.
- Many create their tilemaps beforehand using software like [Tiled](https://www.mapeditor.org/) which, as I understand, also allows you to *pre-bake* certain properties and data into the tiles. This should supposedly help also with collision detection and other stuff. As I wasn't aware of this initially, I just created a layer of tiles manually from certain textures. I faced the issue of how to handle collision and interactions between player and buildings/characters/objects, so I opted to create an invisible circle for each entity starting from its center xy coordinates and extending for a certain radius. This allowed me to check if the player is within a certain distance from the object and trigger an event. It's kind of a hacky solution but it works for now and can be applied to any other element. Code hasn't been abstracted yet but I will refactor soon.
- Managed to find some more songs/melodies/chords/loops I originally wrote that can be used for the game. They have all been sitting in my drive for years and it's good to give them a purpose.
- For a mini-game that's so tiny in scope, you still get to face and deal with a surprisingly high number of issues and choices. I feel this is helping me improve my creative and problem-solving skills, in addition to my understanding of game design and even of a specific framework like Phaser.js