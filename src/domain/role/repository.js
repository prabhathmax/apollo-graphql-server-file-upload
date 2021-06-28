class RoleRepository {
  constructor(knex) {
    this.database = knex;
    this.columns = [
      'id',
      'name',
      'display_name as displayName',
      'description',
      'created_at as createdAt',
      'updated_at as updatedAt',
    ];
  }

  async findForAccountId(accountId) {
    return this.database('role_user')
      .select(this.columns)
      .where({ user_id: accountId })
      .leftOuterJoin('roles', 'role_user.role_id', 'roles.id');
  }
}

export default RoleRepository;
