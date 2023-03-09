"use strict";

/**
 * payment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const typeFunction = {
  "course": async (id) => {
    await strapi.service('api::course.course')
  }
}
    

module.exports = createCoreController("api::payment.payment", ({ strapi }) => ({
  async confirm(ctx) {
    const { id } = ctx.params;
    return { id };
  },
}));
