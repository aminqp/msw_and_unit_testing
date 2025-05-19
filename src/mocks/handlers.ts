import {rest} from 'msw';
import {mockUsers} from "../__fixtures__/mock-users";
import {usersURL} from "../constants";


export const handlers = [
    rest.get(usersURL, (_, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(mockUsers)
        );
    }),
];
