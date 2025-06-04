import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch } from 'react-icons/bs';

function Header({ setSearchQuery }) {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userName, setUserName] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('officialEmail');
    setOfficialEmail(email);

    if (!email) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:8000/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.name) {
          setUserName(data.name);
          setIsLoggedIn(true);
        } else {
          console.error('No user name found for this email');
        }
      })
      .catch((err) => console.error('Failed to fetch user data', err));
  }, [navigate]);

  useEffect(() => {
    let timer;

    if (showProfileDropdown) {
      timer = setTimeout(() => {
        const dropdown = document.querySelector('.dropdown-card');
        if (dropdown) {
          dropdown.classList.add('fade-out');

          setTimeout(() => {
            setShowProfileDropdown(false);
            dropdown.classList.remove('fade-out');
          }, 500); // wait for animation to finish
        }
      }, 5000); // hide after 5 seconds
    }

    return () => clearTimeout(timer);
  }, [showProfileDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('officialEmail');
    setUserName('');
    setOfficialEmail('');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <header className="header">
      <div className="header-left">
        <BsSearch className="icon" />
        <input 
          type="text" 
          placeholder="Search" 
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="header-right desktop-icons">
        <BsFillBellFill className="icon" onClick={() => navigate('/notifications')} />
        <div className="mail-container" onClick={() => navigate('/EmailHistory')}>
          <BsFillEnvelopeFill className="icon" />
        </div>

        <div className="profile-container">
          <BsPersonCircle
            className="icon profile-icon"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          />
          {showProfileDropdown && (
            <div className="dropdown-card">
              {isLoggedIn ? (
                <>
                  <p className="dropdown-name">Hello, {userName || 'User'}</p>
                  <p className="dropdown-email">{officialEmail || 'Email not available'}</p>
                </>
              ) : (
                <p className="dropdown-name">Please log in</p>
              )}
              {isLoggedIn && <button onClick={handleLogout} className="logout-btn">Logout</button>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   BsFillBellFill,
//   BsFillEnvelopeFill,
//   BsPersonCircle,
//   BsSearch
// } from 'react-icons/bs';

// function Header({ setSearchQuery, toggleSidebar }) {
//   const navigate = useNavigate();
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);
//   const [userName, setUserName] = useState('');
//   const [officialEmail, setOfficialEmail] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const email = localStorage.getItem('officialEmail');
//     setOfficialEmail(email);

//     if (!email) {
//       navigate('/login');
//       return;
//     }

//     fetch('http://localhost:8000/api/user', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.name) {
//           setUserName(data.name);
//           setIsLoggedIn(true);
//         } else {
//           console.error('No user name found for this email');
//         }
//       })
//       .catch((err) => console.error('Failed to fetch user data', err));
//   }, [navigate]);

//   useEffect(() => {
//     let timer;

//     if (showProfileDropdown) {
//       timer = setTimeout(() => {
//         const dropdown = document.querySelector('.dropdown-card');
//         if (dropdown) {
//           dropdown.classList.add('fade-out');

//           setTimeout(() => {
//             setShowProfileDropdown(false);
//             dropdown.classList.remove('fade-out');
//           }, 500);
//         }
//       }, 5000);
//     }

//     return () => clearTimeout(timer);
//   }, [showProfileDropdown]);

//   const handleLogout = () => {
//     localStorage.removeItem('officialEmail');
//     setUserName('');
//     setOfficialEmail('');
//     setIsLoggedIn(false);
//     navigate('/login');
//   };

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   return (
//     <header className="header">
//       {/* Hamburger Toggle for Sidebar */}
//       <button className="menu-toggle" onClick={toggleSidebar}>
//         <span></span>
//         <span></span>
//         <span></span>
//       </button>

//       <div className="header-left">
//         <BsSearch className="icon" />
//         <input
//           type="text"
//           placeholder="Search"
//           onChange={handleSearchChange}
//           className="search-input"
//         />
//       </div>

//       <div className="header-right desktop-icons">
//         <BsFillBellFill className="icon" onClick={() => navigate('/queries')} />
//         <div className="mail-container" onClick={() => navigate('/EmailHistory')}>
//           <BsFillEnvelopeFill className="icon" />
//         </div>

//         <div className="profile-container">
//           <BsPersonCircle
//             className="icon profile-icon"
//             onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//           />
//           {showProfileDropdown && (
//             <div className="dropdown-card">
//               {isLoggedIn ? (
//                 <>
//                   <p className="dropdown-name">Hello, {userName || 'User'}</p>
//                   <p className="dropdown-email">{officialEmail || 'Email not available'}</p>
//                 </>
//               ) : (
//                 <p className="dropdown-name">Please log in</p>
//               )}
//               {isLoggedIn && (
//                 <button onClick={handleLogout} className="logout-btn">
//                   Logout
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;
