"use strict";

/**
 * course controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::course.course", ({ strapi }) => ({
  async pay(ctx) {
    const { id } = ctx.params;
    // const { amount, currency, source, description } = ctx.request.body;
    return { id };
  },
  async confirmPayment(ctx) {
    const { id } = ctx.params;
    const payment = await strapi.entityService.findOne(
      "api::payment.payment",
      id,
      {
        populate: {
          user: {
            fields: ["id"],
          },
        },
      }
    );
    const user = await strapi.entityService.findMany(
      "plugin::users-permissions.user.course"
    );
    return user;
    // id,
    // });
    // return test;
    // return payment;
  },
}));
