import instance from "./instance";
import testConnections from "./testConnection";
import authorization from "./authorization";

export default {
    testConnection: testConnections(instance),
    auth: authorization(instance),
}