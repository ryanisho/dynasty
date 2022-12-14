const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 135
  },
  imageSrc: './img/shop.png',
  scale: 2.7,
  framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
      x: 0,
      y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
      x: 215,
      y: 157
    },
    sprites: {
      idle: {
        imageSrc: './img/samuraiMack/Idle.png',
        framesMax: 8
      },
      run: {
        imageSrc: './img/samuraiMack/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/samuraiMack/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/samuraiMack/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/samuraiMack/Attack1.png',
        framesMax: 6
      },
      takeHit: {
        imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
        framesMax: 4
      },
      death: {
        imageSrc: './img/samuraiMack/Death.png',
        framesMax: 6
      }
    },
    attackBox: {
      offset: {
        x: 100,
        y: 50,
      },
      width: 160,
      height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
      x: -50,
      y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
      x: 215,
      y: 167
    },
    sprites: {
      idle: {
        imageSrc: './img/kenji/Idle.png',
        framesMax: 4
      },
      run: {
        imageSrc: './img/kenji/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/kenji/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/kenji/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/kenji/Attack1.png',
        framesMax: 4
      },
      takeHit: {
        imageSrc: './img/kenji/Take hit.png',
        framesMax: 3
      },
      death: {
        imageSrc: './img/kenji/Death.png',
        framesMax: 7
      }
    },
    attackBox: {
      offset: {
        x: -170,
        y: 50,
      },
      width: 170,
      height: 50
    }
})

enemy.draw()

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectangularCollision({rectangle1, rectangle2}){
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function determineWinner({player, enemy, timerID}){
  clearTimeout(timerID)
  document.querySelector('#displayText').style.display = 'flex'
  if (player.health === enemy.health){
    document.querySelector('#displayText').innerHTML = 'Tie'
  }
  else if (player.health > enemy.health){
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
  }
  else if (enemy.health > player.health){
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
  }
}


let timer = 60
let tiemrID

function decreaseTimer(){

  if (timer > 0){
    timerID = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0){
    document.querySelector('#displayText').style.display = 'flex'
    determineWinner({player, enemy, timerID})
  }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.1525)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // Player Movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else{
      player.switchSprite('idle')
    }

    // Jump
    if (player.velocity.y < 0){
      player.switchSprite('jump')
    }
    else if (player.velocity.y > 0){
      player.switchSprite('fall')
    }

    // Enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
      enemy.switchSprite('idle')
    }

    // Jump
    if (enemy.velocity.y < 0){
      enemy.switchSprite('jump')
    }
    else if (enemy.velocity.y > 0){
      enemy.switchSprite('fall')
    }


    // Detect for collision
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
      }) && player.isAttacking 
      && player.isAttacking && player.framesCurrent === 4) 
      // So that the sword animation and health takeaway actually matches up
    {
      enemy.takeHit()
      player.isAttacking = false
      gsap.to('#enemyHealth', {
        width: enemy.health + '%'
      })
    }

    // If player misses
    if (player.isAttacking && player.framesCurrent === 4){
      player.isAttacking = false
    }

    // Enemy Collision
    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
      }) && 
      enemy.isAttacking && enemy.framesCurrent === 2)
    {
      player.takeHit()
      enemy.isAttacking = false
      gsap.to('#playerHealth', {
        width: player.health + '%'
      })
    }

    // If enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2){
      enemy.isAttacking = false
    }

    // End Game based on Health
    if (enemy.health <= 0 || player.health <= 0){
      determineWinner({player, enemy, timerID})
    }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead){
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break

        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break

        case 'w':
            player.velocity.y = -20
            break
        case 's':
          player.attack()
          break  
    }}

    if (!enemy.dead){
    switch(event.key){
      case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break

        case 'ArrowUp':
            enemy.velocity.y = -20
            break

        case 'ArrowDown':
            enemy.attack()
            break

    }
  }
  })


window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break
    }
    // Enemy Keyup Listeners
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})
