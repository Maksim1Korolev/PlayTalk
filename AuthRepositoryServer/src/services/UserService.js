class UserService {
  static usersMap = new Map();

  static loadUsers(users) {
    users.forEach(user => this.usersMap.set(user.username, user));
  }

  static addUser(user) {
    this.usersMap.set(user.username, user);
  }

  static getUsers() {
    return Array.from(this.usersMap.values());
  }

  static getUserByUsername(username) {
    return this.usersMap.get(username);
  }

  static getUserById(userId) {
    for (let user of this.usersMap.values()) {
      if (user._id.toString() === userId) {
        return user;
      }
    }
    return null;
  }

  static updateUser(updatedUser) {
    if (this.usersMap.has(updatedUser.username)) {
      this.usersMap.set(updatedUser.username, {
        ...this.usersMap.get(updatedUser.username),
        ...updatedUser,
      });
      return this.usersMap.get(updatedUser.username);
    }
    throw new Error("User not found");
  }

  static deleteUser(userId) {
    for (let [username, user] of this.usersMap) {
      if (user._id.toString() === userId) {
        this.usersMap.delete(username);
        return user;
      }
    }
    throw new Error("User not found");
  }
}

export default UserService;
