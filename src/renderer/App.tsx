import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';
import { addUser, getUsers } from './transactions/user';
import { EquipmentPage, ServicePage } from './pages';
import { AppLayout } from './components';
import SparePartsPage from './pages/SparePartsPage/ui/SparePartsPage';

// const Hello = () => {
//   const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     getUsers();
//   }, []);

//   window.electron.ipcRenderer.once('dialog:getAllUsers', (arg) => {
//     // eslint-disable-next-line no-console
//     console.log(arg);
//     setData(arg);
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { name, surname } = e.target;
//     const user = {
//       // @ts-ignore
//       name: name.value,
//       surname: surname.value,
//     };
//     if (!name.value || !surname.value) return;

//     addUser(user);
//     getUsers();

//     e.target.reset();
//   };
//   return (
//     <div>
//       <ul>
//         {data &&
//           data.map((user) => (
//             <li key={user.name + user.surname}>
//               {user.name} {user.surname}
//             </li>
//           ))}
//       </ul>
//       <form onSubmit={handleSubmit}>
//         <input name="name" type="text" placeholder="name" />
//         <input name="surname" type="text" placeholder="surname" />
//         <button type="submit">add user</button>
//       </form>
//     </div>
//   );
// };

function AppRoutes() {
  return (
    <Routes>
      <Route path="/service" element={<ServicePage />} />
      <Route path="/equipment" element={<EquipmentPage />} />
      <Route path="/spare-parts" element={<SparePartsPage />} />
      <Route path="*" element={<EquipmentPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </Router>
  );
}
