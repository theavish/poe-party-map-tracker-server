import app from '@server';
import supertest from 'supertest';

import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';
import { pErr, paramMissingError } from '@shared';

describe('Users Routes', () => {

    const usersPath = '/api/users';
    const getUsersPath = `${usersPath}/all`;
    const addUsersPath = `${usersPath}/add`;
    const updateUserPath = `${usersPath}/update`;
    const deleteUserPath = `${usersPath}/delete/:id`;

    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });

    describe(`"GET:${getUsersPath}"`, () => {

        it(`should return a JSON object with all the users and a status code of "${OK}" if the
            request was successful.`, (done) => {

            const users = [
                new User('Sean Maxwell', 'sean.maxwell@gmail.com'),
                new User('John Smith', 'john.smith@gmail.com'),
                new User('Gordan Freeman', 'gordan.freeman@gmail.com'),
            ];

            spyOn(UserDao.prototype, 'getAll').and.returnValue(Promise.resolve(users));

            agent.get(getUsersPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    // Caste instance-objects to 'User' objects
                    const retUsers = res.body.users.map((user: IUser) => {
                        return new User(user);
                    });
                    expect(retUsers).toEqual(users);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {

            const errMsg = 'Could not fetch users.';
            spyOn(UserDao.prototype, 'getAll').and.throwError(errMsg);

            agent.get(getUsersPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });
});
