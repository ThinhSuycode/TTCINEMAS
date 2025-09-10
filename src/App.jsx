import { DefaultLayout, ScrollToTop } from "./components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoute } from "./routes";
function App() {
  return (
    <Router>
      <ScrollToTop></ScrollToTop>
      <div className="App">
        <Routes>
          {publicRoute.map((route, idx) => {
            const Page = route.component;
            let Layout = route.page || DefaultLayout;
            return (
              <Route
                key={idx}
                path={route.path}
                element={
                  <Layout only={route.check}>
                    <Page />
                  </Layout>
                }
              ></Route>
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
