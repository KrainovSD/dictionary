import instanceToken from "./instanceToken";
import instance from "./instance";

import authorization from "./auth";
import user from "./user";
import words from "./words";
import offline from "./offline";

export default {
  auth: authorization(instance, instanceToken),
  user: user(instance, instanceToken),
  words: words(instance, instanceToken),
  offline: offline(),
};
