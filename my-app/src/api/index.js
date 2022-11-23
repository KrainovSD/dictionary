//import instanceToken from "./instanceToken";
import instance from "./instance";

import authorization from "./authorization";

export default {
  auth: authorization(instance),
};
