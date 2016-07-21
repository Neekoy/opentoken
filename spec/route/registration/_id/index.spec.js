"use strict";

var registrationManagerMock;

jasmine.routeTester("/registration/_id", (container) => {
    registrationManagerMock = require("../../../mock/registration-manager-mock")();
    container.register("registrationManager", registrationManagerMock);
}, (routeTester) => {
    it("exports the right methods", () => {
        expect(Object.keys(routeTester.exports).sort()).toEqual([
            "get",
            "name",
            "post"
        ]);
    });
    describe("GET", () => {
        it("returns the registration configuration", () => {
            routeTester.req.params.id = "id";

            return routeTester.get().then(() => {
                expect(registrationManagerMock.getRecordAsync).toHaveBeenCalledWith("id");
                expect(routeTester.res.linkObjects).toEqual([
                    {
                        href: "rendered route: registration-secure, id:\"id\"",
                        profile: "/schema/registration/secure-request.json",
                        rel: "edit",
                        title: "registration-secure"
                    },
                    {
                        href: "rendered route: registration-secure-qr, id:\"id\"",
                        rel: "item",
                        title: "registration-secure-qr"
                    }
                ]);
                expect(routeTester.res.send).toHaveBeenCalledWith({
                    secure: "info"
                });
            });
        });
    });
    describe("POST", () => {
        beforeEach(() => {
            routeTester.req.params.id = "id";
        });
        it("validates the request", () => {
            return routeTester.post({}).then(jasmine.fail, (err) => {
                expect(err).toBe(false);
            });
        });
        it("secures the account", () => {
            var body;

            body = {
                mfa: {
                    totp: {
                        current: "000000",
                        previous: "111111"
                    }
                },
                passwordHash: "abcdefghijklmnopqrstuvwxyz"
            };

            return routeTester.post(body).then(() => {
                expect(registrationManagerMock.secureAsync).toHaveBeenCalledWith("id", body, routeTester.server);
                expect(routeTester.res.send).toHaveBeenCalledWith(204);
                expect(routeTester.res.linkObjects).toEqual([
                    {
                        href: "rendered route: registration-secure, id:\"id\"",
                        rel: "self"
                    }
                ]);
            });
        });
    });
});