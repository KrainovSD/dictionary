import instanceToken from "./instanceToken";
import instance from "./instance";

import authorization from "./authorization";
import changeInfo from "./changeInfo";

export default {
  auth: authorization(instance),
  change: changeInfo(instance, instanceToken),
};
