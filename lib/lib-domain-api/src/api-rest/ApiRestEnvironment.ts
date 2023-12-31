import { RootEnvironment } from '@echo/lib-common';

export class ApiRestEnvironment extends RootEnvironment {
    static readonly apiRest_port: number = ApiRestEnvironment.parseInt('APIREST_API_PORT');

    static readonly apiRest_eventstoreDB_host: string = ApiRestEnvironment.parseString('APIREST_EVENTSTOREDB_HOST');
    static readonly apiRest_eventstoreDB_port: number = ApiRestEnvironment.parseInt('APIREST_EVENTSTOREDB_PORT');

    static readonly apiRest_Jwt_Secret_Key: string = ApiRestEnvironment.parseString('APIREST_JWT_SECRET_KEY');
}
