import User from '@modules/users/infra/typeorm/entities/User';

export default {
  render(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      is_verified: user.classic_info.is_verified
    };
  },
  renderMany(users: User[]) {
    return users.map(user => this.render(user));
  }
};
