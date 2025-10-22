import React, { useState, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ViewCars from './pages/ViewCars'
import EditCar from './pages/EditCar'
import CreateCar from './pages/CreateCar'
import CarDetails from './pages/CarDetails'
import './App.css'
import { getAllCustomItems } from './services/customItemsAPI'

const App = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        getAllCustomItems()
            .then((data) => setCars(data))
            .catch(err => console.error('Error fetching custom cars:', err));
    }, []);

  let element = useRoutes([
    {
      path: '/',
      element: <CreateCar title='BOLT BUCKET | Customize' />
    },
    {
      path:'/customcars',
      element: <ViewCars title='BOLT BUCKET | Custom Cars' data={cars}/>
    },
    {
      path: '/customcars/:id',
      element: <CarDetails title='BOLT BUCKET | View' />
    },
    {
      path: '/edit/:id',
      element: <EditCar title='BOLT BUCKET | Edit' />
    }
  ])

  return (
    <div className='app'>
      <Navigation />
      {element}
    </div>
  )
}

export default App