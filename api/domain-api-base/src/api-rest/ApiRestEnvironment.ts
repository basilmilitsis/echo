import { RootEnvironment } from '@root/common';

export class ApiRestEnvironment extends RootEnvironment {
    static readonly apiRest_port: number = ApiRestEnvironment.parseInt('APIREST_API_PORT');

    static readonly apiRest_eventstoreDB_host: string = ApiRestEnvironment.parseString('APIREST_EVENTSTOREDB_HOST');
    static readonly apiRest_eventstoreDB_port: number = ApiRestEnvironment.parseInt('APIREST_EVENTSTOREDB_PORT');
}
