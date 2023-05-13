const contactsService = require("../models/contacts");
const { HttpErr } = require("../helpers/HttpErr");
const { tryCatchWrapper } = require('../decorators');


const listContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.json(result);
};

const getContactById = async (req, res) => {
  // console.log(req.params)
  const { contactId } = req.params;
  const result = await contactsService.getContactById(contactId);
  if (!result) {
    // return res.status(404).json({
    //   message: `Contact with ${contactId} is not found`,
    // });
    // const error = new Error(`Contact with ${contactId} is not found`);
    // error.status = 404;
    // throw error;
    throw HttpErr(404, `Contact with ${contactId} is not found`);
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await contactsService.removeContact(contactId);
  if (!result) {
    throw HttpErr(404, `Contact with ${contactId} is not found`);
  }
  res.json({ message: "Delete success" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await contactsService.updateContact(contactId, req.body);
  if (!result) {
    throw HttpErr(404, `Contact with ${contactId} is not found`);
  }
  res.json(result);
};

module.exports = {
  listContacts: tryCatchWrapper(listContacts),
  getContactById: tryCatchWrapper(getContactById),
  addContact: tryCatchWrapper(addContact),
  removeContact: tryCatchWrapper(removeContact),
  updateContact: tryCatchWrapper(updateContact),
};