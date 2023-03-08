module.exports = ({ env }) => ({
  // "rest-cache": {
  //   config: {
  //     provider: {
  //       name: "memory",
  //       getTimeout: 500,
  //       options: {
  //         max: 32767,
  //         updateAgeOnGet: false
  //       },
  //     },
  //     strategy: {
  //       contentTypes: ["api::article.article"],
  //       debug: true,
  //     },
  //   },
  // },
  transformer: {
    enabled: true,
    config: {
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      },
      requestTransforms: {
        wrapBodyWithDataKey: true,
      },
    },
  },
});
