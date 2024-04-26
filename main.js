const addTask = document.getElementById('btn-task')
const inputTask = document.querySelector('input')
const tasksContainer = document.querySelector('.tasks-container')
const taskName = document.getElementById('taskName')
let tasks = [],
  timer = null,
  time = 0,
  timerBreak = null,
  current = 0,
  taskId = 0
renderTime()
function renderTime() {
  const timeFormat = document.querySelector('.time-format')
  let minute = parseInt(time / 60)
  let seconds = parseInt(time % 60)
  timeFormat.innerHTML = `${minute < 10 ? '0' : ''}${minute}:${
    seconds < 10 ? '0' : ''
  }${seconds}`
}
addTask.addEventListener('click', (e) => {
  e.preventDefault()
  let name = inputTask.value
  createTasks(name)
  inputTask.value = ''
})
function createTasks(name) {
  if (name !== '') {
    tasks = [...tasks, { id: taskId++, name, make: false, completed: false }]
    renderTasks(tasks)
    // TODO Make a modal
  } else alert("You can't Create a task without title")
}

function renderTasks(tasks) {
  renderTime()
  tasksContainer.innerHTML = tasks.map((task) => taskCard(task)).join('')
  const buttonsStart = document.querySelectorAll('.btn-start button')
  const buttonsDelete = document.querySelectorAll('.btn-delete')
  buttonsStart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (!timer && !timerBreak) {
        startTask(e)
      } else {
        // TODO Make a modal
        alert('Please Wait until the task finishes. For to start 😎')
      }
    })
  })
  buttonsDelete.forEach((btn) => {
    btn.addEventListener('click', deleteTask)
  })
}
const taskCard = ({ id, name, make, completed }) => {
  return `<div class='task' ${make ? `style='border-color:#8e3ce0'` : ''}>
    <div class='title'>${name}</div>
    <div class='buttons'>
    <div class='btn-start'>
    ${
      completed
        ? `<span class='done'>👌Task completed </span>`
        : `<button data-id=${id} >${
            !make ? `Start 📤` : `In Process...`
          } </button>`
    }
    </div>
    <button class='btn-delete' data-id=${id} id='delete'>Delete 📥</button>
    </div>
 </div>`
}
const startTask = ({ target }) => {
  current = target.getAttribute('data-id')
  let newTasks = tasks.map((task) => {
    if (task.id == current) {
      task.make = true
      taskName.textContent = task.name
      time = 25 * 60
      timer = setInterval(() => handlerTimer(), 1000)
    }
    return task
  })
  renderTasks(newTasks)
  //TODO  Make a modal
}
const deleteTask = ({ target }) => {
  let id = target.getAttribute('data-id')
  let task = tasks.find((task) => task.id == id)
  if (id == current && time != 0) {
    time = 0
    clearInterval(timer)
    clearInterval(timerBreak)
    timer = null
    timerBreak = null
    renderTime()
    tasks = tasks.filter((task) => task.id != id)
    taskName.innerHTML = `deleted task called, <b style='color:red'>${task.name}</b>`
    renderTasks(tasks)
  } else {
    tasks = tasks.filter((task) => task.id != id)
    renderTasks(tasks)
  }
}
function handlerTimer() {
  time--
  if (time == 0) {
    clearInterval(timer)
    completeTask()
  }
  renderTime()
}
const completeTask = () => {
  let newTasks = tasks.map((task) => {
    task.id == current ? (task.completed = true) : ''
    return task
  })
  timer = null
  // this is the tim of rest (break)
  time = 5 * 60
  timerBreak = setInterval(() => handlerBreakTimer(), 1000)
  taskName.textContent = 'OK , This is the Break Time 🤓☠👻'
  renderTasks(newTasks)
  clearInterval(timer)
}
function handlerBreakTimer() {
  console.log('object')
  time--
  if (time == 0) {
    time = 0
    clearInterval(timerBreak)
    timerBreak = null
    current = null
    taskName.textContent = ''
  }
  renderTime()
}
