// Application hooks that run for every service
const logErrors = require("../src/utils/logErrors");
const audit = require("../src/utils/audit");
const createNotification = require("../src/utils/notificationService");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [audit.before.update],
    patch: [audit.before.patch],
    remove: [audit.before.remove],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [createNotification.after.create],
    update: [audit.after.update, createNotification.after.update],
    patch: [audit.after.patch, createNotification.after.patch],
    remove: [audit.after.remove, createNotification.after.remove],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
