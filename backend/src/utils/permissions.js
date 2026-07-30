// Role hierarchy: owner > admin > editor > viewer
const ROLE_RANK = { owner: 4, admin: 3, editor: 2, viewer: 1 };

const getMember = (workspace, userId) =>
  workspace.members.find((m) => m.user.toString() === userId.toString());

const requireMember = (workspace, userId) => {
  const member = getMember(workspace, userId);
  if (!member) {
    const err = new Error("You are not a member of this workspace");
    err.statusCode = 403;
    throw err;
  }
  return member;
};

const requireRole = (workspace, userId, minRole) => {
  const member = requireMember(workspace, userId);
  if (ROLE_RANK[member.role] < ROLE_RANK[minRole]) {
    const err = new Error(`This action requires ${minRole} role or higher`);
    err.statusCode = 403;
    throw err;
  }
  return member;
};

module.exports = { getMember, requireMember, requireRole, ROLE_RANK };
