import React from 'react'
import { useState } from 'react'
import { CalendarDateRangeIcon } from '@heroicons/react/20/solid'

import Navbar from './components/Navbar'
import Header from './components/Header'
import Categorycards from './components/CategoryCards'
import Footer from './components/Footer'



const App = () => {


  return (
    <div>
       <Navbar/>
       <Header/>
       <Categorycards/>
       <Footer/>
     

    </div>
  )
}

export default App
