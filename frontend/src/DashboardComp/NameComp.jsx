import { IsLogAtom } from "../atoms/atom";
import { useRecoilValue } from "recoil";

const NameComp = () =>{
    const User = useRecoilValue(IsLogAtom);
  
    return(
        <>
         <div className="p-2">Hello, {User.data.user.firstName} {User.data.user.lastName}</div>
                    <div className="p-2 bg-gray-200 rounded-full w-9 h-9 flex justify-center algin-center">
                        <span>{User.data.user.firstName.charAt(0).toUpperCase()}</span>
                    </div>
        </>
    )
}

export default NameComp;