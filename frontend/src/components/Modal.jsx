import axios from "axios";
import { useRef, useState } from "react";
import {useForm} from "react-hook-form"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ModalState, TellAmount } from "../atoms/atom";
import { toast } from "react-custom-alert";


const Modal = ({user}) => {
    const setisOpen = useSetRecoilState(ModalState(user.id));
    const UserBalance = useSetRecoilState(TellAmount);

     const modelref = useRef();
     const CloseModal = (e)=>{
        if(modelref.current === e.target){
            setisOpen(false);
        }
     }

     const {register,handleSubmit} = useForm();
     const onsubmit = async(e)=>{
        console.log(Number(e.amount));
        if(confirm("Want to Initiate This Transaction") === false){
            return;
        }
        try {
            const response = await axios.post("http://localhost:3000/api/v1/account/transfer",{params:{to:user.id,amount:Number(e.amount)}},{headers:{Authorization:localStorage.getItem("token")}})
            toast.success(response.data.message)
            setisOpen(false);
            try {
                const amount = await axios.get("http://localhost:3000/api/v1/account/balance",{headers:{Authorization:localStorage.getItem("token")}});
                
                UserBalance(amount);
            } catch (error) {
                toast.error("Error While Fetching Balance")
                // alert("Error While Fetching Balance");
            }
            
            
        } catch (error) {
           
            // alert(error.response.data.message);
            toast.error(error.response.data.message)
            setisOpen(false);
        }
       
     }

    return (
        <>
            <div ref={modelref} onClick={CloseModal} className=" fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg w-96">
                    <div className="flex justify-center text-3xl font-bold">
                        Send Money
                    </div>
                    <div className="flex text-gray-500  pt-10 text-center gap-4">
                        <div className="bg-black w-11 h-11 rounded-full p-2 text-white">
                            {user.firstName.charAt(0).toUpperCase()}
                        </div>
                        <div className="py-2 text-black font-bold text-xl">
                            <div>{user.firstName} {user.lastName}</div>
                            <div className="text-gray-500 font-light text-sm">
                            {user.username}
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onsubmit)}>
                        <div className="py-2">
                            <div className="py-1">
                                <label className="font-medium">
                                   Amount (in Rs)
                                </label>
                            </div>
                            <div className=" py-1">
                                <input type="number" placeholder="Enter Amount" className="p-2 w-full border border-slate-300 rounded-lg" {...register("amount")}  required min={0} />
                            </div>
                        </div>
                        <div className="py-2">
                            <button className="text-center bg-green-500 w-full text-white p-2 rounded-lg font-bold" type="submit">
                                Initiate Transfer
                            </button>
                        </div>
                        <div className="text-center py-1">
                            <button className="font-bold" onClick={()=>setisOpen(false)}>Cancel</button>
                        </div>
                       
                        
                    </form>
                </div>
            </div>
        </>
    )
}

export default Modal;