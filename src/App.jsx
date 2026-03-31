import Routing from "./Routes/Routing.jsx"
import { Toaster } from 'react-hot-toast';

function App() {
  

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routing />
    </>
  )
}

export default App
