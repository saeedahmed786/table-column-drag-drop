import React, { useState } from 'react';
import Sample from './Sample';

function App() {
  const [email, setEmail] = useState();
  const [login, setLogin] = useState(false);
  const [show, setShow] = useState(false);

  const submitEmail = (e) => {
    e.preventDefault();
    setLogin(true);
    setShow(false);
  }

  const logout = (e) => {
    setLogin(false);
    setEmail();
  }


  return (
    <div className='App'>
      <header>
        <h2>
          Table
        </h2>
        <div>
          {
            login ?
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div>
                  {email}
                </div>
                <button onClick={logout}>
                  Logout
                </button>
              </div>
              :
              <>
                <button onClick={() => setShow(!show)}>
                  Login
                </button>
                {
                  show &&
                  <form onSubmit={submitEmail}>
                    <input name='email' type="email" placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} />
                    <button type='submit'>Login</button>
                  </form>
                }
              </>
          }
        </div>
      </header>
      <Sample login={login} />
    </div>
  );
}


export default App;

