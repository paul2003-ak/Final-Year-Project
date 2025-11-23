import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { serverurl } from '../App';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";


const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate=useNavigate();

    const handlesubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const result = await axios.post(serverurl + "/api/auth/register", { name, email, password }, { withCredentials: true })

            // dispatch(setuserData(result.data));
            setLoading(false);
            console.log(result.data)
            // navigate('/');
            // toast.success("signup successful")
        } catch (error) {
            setLoading(false);
            console.log(error)
            // toast.error(error.response.data.message)
        }
    }
  return (
     <div className=' bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center '>

            <form onSubmit={handlesubmit} className=' w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex '>
                {/* left div */}
                <div className=' md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 '>
                    <div>
                        <h1 className=' font-semibold text-[black] text-2xl '>
                            Let's Get Started
                        </h1>
                        <h2 className=' text-[#999797] text-[18px] '>
                            Create your account
                        </h2>
                    </div>

                    <div className=' flex flex-col gap-1 w-[80%] items-start justify-center px-3 '>
                        <label htmlFor="name" className=' font-semibold ' >Name</label>
                        <input onChange={(e) => setName(e.target.value)} value={name} id="name" type="text" className=' border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] hover:border-black ' placeholder='Your name' />
                    </div>

                    <div className=' flex flex-col gap-1 w-[80%] items-start justify-center px-3 '>
                        <label htmlFor="email" className=' font-semibold ' >Email</label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} id="email" type="email" className=' border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] hover:border-black ' placeholder='Your Email' />
                    </div>

                    <div className=' flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative '>
                        <label htmlFor="password" className=' font-semibold ' >Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} id="password" type='password' className=' border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] hover:border-black ' placeholder='Your password' />

                    </div>

                   

                    <button disabled={loading} className=' w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px] '>
                        {loading ? <ClipLoader size={30} color='white' /> : "SignUp"}
                    </button>

                    <div className=' w-[80%] flex items-center gap-2 '>
                        <div className=' w-[25%] h-[0.5px] bg-[#c4c4c4] '></div>

                        <div className=' w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center '>Or continue</div>

                        <div className=' w-[25%] h-[0.5px] bg-[#c4c4c4] '></div>
                    </div>
                   

                    <div className='  text-[#6f6f6f]  '>
                        already have an account? <span onClick={() => navigate('/login')} className=' text-black cursor-pointer hover:underline '>Login</span>
                    </div>

                </div>


                
            </form>

        </div>
  )
}

export default RegisterPage
