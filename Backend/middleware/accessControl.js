import policies from "../utils/policies.js";
import permissions from "../utils/permission.js";

// utility function to check if the user has the required permission
const hasPermission = (role, resource, action) => {
    return permissions[role] && permissions[role][resource] && permissions[role][resource].includes(action)
}

/**
 * @param {string} role - the user's role, e.g. { "users", "admin", "manager" }
 * @param {string} resource - the resource the user is trying to access, e.g. { "users" , "booking", "rooms", "amenities", "events"}
 * @param {string} action - the action the user is trying to perform, e.g. { update, delete, create, view, view_all }
 */

const accessControl = (resource, action) => {
    return (req, res, next) =>{
        const role = req.user.role;
        if (!hasPermission(role, resource, action)) {
            return res.status(403).send({ message: "Access denied: insufficient permissions" });
        }

        // Check if the policy allows the action for the user role
        const resourcePolicy = policies[resource];  
        if(!resourcePolicy){
            return res.status(404).send({ message: `Access denied: no policy for resource "${resource}"` });
        }

        //check if the policies with the resources have the specific action("view", "delete", "create", "update", "view_all")
        const actionPolicy = resourcePolicy[action];
        if(!actionPolicy){
            return res.status(404).send({ message: `Access denied: no policy for action "${action}" on "${resource}"`});
        }

        //run the policy to check if access is allowed
        const allowed = actionPolicy(req);//pass the entire req.user.role as parameter to policies.js
        if(!allowed){
            return res.status(403).json({ message: "Access denied: policy check failed" });
        }

        next();//allowed, proceed to the next middleware or controller
    }
}

export default accessControl;