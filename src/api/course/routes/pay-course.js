module.exports = {
  routes: [
    {
      method: "POST",
      path: "/courses/:id/pay",
      handler: "course.pay",
    },
    {
      method: "POST",
      path: "/courses/:id/confirm-payment",
      handler: "course.confirmPayment",
    },
  ],
};
