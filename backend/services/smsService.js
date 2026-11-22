// SMS hook. No SMS gateway is connected: messages are logged so the flow can be
// tested. Connect the department's approved gateway here (e.g. the NIC SMS
// service) — the rest of the app already calls send() at every status change.
exports.send = (mobile, message) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`[sms:not-sent] to ${mobile.slice(0, 2)}******${mobile.slice(-2)}: ${message}`);
  }
};
