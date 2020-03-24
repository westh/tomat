const doNotDisturb = require('@sindresorhus/do-not-disturb')
const { Notification } = require('electron')

const milliPerSeconds = 1000
const secondsPerMinute = 60
const amountOfPomoMinutes = 25
const pomodoroTime = amountOfPomoMinutes * secondsPerMinute * milliPerSeconds
const notificationTime = 4 * milliPerSeconds
const sessionStartedOffset = 5 * milliPerSeconds

let counter = 1
let isDoNotDisturbedEnabled = true
let messageTimer = null
let pauseTimer = null
let pomoTimer = null

function setDoNotDisturb (state) {
  isDoNotDisturbedEnabled = state
}

function pomoNotify (config) {
  const notification = new Notification(config)
  notification.show()
  setTimeout(() => notification.close(), notificationTime)
}

function start () {
  const isLastIterationOfSession = counter === 4
  const amountOfPauseMinutes = isLastIterationOfSession ? 15 : 5
  const pauseTime = amountOfPauseMinutes * secondsPerMinute * milliPerSeconds

  if (isLastIterationOfSession)
    counter = 1

  pomoNotify({
    title: 'Focus',
    body: `Time to focus for ${amountOfPomoMinutes} min.`,
  })

  messageTimer = setTimeout(async () => {
    if (isDoNotDisturbedEnabled)
      await doNotDisturb.enable()
  }, sessionStartedOffset)

  pomoTimer = setTimeout(async () => {
    if (isDoNotDisturbedEnabled)
      await doNotDisturb.disable()

    pomoNotify({
      title: 'Chill',
      body: `Take a break for ${amountOfPauseMinutes} min.`
    })

    pauseTimer = setTimeout(async () => {
      counter++
      start()
    }, pauseTime)
  }, pomodoroTime)
}

async function stop () {
  clearTimeout(messageTimer)
  clearTimeout(pauseTimer)
  clearTimeout(pomoTimer)

  if (isDoNotDisturbedEnabled)
    await doNotDisturb.disable()
}

module.exports = { start, stop, setDoNotDisturb }
