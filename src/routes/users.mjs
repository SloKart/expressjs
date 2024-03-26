import { Router } from "express";
import { query } from "express-validator";
const router = Router();


router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("filter is required")
    .isLength({ min: 3, max: 10 })
    .withMessage("filter must be between 3 and 10 characters"),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);
    const {
      query: { filter, value },
    } = req;
    if (filter && value) {
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    }
    return res.send(mockUsers);
  }
);
export default router;