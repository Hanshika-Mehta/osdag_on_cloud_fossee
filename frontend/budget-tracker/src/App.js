import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Budget from "./components/Budget";
import Remaining from "./components/Remaining";
import ExpenseTotal from "./components/ExpenseTotal";
import ExpenseList from "./components/ExpenseList";
import AddExpenseForm from "./components/AddExpenseForm";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import axios from "axios";
import { AppProvider } from "./context/AppContext";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    client
      .get("/api/user")
      .then(function (res) {
        setCurrentUser(true);
        
      })
      .catch(function (error) {
        setCurrentUser(false);
      });
  }, []);

  function update_form_btn() {
    if (registrationToggle) {
      document.getElementById("form_btn").innerHTML = "Register";
      setRegistrationToggle(false);
    } else {
      document.getElementById("form_btn").innerHTML = "Log in";
      setRegistrationToggle(true);
    }
  }

  function submitRegistration(e) {
    e.preventDefault();
    client
      .post("/api/register", {
        email: email,
        username: username,
        password: password,
      })
      .then(function (res) {
        client
          .post("/api/login", {
            email: email,
            password: password,
          })
          .then(function (res) {
            setCurrentUser(true);
          })
          .catch(function (error){
            console.error(error.response.status);
          });
      });
  }

  function submitLogin(e) {
    e.preventDefault();
    client
      .post("/api/login", {
        email: email,
        password: password,
      })
      .then(function (res) {
        setCurrentUser(true);
        alert(res.data.user_id);
        localStorage.setItem("user_id", res.data.user_id);
      });
  }

  function submitLogout(e) {
    e.preventDefault();
    client.post("/api/logout", { withCredentials: true }).then(function (res) {
      setCurrentUser(false);
    });
  }

  if (currentUser) {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>My Budget Tracker</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <form onSubmit={(e) => submitLogout(e)}>
                  <Button type="submit" variant="light">
                    Log out
                  </Button>
                </form>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="center">
          <AppProvider>
            <div style={{ margin: "40px" }}>
              <div className="container">
                <h1 className="mt-3">My Budget Planner</h1>
                <div className="row mt-3">
                  <div className="col-sm">
                    <Budget />
                  </div>
                  <div className="col-sm">
                    <Remaining />
                  </div>
                  <div className="col-sm">
                    <ExpenseTotal />
                  </div>
                </div>
                <h3 className="mt-3">Expenses</h3>
                <div className="row mt-3">
                  <div className="col-sm">
                    <ExpenseList />
                  </div>
                </div>
                <h3 className="mt-3">Add Expense</h3>
                <div className="mt-3">
                  <div className="col-sm">
                    <AddExpenseForm />
                  </div>
                </div>
              </div>
            </div>
          </AppProvider>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>My Budget Tracker </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Button id="form_btn" onClick={update_form_btn} variant="light">
                Register
              </Button>
              <Navbar.Text style={{margin:"10px"}}>
                Signed in as: <a href="#login">Mark Otto</a>
              </Navbar.Text>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {registrationToggle ? (
        <div className="col-md-6 md-offset-3">
          <div className="center">
            <Form onSubmit={(e) => submitRegistration(e)}>
              <div style={{ margin: "40px" }}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Enter Valid email Id.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </div>
      ) : (
        <div className="col-md-6 md-offset-3">
          <div className="center">
            <Form onSubmit={(e) => submitLogin(e)}>
              <div style={{ margin: "40px" }}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
