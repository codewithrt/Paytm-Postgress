"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config");
const zod = require("zod");
const router = express.Router();
const prisma = new client_1.PrismaClient();
const SignupZod = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req);
    const success = SignupZod.safeParse(req.body.params);
    if (!success) {
        res.status(411).json({ message: "Email already Exist!!! / Incorrect Inputs" });
        return;
    }
    const username = req.body.params.username;
    const isUser = yield prisma.user.findUnique({
        where: {
            username: username
        }
    });
    if (isUser !== null) {
        res.status(411).json({ message: "Email already Exist!!! / Incorrect Inputs" });
        return;
    }
    // Creating user with account
    const user = yield prisma.user.create({
        data: {
            username: username,
            password: req.body.params.password,
            firstName: req.body.params.firstName,
            lastName: req.body.params.lastName,
            account: {
                create: {
                    Balance: 1 + Math.random() * 10000
                }
            }
        }
    });
    const userId = user.id;
    const token = jwt.sign({
        userId: userId
    }, JWT_SECRET_KEY);
    res.status(200).json({
        message: "User Created Sucessfully",
        token: token,
    });
    return;
}));
// Sign in route
const SigninZod = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req);
    const success = SigninZod.safeParse(req);
    if (!success) {
        res.status(411).json({
            message: "Error while Logging in",
        });
        return;
    }
    const username = req.body.params.username;
    const password = req.body.params.password;
    // console.log(username,password);
    // const UserStat = await User.findOne({username:username,password:password});
    const UserStat = yield prisma.user.findUnique({
        where: {
            username: username,
            password: password
        }
    });
    if (UserStat) {
        const token = jwt.sign({
            userId: UserStat.id,
        }, JWT_SECRET_KEY);
        res.status(200).json({
            token: token,
        });
        return;
    }
    // console.log("I logged");
    res.status(411).json({
        message: "Error while Logging in",
    });
    return;
}));
// update method
router.put("/update", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.params.password;
    const firstName = req.body.params.firstName;
    const lastName = req.body.params.lastName;
    try {
        yield prisma.user.update({
            where: {
                id: req.userId
            },
            data: {
                password: password,
                firstName: firstName,
                lastName: lastName,
            }
        });
        res.status(200).json({
            message: "Updated Successfully",
        });
        return;
    }
    catch (error) {
        res.json(411).json({
            message: "Error while updating !!!",
        });
        return;
    }
}));
// Bulk
router.get("/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req);
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    let user;
    try {
        if (firstName !== '' || lastName !== '') {
            user = yield prisma.user.findMany({
                where: {
                    OR: [{
                            firstName: {
                                contains: firstName,
                                mode: 'insensitive'
                            }
                        },
                        {
                            lastName: {
                                contains: lastName,
                                mode: 'insensitive'
                            }
                        }]
                }
            });
        }
        else {
            user = yield prisma.user.findMany({});
        }
        res.status(200).json({
            users: user.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                id: user.id
            }))
        });
        return;
    }
    catch (error) {
        console.log(error);
    }
    return;
}));
// Is valid token
router.get("/IsValidToken", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const user = await User.findById({_id:req.userId});
        const user = yield prisma.user.findUnique({
            where: {
                id: req.userId
            }
        });
        if (user) {
            res.status(200).json({
                user: {
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    id: user.id
                }
            });
        }
        else {
            res.status(403).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(403).json({ message: "User not found" });
    }
}));
module.exports = router;
