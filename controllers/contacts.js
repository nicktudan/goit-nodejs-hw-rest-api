const Contact = require("../models/contact");
const { HttpErr } = require("../helpers");
const { tryCatchWrapper } = require("../decorators");

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  // console.log(req.query);
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "-createAt -updateAt", {skip, limit})
    .populate(
    "owner",
    "email"
  );
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpErr(404, `Contact with ${contactId} is not found`);
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({...req.body, owner});
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw HttpErr(404, `Contact with ${contactId} is not found`);
  }
  res.json({ message: "Contact deleted" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
  if (!result) {
    throw HttpErr(404, `Contact with ${contactId} is not found`);
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
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
  updateStatusContact: tryCatchWrapper(updateStatusContact),
};
