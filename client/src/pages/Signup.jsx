// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// function Signup() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("elder"); // default role

//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await API.post("/auth/register", {
//         name,
//         email,
//         password,
//         role,
//       });

//       alert("Registration successful!");

//       // After successful signup → redirect to login
//       navigate("/");

//     } catch (error) {
//       alert(error.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <div className="row justify-content-center">
//       <div className="col-md-6">
//         <div className="card shadow">
//           <div className="card-body">
//             <h3 className="text-center mb-4">Signup</h3>

//             <form onSubmit={handleSignup}>
              
//               <div className="mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Full Name"
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <input
//                   type="email"
//                   className="form-control"
//                   placeholder="Email"
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <input
//                   type="password"
//                   className="form-control"
//                   placeholder="Password"
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <select
//                   className="form-control"
//                   onChange={(e) => setRole(e.target.value)}
//                 >
//                   <option value="elder">Elder</option>
//                   <option value="family">Family</option>
//                 </select>
//               </div>

//               <button className="btn btn-success w-100">
//                 Signup
//               </button>

//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Signup;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("elder");

  const [username, setUsername] = useState("");
  const [elderUsername, setElderUsername] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
        username: role === "elder" ? username : null,
        elderUsername: role === "family" ? elderUsername : null,
      });

      alert("Registration successful!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="text-center mb-4">Signup</h3>

            <form onSubmit={handleSignup}>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <select
                className="form-control mb-3"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="elder">Elder</option>
                <option value="family">Family</option>
              </select>

              {/* 🔥 If elder → ask username */}
              {role === "elder" && (
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Create Unique Username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              )}

              {/* 🔥 If family → ask elder username */}
              {role === "family" && (
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter Elder Username"
                  onChange={(e) => setElderUsername(e.target.value)}
                  required
                />
              )}

              <button className="btn btn-success w-100">
                Signup
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;