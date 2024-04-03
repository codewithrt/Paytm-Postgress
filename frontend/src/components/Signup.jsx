import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios"
import { Navigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { IsLogAtom } from "../atoms/atom";
import { toast } from "react-custom-alert";

const Signup = () => {
    const { register, handleSubmit } = useForm();
    const setUser = useSetRecoilState(IsLogAtom);
    const onsubmit = async(e) => {
   
        try {
            const token = await axios.post("http://localhost:3000/api/v1/user/signup", { params: { username: e.email, password: e.password,firstName:e.firstName,lastName:e.lastName } });
            let Ourtoken = "Bearer " + token.data.token;
            localStorage.setItem("token", ("Bearer " + token.data.token));
            const User = await axios.get("http://localhost:3000/api/v1/user/IsValidToken", { headers: { Authorization: Ourtoken } });
      
            setUser(User);
            <Navigate to="/dashboard" />
        } catch (error) {
     
            toast.error(error.response.data.message)
            //  alert(error.response.data.message)
        }
    }
    return (
        <>
            <div className="flex justify-center items-center h-full">
                <div className="bg-white p-8 rounded-lg ">
                    <div className="flex justify-center text-3xl font-bold">
                        Sign Up
                    </div>
                    <div className="flex justify-center text-gray-500 py-4 text-center pb-8 px-8">
                        Enter your information to create an <br />
                        account
                    </div>
                    <form onSubmit={handleSubmit(onsubmit)}>
                        <div className="py-2">
                            <div className="py-1">
                                <label className="font-medium">
                                    First Name
                                </label>
                            </div>
                            <div className=" py-1">
                                <input placeholder="John" className="p-2 w-full border border-slate-300 rounded-lg" required maxLength="50" {...register("firstName")} />
                            </div>
                        </div>
                        <div className="py-2">
                            <div className="py-1">
                                <label className="font-medium">
                                    Last Name
                                </label>
                            </div>
                            <div className=" py-1">
                                <input placeholder="Doe" className="p-2 w-full border border-slate-300 rounded-lg" required maxLength="50" {...register("lastName")} />
                            </div>
                        </div>
                        <div className="py-2">
                            <div className="py-1">
                                <label className="font-medium">
                                    Email
                                </label>
                            </div>
                            <div className=" py-1">
                                <input type="email" placeholder="jhondoe@example.com" className="p-2 w-full border border-slate-300 rounded-lg" required minLength="3" maxLength="30" {...register("email")} />
                            </div>
                        </div>
                        <div className="py-2">
                            <div className="py-1">
                                <label className="font-medium">
                                    Password
                                </label>
                            </div>
                            <div className=" py-1">
                                <input type="password" placeholder="#password$" className="p-2 w-full border border-slate-300 rounded-lg" required minLength="6" {...register("password")} />
                            </div>
                        </div>
                        <div className="py-2">
                            <button className="text-center bg-black w-full text-white p-2 rounded-lg " type="submit">
                                Sign Up
                            </button>
                        </div>
                        <div className="text-center py-1">
                            Already have an Account? <Link className="underline" to="/signin">Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup;