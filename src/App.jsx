import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const pages = import.meta.glob("./pages/**/index.{js,jsx}", { eager: true });
const dynamicPages = import.meta.glob("./pages/**/[id].{js,jsx}", {
  eager: true,
});

// Define which routes need authentication
const protectedPaths = ["/history", "/stats"];

function App() {
  return (
    <AuthProvider>
      <Routes>
        {Object.keys(pages).map((path) => {
          const Component = pages[path].default;
          const routePath = path
            .replace("./pages", "")
            .replace("/index.jsx", "")
            .replace("/index.js", "");

          // Check if the current route needs to be protected
          if (protectedPaths.includes(routePath)) {
            return (
              <Route
                key={routePath}
                path={routePath}
                element={
                  <ProtectedRoute>
                    <Component />
                  </ProtectedRoute>
                }
              />
            );
          }

          return (
            <Route
              key={routePath}
              path={routePath || "/"}
              element={<Component />}
            />
          );
        })}
        {Object.keys(dynamicPages).map((path) => {
          const Component = dynamicPages[path].default;
          const routePath = path
            .replace("./pages", "")
            .replace("/[id].jsx", "/:id")
            .replace("/[id].js", "/:id");
          return (
            <Route key={routePath} path={routePath} element={<Component />} />
          );
        })}
        <Route path="*" element="404 Not Found" />
      </Routes>
    </AuthProvider>
  );
}

export default App;
