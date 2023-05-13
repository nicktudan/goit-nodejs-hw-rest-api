const Joi = require("joi");

const contactsService = require("../models/contacts");
const { HttpErr } = require("../helpers/HttpErr");

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const listContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    // res.status(500).json({
    //   message: 'Server error'
    // })
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  // console.log(req.params)
  try {
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
  } catch (error) {
    // const { status = 500, message = "Server error" } = error;
    // res.status(status).json({
    //   message,
    // });
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    // console.log(error);
    if (error) {
      throw HttpErr(400, error.message);
    }
    // console.log(req.body)
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.removeContact(contactId);
    if (!result) {
      throw HttpErr(404, `Contact with ${contactId} is not found`);
    }
    res.json({ message: "Delete success" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpErr(400, error.message);
    }
    const { contactId } = req.params;
    const result = await contactsService.updateContact(contactId, req.body);
    if (!result) {
      throw HttpErr(404, `Contact with ${contactId} is not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};