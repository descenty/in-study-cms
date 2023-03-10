module.exports = {
  routes: [
    {
      method: "POST",
      path: "/courses/:id/pay",
      handler: "course.pay",
    },
    //# TODO need to get a ssl certificate and add yookassa webhook to confirm url
    {
      method: "POST",
      path: "/courses/:id/confirm-payment",
      handler: "course.confirmPayment",
    },
  ],
};
