import policies from "../utils/policies.js";
import permissions from "../utils/permission.js";

// Check if the user has the required permission
const hasPermission = (role, resource, action) => {
  return (
    permissions[role] &&
    permissions[role][resource] &&
    permissions[role][resource].includes(action)
  );
};

/**
 * @param {string} resource - The resource being accessed.
 * @param {string|string[]} actions - A single action or an array of actions to verify.
 */
const accessControl = (resource, actions) => {
  return (req, res, next) => {
    const role = req.user.role;
    const actionsToCheck = Array.isArray(actions) ? actions : [actions];

    for (let action of actionsToCheck) {
      // 1. Permission Check
      if (!hasPermission(role, resource, action)) {
        res.locals.errorMessage = "Access denied insufficien permission";
        return res
          .status(403)
          .send({
            message: `Access denied: insufficient permissions`,
          });
      }

      // 2. Policy Resource Exists
      const resourcePolicy = policies[resource];
      if (!resourcePolicy) {
        res.locals.errorMessage = `No policy defined for resource "${resource}"`;
        return res
          .status(404)
          .send({
            message: `Access denied: no policy defined for resource "${resource}"`,
          });
      }

      // 3. Policy Action Exists
      const actionPolicy = resourcePolicy[action];
      if (!actionPolicy) {
        res.locals.errorMessage = `No policy defined found on action="${action}" with this "${resources}"`;
        return res
          .status(404)
          .send({
            message: `Access denied: no policy defined for action "${action}" on "${resource}"`,
          });
      }

      // 4. Run Policy
      const allowed = actionPolicy(req);
      if (!allowed) {
        res.locals.errorMessage = `Policy check failed: action=${action}, resource=${resource}`;
        return res
          .status(403)
          .send({
            message: `Access denied: policy check failed for action "${action}" on resource "${resource}"`,
          });
      }
    }

    // All actions passed
    next();
  };
};

export default accessControl;
