export const getUsers = () => {
  window.electron.ipcRenderer.sendMessage('dialog:getAllUsers', []);
}

interface User {
  name:string,
  surname:string
}

export const addUser = (user: User) => {
  window.electron.ipcRenderer.sendMessage('dialog:addUser', [user]);
}