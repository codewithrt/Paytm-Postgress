import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom"
import Signup from "./components/Signup"
import Signin from "./components/Signin"
import Dashboard from "./components/Dashboard"
import { useRecoilValue } from "recoil"
import { IsLogAtom } from "./atoms/atom"

function App() {
 const IsUser = useRecoilValue(IsLogAtom);

  return (
    <>
    <div className="bg-[#7f7f7f] h-screen ">
      <BrowserRouter>
      {/* <Suspense fallback={<div>Loading ..</div>}> */}
        <Routes>
          <Route path="/" element={IsUser!== null?<Navigate to="/dashboard" />:<Navigate to="/signup" />} />
          <Route path="/signup" element={IsUser!== null?<Navigate to="/dashboard" />:<Signup/>}/>
          <Route path="/signin" element={IsUser!== null?<Navigate to="/dashboard" />:<Signin/>}/>
          
          <Route path="/dashboard" element={IsUser!== null?<Dashboard/>:<Navigate to="/signup" />}/>
          {/* <Route path="send" element={<SendMoney/>}/> */}
          
        </Routes >
        {/* </Suspense> */}
      </BrowserRouter>
      </div>
    </>
  )
}

export default App
