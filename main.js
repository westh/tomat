const { app, Tray, Menu } = require('electron')
const pomo = require('./pomo')

const offIcon = `${__dirname}/tomatOffTemplate.png`
const onIcon = `${__dirname}/tomatOnTemplate.png`

let appIcon = null
let toggleDoNotDisturb = true

app.dock.hide()

function turnOff () {
  appIcon.setImage(offIcon)
  appIcon.setContextMenu(menu(false))
  pomo.stop()
}

function turnOn () {
  appIcon.setImage(onIcon)
  appIcon.setContextMenu(menu(true))
  pomo.start()
}

function setDoNotDisturbState () {
  toggleDoNotDisturb = !toggleDoNotDisturb
  pomo.setDoNotDisturb(toggleDoNotDisturb)
}

function menu (on) {
 return Menu.buildFromTemplate([
    {
      label: (on ? 'Tomat: On' : 'Tomat: Off'),
      enabled: false
    },
    {
      label: (on ? 'Turn Tomat Off' : 'Turn Tomat On'),
      click: (on ? turnOff : turnOn)
    },
    {
      type: 'separator'
    },
    {
      label: 'Toggle do not disturb',
      type: 'checkbox',
      checked: toggleDoNotDisturb,
      click: setDoNotDisturbState,
      toolTip: 'Toggle do not disturb when a new tomat session starts',
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      role: 'quit'
    }
  ])
}

app.on('ready', () => {
  appIcon = new Tray(offIcon)
  appIcon.setContextMenu(menu(false))
})

app.on('before-quit', async event => {
  event.preventDefault()
  await pomo.stop()
  app.exit()
})
