let firstNameEl = document.getElementById('firstName')
let lastNameEl = document.getElementById('lastName')
let firstNameErrMsgEl = document.getElementById('firstNameErrMsg')
let lastNameErrMsgEl = document.getElementById('lastNameErrMsg')

let emailEl = document.getElementById('email')
let emailErrMsgEl = document.getElementById('emailErrMsg')

let departmentEl = document.getElementById('department')
let departmentErrMsgEl = document.getElementById('departmentErrMsg')

let myFormEl = document.getElementById('myForm')

let userListContainerEl = document.getElementById('userListContainer')
let url = 'https://jsonplaceholder.typicode.com/users'

let formData = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
}
const getUserList = async () => {
  try {
    const response = await fetch(url)
    const users = await response.json()
    displayUsers(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    userListContainerEl.innerHTML = `<li class="user-item">Error loading users. Please try again later.</li>`
  }
}
// Edit User function
const editUser = user => {
  firstNameEl.value = user.name.split(' ')[0]
  lastNameEl.value = user.name.split(' ')[1] || ''
  emailEl.value = user.email
  departmentEl.value = user.department || ''
  formData.firstName = user.name.split(' ')[0]
  formData.lastName = user.name.split(' ')[1] || ''
  formData.email = user.email
  formData.department = user.department || ''

  myFormEl.setAttribute('data-edit-user-id', user.id)
  let submitButton = document.getElementById('submitBtn')
  submitButton.textContent = 'Update User'
}
const updateUser = (userId, formData) => {
  let options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(formData),
  }

  fetch(`${url}/${userId}`, options)
    .then(function (response) {
      return response.json()
    })
    .then(function (jsonData) {
      console.log(jsonData)
      getUserList() // Reload the list of users after updating
    })
}

// Delete User function
const deleteUser = userId => {
  if (confirm('Are you sure you want to delete this user?')) {
    let options = {
      method: 'DELETE',
    }

    fetch(`${url}/${userId}`, options)
      .then(() => {
        console.log('User deleted successfully')
        getUserList() // Reload the list of users after deleting
      })
      .catch(error => console.error('Error deleting user:', error))
  }
}
// Create User List Item
const createUserListItem = user => {
  const listItem = document.createElement('li')
  listItem.classList.add('d-flex', 'flex-row', 'user-container')
  listItem.setAttribute('data-user-id', user.id)

  // User details
  const userDetailsDiv = document.createElement('div')
  userDetailsDiv.classList.add('d-flex', 'flex-column', 'user-details-con')
  listItem.appendChild(userDetailsDiv)

  const userNameEl = document.createElement('p')
  userNameEl.textContent = user.name
  userNameEl.classList.add('user-name')
  userDetailsDiv.appendChild(userNameEl)

  const userEmailEl = document.createElement('p')
  userEmailEl.textContent = user.email
  userEmailEl.classList.add('user-email')
  userDetailsDiv.appendChild(userEmailEl)

  const userDepartmentEl = document.createElement('p')
  userDepartmentEl.textContent = user.department || 'No Department'
  userDepartmentEl.classList.add('user-department')
  userDetailsDiv.appendChild(userDepartmentEl)

  // User actions
  const userActionDiv = document.createElement('div')
  userActionDiv.classList.add(
    'd-flex',
    'flex-row',
    'justify-content-around',
    'align-tems-center',
    'user-action-container',
  )
  listItem.appendChild(userActionDiv)

  // Edit button
  const editButton = document.createElement('button')
  editButton.textContent = 'Edit'
  editButton.addEventListener('click', () => editUser(user))
  userActionDiv.appendChild(editButton)

  // Delete button
  const deleteButton = document.createElement('button')
  deleteButton.textContent = 'Delete'
  deleteButton.addEventListener('click', () => deleteUser(user.id))
  userActionDiv.appendChild(deleteButton)

  // Append to the list
  userListContainerEl.appendChild(listItem)
}

// Display Users function
const displayUsers = users => {
  // Clear existing content
  userListContainerEl.innerHTML = ''
  users.forEach(user => createUserListItem(user))
}

// Get User List function

// Validate Form Data function
function validateFormData(formData) {
  let {firstName, lastName, email, department} = formData
  if (firstName === '') {
    firstNameErrMsgEl.textContent = 'Required*'
  }
  if (lastName === '') {
    lastNameErrMsgEl.textContent = 'Required*'
  }
  if (email === '') {
    emailErrMsgEl.textContent = 'Required*'
  }
  if (department === '') {
    departmentErrMsgEl.textContent = 'Required*'
  }
}

// Submit Form Data function
function submitFormData(formData) {
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(formData),
  }

  fetch(url, options)
    .then(function (response) {
      return response.json()
    })
    .then(function (jsonData) {
      console.log(jsonData)
      getUserList() // Reload the list of users after adding
    })
}

// Form Submit Event Listener
myFormEl.addEventListener('submit', function (event) {
  event.preventDefault()
  validateFormData(formData)
  const editUserId = myFormEl.getAttribute('data-edit-user-id')
  if (editUserId) {
    updateUser(editUserId, formData) // Update existing user
  } else {
    submitFormData(formData) // Add new user
  }

  // Reset form
  myFormEl.reset()
  myFormEl.removeAttribute('data-edit-user-id')
  let submitButton = document.getElementById('submitBtn')
  submitButton.textContent = 'Add User' // Change the text of the submit button
})

// Update User function

// Initial load of users
getUserList()
