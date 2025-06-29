import RegistrationForm from "./components/Form/Form"
import Header from "./components/Header/Header"
import Hero from "./components/Hero/Hero"
import UserListing from "./components/UserListing/UserListing"


const App = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-background)" }}>
      <Header/>
      <Hero/>
      <UserListing/>
      <RegistrationForm/>
    </div>
  )
}

export default App