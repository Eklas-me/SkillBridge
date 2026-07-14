// SSLCommerz configuration helper
export const SSL_CONFIG = {
  store_id: process.env.SSLCOMMERZ_STORE_ID || "testbox",
  store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD || "qwerty",
  is_live: process.env.SSLCOMMERZ_IS_SANDBOX === "false",
};
