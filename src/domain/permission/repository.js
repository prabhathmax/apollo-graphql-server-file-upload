class PermissionRepository {
  constructor(knex) {
    this.database = knex;
    this.columns = [
      'id',
      'name',
      'displayName',
      'description',
      'created_at as createdAt',
      'updated_at as updatedAt',
    ];
  }

  async findForRole(roleId) {
    return this.database('permission_role')
      .select(this.columns)
      .where({ role_id: roleId })
      .leftOuterJoin('permissions', 'permission_role.permission_id', 'permissions.id');
  }
}

export default PermissionRepository;
