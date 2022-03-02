let saved = []
readSaved()
document.querySelector('.add').addEventListener('click', getData)

/**
 * Reads data in Localstorage
 * @returns {void}
 */
function readSaved () {
  if (localStorage.getItem('groups')) {
    saved = JSON.parse(localStorage.getItem('groups'))
    saved.forEach(item => {
    const tr = document.createElement('tr')
    tr.classList.add('team')
    tr.innerHTML = `
      <td><span class="bar"></span>${item.groupname}</td>
      <td class="start">${item.start}</td>
      <td class="end">${item.end}</td>
      <td class="timeLeft"></td>
      <td><i class='bx bx-trash'></i></td>
    `
    document.querySelector('main table').appendChild(tr)
    })
    deleteGroup()
  }
  return
}

function getData(e) {
  e.preventDefault()
  const now = moment()
  const then = now.clone().add('95', 'm')
  const groupName = document.querySelector('#group_input').value
  createNewGroup(now, then, groupName)  
  deleteGroup()
}


/**
 * Creates a new group
 * @param {string} start Start point of timer
 * @param {string} end End point of timer
 * @param {string} groupName Value of input field
 * @returns {void}
 */
function createNewGroup(start, end, groupName) {
  const timeleft = end.diff(start, 'minutes')
  const tr = document.createElement('tr')
  tr.classList.add('team')
  tr.innerHTML = `
    <td><span class="bar"></span>${groupName}</td>
    <td class="start">${start.format('HH:mm:ss')}</td>
    <td class="end">${end.format('HH:mm:ss')}</td>
    <td class="timeLeft">${timeleft}</td>
    <td><i class='bx bx-trash'></i></td>
  `

  const newSave = {
    groupname: groupName,
    start: start.format('HH:mm:ss'),
    end: end.format('HH:mm:ss'),
    checked: false
  }

  saved.push(newSave)
  localStorage.setItem('groups', JSON.stringify(saved))
  saved = JSON.parse(localStorage.getItem('groups'))
  document.querySelector('main table').appendChild(tr)
}

/**
 * Remaps a number using min max values
 * @param {number} x input number
 * @param {number} inMin Minimum expected input
 * @param {number} inMax Maximum expected input
 * @param {number} outMin Minimum desired output
 * @param {number} outMax Maximum desired output
 * @returns {number} output number
 */
function remap (x, inMin, inMax, outMin, outMax) {
  return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function deleteGroup() {
  document.querySelectorAll('.bx-trash').forEach((trash, i) => {
    trash.addEventListener('click', e => {
      console.log( trash.parentElement.parentElement, i)
      trash.parentElement.parentElement.remove()
      saved.splice(i,1)
      localStorage.setItem('groups', JSON.stringify(saved))
    })
  })
}

refresher = setInterval( function() {
  if (document.querySelector('.team')) {
    document.querySelectorAll('.team').forEach(function(group) {
      const end = moment(group.querySelector('.end').innerText, 'hh:mm:ss')
      let difference = end.diff(moment())
      const minutes = (difference / 1000) / 60
      const seconds = (difference / 1000) % 60
      if (difference <= 0 ){
          difference = 0
          group.querySelector('.bar').style.width = '0%'
          group.querySelector('.timeLeft').innerText = `Out of time`
      } else {
        const reWidth = remap( difference, 0, 5700000, 0, 100)
        group.querySelector('.bar').style.width = Math.floor(reWidth) + '%'
        group.querySelector('.timeLeft').innerText = `${Math.floor(minutes)} Minutes ${Math.floor(seconds)} Seconds`
      }
    })
  }
} , 1000)