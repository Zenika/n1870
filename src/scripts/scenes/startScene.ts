import Submarine, { Ballast, Movement } from "../objects/submarine"

const SUBMARINE_SPEED_STEP = 2

export default class StartScene extends Phaser.Scene {
  submarine: Submarine
  text: Phaser.GameObjects.Text
  etape = 0
  moving: boolean
  currentMovement: Movement = Movement.Stopped
  ballaste: Ballast = Ballast.Keep
  lightPosition: number = 0
  light = false;
  ballasteTimer: Phaser.Time.TimerEvent
  swithToEtapeTimout?: NodeJS.Timeout

  constructor() {
    super({
      key: 'StartScene', physics: {
        default: 'matter',
        matter: {
          debug: false,
          gravity: {
            y: 0
          }
        }
      }
    })
  }

  create() {



    const { width, height } = this.scale
    this.etape = 0;

    this.add.image(0, 0, 'game_tuto').setOrigin(0, 0).setScrollFactor(0)
    const PADDING = 70
    this.text = this.add
      .text(PADDING, 350, `Bienvenue dans le tutoriel du Jeu N1870.\nAppuyez sur une touche pour commencer.`, {
        color: '#2D1C11',
        fontSize: '18px',
        align: 'center',
        fixedWidth: width - 2 * PADDING,
        fixedHeight: 100,
        wordWrap: { width: width - 2 * PADDING, useAdvancedWrap: true },
        padding: { x: 10 }, 
      })
      .setDepth(6)
    this.submarine = new Submarine(this, this.cameras.main.width / 2, 0).setPosition(width / 2, height / 3).setDepth(5)

    this.ballasteTimer = this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.ballaste = Ballast.Keep
      },
    });

    this.input.keyboard.on('keydown', (event) => {
      switch (event.which) {
        case Phaser.Input.Keyboard.KeyCodes.ONE:
        case Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE:
          this.submarine.light.lightDown()
          this.lightPosition = 1;
          break;
        case Phaser.Input.Keyboard.KeyCodes.TWO:
        case Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO:
          this.submarine.light.lightStraight()
          this.lightPosition = 2;
          break;
        case Phaser.Input.Keyboard.KeyCodes.THREE:
        case Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE:
          this.submarine.light.lightUp()
          this.lightPosition = 3;
          break;
        case Phaser.Input.Keyboard.KeyCodes.L:
          this.submarine.light.toggleLight()
          this.light = !this.light;
          break;
        case Phaser.Input.Keyboard.KeyCodes.LEFT:
          this.currentMovement = Movement.Backward
          break;
        case Phaser.Input.Keyboard.KeyCodes.RIGHT:
          this.currentMovement = Movement.Forward
          break;
        case Phaser.Input.Keyboard.KeyCodes.UP:
          this.ballaste = Ballast.Fill;
          break;
        case Phaser.Input.Keyboard.KeyCodes.DOWN:
          this.ballaste = Ballast.Empty;
          break;
        case Phaser.Input.Keyboard.KeyCodes.SPACE:
          this.moving = true;
          break;
        case Phaser.Input.Keyboard.KeyCodes.F:
          document.querySelector("#phaser-game")?.requestFullscreen();
          break;
        case Phaser.Input.Keyboard.KeyCodes.P:
        case Phaser.Input.Keyboard.KeyCodes.S:
          if (this.lightPosition === 2) {
            this.scene.start('MainScene');
          }
          else {
            this.swithToEtape(100);
          }
          break;
       // For test
       case Phaser.Input.Keyboard.KeyCodes.X:
          this.scene.start('MainScene');
          break;
        default:
          break;
      }
      event.preventDefault();
      switch (this.etape) {
      case 0:
        this.swithToEtape(1);
        break;
      case 1:
        this.swithToEtape(2);
        break;
      case 2:
      case 3:
        if (this.ballaste === Ballast.Fill) {
          this.swithToEtape(4);
        }
        if (this.ballaste === Ballast.Empty) {
          this.swithToEtape(3);
        }
        break;
      case 5:
      case 6:
        if (this.ballaste === Ballast.Empty) {
          this.swithToEtape(7);
        }
        if (this.ballaste === Ballast.Fill) {
          this.swithToEtape(6);
        }
        break;
      case 8:
      case 9:
        if (this.currentMovement === Movement.Forward) {
          this.swithToEtape(10);
        }
        if (this.currentMovement === Movement.Backward) {
          this.swithToEtape(9);
        }
        break;
      case 10:
        if (this.moving) {
          this.swithToEtape(14);
        }
        break;
      case 11:
      case 12:
        if (this.currentMovement === Movement.Backward) {
          this.swithToEtape(13);
        }
        if (this.currentMovement === Movement.Forward) {
          this.swithToEtape(12);
        }
        break;
      case 13:
        if (this.moving) {
          this.swithToEtape(14);
        }
        break;
      case 15:
      case 16:
        if (this.lightPosition === 1 || this.lightPosition === 3) {
          this.swithToEtape(17);
        }
        if (this.lightPosition === 2) {
          this.swithToEtape(16);
        }
        break;
      case 17:
        if (this.light) {
          this.swithToEtape(18);
        }
        break;
      case 19:
      case 20:
        this.submarine.light.switchOffLight()
        if (this.lightPosition === 1 || this.lightPosition === 3) {
          this.swithToEtape(20);
        }
        if (this.lightPosition === 2) {
          this.swithToEtape(21);
        }
        break;
      }
    });
    this.input.keyboard.on('keyup', event => {
      this.moving = false;
      this.ballaste = Ballast.Keep;
    })
  }

  update(time: number, delta: number): void {
    if (this.ballaste === Ballast.Fill && this.submarine.y < 250) {
      this.submarine.setVelocityY(SUBMARINE_SPEED_STEP)
    } else if (this.ballaste === Ballast.Empty && this.submarine.y > 100) {
      this.submarine.setVelocityY(-SUBMARINE_SPEED_STEP)
    } else {
      this.submarine.setVelocityY(0)
    }
    if (this.moving) {
      if (this.currentMovement === Movement.Forward && this.submarine.x < 450) {
        this.submarine.setVelocityX(SUBMARINE_SPEED_STEP)
      } else if (this.currentMovement === Movement.Backward && this.submarine.x > 150) {
        this.submarine.setVelocityX(-SUBMARINE_SPEED_STEP)
      }
      this.submarine.update(this.currentMovement);
    }
    else {
      this.submarine.setVelocityX(0)
      this.submarine.update(this.currentMovement);
    }
  }

  updateEtapeText() {
    switch (this.etape) {
      case 0:
        this.submarine.update(Movement.Forward)
        this.text.setText(`Appuyez sur une touche pour commencer.`)
        break;
      case 1:
        this.submarine.update(Movement.Stopped)
        this.text.setText(`Vous regardez dans le periscope du sous-marin et votre collègue devra utiliser les commandes.\n\nVoyons comment les utiliser...\n`);
        this.swithToEtape(2, 8000);
        break;
      case 2:
        this.submarine.update(Movement.Stopped)
        this.text.setText(`Un sous-marin possède des ballasts pour plonger.\nAppuyez sur le bouton [+] pour le remplir d'eau.`);
        break;
      case 3:
        this.submarine.update(Movement.Stopped)
        this.text.setText(`Appuyez sur le bouton [+] pour remplir les ballasts.`);
        break;
      case 4:
        this.submarine.update(Movement.Stopped)
        this.text.setText(`Le sous-marin est maintenant lesté, il va s'enfoncer dans les profondeurs...`);
        this.swithToEtape(5, 5000);
        break;
      case 5:
        this.submarine.update(Movement.Stopped)
        this.text.setText(`Vidons maintenant les ballasts.\nAppuyez sur le bouton [-] pour les vider.`);
        break;
      case 6:
        this.submarine.update(Movement.Stopped)
        this.text.setText(`Appuyez sur le bouton [-] pour vider les ballasts.`);
        break;
      case 7:
        this.submarine.update(Movement.Stopped)
        this.text.setText(`Le sous-marin est rempli d'air, il va maintenant remonter vers la surface...`);
        this.swithToEtape(10, 5000);
        break;
      case 8:
        this.submarine.update(Movement.Stopped)
        this.text.setText(`Maintenant faisons avancer le sous-marin vers l'avant.\nMettez le sous-marin en marche avant en mettant le commutateur de [DIRECTION] sur la position [2].`);
        break;
      case 9:
        this.submarine.update(Movement.Stopped)
        this.text.setText(`Mettez le sous-marin en marche avant avec le commutateur de [DIRECTION] sur la position [2]`);
        break;
      case 10:
        this.text.setText(`Maintenant faisons avancer le sous-marin vers l'avant, appuyez sur la touche [marche] autant de fois que nécessaire pour avancer, la led verte sur le poste de commande s'allume à chaque appui.`);
        break;
      case 11:
        this.submarine.update(Movement.Stopped)
        this.text.setText(`Si vous buttez contre un rocher, il faut enclencher la marche arrière.\nMettez le sous-marin en marche arrière avec le commutateur de [DIRECTION] sur la position [1].`);
        break;
      case 12:
        this.submarine.update(Movement.Stopped)
        this.text.setText(`Mettez le sous-marin en marche arrière avec le commutateur de [DIRECTION] sur la position [1].`);
        break;
      case 13:
        this.text.setText(`Maintenant que la marche arrière est enclenchée, appuyez sur la touche marche autant de fois que nécessaire pour reculer.`);
        break;
      case 14:
        this.submarine.setPosition(300, 200)
        this.text.setText(`Une lampe est placée sur le sous-marin, apprenez à la manipuler...`);
        this.swithToEtape(15, 5000);
        break;
      case 15:
        this.text.setText(`Le commutateur [BRAS] trois positions de gauche permet de mettre le bras en haut, en bas ou au milieu.\nTournez le contacteur pour le mettre en position basse [0] ou haute [2].`);
        break;
      case 16:
        this.text.setText(`Actionnez le commutateur [BRAS] pour le mettre en position basse [0] ou haute [2].`);
        break;
      case 17:
        this.text.setText(`Allumez la lampe en appuyant sur le bouton blanc de gauche, intitulé [LAMPE].\nLa led jaune s'allume aussi longtemps que la lampe.`);
        break;
      case 18:
        this.text.setText(`Si un monstre passe dans le faiseau de la lampe, il sera effrayé et s'eloignera du sous-marin.`);
        this.swithToEtape(19, 8000);
        break;
      case 19:
        this.text.setText(`Pour continuer, remettez le bras en position centrale (commutateur de gauche en position [1]).`);
        break;
      case 20:
        this.text.setText(`Mettez le bras en position centrale.`);
        break;
      case 21:
        this.text.setText(`Le but du jeu est d'avancer le plus loin possible en évitant les monstres ou en les éloignant avec la lampe et de ne pas toucher les rochers.`);
        this.swithToEtape(22, 5000);
        break;
      case 22:
        this.text.setText(`Vous pilotez un vieux sous-marin, il faut être délicat avec le panneau de commande ;)`)
        this.swithToEtape(23, 5000);
        break;
      case 23:
        this.text.setText(`Dès que vous êtes prêt, ouvrez le capot rouge du bouton [DANGER] et lever l'interrupteur pour commencer...`);
        break;
      case 100:
        this.text.setText(`Pour commencer, mettez le commutateur [BRAS] en position centrale [1],\n et enfin basculer en position haute le bouton rouge [DANGER].`)
        break;
    }
  }

  swithToEtape(toEtape, delay = 0) {
    console.log(`switch to etape ${toEtape} with delay ${delay}`)
      if (this.swithToEtapeTimout) {
          clearTimeout(this.swithToEtapeTimout);
          this.swithToEtapeTimout = undefined;
      }
      if (delay === 0) {
          this.etape = toEtape;
          this.updateEtapeText();
      }
      else {
          this.swithToEtapeTimout = setTimeout(() => {
              this.swithToEtapeTimout = undefined;
              this.etape = toEtape;
              this.updateEtapeText();
          }, delay)
      }
  }
}
