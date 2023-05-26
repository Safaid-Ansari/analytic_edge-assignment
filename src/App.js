import "./App.css";
import DataGrid from "./components/DataGrid";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
function App() {
  return (
    <div className="mainContainer">
      <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route
            path="/users"
            element={
              <DataGrid
                name="Users"
                endpoint="https://jsonplaceholder.typicode.com/users"
                pageSize={4}
              />
            }
          ></Route>
          <Route
            path="/posts"
            element={
              <DataGrid
                name="Posts"
                endpoint="https://jsonplaceholder.typicode.com/posts"
                pageSize={6}
              />
            }
          ></Route>
          <Route
            path="/comments"
            element={
              <DataGrid
                name="Comments"
                endpoint="https://jsonplaceholder.typicode.com/comments"
                pageSize={6}
              />
            }
          ></Route>
          <Route
            path="/"
            element={
              <DataGrid
                name="Users"
                endpoint="https://jsonplaceholder.typicode.com/users"
                pageSize={4}
              />
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
