import { TellAmount } from "../atoms/atom";
import { useRecoilValue } from "recoil";

const YourBalance = () =>{
    const Amount = useRecoilValue(TellAmount);
   
    return(
       <>
       <div className="p-2 px-9 py-4 font-bold text-lg">
                Your Balance  $ {Amount.data.balance.toFixed(3)}
                </div>
       </>
    )
}

export default YourBalance;