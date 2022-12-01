import instanceToken from "./instanceToken";
import instance from "./instance";

import authorization from "./authorization";
import changeInfo from "./changeInfo";
import words from "./words";

export default {
  auth: authorization(instance),
  change: changeInfo(instance, instanceToken),
  words: words(instance, instanceToken),
};
