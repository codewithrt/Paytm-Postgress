import { PrismaClient } from "@prisma/client";
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config");
const zod = require("zod");

const router = express.Router();

const prisma = new PrismaClient();

const SignupZod = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
})

router.post("/signup", async (req: any, res: any) => {
    // console.log(req);
    const success = SignupZod.safeParse(req.body.params);
    if (!success) {
        res.status(411).json({ message: "Email already Exist!!! / Incorrect Inputs" });
        return;
    }
    // const username = req.body.params.username;
    const username = req.body.username;
    const isUser = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    if (isUser !== null) {
        res.status(411).json({ message: "Email already Exist!!! / Incorrect Inputs" });
        return;
    }

    // Creating user with account
    const user = await prisma.user.create({
        data: {
            username: username,
            // password: req.body.params.password,
            // firstName: req.body.params.firstName,
            // lastName: req.body.params.lastName,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            account: {
                create: {
                    Balance: 1 + Math.random() * 10000
                }
            }
        }
    })


    const userId = user.id;
    const token = jwt.sign({
        userId: userId
    }, JWT_SECRET_KEY);

    res.status(200).json({
        message: "User Created Sucessfully",
        token: token,
    })
    return;
})


// Sign in route
const SigninZod = zod.object({
    username: zod.string().email(),
    password: zod.string(),
})
router.post("/signin", async (req: any, res: any) => {
    // console.log(req);
    const success = SigninZod.safeParse(req);
    if (!success) {
        res.status(411).json({
            message: "Error while Logging in",
        })
        return;
    }
    const username = req.body.params.username;
    const password = req.body.params.password;
    // console.log(username,password);
    // const UserStat = await User.findOne({username:username,password:password});
    const UserStat = await prisma.user.findUnique({
        where: {
            username: username,
            password: password
        }
    })

    if (UserStat) {
        const token = jwt.sign({
            userId: UserStat.id,
        }, JWT_SECRET_KEY)
        res.status(200).json({
            token: token,
        })
        return;
    }
    // console.log("I logged");
    res.status(411).json({
        message: "Error while Logging in",
    })
    return;
})

// update method

router.put("/update", authMiddleware, async (req: any, res: any) => {
    const password = req.body.params.password;
    const firstName = req.body.params.firstName;
    const lastName = req.body.params.lastName;

    try {
        await prisma.user.update({
            where: {
                id: req.userId
            },
            data: {
                password: password,
                firstName: firstName,
                lastName: lastName,
            }
        })
        res.status(200).json({
            message: "Updated Successfully",
        })
        return;
    } catch (error) {
        res.json(411).json({
            message: "Error while updating !!!",
        })
        return;
    }

})

// Bulk
router.get("/bulk", async (req: any, res: any) => {
    // console.log(req);
    
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;

    
    let user
    try {
        if (firstName !== '' || lastName !== '') {

            user = await prisma.user.findMany({
                where: {
                    OR: [{
                        firstName: {
                            contains: firstName,
                            mode: 'insensitive'
                        }},
                        {
                        lastName: {
                            contains: lastName,
                            mode: 'insensitive'
                        }
                    }]
                }
            })
        } else {
            user = await prisma.user.findMany({});
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
    } catch (error) {
        console.log(error);
    }

    return;
})

// Is valid token
router.get("/IsValidToken", authMiddleware, async (req: any, res: any) => {
    try {
        // const user = await User.findById({_id:req.userId});
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId
            }
        })
        if (user) {
            res.status(200).json({
                user: {
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    id: user.id
                }
            })
        } else {
            res.status(403).json({ message: "User not found" });
        }

    } catch (error) {
        res.status(403).json({ message: "User not found" });
    }


})


module.exports = router