import {useSetRecoilState} from "recoil"
import {InputUserAtom} from "../atoms/atom"

const InputComp = () =>{
    const inputuser = useSetRecoilState(InputUserAtom);
    const LookChange = (e)=>{
        inputuser(e.target.value)
    }
    return(
        <input placeholder="Search Users..." className="p-2  border-2 w-full rounded-lg" onChange={(e)=>{LookChange(e)}}/>
    )
}

export default InputComp;