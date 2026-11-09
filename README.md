# VEILBOUND

A single-player, side-scrolling Jujutsu Kaisen fan RPG made with HTML and Canvas. Character artwork is drawn in code and inspired by visual references; reference screenshots are not embedded in the game.

## Play

Download `loader.html` from this repository and open it in a browser. It fetches the latest `game.html` from the `main` branch. Internet access is needed for the loader; a downloaded `game.html` can also run on its own.

Inspect a character, then choose **Begin**. You can also use A / D to select and Enter to begin.

After updating, download the current loader to get checkpoint and autosave support inside the loader. Saves are kept in your browser on this device. Clearing browser storage clears the save. Existing saves from the first prototype use a separate save slot.

## Controls

| Key | Action |
| --- | --- |
| A / D or arrow keys | Move |
| Space / W / up arrow | Jump; press again in the air to double jump |
| S + Space | Drop through a rooftop |
| Shift | Dash dodge; uses 8 cursed energy |
| J or left mouse | Strike; hold to chain the three-hit combo |
| K or right mouse | Character technique |
| R | Advanced technique, after unlocking |
| L | Domain Expansion, after unlocking |
| E | Talk, open a cache, or rest at a lantern |
| 1 | Use a recovery talisman |
| 2 | Use a cursed energy tonic |
| Tab | Technique tree and field manual |
| M | World map |
| Escape | Pause / resume |

Touch controls are available on devices with a coarse pointer.
You can also click the hotbar to cast. Mouse attacks face toward the cursor.

## The journey

Meet the instructor at the school gate, exorcise five curses, and report back. Explore east through the grove and city to reach the sealed shrine. Defeat the Veilkeeper to break the veil. Six hidden caches reward platform exploration.

- **Yuji:** three-hit combo with a Black Flash finisher, a tracking delayed impact from Divergent Fist, and an advanced Black Flash that lunges into range. Connecting a combo finisher restores 10 energy. His domain also strengthens outgoing damage.
- **Megumi:** homing black and white Divine Dogs and Nue's repeated lightning strikes. Techniques recover 15% faster. Chimera Shadow Garden periodically summons additional shadow dogs.
- **Gojo:** Blue creates a lasting gravity well; Red repels the target and nearby curses. Cast Red while Blue is still visible to charge and launch a piercing Hollow Purple. Infinity spends 18 energy to block one hit every eight seconds. Hold Space while falling to hover for up to 1.5 seconds, using cursed energy.
- **Sukuna:** a Cleave combo finisher, three piercing Dismantle slashes, Divine Flame with an explosive impact and lingering ground fire, and Malevolent Shrine. Exorcisms restore eight health.
- **Bottom HUD:** health, energy, character status, techniques, supplies, quest summary, menus, boss health, and touch controls are grouped in a centered bottom dock. Interaction prompts and notifications appear above it.
- **Character art:** original detailed pixel sprites with 12 walking frames, three six-frame combo attacks, casting, idle, dash, jumping, falling, and hurt animations.
- **Roster:** switch characters at lanterns through the field manual; upgrades and quest progress carry over.
- **Wardrobe:** each character has a Signature, Field, and Awakened uniform palette. Alternate uniforms cost 80 fragments each, unlock once, and are cosmetic.
- **School courtyard:** talk to the supervisor for your assignment and practice safely on the training dummy.
- **Progression:** spend level-up points on advanced techniques, domains, cursed output, and reinforcement.
- **Checkpoints:** lanterns restore health and energy, save progress, and set the rescue location.
- **Enemies:** crawlers, brutes, spitters, and a two-phase boss with telegraphed attacks.
- **Settings:** toggle synthesized sound effects and screen shake in the field manual.
- **Camera:** choose wide, standard, or close framing in settings.
- **Save backups:** use Settings to export a JSON save backup and import it on another browser or device. This also gives you a backup when browser storage is unavailable.
- **Supplies:** start with two recovery talismans and one energy tonic. Spend fragments to restock at lanterns through the Supplies tab. Carry up to five of each.
- **Cursed Gauntlet:** after lifting the veil, enter a three-wave post-story combat trial from the Journal. Defeat the Veilkeeper's echo for 150 bonus fragments and 180 XP. You can leave through Settings. Defeat rescues you at your checkpoint.

Ordinary curses return when you continue a saved session. Quest progress, the defeated story boss, opened caches, character upgrades, checkpoint, and supplies remain saved.

This is an unofficial fan project. It is not affiliated with the creators or rights holders of Jujutsu Kaisen. Some gameplay abilities and names are creative adaptations.

