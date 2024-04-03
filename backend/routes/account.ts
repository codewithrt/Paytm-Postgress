import { PrismaClient } from "@prisma/client";

const expresses = require("express");
const authMiddlewares = require("../middleware/authMiddleware");

const prisma = new PrismaClient();

const routers = expresses.Router();

routers.get("/balance",authMiddlewares,async(req:any,res:any)=>{
    const userId = req.userId;
    const account = await prisma.account.findUnique({
        where:{
            id:userId
        }
    })
    res.status(200).json({
        balance:account?.Balance
    })
    return;
})

routers.post("/transfer",authMiddlewares,async(req:any,res:any)=>{
    // console.log(req);
    const to = req.body.params.to;   
    const amount = req.body.params.amount;

    const user  = req.userId;
    const userbalance = await prisma.account.findUnique({
          where:{
            UserId:user
          }
    })
    if(!userbalance || userbalance.Balance<amount){
        res.status(403).json({
            message:"Insufficient Balance"
        })
        return;
    }
    const touser = await prisma.account.findUnique({
        where:{
            UserId:to
        }
    })
    
    if(touser === null){
        // console.log("I logged 2");
        res.status(403).json({
            message:"Invalid Account"
        })
        return;
    }


    try {
        await prisma.$transaction(async(tx)=>{
            // Decreemnt from Sender
            const sender = await tx.account.update({
                data:{
                    Balance:{
                        decrement:amount
                    }
                },
                where:{
                    UserId:user
                }
            })
            if (sender.Balance<0) {
                
                throw new Error(`${user} doesn't have enough to send ${amount}`)
                
                // return;
            }
            const recipient = await tx.account.update({
                data:{
                    Balance:{
                        increment:amount
                    }
                },
                where:{
                    UserId:to
                }
            })
    
        })
        res.status(200).json({
            message:"Transfer Successful"
        })
        return;
    } catch (error) {
        console.log(error);
        
        res.status(403).json({
            message:error
        })
        return;
    }
    
    return;
})


module.exports = routers;

// async function transfer(req){
//     const to = req.body.to;
//     const amount = req.body.amount;
//     const user  = req.userId;
//     const userbalance = await Account.findOne({
//         UserId:user
//     })
//     // console.log(userbalance);
//     if(!userbalance || userbalance.balance<amount){
//         // res.send(400).json({
//         //     message:"Insufficient Balance"
//         // })
//         console.log("Insufficinet Balance");
//         return;
//     }
//     const touser = await Account.findOne({
//         UserId:user
//     })
  
//     console.log(touser);
//     if(touser === null){
//         // res.status(400).json({
//         //     message:"Invalid Account"
//         // })
//         console.log("Invalid Account");
//         return;
//     }

//     const session = await mongoose.startSession();
//     session.startTransaction();
//     await Account.updateOne({UserId:user},{$inc:{balance:-amount}}).session(session);
//     await Account.updateOne({UserId:to},{$inc:{balance:+amount}}).session(session);
//     // commiting the Transaction
//     await session.commitTransaction();

//     // res.status(200).json({
//     //     message:"Transfer Successful"
//     // })
//     console.log("Transfer Sucessful")
//     return;
// }

// transfer({
//     userId: "65f9ac5340a8987e98a33b63",
//     body: {
//         to: "65f9a5bfb606dd6e6ce6d7c9",
//         amount: 100
//     }
// })

// transfer({
//     userId: "65f9ac5340a8987e98a33b63",
//     body: {
//         to: "65f9a5bfb606dd6e6ce6d7c9",
//         amount: 100
//     }
// })