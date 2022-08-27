import "./App.css";
import { Route } from "react-router-dom";
import Home from "./pages/home";
import Chats from "./pages/chats";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Home} exact />
      <Route path="/api/chats" component={Chats} />
    </div>
  );
}

export default App;
