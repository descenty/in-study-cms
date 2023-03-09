module.exports = {
  routes: [
    {
      method: "POST",
      path: "/payments/:id/confirm",
      handler: "payment.confirm",
    },
  ],
};
