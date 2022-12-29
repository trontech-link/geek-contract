import { Layout } from "antd";
import AppHeader from "./Header";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <Layout>
      <AppHeader />
      <div className="main">
        <div className="content">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default Main;
