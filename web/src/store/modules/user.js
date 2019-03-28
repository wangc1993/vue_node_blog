import util from '@/utils/utils.js'

const user = {
  state: {
    username: util.getCookie('username') ? util.getCookie('username') : '',
    userId: util.getCookie('userId') ? util.getCookie('userId') : '',
    isAdmin: util.getCookie('isAdmin') ? util.getCookie('isAdmin') : '',
  },
  mutations: {
    setUsername(state, value) {
      state.username = value;
    },
    setUserId(state, value) {
      state.userId = value;
    },
    setIsAdmin(state, value) {
      state.isAdmin = value;
    }
  }
}

export default user
