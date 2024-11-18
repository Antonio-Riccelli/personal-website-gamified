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