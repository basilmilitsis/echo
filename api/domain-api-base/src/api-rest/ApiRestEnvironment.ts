import { BaseEnvironment } from '@root/common';

export class ApiRestEnvironment extends BaseEnvironment {
    static readonly apiRest_port: number = ApiRestEnvironment.parseInt(process.env.API_REST_PORT);
}
