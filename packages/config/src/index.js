import configure from "./decorators/configurator";
import SsmConfigProvider from './providers/ssm';

module.exports = {
    configure: configure,
    SsmConfigProvider: SsmConfigProvider
}