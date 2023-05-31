const express = require("express");

const {contactsController} = require("../../controllers");
const schema = require("../../schemas/schema");
const { validateBody, isValidId } = require("../../decorators");
const { authenticate } = require("../../middlewares");

const router = express.Router();

// ALTERNATIVE - We can use this middleware when it needs to be added to each request 
// router.use(authenticate);

router.get("/", authenticate, contactsController.listContacts);

router.get("/:contactId", authenticate, isValidId, contactsController.getContactById);

router.post(
  "/",
  authenticate,
  validateBody(schema.contactAddSchema),
  contactsController.addContact
);

router.delete(
  "/:contactId",
  authenticate,
  isValidId,
  contactsController.removeContact
);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schema.contactAddSchema),
  contactsController.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schema.updateFavoriteSchema),
  contactsController.updateStatusContact
);

module.exports = router;
