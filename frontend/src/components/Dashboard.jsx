import { lazy, useState ,Suspense} from "react";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { InputUserAtom, IsLogAtom, TellAmount, UserSelector } from "../atoms/atom";
// import Test from "./Test";
// const {InputUserAtom,UserSelector} = lazy(()=>import("../atoms/atom"))
import InputComp from "./InputComp";
import UserList from "./UserList";
import NameComp from "../DashboardComp/NameComp";
import YourBalance from "../DashboardComp/YourBalance";
import LogOut from "../DashboardComp/LogOut";

const Dashboard = ()=>{
   

    return(
        <>

           <div className="bg-white h-full">
             <div className="grid grid-cols-2 gap-4 place-content-end px-8 bg-white py-2 border-b-2 border-gray-200">
                <div className="p-2 font-bold text-xl">
                    Payments App
                </div>
                <div className="justify-end  flex">
                   <NameComp/>
                </div>
             </div>
             <div className="bg-white grid grid-cols-2 place-content-end">
                <YourBalance/>
                <LogOut/>
             </div>
             <div>
                <div className="p-2 px-9 py-3 font-bold text-lg">
                Users
                </div>
                <div className="p-2 px-9 py-3">
                   <InputComp/>
                </div>
             </div>
            
             <div className="p-2 px-9 py-8" >
             <Suspense fallback={<div>Loading ..</div>}>
                <UserList/>
                
                 </Suspense>
             </div>
             
           </div>

        </>
    )
}

export default Dashboard;