"use strict";

/**
 * course controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { YooCheckout } = require("@a2seven/yoo-checkout");

module.exports = createCoreController("api::course.course", ({ strapi }) => ({
  async pay(ctx) {
    const { id } = ctx.params;

    const course = await strapi.entityService.findOne(
      "api::course.course",
      id,
      {
        populate: {
          users: {
            fields: ["id"],
          },
        },
      }
    );
    if (!course) ctx.throw(404, "Course not found");
    if (course.price === 0) ctx.throw(400, "Course is free");
    if (course.users.some((user) => user.id === ctx.state.user.id))
      ctx.throw(400, "User already bought this course");

    const paymentEntities = await strapi.entityService.findMany(
      "api::payment.payment",
      {
        data: {
          user: ctx.state.user.id,
          status: "pending",
          data: {
            type: "course",
            id: course.id,
          },
        },
      }
    );
    if (paymentEntities.length > 0) ctx.throw(400, paymentEntities[0].url);

    const yookassaConfig = await strapi.entityService.findOne(
      "api::yookassa-config.yookassa-config",
      1
    );
    const checkout = new YooCheckout({
      shopId: yookassaConfig.shopId,
      secretKey: yookassaConfig.secretKey,
    });

    const origin = ctx.origin ? ctx.origin : "http://localhost:5173";
    const returnUrl = `${origin}/courses/${course.id}/confirm-payment`;

    const payment = await checkout.createPayment({
      amount: {
        value: course.price,
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: returnUrl,
      },
      capture: true,
      description: `Покупка курса "${course.title}"`,
    });
    await strapi.entityService.create("api::payment.payment", {
      data: {
        amount: course.price,
        url: payment.confirmation.confirmation_url,
        successUrl: returnUrl,
        data: {
          type: "course",
          id: course.id,
        },
        user: ctx.state.user.id,
      },
    });

    ctx.status = 200;
    ctx.body = {
      redirect: payment.confirmation.confirmation_url,
    };
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
    if (!payment) ctx.throw(404, "Payment not found");
    if (payment.status !== "pending") ctx.throw(400, "Payment is not pending");

    await strapi.entityService.update("api::course.course", payment.data.id, {
      data: {
        users: {
          connect: [payment.user.id],
        },
      },
    });
    await strapi.entityService.update("api::payment.payment", id, {
      data: {
        status: "completed",
      },
    });
    
    ctx.status = 200;
  },
}));
