import instanceToken from "./instanceToken";
import instance from "./instance";

import authorization from "./authorization";
console.log(instanceToken);


export default {
    auth: authorization(instance),
}