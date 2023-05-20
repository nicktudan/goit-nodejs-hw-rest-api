const express = require("express");

const contactsController = require("../../controllers/contacts");
const schema = require("../../schemas/schema");
const { validateBody } = require("../../decorators");

const router = express.Router();

router.get("/", contactsController.listContacts);

router.get("/:contactId", contactsController.getContactById);

router.post(
  "/",
  validateBody(schema.contactAddSchema),
  contactsController.addContact
);

router.delete("/:contactId", contactsController.removeContact);

router.put(
  "/:contactId",
  validateBody(schema.contactAddSchema),
  contactsController.updateContact
);

module.exports = router;
