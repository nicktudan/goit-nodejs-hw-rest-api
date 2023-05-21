const express = require("express");

const contactsController = require("../../controllers/contacts");
const schema = require("../../schemas/schema");
const { validateBody, isValidId } = require("../../decorators");

const router = express.Router();

router.get("/", contactsController.listContacts);

router.get("/:contactId", isValidId, contactsController.getContactById);

router.post(
  "/",
  validateBody(schema.contactAddSchema),
  contactsController.addContact
);

router.delete("/:contactId", isValidId, contactsController.removeContact);

router.put(
  "/:contactId", isValidId,
  validateBody(schema.contactAddSchema),
  contactsController.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schema.updateFavoriteSchema),
  contactsController.updateStatusContact
);

module.exports = router;
